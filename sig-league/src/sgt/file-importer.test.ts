import { createNewDatabase } from "../db/sqlite/test-helpers";
import { SgtScorecardsRepo } from "../repos/sgt-scorecards-repo";
import { FileImporter } from "./file-importer";

describe("file-importer", () => {
  test("importing scorecards should persist", async () => {
    const dbPath = "./test-file-importer.db";
    const db = await createNewDatabase(dbPath);
    const sgtScorecardsRepo = new SgtScorecardsRepo(db);
    const fileImporter = new FileImporter(sgtScorecardsRepo);
    await fileImporter.importFile("./data/new_sig_scores.json");
    const scorecards = await sgtScorecardsRepo.getScorecardsByTourneyName(
      "SIG Touren QSchool"
    );
    expect(scorecards.length).toBe(16);
  });

  test("importing scorecards twice should not duplicate", async () => {
    const dbPath = "./test-file-importer2.db";
    const db = await createNewDatabase(dbPath);
    const sgtScorecardsRepo = new SgtScorecardsRepo(db);
    const fileImporter = new FileImporter(sgtScorecardsRepo);
    await fileImporter.importFile("./data/new_sig_scores.json");
    await fileImporter.importFile("./data/new_sig_scores.json");
    const scorecards = await sgtScorecardsRepo.getScorecardsByTourneyName(
      "SIG Touren QSchool"
    );
    expect(scorecards.length).toBe(16);
  });

  test("importing scorecards with updates should update in database", async () => {
    const dbPath = "./test-file-importer3.db";
    const db = await createNewDatabase(dbPath);
    const sgtScorecardsRepo = new SgtScorecardsRepo(db);
    const fileImporter = new FileImporter(sgtScorecardsRepo);
    await fileImporter.importFile("./data/new_sig_scores.json");
    const scorecardAfterFirstImport =
      await sgtScorecardsRepo.getScorecardByTourneyNameAndRound(
        "91an",
        "SIG Touren QSchool",
        1
      );
    await fileImporter.importFile("./data/new_sig_scores_with_updates.json");
    const scorecardAfterSecondImport =
      await sgtScorecardsRepo.getScorecardByTourneyNameAndRound(
        "91an",
        "SIG Touren QSchool",
        1
      );
    expect(scorecardAfterFirstImport.activeHole).toBe(17);
    expect(scorecardAfterFirstImport.hole17_gross).toBe(0);
    expect(scorecardAfterSecondImport.activeHole).toBe(19);
    expect(scorecardAfterSecondImport.hole17_gross).toBe(4);
  });
});
