export interface Db {
  query<T>(query: string, params?: { [key: string]: any }): Promise<T>;
  get<T>(query: string, params?: { [key: string]: any }): Promise<T>;
  insertRecord(query: string, params: { [key: string]: any }): Promise<void>;
  lastRecord<T>(tableName: string): Promise<T>;
  run(query: string, params?: { [key: string]: any }): Promise<void>;
  tableExists(tableName: string): Promise<boolean>;
  updateRecord(query: string, params: { [key: string]: any }): Promise<void>;
}
