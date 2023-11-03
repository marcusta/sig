import { Database } from "sqlite3";
import { Db } from "../db";
import { executeQuery, get, runWithParams } from "./sqlite3-utils";

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
      await runWithParams(query, this.db, params);
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

  async run(query: string, params?: { [key: string]: any }): Promise<void> {
    try {
      await runWithParams(query, this.db, params);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Failed to run query ${query}: ${e.message}`);
      } else {
        throw new Error(`Failed to run query ${query}: ${e}`);
      }
    }
  }

  async tableExists(tableName: string): Promise<boolean> {
    try {
      const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
      const result = await this.query<{ name: string }[]>(query);
      return result.length > 0;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(
          `Failed to check if table ${tableName} exists: ${e.message}`
        );
      } else {
        throw new Error(`Failed to check if table ${tableName} exists: ${e}`);
      }
    }
  }

  async updateRecord(query: string, params: { [key: string]: any }) {
    try {
      await runWithParams(query, this.db, params);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Failed to update record: ${e.message}`);
      } else {
        throw new Error(`Failed to update record: ${e}`);
      }
    }
  }
}
