import * as elements from "typed-html";
import { log } from "../../../../log";
import { Course, TeeBox } from "../../../../models";

export function TeeboxList(course: Course, teeboxes: TeeBox[]) {
  log("TeeboxList: ", course, teeboxes);
  return (
    <div class="container mx-auto p-8 bg-white rounded shadow-xl">
      <img
        src={
          "https://simulatorgolftour.com/public/assets/courseImages/scorecards/scorecard_" +
          course.SgtID +
          ".jpg"
        }
        alt="hello"
      />
      <h1 class="text-2xl font-semibold mb-6">
        Tee boxes for {course.CourseName}
      </h1>
      <ul class="list-inside space-y-4">
        {teeboxes.map((teebox: TeeBox) => (
          <li class="border-l-4 border-blue-500 pl-4">
            {teebox.TeeBoxName}, {teebox.CourseRating}, {teebox.SlopeRating},
            {teebox.LengthInYards}
          </li>
        ))}
      </ul>
      <br />
      <TeeboxForm courseId={course.CourseID} />
    </div>
  );
}

export function TeeboxForm({ courseId }: { courseId: number }) {
  return (
    <div>
      <h2 class="text-xl font-bold mb-4">
        Add Tee Box to Course: <span id="selected-course-name"></span>
      </h2>
      <form
        id="add-teebox-form"
        hx-post={"/admin/courses/" + courseId + "/teeboxes/create"}
        hx-target="#teebox-form"
      >
        <input type="hidden" id="selected-course-id" name="courseId" />
        <div class="mb-4">
          <label class="block text-sm mb-2" for="teeboxName">
            Tee Box Name
          </label>
          <input
            type="text"
            id="TeeboxName"
            name="TeeboxName"
            class="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
          <label class="block text-sm mb-2" for="CourseRating">
            Course rating
          </label>
          <input
            type="text"
            id="CourseRating"
            name="CourseRating"
            class="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
          <label class="block text-sm mb-2" for="SlopeRating">
            Slope rating
          </label>
          <input
            type="text"
            id="SlopeRating"
            name="SlopeRating"
            class="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
          <label class="block text-sm mb-2" for="LengthInYards">
            Length in yards
          </label>
          <input
            type="text"
            id="LengthInYards"
            name="LengthInYards"
            class="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>
        <div>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Add Tee Box
          </button>
          <a
            href={`/admin/courses`}
            class="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
          >
            Back
          </a>
        </div>
      </form>
    </div>
  );
}
