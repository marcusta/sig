import * as elements from "typed-html";
import { Course, TeeBox } from "../../../../models";

export function CourseView({
  course,
  teeboxes,
}: {
  course: Course;
  teeboxes: TeeBox[];
}) {
  return (
    <div class="container mx-auto mt-10">
      <div class="bg-white shadow p-6 rounded-lg">
        <h1 class="text-xl font-semibold mb-4">{course.CourseName}</h1>

        <div class="mb-6">
          <img
            src={
              "https://simulatorgolftour.com/public/assets/courseImages/scorecards/scorecard_" +
              course.SgtID +
              ".jpg"
            }
            alt="Scorecard Image"
            class="rounded w-full h-auto"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 class="text-lg font-medium mb-2">Tee Boxes</h2>
            {teeboxes.map((teebox: TeeBox) => (
              <div class="border rounded p-4">
                <div class="mb-4">
                  <div class="text-blue-600">{teebox.TeeBoxName}</div>
                  <div>Course Rating: {teebox.CourseRating}</div>
                  <div>Slope Rating: {teebox.SlopeRating}</div>
                  <div>
                    Length: {teebox.LengthInYards} Yards /{" "}
                    {(teebox.LengthInYards * 0.9144).toFixed(0)} Meters
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <form
              method="POST"
              action={"/admin/courses/" + course.CourseID + "/teeboxes/create"}
            >
              <h2 class="text-lg font-medium mb-2">Add Tee Box</h2>
              <div class="border rounded p-4">
                <div class="mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Tee Box Name
                  </label>
                  <input
                    id="TeeboxName"
                    name="TeeboxName"
                    class="mt-1 p-2 w-full border rounded"
                    type="text"
                  />
                </div>
                <div class="mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Course Rating
                  </label>
                  <input
                    id="CourseRating"
                    name="CourseRating"
                    class="mt-1 p-2 w-full border rounded"
                    type="text"
                  />
                </div>
                <div class="mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Slope Rating
                  </label>
                  <input
                    id="SlopeRating"
                    name="SlopeRating"
                    class="mt-1 p-2 w-full border rounded"
                    type="text"
                  />
                </div>
                <div class="mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Length in Yards
                  </label>
                  <input
                    id="LengthInYards"
                    name="LengthInYards"
                    class="mt-1 p-2 w-full border rounded"
                    type="text"
                  />
                </div>
                <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                  Add Tee Box
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="mt-6">
          <button class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
