import fs from "fs";
import path from "path";
import { Course, CourseManifestList } from "./types";

export function readCourseList(): CourseManifestList {
  // if course list doesn't exist, create it
  if (!fs.existsSync("courseList.json")) {
    writeCourseList([]);
  }
  const courseList = fs.readFileSync("courseList.json", "utf8");
  return JSON.parse(courseList);
}

export function writeCourseList(courseList: CourseManifestList) {
  const courseListJson = JSON.stringify(courseList, null, "  ");
  fs.writeFileSync("courseList.json", courseListJson);
}

export function createCourseFolderIfMissing(courseFolderName: string) {
  if (!fs.existsSync(courseFolderName)) {
    fs.mkdirSync(courseFolderName);
  }
}

export function checkIfDownloadedFileExists(
  course: Course,
  targetFolder: string
) {
  return fileExistsInFolder(targetFolder, course.CourseFolder + ".zip");
}

export function fileExistsInFolder(folderName: string, filename: string) {
  const filePath = path.join(folderName, filename);
  return fs.existsSync(filePath);
}

export function publishMergedManifest(
  manifestList: CourseManifestList,
  outputPath: string
) {
  const baseURL = "http://yourserver.com";
  const mergedManifest: Course[] = [];

  manifestList.forEach((manifest) => {
    manifest.courseList.forEach((course) => {
      const courseFilePath = path.join(
        manifest.folder,
        `${course.CourseFolder}.zip`
      );
      if (fs.existsSync(courseFilePath)) {
        // Update the Download URLs to point to your server
        course.DownloadURL = `${baseURL}/${manifest.folder}/${course.CourseFolder}.zip`;
        course.DownloadURL2 = `${baseURL}/${manifest.folder}/${course.CourseFolder}2.zip`;
        course.DownloadURL3 = `${baseURL}/${manifest.folder}/${course.CourseFolder}3.zip`;
        mergedManifest.push(course);
      }
    });
  });

  fs.writeFileSync(outputPath, JSON.stringify(mergedManifest, null, 2));
}
