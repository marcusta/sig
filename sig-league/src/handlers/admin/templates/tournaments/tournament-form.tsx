import * as elements from "typed-html";

export function CreateTournamentForm() {
  return (
    <div>
      <h2 class="text-xl font-bold mb-4">Create a Tournament</h2>
      <form method="post" action="/admin/tournaments/create">
        <div class="mb-4">
          <label class="block text-sm mb-2" for="tournamentName">
            Tournament Name
          </label>
          <input
            type="text"
            id="tournamentName"
            name="tournamentName"
            class="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            required="true"
          />
          <br />
          <label class="block text-sm mb-2" for="tournamentName">
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
            class="inline-flex items-center px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Create Tournament
          </button>
          <a
            href="/admin/tournaments"
            class="inline-flex items-center px-5 py-2 ml-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
          >
            Back
          </a>
        </div>
      </form>
    </div>
  );
}
