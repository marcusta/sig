export interface SgtScorecard extends BaseSgtObject {
  rating: number;
  total_par: number;
  handicap_differential?: number;
}

export interface SgtJsonObject extends BaseSgtObject {
  rating: string;
}

export interface PreviousImportedScorecard {
  player_name: string;
  tourneyName: string;
  round: number;
  activeHole: number;
}

interface BaseSgtObject {
  player_name: string;
  TeamPlayer1: string | null;
  TeamPlayer2: string | null;
  TeamPlayer3: string | null;
  TeamPlayer4: string | null;
  tourName: string;
  tourneyName: string;
  tourney_end_date: string;
  round: number;
  activeHole: number;
  hole1_gross?: number;
  hole2_gross?: number;
  hole3_gross?: number;
  hole4_gross?: number;
  hole5_gross?: number;
  hole6_gross?: number;
  hole7_gross?: number;
  hole8_gross?: number;
  hole9_gross?: number;
  hole10_gross?: number;
  hole11_gross?: number;
  hole12_gross?: number;
  hole13_gross?: number;
  hole14_gross?: number;
  hole15_gross?: number;
  hole16_gross?: number;
  hole17_gross?: number;
  hole18_gross?: number;
  hole1_net?: number;
  hole2_net?: number;
  hole3_net?: number;
  hole4_net?: number;
  hole5_net?: number;
  hole6_net?: number;
  hole7_net?: number;
  hole8_net?: number;
  hole9_net?: number;
  hole10_net?: number;
  hole11_net?: number;
  hole12_net?: number;
  hole13_net?: number;
  hole14_net?: number;
  hole15_net?: number;
  hole16_net?: number;
  hole17_net?: number;
  hole18_net?: number;
  h1_Par: number;
  h2_Par: number;
  h3_Par: number;
  h4_Par: number;
  h5_Par: number;
  h6_Par: number;
  h7_Par: number;
  h8_Par: number;
  h9_Par: number;
  h10_Par: number;
  h11_Par: number;
  h12_Par: number;
  h13_Par: number;
  h14_Par: number;
  h15_Par: number;
  h16_Par: number;
  h17_Par: number;
  h18_Par: number;
  h1_index: number;
  h2_index: number;
  h3_index: number;
  h4_index: number;
  h5_index: number;
  h6_index: number;
  h7_index: number;
  h8_index: number;
  h9_index: number;
  h10_index: number;
  h11_index: number;
  h12_index: number;
  h13_index: number;
  h14_index: number;
  h15_index: number;
  h16_index: number;
  h17_index: number;
  h18_index: number;
  in_gross: number;
  out_gross: number;
  total_gross: number;
  toPar_gross: number;
  in_net: number;
  out_net: number;
  total_net: number;
  toPar_net: number;
  courseName: string;
  teetype: string;
  slope: number;
}
