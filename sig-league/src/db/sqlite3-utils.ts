import { Database } from "sqlite3";
import { log } from "../log";
import { Db } from "./db";

export async function executeQuery<T>(
  query: string,
  db: Database,
  params?: { [key: string]: any }
): Promise<T> {
  log("query", query);
  const resultPromise = new Promise<T>((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        log("rows", rows);
        resolve(rows as T);
      }
    });
  });
  return resultPromise;
}

export async function get<T>(
  query: string,
  db: Database,
  params?: { [key: string]: any }
): Promise<T> {
  log("query", query);
  const resultPromise = new Promise<T>((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        log("row", row);
        resolve(row as T);
      }
    });
  });
  return resultPromise;
}

// query: string, params object key value pairs, any values string keys
export async function runWithParams(
  query: string,
  params: { [key: string]: any },
  db: Database
): Promise<void> {
  const resultPromise = new Promise<void>((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return resultPromise;
}

export class SqliteDb implements Db {
  constructor(private db: Database) {}
  get<T>(
    query: string,
    params?: { [key: string]: any } | undefined
  ): Promise<T> {
    try {
      return get(query, this.db, params);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Failed to run query ${query}: ${e.message}`);
      } else {
        throw new Error(`Failed to run query ${query}: ${e}`);
      }
    }
  }

  query<T>(query: string, params?: { [key: string]: any }): Promise<T> {
    try {
      return executeQuery(query, this.db, params);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Failed to run query ${query}: ${e.message}`);
      } else {
        throw new Error(`Failed to run query ${query}: ${e}`);
      }
    }
  }

  async insertRecord<T>(
    query: string,
    params: { [key: string]: any }
  ): Promise<void> {
    try {
      const result = this.db.run(query, params);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Failed to insert record: ${e.message}`);
      } else {
        throw new Error(`Failed to insert record: ${e}`);
      }
    }
  }

  async lastRecord<T>(tableName: string): Promise<T> {
    try {
      const query = `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1`;
      const list = await this.query<T[]>(query);
      return list[0] as T;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(
          `Failed to retrieve last record for table ${tableName}: ${e.message}`
        );
      } else {
        throw new Error(
          `Failed to retrieve last record for table ${tableName}: ${e}`
        );
      }
    }
  }
}
