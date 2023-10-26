import express from "express";
import { connectToDatabase, createDatabase } from "./db/config";
import { SqliteDb } from "./db/sqlite3-utils";
import { registerCourseAdminHandlers } from "./handlers/admin/admin-course";
import { registerTournamentAdminHandlers } from "./handlers/admin/admin-tournament";
import { log } from "./log";
import { CourseRepo } from "./repos/course-repo";
import { TeeboxRepo } from "./repos/teebox-repo";
import { TournamentRepo } from "./repos/tournament-repo";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("static"));

const sqliteDb = new SqliteDb(connectToDatabase());
const courseRepo = new CourseRepo(sqliteDb);
const teeboxRepo = new TeeboxRepo(sqliteDb);
const tournamentRepo = new TournamentRepo(sqliteDb);

registerCourseAdminHandlers(app, courseRepo, teeboxRepo);
registerTournamentAdminHandlers(app, courseRepo, teeboxRepo, tournamentRepo);

app.listen(PORT, () => {
  // dropDatabase();
  createDatabase();
  log(`Server is running on port ${PORT}`);
});
