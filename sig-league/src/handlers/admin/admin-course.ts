import express from "express";
import { log } from "../../log";
import { CourseRepo } from "../../repos/course-repo";
import { TeeboxRepo } from "../../repos/teebox-repo";
import { AddCourse } from "./templates/courses/add-course";
import { TeeboxList } from "./templates/courses/course";
import { CourseView } from "./templates/courses/course2";
import { listCoursePage } from "./templates/courses/list-courses";
import { Page } from "./templates/page";

export function registerCourseAdminHandlers(
  app: express.Express,
  courseRepo: CourseRepo,
  teeboxRepo: TeeboxRepo
) {
  app.get("/admin/courses", async (req, res) => {
    log("GET /admin/courses");
    const courses = await courseRepo.listCourses();

    log("courses", courses);
    const page = Page(listCoursePage(courses));
    log("Return page list");
    res.send(page);
  });

  app.get("/admin/courses/add", async (req, res) => {
    const page = Page(AddCourse());
    res.send(page);
  });

  app.post("/admin/courses/create", async (req, res) => {
    const { courseName, sgtId } = req.body;
    await courseRepo.createCourse(courseName, sgtId);
    res.redirect("/admin/courses");
  });

  app.get("/admin/courses/:courseId/teeboxes", async (req, res) => {
    const { courseId } = req.params;
    log("courseId", courseId);
    const course = await courseRepo.getCourse(courseId);
    const teeboxes = await teeboxRepo.getTeeboxesForCourse(courseId);
    const result = TeeboxList(course, teeboxes);
    res.send(result);
  });

  app.get("/admin/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    log("courseId", courseId);
    const course = await courseRepo.getCourse(courseId);
    const teeboxes = await teeboxRepo.getTeeboxesForCourse(courseId);
    const result = Page(CourseView({ course, teeboxes }));
    res.send(result);
  });

  app.get("/admin/courses/:courseId/teeboxes", async (req, res) => {
    const { courseId } = req.params;
    log("courseId", courseId);
    const course = await courseRepo.getCourse(courseId);
    const teeboxes = await teeboxRepo.getTeeboxesForCourse(courseId);
    const result = TeeboxList(course, teeboxes);
    res.send(result);
  });

  app.post("/admin/courses/:courseId/teeboxes/create", async (req, res) => {
    const { courseId } = req.params;
    const { TeeboxName, CourseRating, SlopeRating, LengthInYards } = req.body;

    await teeboxRepo.createTeeBox(
      courseId,
      TeeboxName,
      CourseRating,
      SlopeRating,
      LengthInYards
    );

    res.redirect(`/admin/courses/${courseId}`);
  });
}
