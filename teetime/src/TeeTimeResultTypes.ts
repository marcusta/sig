export interface TeeTimeResult {
  years: { [key: string]: Year };
}

export interface Year {
  players: Player[];
  competitions: Competition[];
}

export interface Competition {
  id: string;
  name: string;
  note: string;
  date: string;
  type: EventType;
  startHole: string;
  doped: boolean;
  results: PlayerResult[];
  cancelled?: boolean;
}

export interface PlayerResult {
  nick: string;
  result: number;
  position: number;
  points: number;
  usedForPoints: boolean;
  competitionType: EventType;
  countsForDopedHandicap: boolean;
  dq?: boolean;
}

export enum EventType {
  Poäng = "Poäng",
  Slag = "Slag",
}

export interface Player {
  name: string;
  nick: string;
  points: number;
  totalPoints: number;
  played: number;
  won: number;
  top3: number;
  top5: number;
  meanResult: number;
  meanResultTop10: number;
  meanPoints: number;
  meanPointsTop10: number;
  bestResult: number;
  worstResult: number;
  playedPercentage: number;
  dopedHandicap: number;
}
