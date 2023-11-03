import * as express from "express";
import { TournamentResults } from "../../models";
import { SgtScorecardsRepo } from "../../repos/sgt-scorecards-repo";
import { TournamentRepo } from "../../repos/tournament-repo";
import { ResultsForTourney } from "../../usecases/results-for-tourney";
import { Page } from "../admin/templates/page";
import { tourneyListView } from "./templates/tourney-list";
import { TournamentResultView } from "./templates/tourney-result";

export function registerResultsHandlers(
  app: express.Express,
  sgtScorecardsRepo: SgtScorecardsRepo,
  tournamentRepo: TournamentRepo
) {
  const tourneyResultMaker = new ResultsForTourney(
    sgtScorecardsRepo,
    tournamentRepo
  );

  app.get("/results", async (req, res) => {
    const tourneyNameList = await sgtScorecardsRepo.getActiveTourneyNames();
    const tourneyResultsList: TournamentResults[] = [];

    for (const tourneyName of tourneyNameList) {
      const tourneyResults =
        await tourneyResultMaker.getResultsForTourneyByName(tourneyName);
      tourneyResultsList.push(tourneyResults);
    }

    const page = Page(tourneyListView(tourneyResultsList));
    res.send(page);
  });

  app.get("/results/tourneys/:tourneyId", async (req, res) => {
    const tourneyId = req.params.tourneyId;
    const tourneyResults = await tourneyResultMaker.getResultsForTourneyById(
      tourneyId
    );
    const page = Page(TournamentResultView({ tourneyResults }));
    res.send(page);
  });
}
