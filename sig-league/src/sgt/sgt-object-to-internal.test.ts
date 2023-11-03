import { parseSgtFile } from "./file-parser";
import { convertToSgtScorecard } from "./sgt-object-to-internal";

describe("sgt-object-to-internal", () => {
  test("should convert sgt object to internal", () => {
    const sgtObjects = parseSgtFile("./data/new_sig_scores.json");
    const sgtObject = sgtObjects[0];
    const sgtResultObject = convertToSgtScorecard(sgtObject);
    expect(sgtResultObject).not.toBeNull();
    expect(sgtResultObject.total_gross).toBe(64);
    expect(sgtResultObject.total_par).toBe(72);
    expect(sgtResultObject.h1_Par).toBe(4);
    expect(sgtResultObject.hole1_gross).toBe(3);
  });
});
