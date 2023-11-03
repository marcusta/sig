import { Db } from "../db/db";
import { Scorecard } from "../models";

export class ScorecardRepo {
  private db: Db;
  constructor(db: Db) {
    this.db = db;
  }
  async getScorecard(scorecardID: string): Promise<Scorecard> {
    const sql = `
      SELECT
      ScorecardID,
      PlayerID,
      RoundID,
      In_Gross,
      Out_Gross,
      In_Net,
      Out_Net,
      Total_Gross,
      ToPar_Gross,
      Total_Net,
      ToPar_Net,
      HandicapDiff,
      Complete,
      CreatedAt,
      FROM Scorecards
      WHERE ScorecardID = $scorecardID
      LIMIT 1
    `;
    return await this.db.get(sql, { $scorecardID: scorecardID });
  }

  async getScorecardBySgtId(sgtScorecardId: string): Promise<Scorecard> {
    const sql = `
      SELECT
      ScorecardID,
      PlayerID,
      RoundID,
      InGross,
      OutGross,
      TotalGross,
      ToParGross,
      InNet,
      OutNet,
      TotalNet,
      ToParNet,
      SgtOutNet,
      SgtInNet,
      SgtTotalNet,
      SgtToParNet,
      HandicapDiff,
      Complete,
      CreatedAt
      FROM Scorecards
      WHERE SgtScorecardID = $sgtScorecardID
      LIMIT 1
    `;
    return await this.db.get(sql, { $sgtScorecardID: sgtScorecardId });
  }
}
