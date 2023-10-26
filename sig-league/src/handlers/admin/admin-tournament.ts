import express from "express";
import { log } from "../../log";
import { CourseRepo } from "../../repos/course-repo";
import { TeeboxRepo } from "../../repos/teebox-repo";
import { TournamentRepo } from "../../repos/tournament-repo";
import { Panel } from "../templates/components";
import { Page } from "./templates/page";
import { TournamentList } from "./templates/tournaments/list-tournaments";
import { TeeBoxSelector } from "./templates/tournaments/teeboxes";
import { CreateTournamentForm } from "./templates/tournaments/tournament-form";
import { TournamentView } from "./templates/tournaments/tournament-view";

export function registerTournamentAdminHandlers(
  app: express.Express,
  courseRepo: CourseRepo,
  teeboxRepo: TeeboxRepo,
  tournamentRepo: TournamentRepo
) {
  app.get("/admin/tournaments", async (req, res) => {
    const tournaments = await tournamentRepo.listTournaments();
    log("tournaments", tournaments);
    const page = Page(TournamentList({ tournaments }));
    res.send(page);
  });

  app.get("/admin/tournaments/add", async (req, res) => {
    const page = Page(Panel(CreateTournamentForm()));
    res.send(page);
  });

  app.post("/admin/tournaments/create", async (req, res) => {
    const { tournamentName, sgtId } = req.body;
    await tournamentRepo.createTournament(tournamentName, sgtId);
    res.redirect("/admin/tournaments");
  });

  app.get("/admin/tournaments/:tournamentId", async (req, res) => {
    log("=============== GET TOURNAMENT ADMIN VIEW ===============");
    const tournamentId = req.params.tournamentId;
    const courses = await courseRepo.listCourses();
    const tournament = await tournamentRepo.getFullTournament(tournamentId);
    const page = Page(TournamentView({ tournament, courses }));
    res.send(page);
  });

  app.get("/admin/teebox-selector", async (req, res) => {
    log("=============== GET TEEBOX SELECTOR ===============");
    const courseId = req.query.course as string;
    log("Getting teebox selector for courseId", courseId);
    const teeboxes = await teeboxRepo.getTeeboxesForCourse(courseId);
    const page = TeeBoxSelector({ teeboxes });
    log("teebox selector page", page);
    res.send(page);
  });

  app.post(
    "/admin/tournaments/:tournamentId/rounds/create",
    async (req, res) => {
      log("=============== CREATE TOURNAMENT ROUND ===============");
      const tournamentId = req.params.tournamentId;
      const { teeboxId, roundNumber } = req.body;
      await tournamentRepo.addRoundToTournament(
        tournamentId,
        teeboxId,
        roundNumber
      );
      res.redirect(`/admin/tournaments/${tournamentId}`);
    }
  );
}
