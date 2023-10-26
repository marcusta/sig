export const localHttpServer = "http://localhost:3010";

/*const courseManifestUrls = [
  "https://simulatorgolftour.com/course_manifest.json",
  "https://tekbud.s3.us-east-2.amazonaws.com/tekbudcourselist1.json",
  "https://www.dropbox.com/s/5er3u2xanxjnqnj/fantasyv2.json?dl=1",
  "http://pakmanstudios.com/tier1-093006.json",
  "http://pakmanstudios.com/tier2-070101.json",
];*/

export const courseManifestUrls: CourseManifestList = [
  {
    url: "http://127.0.0.1:3010/testManifest.json",
    folder: "testManifest",
    courseList: [],
  },
  {
    url: "http://127.0.0.1:3010/test-folder2/testManifest2.json",
    folder: "testManifest2",
    courseList: [],
  },
];

export const courseManifestPublishPath = "./course_manifest.json";
