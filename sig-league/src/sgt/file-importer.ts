import { SgtScorecardsRepo } from "../repos/sgt-scorecards-repo";
import { parseSgtFile } from "./file-parser";
import { PreviousImportedScorecard, SgtJsonObject } from "./sgt-model";
import { convertToSgtScorecard } from "./sgt-object-to-internal";

export class FileImporter {
  private sgtScorecardsRepo: SgtScorecardsRepo;

  constructor(sgtScorecardsRepo: SgtScorecardsRepo) {
    this.sgtScorecardsRepo = sgtScorecardsRepo;
  }

  async importFile(filePath: string) {
    const previouslyImportedScorecardsList =
      await this.sgtScorecardsRepo.getPreviousImportedScorecards();
    const previouslyImportedScorecards =
      this.convertPreviouslyImportedScorecardsToMap(
        previouslyImportedScorecardsList
      );
    const sgtJsonObjects = parseSgtFile(filePath);
    for (const sgtJsonObject of sgtJsonObjects) {
      const key = this.getScorecardKey(sgtJsonObject);
      const prevScorecard = previouslyImportedScorecards[key];
      await this.importScorecard(sgtJsonObject, prevScorecard);
    }
  }

  private async importScorecard(
    sgtJsonObject: SgtJsonObject,
    previouslyImportedScorecard: PreviousImportedScorecard
  ) {
    const scorecard = convertToSgtScorecard(sgtJsonObject);
    if (!previouslyImportedScorecard) {
      await this.sgtScorecardsRepo.importScorecard(scorecard);
    } else if (
      this.shouldUpdateScorecard(previouslyImportedScorecard, sgtJsonObject)
    ) {
      this.sgtScorecardsRepo.updateScorecard(scorecard);
    }
  }

  private shouldUpdateScorecard(
    previouslyImportedScorecard: PreviousImportedScorecard,
    sgtJsonObject: SgtJsonObject
  ) {
    return sgtJsonObject.activeHole !== previouslyImportedScorecard.activeHole;
  }

  private convertPreviouslyImportedScorecardsToMap(
    previouslyImportedScorecards: PreviousImportedScorecard[]
  ): { [key: string]: PreviousImportedScorecard } {
    const map: { [key: string]: PreviousImportedScorecard } = {};
    for (const scorecard of previouslyImportedScorecards) {
      const key = this.getScorecardKey(scorecard);
      map[key] = scorecard;
    }
    return map;
  }

  private getScorecardKey(
    previousImportedScorecard: PreviousImportedScorecard
  ) {
    return `${previousImportedScorecard.player_name}-${previousImportedScorecard.tourneyName}-${previousImportedScorecard.round}`;
  }
}
