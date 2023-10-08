import axios from "axios";
import fs from "fs";
import path from "path";

function getCourseInfoResponse() {
  // return metadata about course list
  const courseCounts = getCourseInfo();
  // return as a formatted HTML table
  let table = "<table>";
  table += "<tr><th align='left'>Course List</th><th>Count</th></tr>";
  for (const url of Object.keys(courseCounts)) {
    table += `<tr><td>${url}</td><td>${courseCounts[url]}</td></tr>`;
  }
  table += "</table>";

  const html = `
  <html>
    <body>
      <h1>Course List</h1>
      ${table}
    </body>
  </html>
  `;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=UTF-8" },
  });
}

function getMergedManifestResponse(): Response {
  const courseList = readCourseList();
  const courses: Course[] = [];
  for (const courseManifest of courseList) {
    courses.push(...courseManifest.courseList);
  }
  const courseListJson = JSON.stringify(courses, null, "  ");
  return new Response(courseListJson, {
    headers: { "content-type": "application/json; charset=UTF-8" },
  });
}

function startServer() {
  const server = Bun.serve({
    port: 3000,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/") {
        return getCourseInfoResponse();
      }
      if (url.pathname === "/courseList.json") {
        return getMergedManifestResponse();
      }
      return new Response("Bun!");
    },
  });
  console.log(`Listening on http://localhost:${server.port} ...`);
}

/*const courseManifestUrls = [
  "https://simulatorgolftour.com/course_manifest.json",
  "https://tekbud.s3.us-east-2.amazonaws.com/tekbudcourselist1.json",
  "https://www.dropbox.com/s/5er3u2xanxjnqnj/fantasyv2.json?dl=1",
  "http://pakmanstudios.com/tier1-093006.json",
  "http://pakmanstudios.com/tier2-070101.json",
];*/

const courseManifestUrls = [
  { url: "http://127.0.0.1:3010/testManifest.json", folder: "testManifest" },
  {
    url: "http://127.0.0.1:3010/test-folder2/testManifest2.json",
    folder: "testManifest2",
  },
];

type CourseManifestList = CourseManifest[];

interface CourseManifest {
  url: string;
  courseList: Course[];
  folder: string;
}

/*
Example course json
    {
        "coursekey": "TorreySouth",
        "Name": "Torrey South",
        "ElevationInFeet": 105,
        "DownloadURL": "https:\/\/sgtloadbalancer.herokuapp.com\/?courseDL=TorreySouth",
        "DownloadURL2": "https:\/\/www.mediafire.com\/file\/pprx0zognc0wxlz\/torrey_pines_south_v3_gsp.zip\/file",
        "DownloadURL3": "https:\/\/dtrz37ctsyu07.cloudfront.net\/torrey_pines_south_v3_gsp.zip",
        "RemoteVersion": "3",
        "LastUpdated": "2023-07-27",
        "CourseLocation": "La Jolla, CA",
        "CourseDesigner": "Johnmeyer",
        "Par": 72,
        "KidFriendly": "true",
        "CourseFolder": "torrey_pines_south_v3_gsp",
        "GKDVersion": "2",
        "GKDDownloadURL": "https:\/\/dkfomfzm5un6c.cloudfront.net\/torrey_pines_south_v3_gsp.zip",
        "MetaDataRemoteVersion": "1",
        "MetaDataDownloadURL": null,
        "Images": "[]",
        "Videos": "[]",
        "remoteThumbnailImage": null,
        "KeywordBeginnerFriendly": null,
        "KeywordCoastal": null,
        "KeywordDesert": null,
        "KeywordFantasy": null,
        "KeywordHeathland": null,
        "KeywordHistoric": null,
        "KeywordLinks": null,
        "KeywordLowPoly": null,
        "KeywordMajorVenue": null,
        "KeywordMountain": null,
        "KeywordParkland": null,
        "KeywordTourStop": null,
        "KeywordTraining": null,
        "KeywordTropical": null
    },
*/

interface Course {
  courseKey: string;
  Name: string;
  ElevationInFeet: number;
  DownloadURL: string;
  DownloadURL2: string;
  DownloadURL3: string;
  RemoteVersion: string;
  LastUpdated: string;
  CourseLocation: string;
  CourseDesigner: string;
  Par: number;
  KidFriendly: boolean;
  CourseFolder: string;
  GkdVersion: string;
  GkdDownloadUrl: string;
  MetaDataRemoteVersion: string;
  MetaDataDownloadUrl: string;
  Images: string;
  Videos: string;
  remoteThumbnailImage: string;
  KeywordBeginnerFriendly: string;
  KeywordCoastal: string;
  KeywordDesert: string;
  KeywordFantasy: string;
  KeywordHeathland: string;
  KeywordHistoric: string;
  KeywordLinks: string;
  KeywordLowPoly: string;
  KeywordMajorVenue: string;
  KeywordMountain: string;
  KeywordParkland: string;
  KeywordTourStop: string;
  KeywordTraining: string;
  KeywordTropical: string;
}

async function fetchCourseManifests() {
  // loop through all urls and add
  const courseManifests: CourseManifestList = [];
  for (const manifest of courseManifestUrls) {
    console.log("fetching manifest", manifest.url);
    const courseList = await fetch(manifest.url).then((res) => res.json());
    console.log("fetched manifest", manifest.url);
    courseManifests.push({
      url: manifest.url,
      folder: manifest.folder,
      courseList: courseList,
    });
  }
  return courseManifests;
}

function readCourseList(): CourseManifestList {
  // if course list doesn't exist, create it
  if (!fs.existsSync("courseList.json")) {
    writeCourseList([]);
  }
  const courseList = fs.readFileSync("courseList.json", "utf8");
  return JSON.parse(courseList);
}

function writeCourseList(courseList: CourseManifestList) {
  const courseListJson = JSON.stringify(courseList, null, "  ");
  fs.writeFileSync("courseList.json", courseListJson);
}

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

interface CourseToDownload {
  course: Course;
  targetFolder: string;
}

async function doFullUpdateCycle() {
  const newCourseManifestList = await fetchCourseManifests();
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
      const courses = findCoursesToDownload(
        oldManifest.courseList,
        newManifest.courseList,
        newManifest.folder
      );
      coursesToDownload.push(...courses);
    }
  });

  console.log("courses to download count", coursesToDownload.length);
  downloadCourses(coursesToDownload);
  writeCourseList(newCourseManifestList);
}

async function downloadCourses(coursesToDownload: CourseToDownload[]) {
  for (const courseToDownload of coursesToDownload) {
    console.log(
      "about to download course",
      courseToDownload.course.Name,
      "to folder",
      courseToDownload.targetFolder
    );
    await downloadCourse(courseToDownload);
    console.log("downloaded course", courseToDownload.course.Name);
  }
}

async function downloadCourse(courseToDownload: CourseToDownload) {
  // create target folder if not exist
  if (!fs.existsSync(courseToDownload.targetFolder)) {
    fs.mkdirSync(courseToDownload.targetFolder);
  }
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
      writer.on("error", (err) => {
        console.log("Error downloading file", filePath, err);
        reject(err);
      });
    } catch (error) {
      console.log("Error downloading file", filePath, error);
      reject(error);
    }
  });
}

function findCoursesToDownload(
  oldManifestCourseList: Course[],
  newManifestCourseList: Course[],
  folder: string
): CourseToDownload[] {
  // convert oldManifestCourses to object keyed on course name
  console.log("finding courses to donwload!");
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

function checkIfDownloadedFileExists(course: Course, targetFolder: string) {
  return fileExistsInFolder(targetFolder, course.CourseFolder + ".zip");
}

function fileExistsInFolder(folderName: string, filename: string) {
  const filePath = path.join(folderName, filename);
  return fs.existsSync(filePath);
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
  if (oldCourse.DownloadUrl !== newCourse.DownloadUrl) {
    return true;
  }
  // Continue for other fields as needed...

  // If none of the conditions are met, return false
  return false;
}

function scheduleCourseListUpdate() {
  setTimeout(() => {
    fetchCourseManifests().then(writeCourseList);
  }, 100);
}

function getCourseInfo() {
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

async function main() {
  // fetchCourseManifests().then(writeCourseList);
  // scheduleCourseListUpdate();
  // printCourseInfo();
  // startServer();
  // printAllFieldsWithExample();
  doFullUpdateCycle();
}

async function printAllFieldsWithExample() {}

main();
