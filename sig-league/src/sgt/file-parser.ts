import fs from "fs";
import { SgtJsonObject } from "./sgt-model";

export function parseSgtFile(fileName: string): SgtJsonObject[] {
  try {
    const fileContents = fs.readFileSync(fileName, "utf-8"); // Read the file synchronously
    const parsedData: SgtJsonObject[] = JSON.parse(fileContents); // Parse the JSON string into SgtResultObject[]
    return parsedData;
  } catch (err) {
    console.error(err);
    return [];
  }
}
