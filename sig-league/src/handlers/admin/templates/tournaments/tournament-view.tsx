import * as elements from "typed-html";
import { Course, FullTournament } from "../../../../models";
import { TournamentRoundForm } from "./tournament-round-form";

export function TournamentView({
  tournament,
  courses,
}: {
  tournament: FullTournament | null;
  courses: Course[];
}) {
  if (tournament == null) {
    return (
      <div class="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded">
        <h2 class="text-xl font-bold mb-4">Tournament Not Found</h2>
      </div>
    );
  }
  return (
    <div class="bg-gray-100 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <div class="bg-white p-6 rounded-md shadow-sm mb-8">
          <h1 class="text-2xl font-bold text-blue-700 mb-2">
            {tournament.TournamentName}
          </h1>
          <p class="text-gray-600">SGT ID: {tournament.SgtID}</p>
        </div>

        <div class="bg-white p-6 rounded-md shadow-sm mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Rounds</h2>
          <RoundList tournament={tournament} />
        </div>

        <div class="bg-white p-6 rounded-md shadow-sm">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Add Tournament Round
          </h2>
          <TournamentRoundForm tournament={tournament} courses={courses} />
        </div>
      </div>
    </div>
  );
}

function RoundList({ tournament }: { tournament: FullTournament }) {
  return (
    <ul class="space-y-4">
      {tournament.rounds.map((round) => (
        <li class="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-md shadow-sm">
          <div class="font-semibold text-blue-700">
            Round {round.RoundNumber}:{" "}
            <a href={"/admin/courses/" + round.teebox.course.CourseID}>
              {round.teebox.course.CourseName}
            </a>
          </div>
          <div class="ml-4 mt-2 space-y-1">
            <div>
              <span class="font-semibold">TeeBox:</span>{" "}
              {round.teebox.TeeBoxName}
            </div>
            <div>
              <span class="font-semibold">Course Rating:</span>{" "}
              {round.teebox.CourseRating}
            </div>
            <div>
              <span class="font-semibold">Slope Rating:</span>{" "}
              {round.teebox.SlopeRating}
            </div>
            <div>
              <span class="font-semibold">Length:</span>{" "}
              {round.teebox.LengthInYards} Yards /{" "}
              {(round.teebox.LengthInYards * 0.9144).toFixed(0)} Meters
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
