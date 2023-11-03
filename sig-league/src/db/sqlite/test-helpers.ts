import { promises as fsPromises } from "fs";
import { createDatabase } from "../createDatabase";
import { Db } from "../db";
import { connectToDatabase } from "./connect";
import { SqliteDb } from "./sqlite3-db";

export const deleteFileIfExistsAsync = async (
  filePath: string
): Promise<void> => {
  try {
    // Try to get stats for the file, which will throw if the file does not exist
    await fsPromises.stat(filePath);
    // If stat does not throw, the file exists, and we can delete it
    await fsPromises.unlink(filePath);
  } catch (error: any) {
    // If error code is ENOENT, the file does not exist. Otherwise, log the error.
    if (error.code === "ENOENT") {
      console.log(`File ${filePath} does not exist, no action taken.`);
    } else {
      console.error(`Error while trying to delete file ${filePath}:`, error);
    }
  }
};

export const deleteTestDatabase = async (filePath: string): Promise<void> => {
  await deleteFileIfExistsAsync(filePath);
};

export const createNewDatabase = async (dbPath: string): Promise<Db> => {
  await deleteTestDatabase(dbPath);
  const conn = connectToDatabase(dbPath);
  const db = new SqliteDb(conn);
  await createDatabase(db);
  return db;
};
