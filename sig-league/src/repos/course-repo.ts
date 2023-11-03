import { Db } from "../db/db";
import { log } from "../log";
import { Course } from "../models";

export class CourseRepo {
  constructor(private db: Db) {}

  async listCourses(): Promise<Course[]> {
    const sql = `
      SELECT CourseID, CourseName, SgtID
      FROM Courses
      ORDER BY CourseName
    `;
    return await this.db.query<Course[]>(sql);
  }

  async createCourse(courseName: string, sgtId: string): Promise<void> {
    const sql = `
      INSERT INTO Courses (CourseName, SgtID)
      VALUES ($courseName, $sgtId)
    `;
    log("Creating course: ", courseName, sgtId);
    await this.db.insertRecord(sql, { $courseName: courseName, $sgtId: sgtId });
  }

  async getCourse(courseId: string): Promise<Course> {
    const sql = `
      SELECT CourseID, CourseName, SgtID
      FROM Courses
      WHERE CourseID = $courseId
      LIMIT 1
    `;
    log("getCourse", courseId, "query: ", sql);
    return await this.db.get<Course>(sql, { $courseId: courseId });
  }
}
