import sqlite3 from "sqlite3";

const dbPath = process.env.DB_PATH || "./db.sqlite3";

const connections: { [key: string]: sqlite3.Database } = {};
export const connectToDatabase = (path?: string): sqlite3.Database => {
  // open the database
  const connectionPath = path || dbPath;
  if (!connections[connectionPath]) {
    const db = new sqlite3.Database(connectionPath);
    connections[dbPath] = db;
  }
  return connections[dbPath];
};
