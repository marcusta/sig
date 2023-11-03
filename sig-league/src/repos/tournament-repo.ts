import { Db } from "../db/db";
import { log } from "../log";
import {
  Course,
  FullTeeBox,
  FullTournament,
  FullTournamentRound,
  Tournament,
  TournamentRound,
} from "./../models";

export class TournamentRepo {
  private db: Db;
  constructor(db: Db) {
    this.db = db;
  }

  async listTournaments(): Promise<Tournament[]> {
    const sql = `
      SELECT TournamentID, TournamentName, SgtID
      FROM Tournaments
      ORDER BY TournamentName
    `;
    return await this.db.query<Tournament[]>(sql);
  }

  async createTournament(tournamentName: string, sgtID: string): Promise<void> {
    const sql = `
      INSERT INTO Tournaments (TournamentName, SgtID)
      VALUES ($tournamentName, $sgtID)
      `;
    log("Creating tournament: ", tournamentName, sgtID);
    await this.db.insertRecord(sql, {
      $tournamentName: tournamentName,
      $sgtID: sgtID,
    });
  }

  async getTournament(tournamentID: string): Promise<Tournament> {
    const sql = `
      SELECT TournamentID, TournamentName, SgtID
      FROM Tournaments
      WHERE TournamentID = $tournamentID
      LIMIT 1
    `;
    log("getTournament", tournamentID, "query: ", sql);
    return await this.db.get<Tournament>(sql, { $tournamentID: tournamentID });
  }

  async getFullTournament(
    tournamentID: string
  ): Promise<FullTournament | null> {
    const sql = `
    SELECT
    t.TournamentID,
    t.TournamentName,
    t.SgtID AS TournamentSgtID,
    FROM
        Tournaments t
    WHERE
        t.TournamentID = $tournamentID;
  `;
    log("getTournament", tournamentID, "query: ", sql);

    const result = await this.getTournament(tournamentID);

    const rounds = await this.getFullTournamentRounds(tournamentID);

    return {
      ...result,
      rounds,
    };
  }

  async addRoundToTournament(
    tournamentID: string,
    teeboxID: string,
    roundNumber: number
  ): Promise<void> {
    const sql = `
    INSERT INTO TournamentRounds (TournamentID, TeeBoxID, RoundNumber)
    VALUES ($tournamentID, $teeboxID, $roundNumber)
    `;
    log("Adding round to tournament: ", tournamentID, teeboxID, roundNumber);
    await this.db.insertRecord(sql, {
      $tournamentID: tournamentID,
      $teeboxID: teeboxID,
      $roundNumber: roundNumber,
    });
  }

  async getTournamentRounds(tournamentID: string): Promise<TournamentRound[]> {
    const sql = `
    SELECT RoundID, TournamentID, TeeBoxID, RoundNumber
    FROM TournamentRounds
    WHERE TournamentID = $tournamentID
    ORDER BY RoundNumber
  `;
    return await this.db.query<TournamentRound[]>(sql, {
      $tournamentID: tournamentID,
    });
  }

  async getFullTournamentRounds(
    tournamentID: string
  ): Promise<FullTournamentRound[]> {
    const sql = `
    SELECT
    tr.RoundID,
    tr.TournamentID,
    tr.TeeBoxID,
    tr.RoundNumber,
    tb.TeeBoxName,
    tb.CourseRating,
    tb.SlopeRating,
    tb.LengthInYards,
    c.CourseID,
    c.CourseName
    FROM
        TournamentRounds tr
    JOIN
        TeeBoxes tb ON tr.TeeBoxID = tb.TeeBoxID
    JOIN
        Courses c ON tb.CourseID = c.CourseID
    WHERE
        TournamentID = $tournamentID
    ORDER BY
        RoundNumber
  `;

    function mapDbResponseToFullRound(
      dbResponse: any[]
    ): FullTournamentRound[] {
      const rounds: FullTournamentRound[] = [];
      for (const row of dbResponse) {
        const course: Course = {
          CourseID: row.CourseID,
          CourseName: row.CourseName,
          SgtID: row.SgtID,
        };

        const teeBox: FullTeeBox = {
          TeeBoxID: row.TeeBoxID,
          CourseID: row.CourseID,
          TeeBoxName: row.TeeBoxName,
          CourseRating: row.CourseRating,
          SlopeRating: row.SlopeRating,
          LengthInYards: row.LengthInYards,
          course: course,
        };

        const tournamentRound: FullTournamentRound = {
          RoundID: row.RoundID,
          TournamentID: row.TournamentID,
          TeeBoxID: row.TeeBoxID,
          RoundNumber: row.RoundNumber,
          teebox: teeBox,
        };

        rounds.push(tournamentRound);
      }
      return rounds;
    }

    const result = await this.db.query<any[]>(sql, {
      $tournamentID: tournamentID,
    });

    return mapDbResponseToFullRound(result);
  }

  async getTournamentBySgtId(sgtTournamentId: string) {
    const sql = `
    SELECT RoundID, TournamentID, TeeBoxID, RoundNumber
    FROM TournamentRounds
    WHERE SgtID = $sgtID
    ORDER BY RoundNumber
  `;
    return await this.db.query<TournamentRound[]>(sql, {
      $sgtID: sgtTournamentId,
    });
  }

  async getFullTourneyByName(
    tourneyName: string
  ): Promise<FullTournament | null> {
    const sql = `
    SELECT
    t.TournamentID,
    t.TournamentName,
    t.SgtID AS TournamentSgtID,
    tr.RoundNumber,
    tr.RoundID,
    tb.TeeBoxID,
    c.CourseID,
    c.CourseName,
    tb.TeeBoxName,
    tb.CourseRating,
    tb.SlopeRating,
    tb.LengthInYards
    FROM
        Tournaments t
    JOIN
        TournamentRounds tr ON t.TournamentID = tr.TournamentID
    JOIN
        TeeBoxes tb ON tr.TeeBoxID = tb.TeeBoxID
    JOIN
        Courses c ON tb.CourseID = c.CourseID
    WHERE
        TournamentName = $tourneyName
      LIMIT 1
    `;
    log("getTournament", tourneyName, "query: ", sql);
    const result = await this.db.query<any[]>(sql, {
      $tourneyName: tourneyName,
    });

    return mapDbResponseToFullTournament(result);
  }
}

function mapDbResponseToFullTournament(
  dbResponse: any[]
): FullTournament | null {
  if (!dbResponse || dbResponse.length === 0) return null;

  const firstRow = dbResponse[0];

  const tournament: FullTournament = {
    TournamentID: firstRow.TournamentID,
    TournamentName: firstRow.TournamentName,
    SgtID: firstRow.TournamentSgtID,
    rounds: [],
  };

  for (const row of dbResponse) {
    const course: Course = {
      CourseID: row.CourseID,
      CourseName: row.CourseName,
      SgtID: row.SgtID,
    };

    const teeBox: FullTeeBox = {
      TeeBoxID: row.TeeBoxID,
      CourseID: row.CourseID,
      TeeBoxName: row.TeeBoxName,
      CourseRating: row.CourseRating,
      SlopeRating: row.SlopeRating,
      LengthInYards: row.LengthInYards,
      course: course,
    };

    const tournamentRound: FullTournamentRound = {
      RoundID: row.RoundID,
      TournamentID: row.TournamentID,
      TeeBoxID: row.TeeBoxID,
      RoundNumber: row.RoundNumber,
      teebox: teeBox,
    };

    tournament.rounds.push(tournamentRound);
  }

  return tournament;
}
