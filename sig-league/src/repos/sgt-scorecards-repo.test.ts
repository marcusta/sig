import { createNewDatabase } from "../db/sqlite/test-helpers";
import { parseSgtFile } from "../sgt/file-parser";
import { SgtJsonObject } from "../sgt/sgt-model";
import { convertToSgtScorecard } from "../sgt/sgt-object-to-internal";
import { SgtScorecardsRepo } from "./sgt-scorecards-repo";

async function importScorecards(
  sgtJsonObjects: SgtJsonObject[],
  sgtScorecardsRepo: SgtScorecardsRepo
) {
  for (const sgtJsonObject of sgtJsonObjects) {
    const scorecard = convertToSgtScorecard(sgtJsonObject);
    await sgtScorecardsRepo.importScorecard(scorecard).catch((e) => {
      console.error(
        "Error importing scorecard for player:",
        scorecard.player_name,
        e
      );
      throw e; // Rethrow the error to potentially fail the test here
    });
  }
}

async function setupDbAndImportScorecards(
  dbPath: string,
  sgtFile: string
): Promise<SgtScorecardsRepo> {
  const db = await createNewDatabase(dbPath);
  const sgtScorecardsRepo = new SgtScorecardsRepo(db);
  const sgtJsonObjects = parseSgtFile(sgtFile);
  await importScorecards(sgtJsonObjects, sgtScorecardsRepo);
  return sgtScorecardsRepo;
}

describe("sgt-scorecards-repo", () => {
  test("importing a scorecard should persist", async () => {
    const dbPath = "./test-import.db";
    const db = await createNewDatabase(dbPath);
    const sgtScorecardsRepo = new SgtScorecardsRepo(db);

    const sgtJsonObjects = parseSgtFile("./data/new_sig_scores.json");
    const sgtJsonObject = sgtJsonObjects[0];

    const scorecard = convertToSgtScorecard(sgtJsonObject);

    await sgtScorecardsRepo.importScorecard(scorecard);

    const scorecardFromDb =
      await sgtScorecardsRepo.getScorecardByTourneyNameAndRound(
        scorecard.player_name,
        scorecard.tourneyName,
        scorecard.round
      );

    expect(scorecardFromDb).not.toBeNull();
    expect(scorecardFromDb.total_gross).toBe(scorecard.total_gross);
    expect(scorecardFromDb.total_par).toBe(scorecard.total_par);
    expect(scorecardFromDb.h1_Par).toBe(scorecard.h1_Par);
    expect(scorecardFromDb.hole1_gross).toBe(scorecard.hole1_gross);
  });

  test("getting scorecards for a tournament should return all stored scorecards for tournament", async () => {
    const sgtScorecardsRepo = await setupDbAndImportScorecards(
      "./test-list.db",
      "./data/new_sig_scores.json"
    );
    const tourneyName = "SIG Touren QSchool";

    const scorecardsFromRepo =
      await sgtScorecardsRepo.getScorecardsByTourneyName(tourneyName);

    expect(scorecardsFromRepo.length).toBe(16);
  });

  test("should get 4 active tournaments from imported scorecards", async () => {
    const sgtScorecardsRepo = await setupDbAndImportScorecards(
      "./test-active-tournaments.db",
      "./data/new_sig_scores.json"
    );
    const activeTournaments = await sgtScorecardsRepo.getActiveTourneys();
    expect(activeTournaments.length).toBe(4);
  });
});
