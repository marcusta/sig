export interface TournamentResults {
  resultList: TournamentResult[];
  tourneyName: string;
  courseName: string;
  rounds: number;
}

export interface TournamentResult {
  playerName: string;
  rounds: TournamentRoundResult[];
  netToPar: number;
  grossToPar: number;
  position: number;
  complete: boolean;
  handicap: string;
  playedHoles: number;
}

export interface TournamentRoundResult {
  round: number;
  netOut: number;
  netIn: number;
  netToPar: number;
  netTotal: number;
  grossOut: number;
  grossIn: number;
  grossToPar: number;
  grossTotal: number;
  activeHole: number;
}

export interface Course {
  CourseID: number;
  CourseName: string;
  SgtID: string;
}

export interface TeeBox {
  TeeBoxID: number;
  CourseID: number;
  TeeBoxName: string;
  CourseRating: number;
  SlopeRating: number;
  LengthInYards: number;
}

export interface FullTeeBox extends TeeBox {
  course: Course;
}

export interface Tournament {
  TournamentID: number;
  TournamentName: string;
  SgtID: string;
}

export interface FullTournament extends Tournament {
  rounds: FullTournamentRound[];
}

export interface TournamentRound {
  RoundID: number;
  TournamentID: number;
  TeeBoxID: number;
  RoundNumber: number;
}

export interface FullTournamentRound extends TournamentRound {
  teebox: FullTeeBox;
}

export interface Hole {
  HoleID: number;
  CourseID: number;
  HoleNumber: number;
  Par: number;
  Handicap: number;
}

export interface Player {
  PlayerID: number;
  PlayerName: string;
  Handicap: number;
}

export interface FullPlayer extends Player {
  scorecards: FullScorecard[];
}

export interface Score {
  in: number;
  out: number;
  total: number;
  toPar: number;
}

export interface Scorecard {
  ScorecardID: number;
  PlayerID: number;
  RoundID: number;
  Gross: Score;
  Net: Score;
  SgtNet: Score;
  HandicapDiff: number;
  Complete: boolean;
  CreatedAt: string;
}

export interface FullScorecard extends Scorecard {
  holes: HoleScore[];
}

export interface HoleScore {
  HoleScoreID: number;
  ScorecardID: number;
  HoleID: number;
  GrossScore: number;
  NetScore: number;
  SgtNetScore: number;
}
