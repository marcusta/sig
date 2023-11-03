import * as elements from "typed-html";
import { TournamentResult, TournamentResults } from "../../../models";

export function tourneyListView(tourneyList: TournamentResults[]) {
  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Ongoing Golf Tournaments
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        {tourneyList.map((tourney) => (
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <TourneyCard tourney={tourney} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TourneyCard({ tourney }: { tourney: TournamentResults }) {
  const results = tourney.resultList.slice(0, 4);
  return (
    <div class="bg-white">
      <div class="p-4">
        <h2 class="font-bold text-xl mb-2">
          <a href={"/results/tourneys/" + tourney.tourneyID}>
            {tourney.tourneyName}
          </a>
        </h2>
        <p class="text-gray-700">
          <a href={"/results/tourneys/" + tourney.tourneyID}>
            {tourney.courseName}
          </a>
        </p>
        <div class="mt-4">
          <h3 class="text-lg font-semibold">Current Top Scores</h3>

          <ul class="mt-2">
            {results.map((player) => (
              <PlayerRow player={player} />
            ))}
          </ul>
        </div>
      </div>
      <div class="p-4 border-t border-gray-200">
        <span class="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">
          Live
        </span>
        <div class="mt-2">
          <span class="text-gray-600 text-sm">April 7-10</span>
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ player }: { player: TournamentResult }) {
  return (
    <li class="flex justify-between items-center mt-1">
      <span class="font-medium">{player.playerName}</span>
      <span class="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
        {player.netToPar} ({player.playedHoles})
      </span>
    </li>
  );
}
