import * as elements from "typed-html";

export function AddCourse() {
  return (
    <div class="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded">
      <h2 class="text-xl font-bold mb-4">Create a Course</h2>
      <form method="post" action="/admin/courses/create">
        <div class="mb-4">
          <label class="block text-sm mb-2" for="courseName">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            class="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            required="true"
          />
          <br />
          <label class="block text-sm mb-2" for="courseName">
            SGT ID
          </label>
          <input
            type="text"
            id="sgtId"
            name="sgtId"
            class="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            required="true"
          />
        </div>
        <div>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}
