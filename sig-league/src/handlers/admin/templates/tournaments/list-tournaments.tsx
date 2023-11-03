import * as elements from "typed-html";
import { Tournament } from "../../../../models";
import { log } from "../../../../log";

export function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
  log("TournamentList: ", tournaments);
  return (
    <div class="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded">
      <h2 class="text-xl font-bold mb-4">Tournaments</h2>
      <ul>
        {tournaments.map((tournament) => (
          <li class="border-l-4 border-blue-500 pl-4">
            <a href={`/admin/tournaments/${tournament.TournamentID}`}>
              {tournament.TournamentName}
            </a>
          </li>
        ))}
      </ul>
      <br />
      <br />
      <a
        href="/admin/tournaments/add"
        class="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Create Tournament
      </a>
    </div>
  );
}
