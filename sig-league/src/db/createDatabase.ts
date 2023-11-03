import { Db } from "./db";

export async function waitFor(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({});
    }, ms);
  });
}

export async function createDatabase(db: Db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS Courses (
      CourseID INTEGER PRIMARY KEY AUTOINCREMENT,
      CourseName TEXT NOT NULL,
      SgtID TEXT NOT NULL
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS TeeBoxes (
    TeeBoxID INTEGER PRIMARY KEY AUTOINCREMENT,
    CourseID INTEGER NOT NULL,
    TeeBoxName TEXT NOT NULL,
    CourseRating REAL NOT NULL,
    SlopeRating REAL NOT NULL,
    LengthInYards INTEGER NOT NULL,
    FOREIGN KEY (CourseID) REFERENCES Courses (CourseID)
  )
`);

  db.run(`
CREATE TABLE IF NOT EXISTS Tournaments (
  TournamentID INTEGER PRIMARY KEY AUTOINCREMENT,
  TournamentName TEXT NOT NULL,
  SgtID TEXT NOT NULL
)
`);

  db.run(`
CREATE TABLE IF NOT EXISTS Players (
  PlayerID INTEGER PRIMARY KEY AUTOINCREMENT,
  PlayerName TEXT NOT NULL,
  Handicap REAL NOT NULL
)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS TournamentRounds (
      RoundID INTEGER PRIMARY KEY AUTOINCREMENT,
      TournamentID INTEGER NOT NULL,
      TeeBoxID INTEGER NOT NULL,
      RoundNumber INTEGER NOT NULL,
      FOREIGN KEY (TournamentID) REFERENCES Tournaments (TournamentID),
      FOREIGN KEY (TeeBoxID) REFERENCES TeeBoxes (TeeBoxID)
    )
  `);

  // create table for sgt scorecards if not exists based on type SgtResultObject in sgt-model.ts
  const sgtTableExistsResult = await db.tableExists("SgtScorecard");
  if (!sgtTableExistsResult) {
    const sgtSql = `
    CREATE TABLE SgtScorecard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      TeamPlayer1 TEXT,
      TeamPlayer2 TEXT,
      TeamPlayer3 TEXT,
      TeamPlayer4 TEXT,
      tourName TEXT NOT NULL,
      tourneyName TEXT NOT NULL,
      tourney_end_date TEXT NOT NULL,
      round INTEGER NOT NULL,
      activeHole INTEGER NOT NULL,
      hole1_gross INTEGER,
      hole1_net INTEGER,
      hole2_gross INTEGER,
      hole2_net INTEGER,
      hole3_gross INTEGER,
      hole3_net INTEGER,
      hole4_gross INTEGER,
      hole4_net INTEGER,
      hole5_gross INTEGER,
      hole5_net INTEGER,
      hole6_gross INTEGER,
      hole6_net INTEGER,
      hole7_gross INTEGER,
      hole7_net INTEGER,
      hole8_gross INTEGER,
      hole8_net INTEGER,
      hole9_gross INTEGER,
      hole9_net INTEGER,
      hole10_gross INTEGER,
      hole10_net INTEGER,
      hole11_gross INTEGER,
      hole11_net INTEGER,
      hole12_gross INTEGER,
      hole12_net INTEGER,
      hole13_gross INTEGER,
      hole13_net INTEGER,
      hole14_gross INTEGER,
      hole14_net INTEGER,
      hole15_gross INTEGER,
      hole15_net INTEGER,
      hole16_gross INTEGER,
      hole16_net INTEGER,
      hole17_gross INTEGER,
      hole17_net INTEGER,
      hole18_gross INTEGER,
      hole18_net INTEGER,
      h1_Par INTEGER,
      h2_Par INTEGER,
      h3_Par INTEGER,
      h4_Par INTEGER,
      h5_Par INTEGER,
      h6_Par INTEGER,
      h7_Par INTEGER,
      h8_Par INTEGER,
      h9_Par INTEGER,
      h10_Par INTEGER,
      h11_Par INTEGER,
      h12_Par INTEGER,
      h13_Par INTEGER,
      h14_Par INTEGER,
      h15_Par INTEGER,
      h16_Par INTEGER,
      h17_Par INTEGER,
      h18_Par INTEGER,
      h1_index INTEGER,
      h2_index INTEGER,
      h3_index INTEGER,
      h4_index INTEGER,
      h5_index INTEGER,
      h6_index INTEGER,
      h7_index INTEGER,
      h8_index INTEGER,
      h9_index INTEGER,
      h10_index INTEGER,
      h11_index INTEGER,
      h12_index INTEGER,
      h13_index INTEGER,
      h14_index INTEGER,
      h15_index INTEGER,
      h16_index INTEGER,
      h17_index INTEGER,
      h18_index INTEGER,
      in_gross INTEGER,
      out_gross INTEGER,
      total_gross INTEGER,
      toPar_gross INTEGER,
      in_net INTEGER,
      out_net INTEGER,
      total_net INTEGER,
      toPar_net INTEGER,
      total_par INTEGER,
      courseName TEXT NOT NULL,
      teetype TEXT NOT NULL,
      rating REAL NOT NULL,
      slope INTEGER NOT NULL,
      first_imported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      handicap_differential REAL NOT NULL
    );
  `;
    db.run(sgtSql);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({});
    }, 100);
  });
}
