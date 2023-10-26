import sqlite3 from "sqlite3";

const dbPath = process.env.DB_PATH || "./db.sqlite3";

let db: sqlite3.Database | null = null;
export const connectToDatabase = (): sqlite3.Database => {
  // open the database
  if (!db) {
    db = new sqlite3.Database(dbPath);
  }
  return db;
};

export function createDatabase() {
  // make sure the database is connected and then create the tables
  console.log("createDatabase");
  const db = connectToDatabase();
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
  HcpIndex REAL NOT NULL
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

  db.run(`
    CREATE TABLE IF NOT EXISTS Scorecards (
      ScorecardID INTEGER PRIMARY KEY AUTOINCREMENT,
      PlayerID INTEGER NOT NULL,
      RoundID INTEGER NOT NULL,
      InGross INTEGER,
      OutGross INTEGER,
      SgtInNet INTEGER,
      SgtOutNet INTEGER,
      TotalGross INTEGER,
      ToParGross INTEGER,
      SgtTotalNet INTEGER,
      SgtToParNet INTEGER,
      HandicapDiff REAL,
      FOREIGN KEY (PlayerID) REFERENCES Players (PlayerID),
      FOREIGN KEY (RoundID) REFERENCES Rounds (RoundID)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Holes (
      HoleID INTEGER PRIMARY KEY AUTOINCREMENT,
      CourseID INTEGER NOT NULL,
      HoleNumber INTEGER NOT NULL,
      Par INTEGER NOT NULL,
      Handicap INTEGER NOT NULL,
      FOREIGN KEY (CourseID) REFERENCES Courses (CoursesID)
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS Scorecards (
    ScorecardID INTEGER PRIMARY KEY AUTOINCREMENT,
    PlayerID INTEGER NOT NULL,
    RoundID INTEGER NOT NULL,
    InGross INTEGER,
    OutGross INTEGER,
    InNet INTEGER,
    OutNet INTEGER,
    TotalGross INTEGER,
    ToParGross INTEGER,
    TotalNet INTEGER,
    ToParNet INTEGER,
    FOREIGN KEY (PlayerID) REFERENCES Players (PlayerID),
    FOREIGN KEY (RoundID) REFERENCES Rounds (RoundID)
  )
`);

  db.run(`
CREATE TABLE IF NOT EXISTS Scores (
  ScoreID INTEGER PRIMARY KEY AUTOINCREMENT,
  ScorecardID INTEGER NOT NULL,
  HoleID INTEGER NOT NULL,
  Gross INTEGER NOT NULL,
  Net INTEGER NOT NULL,
  FOREIGN KEY (ScorecardID) REFERENCES Scorecards (ScorecardID),
  FOREIGN KEY (HoleID) REFERENCES Holes (HoleID)
)
  `);
}

export function dropDatabase() {
  const db = connectToDatabase();
  console.log("dropDatabase");
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS Scores");
    db.run("DROP TABLE IF EXISTS Holes");
    db.run("DROP TABLE IF EXISTS Scorecards");
    db.run("DROP TABLE IF EXISTS Rounds");
    db.run("DROP TABLE IF EXISTS Players");
    db.run("DROP TABLE IF EXISTS Tournaments");
    db.run("DROP TABLE IF EXISTS TeeBoxes");
    db.run("DROP TABLE IF EXISTS Courses");
  });
}
