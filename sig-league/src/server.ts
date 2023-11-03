import express from "express";
import { createDatabase } from "./db/createDatabase";
import { connectToDatabase } from "./db/sqlite/connect";
import { SqliteDb } from "./db/sqlite/sqlite3-db";
import { registerCourseAdminHandlers } from "./handlers/admin/admin-course";
import { registerTournamentAdminHandlers } from "./handlers/admin/admin-tournament";
import { registerResultsHandlers } from "./handlers/viewer/results";
import { log } from "./log";
import { CourseRepo } from "./repos/course-repo";
import { SgtScorecardsRepo } from "./repos/sgt-scorecards-repo";
import { TeeboxRepo } from "./repos/teebox-repo";
import { TournamentRepo } from "./repos/tournament-repo";
import { FileImporter } from "./sgt/file-importer";
import { startSgtSync } from "./sgt/sgt-downloader";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("static"));

const sgtURL = "https://simulatorgolftour.com/club-api/3/club-scores";
const filepathForSyncFile = "./data/sig-scores.json";

const sqliteDb = new SqliteDb(connectToDatabase());
const courseRepo = new CourseRepo(sqliteDb);
const teeboxRepo = new TeeboxRepo(sqliteDb);
const tournamentRepo = new TournamentRepo(sqliteDb);
const sgtScorecardsRepo = new SgtScorecardsRepo(sqliteDb);
const fileImporter = new FileImporter(sgtScorecardsRepo);

createDatabase(sqliteDb);

registerCourseAdminHandlers(app, courseRepo, teeboxRepo);
registerTournamentAdminHandlers(app, courseRepo, teeboxRepo, tournamentRepo);
registerResultsHandlers(app, sgtScorecardsRepo, tournamentRepo);
startSgtSync(sgtURL, filepathForSyncFile, 40, fileImporter);

app.listen(PORT, () => {
  // dropDatabase();
  log(`Server is running on port ${PORT}`);
});
