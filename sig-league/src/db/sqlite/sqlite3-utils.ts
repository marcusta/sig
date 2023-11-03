import { Database } from "sqlite3";

export async function executeQuery<T>(
  query: string,
  db: Database,
  params?: { [key: string]: any }
): Promise<T> {
  const resultPromise = new Promise<T>((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
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
  const resultPromise = new Promise<T>((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T);
      }
    });
  });
  return resultPromise;
}

// query: string, params object key value pairs, any values string keys
export async function runWithParams(
  query: string,
  db: Database,
  params?: { [key: string]: any }
): Promise<void> {
  const resultPromise = new Promise<void>((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        console.log("error running query", query, params, err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return resultPromise;
}
