import { scrapeProducts } from './scraper.js';
import { logger } from './logger.js';
import { saveResults } from './utils.js';

try {
  const products = await scrapeProducts();
  const { jsonPath, csvPath } = await saveResults(products);
  logger.info(`Done. Saved ${products.length} products.`);
  logger.info(`JSON: ${jsonPath}`);
  logger.info(`CSV:  ${csvPath}`);
} catch (error) {
  logger.error(`Scrape failed: ${error.message}`);
  process.exitCode = 1;
}
