import axios from "axios";
import fs from "fs";
import { promisify } from "util";
import { log } from "../log";
import { FileImporter } from "./file-importer";

// URL for SGT https://simulatorgolftour.com/club-api/3/club-scores

export async function startSgtSync(
  sgtURL: string,
  filepath: string,
  syncInterval: number,
  fileImporter: FileImporter
) {
  setInterval(async () => {
    await downloadScoresFromSgtAndImport(
      sgtURL,
      filepath,
      syncInterval,
      fileImporter
    );
  }, 1000 * syncInterval);
  setTimeout(async () => {
    await downloadScoresFromSgtAndImport(
      sgtURL,
      filepath,
      syncInterval,
      fileImporter
    );
  }, 1000 * 5);
}

async function downloadScoresFromSgtAndImport(
  sgtURL: string,
  filepath: string,
  syncInterval: number,
  fileImporter: FileImporter
) {
  let downloadError: any;
  try {
    const startDownloadTime = new Date();
    await downloadFileIfOld(sgtURL, filepath, syncInterval);
    const endDownloadTime = new Date();
    log(
      `downloaded file in ${
        endDownloadTime.getTime() - startDownloadTime.getTime()
      } ms`
    );
  } catch (err: unknown) {
    downloadError = err;
  }
  if (!downloadError) {
    log("importing file to db");
    const startTime = new Date();
    await fileImporter.importFile(filepath);
    const endTime = new Date();
    log(`imported file to db in ${endTime.getTime() - startTime.getTime()} ms`);
  }
}

const stat = promisify(fs.stat);
export async function downloadFileIfOld(
  fileUrl: string,
  outputLocationPath: string,
  maxAgeInMinutes = 3
): Promise<boolean> {
  try {
    // Check if file exists and get its stats
    let shouldDownload = true;

    /*try {
      const fileStats = await stat(outputLocationPath);
      const now = new Date();
      const age = now.getTime() - fileStats.mtimeMs; // file age in minutes
      shouldDownload = age > maxAgeInMinutes * 60 * 1000;
    } catch (error: any) {
      // If the file doesn't exist, an error will be thrown, and we'll proceed to download
      if (error.code !== "ENOENT") {
        throw error;
      }
    }*/

    // If the file is old enough, download it
    if (shouldDownload) {
      await downloadSgtFile(fileUrl, outputLocationPath);
      return true;
    } else {
      log(
        `File at ${outputLocationPath} is not older than ${maxAgeInMinutes} minutes. No download needed.`
      );
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // rethrow the error for the caller to handle if necessary
  }
  return false;
}

export async function downloadSgtFile(
  fileUrl: string,
  outputLocationPath: string
): Promise<void> {
  try {
    log(`Downloading file from ${fileUrl}`);
    // Axios GET request to retrieve the file as a buffer
    const response = await axios.get<Buffer>(fileUrl, {
      responseType: "arraybuffer",
    });

    // Using fs.promises.writeFile to save the file buffer directly to disk
    await fs.promises.writeFile(outputLocationPath, response.data);

    log(`Downloaded file saved to ${outputLocationPath}`);
  } catch (error) {
    console.error("An error occurred during file download:", error);
    throw error; // rethrow the error for the caller to handle if necessary
  }
}
