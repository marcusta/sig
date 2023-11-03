import { SgtJsonObject, SgtScorecard } from "./sgt-model";

export function convertToSgtScorecard(jsonObject: SgtJsonObject): SgtScorecard {
  const totalPar = calculateTotalPar(jsonObject);

  const resultScorecard = {
    ...jsonObject,
    rating: Number(jsonObject.rating),
    total_par: totalPar,
    handicap_differential: calculateHandicapDifferential(jsonObject, totalPar),
  };

  return resultScorecard;
}

export function calculateHandicapDifferential(
  jsonObject: SgtJsonObject,
  totalPar: number
): number {
  const totalGross = jsonObject.total_gross;
  const rating = Number(jsonObject.rating);
  const playerDiff = totalGross - rating;
  const diff = (playerDiff * 120) / jsonObject.slope;
  return diff;
}

function calculateTotalPar(jsonObject: SgtJsonObject): number {
  // Destructure the par values from the object
  const {
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
  } = jsonObject;

  const totalPar =
    h1_Par +
    h2_Par +
    h3_Par +
    h4_Par +
    h5_Par +
    h6_Par +
    h7_Par +
    h8_Par +
    h9_Par +
    h10_Par +
    h11_Par +
    h12_Par +
    h13_Par +
    h14_Par +
    h15_Par +
    h16_Par +
    h17_Par +
    h18_Par;

  return totalPar;
}
