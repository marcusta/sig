import { Db } from "../db/db";
import { PreviousImportedScorecard, SgtScorecard } from "../sgt/sgt-model";

export class SgtScorecardsRepo {
  private db: Db;
  constructor(db: Db) {
    this.db = db;
  }

  async importScorecard(scorecard: SgtScorecard) {
    const loopObject: any = scorecard;
    const params: any = {};
    for (const key in scorecard) {
      params["$" + key] = loopObject[key];
    }
    await this.db.insertRecord(insertScorecardSql, params);
  }

  async getScorecardByTourneyNameAndRound(
    playerName: string,
    tourneyName: string,
    round: number
  ): Promise<SgtScorecard> {
    const sql = `
      SELECT * 
      FROM SgtScorecard
      WHERE  TourneyName = $tourneyName AND 
             round = $round AND 
             player_name = $playerName
      LIMIT 1
    `;

    return await this.db.get(sql, {
      $tourneyName: tourneyName,
      $round: round,
      $playerName: playerName,
    });
  }

  async getScorecardsByTourneyName(tourneyName: string) {
    const sql = `
      SELECT * 
      FROM SgtScorecard
      WHERE tourneyName = $tournamentName
    `;
    return await this.db.query<SgtScorecard[]>(sql, {
      $tournamentName: tourneyName,
    });
  }

  async getPreviousImportedScorecards(): Promise<PreviousImportedScorecard[]> {
    const sql = `
      SELECT player_name, tourneyName, round, activeHole
      FROM SgtScorecard
    `;
    return await this.db.query<PreviousImportedScorecard[]>(sql);
  }

  async updateScorecard(scorecard: SgtScorecard) {
    const params = createUpdateParams(scorecard);
    const updateScorecardSql = getUpdateScorecardSql();
    await this.db.updateRecord(updateScorecardSql, params);
  }

  async getActiveTourneyNames(): Promise<string[]> {
    const sql = `
      SELECT DISTINCT tourneyName
      FROM SgtScorecard
      WHERE tourney_end_date > date('now')
    `;
    return (await this.db.query<{ tourneyName: string }[]>(sql)).map(
      (x) => x.tourneyName
    );
  }
}

function getUpdateScorecardSql(): string {
  return `
  UPDATE SgtScorecard
  SET activeHole = $activeHole,
      hole1_gross = $hole1_gross,
      hole1_net = $hole1_net,
      hole2_gross = $hole2_gross,
      hole2_net = $hole2_net,
      hole3_gross = $hole3_gross,
      hole3_net = $hole3_net,
      hole4_gross = $hole4_gross,
      hole4_net = $hole4_net,
      hole5_gross = $hole5_gross,
      hole5_net = $hole5_net,
      hole6_gross = $hole6_gross,
      hole6_net = $hole6_net,
      hole7_gross = $hole7_gross,
      hole7_net = $hole7_net,
      hole8_gross = $hole8_gross,
      hole8_net = $hole8_net,
      hole9_gross = $hole9_gross,
      hole9_net = $hole9_net,
      hole10_gross = $hole10_gross,
      hole10_net = $hole10_net,
      hole11_gross = $hole11_gross,
      hole11_net = $hole11_net,
      hole12_gross = $hole12_gross,
      hole12_net = $hole12_net,
      hole13_gross = $hole13_gross,
      hole13_net = $hole13_net,
      hole14_gross = $hole14_gross,
      hole14_net = $hole14_net,
      hole15_gross = $hole15_gross,
      hole15_net = $hole15_net,
      hole16_gross = $hole16_gross,
      hole16_net = $hole16_net,
      hole17_gross = $hole17_gross,
      hole17_net = $hole17_net,
      hole18_gross = $hole18_gross,
      hole18_net = $hole18_net,
      in_gross = $in_gross,
      out_gross = $out_gross,
      total_gross = $total_gross,
      toPar_gross = $toPar_gross,
      in_net = $in_net,
      out_net = $out_net,
      total_net = $total_net,
      toPar_net = $toPar_net,
      handicap_differential = $handicap_differential
  WHERE player_name = $player_name AND
        tourneyName = $tourneyName AND
        round = $round
`;
}

function createUpdateParams(scorecard: SgtScorecard) {
  const params: any = {};
  params.$activeHole = scorecard.activeHole;
  params.$hole1_gross = scorecard.hole1_gross;
  params.$hole1_net = scorecard.hole1_net;
  params.$hole2_gross = scorecard.hole2_gross;
  params.$hole2_net = scorecard.hole2_net;
  params.$hole3_gross = scorecard.hole3_gross;
  params.$hole3_net = scorecard.hole3_net;
  params.$hole4_gross = scorecard.hole4_gross;
  params.$hole4_net = scorecard.hole4_net;
  params.$hole5_gross = scorecard.hole5_gross;
  params.$hole5_net = scorecard.hole5_net;
  params.$hole6_gross = scorecard.hole6_gross;
  params.$hole6_net = scorecard.hole6_net;
  params.$hole7_gross = scorecard.hole7_gross;
  params.$hole7_net = scorecard.hole7_net;
  params.$hole8_gross = scorecard.hole8_gross;
  params.$hole8_net = scorecard.hole8_net;
  params.$hole9_gross = scorecard.hole9_gross;
  params.$hole9_net = scorecard.hole9_net;
  params.$hole10_gross = scorecard.hole10_gross;
  params.$hole10_net = scorecard.hole10_net;
  params.$hole11_gross = scorecard.hole11_gross;
  params.$hole11_net = scorecard.hole11_net;
  params.$hole12_gross = scorecard.hole12_gross;
  params.$hole12_net = scorecard.hole12_net;
  params.$hole13_gross = scorecard.hole13_gross;
  params.$hole13_net = scorecard.hole13_net;
  params.$hole14_gross = scorecard.hole14_gross;
  params.$hole14_net = scorecard.hole14_net;
  params.$hole15_gross = scorecard.hole15_gross;
  params.$hole15_net = scorecard.hole15_net;
  params.$hole16_gross = scorecard.hole16_gross;
  params.$hole16_net = scorecard.hole16_net;
  params.$hole17_gross = scorecard.hole17_gross;
  params.$hole17_net = scorecard.hole17_net;
  params.$hole18_gross = scorecard.hole18_gross;
  params.$hole18_net = scorecard.hole18_net;
  params.$in_gross = scorecard.in_gross;
  params.$out_gross = scorecard.out_gross;
  params.$total_gross = scorecard.total_gross;
  params.$toPar_gross = scorecard.toPar_gross;
  params.$in_net = scorecard.in_net;
  params.$out_net = scorecard.out_net;
  params.$total_net = scorecard.total_net;
  params.$toPar_net = scorecard.toPar_net;
  params.$player_name = scorecard.player_name;
  params.$tourneyName = scorecard.tourneyName;
  params.$round = scorecard.round;
  params.$handicap_differential = scorecard.handicap_differential;
  return params;
}

const insertScorecardSql = `
INSERT INTO SgtScorecard (
  player_name,
  TeamPlayer1,
  TeamPlayer2,
  TeamPlayer3,
  TeamPlayer4,
  tourName,
  tourneyName,
  tourney_end_date,
  round,
  activeHole,
  hole1_gross,
  hole1_net,
  hole2_gross,
  hole2_net,
  hole3_gross,
  hole3_net,
  hole4_gross,
  hole4_net,
  hole5_gross,
  hole5_net,
  hole6_gross,
  hole6_net,
  hole7_gross,
  hole7_net,
  hole8_gross,
  hole8_net,
  hole9_gross,
  hole9_net,
  hole10_gross,
  hole10_net,
  hole11_gross,
  hole11_net,
  hole12_gross,
  hole12_net,
  hole13_gross,
  hole13_net,
  hole14_gross,
  hole14_net,
  hole15_gross,
  hole15_net,
  hole16_gross,
  hole16_net,
  hole17_gross,
  hole17_net,
  hole18_gross,
  hole18_net,
  h1_Par,
  h2_Par,
  h3_Par,
  h4_Par,
  h5_Par,
  h6_Par,
  h7_Par,
  h8_Par,
  h9_Par,
  h10_Par,
  h11_Par,
  h12_Par,
  h13_Par,
  h14_Par,
  h15_Par,
  h16_Par,
  h17_Par,
  h18_Par,
  h1_index,
  h2_index,
  h3_index,
  h4_index,
  h5_index,
  h6_index,
  h7_index,
  h8_index,
  h9_index,
  h10_index,
  h11_index,
  h12_index,
  h13_index,
  h14_index,
  h15_index,
  h16_index,
  h17_index,
  h18_index,
  in_gross,
  out_gross,
  total_gross,
  toPar_gross,
  in_net,
  out_net,
  total_net,
  toPar_net,
  total_par,
  courseName,
  teetype,
  rating,
  slope,
  handicap_differential
) VALUES (
  $player_name,
  $TeamPlayer1,
  $TeamPlayer2,
  $TeamPlayer3,
  $TeamPlayer4,
  $tourName,
  $tourneyName,
  $tourney_end_date,
  $round,
  $activeHole,
  $hole1_gross,
  $hole1_net,
  $hole2_gross,
  $hole2_net,
  $hole3_gross,
  $hole3_net,
  $hole4_gross,
  $hole4_net,
  $hole5_gross,
  $hole5_net,
  $hole6_gross,
  $hole6_net,
  $hole7_gross,
  $hole7_net,
  $hole8_gross,
  $hole8_net,
  $hole9_gross,
  $hole9_net,
  $hole10_gross,
  $hole10_net,
  $hole11_gross,
  $hole11_net,
  $hole12_gross,
  $hole12_net,
  $hole13_gross,
  $hole13_net,
  $hole14_gross,
  $hole14_net,
  $hole15_gross,
  $hole15_net,
  $hole16_gross,
  $hole16_net,
  $hole17_gross,
  $hole17_net,
  $hole18_gross,
  $hole18_net,
  $h1_Par,
  $h2_Par,
  $h3_Par,
  $h4_Par,
  $h5_Par,
  $h6_Par,
  $h7_Par,
  $h8_Par,
  $h9_Par,
  $h10_Par,
  $h11_Par,
  $h12_Par,
  $h13_Par,
  $h14_Par,
  $h15_Par,
  $h16_Par,
  $h17_Par,
  $h18_Par,
  $h1_index,
  $h2_index,
  $h3_index,
  $h4_index,
  $h5_index,
  $h6_index,
  $h7_index,
  $h8_index,
  $h9_index,
  $h10_index,
  $h11_index,
  $h12_index,
  $h13_index,
  $h14_index,
  $h15_index,
  $h16_index,
  $h17_index,
  $h18_index,
  $in_gross,
  $out_gross,
  $total_gross,
  $toPar_gross,
  $in_net,
  $out_net,
  $total_net,
  $toPar_net,
  $total_par,
  $courseName,
  $teetype,
  $rating,
  $slope,
  $handicap_differential
)
`;
