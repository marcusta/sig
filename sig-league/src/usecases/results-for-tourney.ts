import {
  FullTournament,
  TournamentResult,
  TournamentResults,
  TournamentRoundResult,
} from "../models";
import { SgtScorecardsRepo } from "../repos/sgt-scorecards-repo";
import { TournamentRepo } from "../repos/tournament-repo";
import { calculateHandicap } from "../sgt/estimate-handicap";

export class ResultsForTourney {
  private sgtScorecardsRepo: SgtScorecardsRepo;
  private tournamentRepo: TournamentRepo;

  constructor(
    sgtScorecardsRepo: SgtScorecardsRepo,
    tournamentRepo: TournamentRepo
  ) {
    this.sgtScorecardsRepo = sgtScorecardsRepo;
    this.tournamentRepo = tournamentRepo;
  }

  async getResultsForTourneyByName(
    tourneyName: string
  ): Promise<TournamentResults> {
    const tourney = await this.tournamentRepo.getFullTourneyByName(tourneyName);
    return this.getResultsForTourney(tourney);
  }

  async getResultsForTourneyById(
    tourneyId: string
  ): Promise<TournamentResults> {
    const tourney = await this.tournamentRepo.getFullTournament(tourneyId);
    return this.getResultsForTourney(tourney);
  }

  async getResultsForTourney(
    tourney: FullTournament | null
  ): Promise<TournamentResults> {
    if (!tourney) {
      return {
        tourneyName: "No tournament found",
        rounds: 0,
        resultList: [],
        courseName: "",
      };
    }
    const tourneyName = tourney.TournamentName;
    const tourneyRoundCount = tourney?.rounds?.length ?? 0;
    if (tourneyRoundCount === 0) {
      return {
        tourneyName: tourneyName,
        rounds: 0,
        resultList: [],
        courseName:
          tourney?.rounds[0]?.teebox?.course?.CourseName ??
          "No teebox or course mapped to tournament",
      };
    }

    const scorecards = await this.sgtScorecardsRepo.getScorecardsByTourneyName(
      tourneyName
    );

    const resultMap: { [playerName: string]: TournamentResult } = {};

    for (const scorecard of scorecards) {
      const roundResult: TournamentRoundResult = {
        grossIn: scorecard.in_gross,
        grossOut: scorecard.out_gross,
        grossTotal: scorecard.total_gross,
        grossToPar: scorecard.toPar_gross,
        netIn: scorecard.in_net,
        netOut: scorecard.out_net,
        netTotal: scorecard.total_net,
        netToPar: scorecard.toPar_net,
        round: scorecard.round,
        activeHole: scorecard.activeHole,
      };
      if (!resultMap[scorecard.player_name]) {
        resultMap[scorecard.player_name] = {
          playerName: scorecard.player_name,
          rounds: [],
          netToPar: 0,
          grossToPar: 0,
          position: 0,
          complete: false,
          handicap: "-",
          playedHoles: 0,
        };
      }

      const tournamentResult = resultMap[scorecard.player_name];
      tournamentResult.netToPar += roundResult.netToPar;
      tournamentResult.grossToPar += roundResult.grossToPar;
      if (scorecard.activeHole === 19) {
        const handicap = calculateHandicap(scorecard);
        tournamentResult.handicap = handicap.toString();
      }
      tournamentResult.playedHoles += scorecard.activeHole - 1;
      if (tournamentResult.playedHoles / tourneyRoundCount === 18) {
        tournamentResult.complete = true;
      }

      tournamentResult.rounds.push(roundResult);
    }

    const resultList = Object.values(resultMap).sort((a, b) => {
      return a.netToPar - b.netToPar;
    });

    return {
      tourneyName: tourneyName,
      rounds: tourneyRoundCount,
      resultList,
      courseName: tourney?.rounds[0]?.teebox?.course?.CourseName ?? "",
    };
  }
}
