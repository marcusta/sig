import { Course, CourseManifestList } from "./types";
import fs from "fs";
import path from "path";

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
  
  export function createCourseFolderIfMising(courseFolderName: string) {
    if (!fs.existsSync(courseFolderName)) {
      fs.mkdirSync(courseFolderName);
    }    
  }

  
export function checkIfDownloadedFileExists(course: Course, targetFolder: string) {
  return fileExistsInFolder(targetFolder, course.CourseFolder + ".zip");
}

export function fileExistsInFolder(folderName: string, filename: string) {
  const filePath = path.join(folderName, filename);
  return fs.existsSync(filePath);
}
  