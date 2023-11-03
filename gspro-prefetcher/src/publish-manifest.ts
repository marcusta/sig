import * as fs from 'fs';
import * as path from 'path';
import { readCourseList } from './file-storage';
import { Course } from './types';

export function publishLocalCourseManifest() {
  // Base URL of your local server
  const localBaseUrl = 'http://192.168.10.93:8080';

  // Read the current course list
  const courseManifests = readCourseList();

  // New array for updated courses
  const updatedCourses: Course[] = [];

  courseManifests.forEach(manifest => {
    manifest.courseList.forEach(course => {
      // Construct the local file path for this course
      const localFilePath = path.join('.', manifest.folder, course.CourseFolder + '.zip'); // assuming the course file is a .zip
      // Check if the course file exists locally
      if (fs.existsSync(localFilePath)) {
        // Construct the new URLs
        const localCourseUrl = localBaseUrl + '/' + manifest.folder + '/' + course.CourseFolder + '.zip';
        // Rewrite the URLs to point to the local server
        const updatedCourse = {
          ...course,
          DownloadURL: localCourseUrl,
          DownloadURL2: localCourseUrl,
          DownloadURL3: localCourseUrl,
        };

        updatedCourses.push(updatedCourse);
      }
    });
  });

  // Prepare the data to write to course_manifest.json
  const dataToWrite = JSON.stringify(updatedCourses, null, 2);  // pretty-printed JSON

  // Write to course_manifest.json in the current directory
  fs.writeFile('course_manifest.json', dataToWrite, (err) => {
    if (err) {
      console.error('Error writing course_manifest.json', err);
      return;
    }
    console.log('course_manifest.json has been saved with local URLs.');
  });
}
