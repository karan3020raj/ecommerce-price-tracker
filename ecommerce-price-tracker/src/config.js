import 'dotenv/config';

const asPositiveNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

export const config = {
  targetUrl: process.env.TARGET_URL || 'https://books.toscrape.com/',
  maxPages: asPositiveNumber(process.env.MAX_PAGES, 3),
  headless: process.env.HEADLESS !== 'false',
  requestTimeout: asPositiveNumber(process.env.REQUEST_TIMEOUT, 30_000),
  retryCount: asPositiveNumber(process.env.RETRY_COUNT, 3),
};
