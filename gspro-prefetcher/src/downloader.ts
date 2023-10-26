import axios from "axios";
import fs from "fs";
import path from "path";

import { createCourseFolderIfMissing } from "./file-storage";
import { CourseManifestList, CourseToDownload } from "./types";

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

export async function downloadCourse(
  courseToDownload: CourseToDownload
): Promise<string> {
  createCourseFolderIfMissing(courseToDownload.targetFolder);

  const course = courseToDownload.course;
  const targetFolder = courseToDownload.targetFolder;
  const fileName = course.CourseFolder + ".zip";
  const filePath = path.join(targetFolder, fileName);

  let downloadUrl = course.DownloadURL || course.DownloadURL2;

  try {
    await downloadWithProgress(downloadUrl, filePath);
    console.log("File downloaded successfully!", filePath);
    return "complete!";
  } catch (error) {
    console.log(
      `Error downloading from ${downloadUrl}. Trying alternative URL if available...`
    );
    if (downloadUrl !== course.DownloadURL2) {
      downloadUrl = course.DownloadURL2;
      try {
        await downloadWithProgress(downloadUrl, filePath);
        console.log("File downloaded successfully!", filePath);
        return "complete!";
      } catch (secondError) {
        console.log(
          "Error downloading file from alternative URL",
          filePath,
          secondError
        );
        fs.unlinkSync(filePath); // Cleanup partial file
        throw secondError;
      }
    } else {
      fs.unlinkSync(filePath); // Cleanup partial file
      throw error;
    }
  }
}

async function downloadWithProgress(url: string, filePath: string) {
  const response = await axios.get(url, {
    responseType: "stream",
  });

  const totalLength = parseInt(response.headers["content-length"], 10);
  let downloadedBytes = 0;
  let lastTime = Date.now();
  let lastDownloadedBytes = 0;

  const writer = fs.createWriteStream(filePath);
  response.data.on("data", (chunk: any) => {
    downloadedBytes += chunk.length;
    const currentTime = Date.now();
    if (currentTime - lastTime >= 3000) {
      // update every three seconds
      const speed =
        ((downloadedBytes - lastDownloadedBytes) / (currentTime - lastTime)) *
        1000; // bytes per second
      const percentCompleted = Math.round(
        (downloadedBytes / totalLength) * 100
      );
      const downloadedMB = (downloadedBytes / (1024 * 1024)).toFixed(2);
      const remainingMB = (
        (totalLength - downloadedBytes) /
        (1024 * 1024)
      ).toFixed(2);
      console.log(
        `Downloaded ${downloadedMB} MB (${percentCompleted}%) - ${remainingMB} MB remains - ${
          Math.round((speed / (1024 * 1024)) * 10) / 10
        } MB/s`
      );
      lastTime = currentTime;
      lastDownloadedBytes = downloadedBytes;
    }
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
