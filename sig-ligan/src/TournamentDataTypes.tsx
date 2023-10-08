export interface Tournament {
  id: string;
  name: string;
  pars: number[];
  indexes: number[];
  par: string;
  playerRounds: { [key: string]: PlayerRounds };
}

export interface PlayerRounds {
  name: string;
  id: string;
  handicap: number;
  gross: number;
  net: number;
  grossPosition: string;
  netPosition: string;
  grossPoints: number;
  netPoints: number;
  rounds: Round[];
}

export interface Round {
  scoreId: string;
  activeHole: number;
  round: string;
  date: string;
  status: string;
  net: Result;
  gross: Result;
}

export interface Result {
  in: number;
  out: number;
  total: number;
  toPar: number;
  holes: number[];
}

export type ResultType = "gross" | "net";
