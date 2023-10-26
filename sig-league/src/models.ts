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
  HcpIndex: number;
}

export interface Scorecard {
  ScorecardID: number;
  PlayerID: number;
  RoundID: number;
  SgtInGross: number;
  OutGross: number;
  SgtInNet: number;
  OutNet: number;
  TotalGross: number;
  ToParGross: number;
  SgtTotalNet: number;
  SgtToParNet: number;
  HandicapDiff: number;
}

export interface HoleScore {
  HoleScoreID: number;
  ScorecardID: number;
  HoleID: number;
  GrossScore: number;
  SgtNetScore: number;
}
