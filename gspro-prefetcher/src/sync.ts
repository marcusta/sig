import { courseManifestPublishPath, courseManifestUrls } from "./configuration";
import { downloadCourses, fetchCourseManifests } from "./downloader";
import {
  checkIfDownloadedFileExists,
  publishMergedManifest,
  readCourseList,
  writeCourseList,
} from "./file-storage";
import { Course, CourseManifest, CourseToDownload } from "./types";

// full update functionality is
// 1. fetch course manifests
// 2. write course list to disk as new course list json
// 3. compare new course list to old course list
// 3a. comparison is done by comparing each field of each course
// 3b. if a course is new, add it to the list
// 3c. if a course is missing, remove it from the list
// 3d. if a course has changed, update it in the list
// 4. Download each course file that is new or changed based on the DownloadURL or DownloadURL2 field
// 5. Write each downloaded course file to disk to the course folder
// 6. Update the course list with the new course version and point the DownloadURL to the local file
// 7. Write the updated course list to disk
// 8. Schedule the next full update

export async function doFullUpdateCycle() {
  const newCourseManifestList = await fetchCourseManifests(courseManifestUrls);

  const oldCourseManifestList = readCourseList();
  console.log("read old course manifest...");
  // convert oldCourseManifestList to obj keyed on folder name
  const oldCourseManifestsObj: { [key: string]: CourseManifest } = {};
  for (const manifest of oldCourseManifestList) {
    oldCourseManifestsObj[manifest.folder] = manifest;
  }

  const coursesToDownload: CourseToDownload[] = [];
  // loop over fetched course manifests
  newCourseManifestList.forEach((newManifest) => {
    console.log("for each new manifest ", newManifest.folder);
    const oldManifest = oldCourseManifestsObj[newManifest.folder];
    coursesToDownload.push(...findCoursesToDownload(oldManifest, newManifest));
  });

  console.log("courses to download count", coursesToDownload.length);
  downloadCourses(coursesToDownload, (course, status) => {
    console.log(`Download of ${course.course.Name} was ${status}`);
    // After every successful download, publish the merged manifest
    if (status === "successful") {
      publishMergedManifest(newCourseManifestList, courseManifestPublishPath);
    }
  });
  writeCourseList(newCourseManifestList);
}

function findCoursesToDownload(
  oldManifest: CourseManifest,
  newManifest: CourseManifest
) {
  const coursesToDownload: CourseToDownload[] = [];
  if (!oldManifest) {
    // if the manifest doesn't exist, add all courses to download
    console.log("old manifest of folder did not exist...");
    coursesToDownload.push(
      ...newManifest.courseList.map((course) => ({
        course: course,
        targetFolder: newManifest.folder,
      }))
    );
  } else {
    // if the manifest exists, compare each course
    console.log("old manifest exists...", oldManifest.folder);
    const courses = findCoursesToDownloadByComparingManifests(
      oldManifest.courseList,
      newManifest.courseList,
      newManifest.folder
    );
    coursesToDownload.push(...courses);
  }
  return coursesToDownload;
}

function findCoursesToDownloadByComparingManifests(
  oldManifestCourseList: Course[],
  newManifestCourseList: Course[],
  folder: string
): CourseToDownload[] {
  // convert oldManifestCourses to object keyed on course name
  console.log("finding courses to download!");
  const oldManifestCoursesObj: { [key: string]: Course } = {};
  for (const course of oldManifestCourseList) {
    oldManifestCoursesObj[course.Name] = course;
  }

  const coursesToDownload: CourseToDownload[] = [];

  // Loop through all courses in the new manifest
  for (const newCourse of newManifestCourseList) {
    // If the course is new, add it to the list
    const oldCourse = oldManifestCoursesObj[newCourse.Name];
    if (!oldCourse) {
      console.log("old course did not exist ", newCourse.CourseFolder);
      coursesToDownload.push({ course: newCourse, targetFolder: folder });
    } else if (hasCourseChanged(oldCourse, newCourse)) {
      console.log(
        "course has changed and should download ",
        newCourse.CourseFolder
      );
      coursesToDownload.push({ course: newCourse, targetFolder: folder });
    } else if (!checkIfDownloadedFileExists(newCourse, folder)) {
      console.log(
        "course is not downloaded and should download ",
        newCourse.CourseFolder
      );
      // If the course exists, but the file is missing, add it to the list
      coursesToDownload.push({ course: newCourse, targetFolder: folder });
    }
  }

  return coursesToDownload;
}

function hasCourseChanged(oldCourse: Course, newCourse: Course): boolean {
  if (oldCourse.RemoteVersion !== newCourse.RemoteVersion) {
    return true;
  }
  if (oldCourse.LastUpdated !== newCourse.LastUpdated) {
    return true;
  }
  if (oldCourse.GkdVersion !== newCourse.GkdVersion) {
    return true;
  }
  if (oldCourse.DownloadURL !== newCourse.DownloadURL) {
    return true;
  }
  // Continue for other fields as needed...

  // If none of the conditions are met, return false
  return false;
}

function scheduleCourseListUpdate() {
  setTimeout(() => {
    fetchCourseManifests(courseManifestUrls).then(writeCourseList);
  }, 100);
}

export function getCourseInfo() {
  const courseList = readCourseList();
  const courseCounts: { [key: string]: number } = {};
  for (const manifest of courseList) {
    courseCounts[manifest.url] = manifest.courseList.length;
  }
  return courseCounts;
}

function printCourseInfo() {
  const courseCounts = getCourseInfo();
  console.log(courseCounts);
}
