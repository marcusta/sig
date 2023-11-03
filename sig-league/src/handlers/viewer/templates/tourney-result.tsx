import * as elements from "typed-html";
import { TournamentResult, TournamentResults } from "../../../models";

export function TournamentResultView({
  tourneyResults,
}: {
  tourneyResults: TournamentResults;
}) {
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-10 text-center">
        <h2 class="text-3xl font-extrabold text-gray-800 sm:text-4xl">
          {tourneyResults.tourneyName}
        </h2>
        <p class="mt-2 text-base text-gray-500">{tourneyResults.courseName}</p>
      </div>

      <div class="flex flex-col mt-8">
        <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
            <TournamentResultTable resultsList={tourneyResults.resultList} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TournamentResultTable({
  resultsList,
}: {
  resultsList: TournamentResult[];
}) {
  return (
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
            Position
          </th>
          <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Player Name
          </th>
          <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
            Net Out
          </th>
          <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
            Net In
          </th>
          <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
            Total
          </th>
          <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
            Holes Played
          </th>
        </tr>
      </thead>
      <tbody class="bg-white">
        {resultsList.map((player, index) => (
          <TournamentResultRow playerResult={player} index={index} />
        ))}
      </tbody>
    </table>
  );
}

export function TournamentResultRow({
  playerResult,
  index,
}: {
  playerResult: TournamentResult;
  index: number;
}) {
  return (
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
        {index + 1}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {playerResult.playerName}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {playerResult.rounds[0].netOut}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {playerResult.rounds[0].netIn}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {playerResult.rounds[0].netToPar > 0 ? "+" : ""}
        {playerResult.rounds[0].netToPar}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {playerResult.playedHoles}
      </td>
    </tr>
  );
}
