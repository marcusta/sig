import { Db } from "../db/db";
import { log } from "../log";
import { TeeBox } from "../models";

export class TeeboxRepo {
  constructor(private db: Db) {}

  async getTeeboxesForCourse(courseId: string): Promise<TeeBox[]> {
    const sql = `
      SELECT TeeBoxID, TeeBoxName, CourseID, SlopeRating, CourseRating, LengthInYards
      FROM TeeBoxes
      WHERE CourseID = $courseId
      ORDER BY TeeBoxName
    `;
    return await this.db.query<TeeBox[]>(sql, { $courseId: courseId });
  }

  async createTeeBox(
    courseId: string,
    teeboxName: string,
    courseRating: number,
    slopeRating: number,
    lengthInYards: number
  ): Promise<void> {
    const sql = `
      INSERT INTO TeeBoxes (CourseID, TeeBoxName, CourseRating, SlopeRating, LengthInYards)
      VALUES ($courseId, $teeboxName, $courseRating, $slopeRating, $lengthInYards)
      `;
    log(
      "Creating teebox: ",
      courseId,
      teeboxName,
      courseRating,
      slopeRating,
      lengthInYards
    );
    await this.db.insertRecord(sql, {
      $courseId: courseId,
      $teeboxName: teeboxName,
      $courseRating: courseRating,
      $slopeRating: slopeRating,
      $lengthInYards: lengthInYards,
    });
  }
}
