import axios from "axios";
import fs from "fs";
import path from "path";

import { createCourseFolderIfMissing } from "./file-storage";
import { Course, CourseManifestList, CourseToDownload } from "./types";

export async function fetchCourseManifests(
  courseManifestUrls: CourseManifestList
) {
  // loop through all urls and add
  const courseManifests: CourseManifestList = [];
  for (const manifest of courseManifestUrls) {
    console.log("fetching manifest", manifest.url);
    const courseList = await axios.get(manifest.url).then((res) => res.data);
    console.log("fetched manifest", manifest.url);
    courseManifests.push({
      url: manifest.url,
      folder: manifest.folder,
      courseList: courseList,
    });
  }
  return courseManifests;
}

export async function downloadCourses(
  coursesToDownload: CourseToDownload[],
  onCourseDownloaded: (course: CourseToDownload, status: string) => void
) {
  for (const courseToDownload of coursesToDownload) {
    console.log(
      "about to download course",
      courseToDownload.course.Name,
      "to folder",
      courseToDownload.targetFolder
    );
    let downloadStatus = "failed";
    try {
      await downloadCourse(courseToDownload);
      downloadStatus = "successful";
    } catch (error) {
      console.error("Error downloading", courseToDownload.course.Name, error);
    }

    console.log("downloaded course", courseToDownload.course.Name);

    // Call the callback if provided
    if (onCourseDownloaded) {
      onCourseDownloaded(courseToDownload, downloadStatus);
    }
  }
}

export async function downloadCourse(courseToDownload: CourseToDownload): Promise<string> {
  createCourseFolderIfMissing(courseToDownload.targetFolder);

  const course = courseToDownload.course;
  const targetFolder = courseToDownload.targetFolder;
  const fileName = `${course.CourseFolder}.zip`;
  const filePath = path.join(targetFolder, fileName);

  // Retrieve the next URL for download
  const downloadUrl = getNextDownloadURL(course);

  try {
    await downloadWithProgress(downloadUrl, filePath);
    console.log("File downloaded successfully!", filePath);
    return "complete!";
  } catch (error) {
    console.log(`Error downloading from ${downloadUrl}. Trying alternative URLs if available...`);

    // If failed, try the next available URLs
    for (const alternativeUrl of [course.DownloadURL, course.DownloadURL2, course.DownloadURL3].filter(url => url !== downloadUrl)) {
      try {
        await downloadWithProgress(alternativeUrl, filePath);
        console.log("File downloaded successfully!", filePath);
        return "complete!";
      } catch (secondError) {
        console.log(`Error downloading from ${alternativeUrl}.`);
      }
    }

    // If all URLs fail
    fs.unlinkSync(filePath);  // Cleanup partial file
    throw new Error("Failed to download from all available URLs.");
  }
}

// Specifies which URLs are active for downloading. 
// You can comment out or remove any URL you wish to exclude from the cycle.
const activeURLs: Array<keyof Course> = [
  'DownloadURL' as keyof Course,
  //'DownloadURL2' as keyof Course,
  //'DownloadURL3' as keyof Course  // Commented out as an example. Uncomment to include it.
];

let lastUsedIndex = 0;

function getNextDownloadURL(course: Course): string {
  const urls = activeURLs.map(key  => course[key]).filter(Boolean);

  if (urls.length === 0) {
    throw new Error("No active URLs available for downloading.");
  }

  lastUsedIndex = (lastUsedIndex + 1) % urls.length;
  return urls[lastUsedIndex] as string;
}

async function downloadWithProgress(url: string, filePath: string) {
  console.log('Downloading URL', url);
  const response = await axios.get(url, {
    responseType: "stream"
  });

  const totalLength = parseInt(response.headers['content-length'], 10);
  let downloadedBytes = 0;
  let lastTime = Date.now();
  let lastDownloadedBytes = 0;

  // Define a temporary file path
  const tempFilePath = filePath + '.tmp';
  const writer = fs.createWriteStream(tempFilePath);

  response.data.on("data", (chunk: any) => {
    downloadedBytes += chunk.length;
    const currentTime = Date.now();
    if (currentTime - lastTime >= 3000) { // update every three seconds
      const speed = (downloadedBytes - lastDownloadedBytes) / (currentTime - lastTime) * 1000; // bytes per second
      const percentCompleted = Math.round((downloadedBytes / totalLength) * 100);
      const downloadedMB = (downloadedBytes / (1024 * 1024)).toFixed(2);
      const remainingMB = ((totalLength - downloadedBytes) / (1024 * 1024)).toFixed(2);
      console.log(`Downloaded ${downloadedMB} MB (${percentCompleted}%) - ${remainingMB} MB remains - ${Math.round(speed / (1024 * 1024) * 10) / 10} MB/s`);
      lastTime = currentTime;
      lastDownloadedBytes = downloadedBytes;
    }
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", () => {
      // Once download is complete, move the temp file to the final destination
      fs.rename(tempFilePath, filePath, err => {
        if (err) {
          console.error('Error during file rename', err);
          reject(err);
        } else {
          console.log('Download complete, file moved to:', filePath);
          resolve("success");
        }
      });
    });
    writer.on("error", (err: NodeJS.ErrnoException) => {
      // Cleanup the temporary file in case of an error.
      fs.unlink(tempFilePath, unlinkErr => {
        if (unlinkErr) {
          console.error('Error during file cleanup', unlinkErr);
        }
        reject(err);
      });
    });
  });
}
