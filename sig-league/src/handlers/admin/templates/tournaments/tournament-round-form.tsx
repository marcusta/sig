import * as elements from "typed-html";
import { Course, Tournament } from "../../../../models";

export function TournamentRoundForm({
  courses,
  tournament,
}: {
  courses: Course[];
  tournament: Tournament;
}) {
  return (
    <form
      method="post"
      action={
        "/admin/tournaments/" + tournament.TournamentID + "/rounds/create"
      }
      class="bg-white  max-w-lg space-y-4"
    >
      <div class="flex justify-between space-x-4">
        <div class="w-1/4">
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="roundNumber"
          >
            Round Number
          </label>
          <input
            type="text"
            id="roundNumber"
            name="roundNumber"
            class="h-10 px-3 py-2 border border-gray-300 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            required="true"
          />
        </div>

        <div class="w-2/4">
          <label
            for="courseSelector"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Course:
          </label>
          <select
            id="courseSelector"
            name="course"
            hx-get="/admin/teebox-selector"
            hx-trigger="change"
            hx-target="#teeboxWrapper"
            class="h-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option value={course.CourseID.toString()}>
                {course.CourseName}
              </option>
            ))}
          </select>
        </div>
        <div class="w-1/4" id="teeboxWrapper">
          <label
            for="courseSelector"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Select teebox:
          </label>
          <select
            id="teeboxSelector"
            name="teebox"
            class="h-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          >
            <option>-</option>
          </select>
        </div>
      </div>
      <div class="flex justify-start space-x-4 mt-4">
        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Create Round
        </button>
        <a
          href={`/admin/tournaments`}
          class="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
        >
          Back
        </a>
      </div>
    </form>
  );
}
