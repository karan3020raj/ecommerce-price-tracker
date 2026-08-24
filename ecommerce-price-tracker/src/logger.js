const stamp = () => new Date().toISOString();

export const logger = {
  info: (message) => console.log(`[${stamp()}] INFO  ${message}`),
  warn: (message) => console.warn(`[${stamp()}] WARN  ${message}`),
  error: (message) => console.error(`[${stamp()}] ERROR ${message}`),
};
