import axios from "axios";
import fs from "fs";

import { CourseManifestList, CourseToDownload } from "./types";
import { createCourseFolderIfMising } from "./file-storage";

export async function fetchCourseManifests(courseManifestUrls: CourseManifestList) {
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

export async function downloadCourse(courseToDownload: CourseToDownload) {
    // create target folder if not exist
    createCourseFolderIfMising(courseToDownload.targetFolder);
    const course = courseToDownload.course;
  
    const targetFolder = courseToDownload.targetFolder;
    const downloadUrl = course.DownloadURL || course.DownloadURL2;
    const fileName = course.CourseFolder + ".zip";
  
    const filePath = `${targetFolder}/${fileName}`;
  
    console.log("downloading file", downloadUrl, "to", filePath);
    // return a Promise that resolves when the file is downloaded
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(downloadUrl, { responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
  
        response.data.pipe(writer);
  
        writer.on("finish", () => {
          console.log("File downloaded successfully!", filePath);
          resolve("complete!");
        });
        writer.on("error", (err: any) => {
          console.log("Error downloading file", filePath, err);
          reject(err);
        });
      } catch (error) {
        console.log("Error downloading file", filePath, error);
        reject(error);
      }
    });
  }
  