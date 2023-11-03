import * as elements from "typed-html";
import { Course, TeeBox } from "../../../../models";

function ListCourses({ courses }: { courses: Course[] }) {
  console.log("ListCourses courses: ", courses);
  const result = (
    <ul class="list-inside space-y-4">
      {courses.map((course: Course) => (
        <li class="border-l-4 border-blue-500 pl-4">
          <a href={"/admin/courses/" + course.CourseID}>{course.CourseName}</a>
        </li>
      ))}
    </ul>
  );
  console.log("ListCourses result: ", result.toString());
  return result;
}

export function listCoursePage(courses: Course[]) {
  return (
    <div class="container mx-auto px-4">
      <div class="flex justify-between gap-4 items-start">
        <div class="flex-1 p-4">
          <div class="p-8 bg-white rounded shadow-xl">
            <h1 class="text-2xl font-semibold mb-6">Courses</h1>
            <ListCourses courses={courses} />
            <a
              href="/admin/courses/add"
              class="block mt-4 text-blue-500 hover:underline"
            >
              Add course
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
