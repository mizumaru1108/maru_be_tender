export const addLog = (fieldName: string, logs: string) => {
  logs += ` [field ${fieldName} change requested] `;
  return logs;
};
