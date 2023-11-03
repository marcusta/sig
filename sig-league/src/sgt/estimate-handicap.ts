import { SgtScorecard } from "./sgt-model";

export function calculateHandicap(tournamentData: SgtScorecard): number {
  let strokesReceived = 0;

  for (let i = 1; i <= 18; i++) {
    const holeGross = tournamentData[
      `hole${i}_gross` as keyof SgtScorecard
    ] as number;
    const holeNet = tournamentData[
      `hole${i}_net` as keyof SgtScorecard
    ] as number;

    // If net score is less than gross score, the difference is the number of handicap strokes received.
    const netDifference = holeGross - holeNet;
    strokesReceived += netDifference;
  }

  return strokesReceived;
}
