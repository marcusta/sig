// log function that takes any params, returns void and logs to console with timestamp
export const log = (...params: any[]): void => {
  const now = new Date();
  console.log(`${now.toISOString()}:`, ...params);
};
