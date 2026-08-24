import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function retry(operation, retries, onRetry) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        onRetry?.(error, attempt);
        await sleep(attempt * 750);
      }
    }
  }
  throw lastError;
}

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export async function saveResults(products) {
  const directory = path.resolve('data');
  await mkdir(directory, { recursive: true });
  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  const jsonPath = path.join(directory, `products-${timestamp}.json`);
  const csvPath = path.join(directory, `products-${timestamp}.csv`);
  const payload = { scrapedAt: new Date().toISOString(), totalProducts: products.length, products };
  const columns = ['title', 'currentPrice', 'currency', 'discount', 'rating', 'stockStatus', 'inStock', 'productUrl', 'source'];
  const csv = [columns.join(','), ...products.map((product) => columns.map((key) => csvCell(product[key])).join(','))].join('\n');
  await Promise.all([writeFile(jsonPath, JSON.stringify(payload, null, 2)), writeFile(csvPath, csv)]);
  return { jsonPath, csvPath };
}
