
import { getCourseInfo, readCourseList } from "./file-storage";
import { doFullUpdateCycle } from "./sync";
import { publishLocalCourseManifest } from "./publish-manifest";
import { startServer } from "./express-server";

async function main() {
  // fetchCourseManifests().then(writeCourseList);
  // scheduleCourseListUpdate();
  // printCourseInfo();
  // startServer();
  // printAllFieldsWithExample();
  // doFullUpdateCycle();

  const args = process.argv.slice(2); // Remove the first two elements

  if (args[0] === "sync") {
    doFullUpdateCycle(); // Your function to sync and fetch all courses
  } else if (args[0] === "generate") {
    publishLocalCourseManifest(); // Your function to generate course_manifest.json
  } else if (args[0] === "info") {
    printCourseInfo();
  } else if (args[0] === "server") {
    startServer();
  } else if (args[0] === "scheduler") {
    console.log("do stuff in schedule");
  } else {
    console.log("Usage: npx ts-node ./src/index.ts [sync|generate]");
    console.log("sync - Sync and fetch all courses");
    console.log("generate - Generate course_manifest.json");
    console.log("info - Show information about available courses");
  }
}

async function printAllFieldsWithExample() {}

main();

function printCourseInfo() {
  const courseCounts = getCourseInfo();
  console.log(courseCounts);
}

