import express from "express";
import { getCourseInfo, readCourseList } from "./file-storage";
import { Course } from "./types";

const app = express();
const PORT = 3000;

export function startServer() {
    app.get("/", (req, res) => {
      const response = getCourseInfoResponse();
      res.header("Content-Type", "text/html; charset=UTF-8").send(response);
    });
  
    app.get("/courseList.json", (req, res) => {
      const response = getMergedManifestResponse();
      res
        .header("Content-Type", "application/json; charset=UTF-8")
        .json(response);
    });
  
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT} ...`);
    });
  
    function getCourseInfoResponse(): string {
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
  
      return html;
    }
  
    function getMergedManifestResponse() {
      const courseList = readCourseList();
      const courses: Course[] = [];
      for (const courseManifest of courseList) {
        courses.push(...courseManifest.courseList);
      }
      return courses; // Note: This function now returns the object directly, Express will handle JSON string conversion
    }
  
  
  
    // Assuming these functions exist
    // function getCourseInfo(): { [key: string]: any } { /* implementation */ }
    // function readCourseList(): any[] { /* implementation */ }
    // type Course = { /* structure */ };
  }
  