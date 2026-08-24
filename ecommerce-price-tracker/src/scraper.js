import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { config } from './config.js';
import { logger } from './logger.js';
import { productFromFields } from './parser.js';
import { retry } from './utils.js';

const productSelector = 'article.product_pod';

function parseHtml(html, pageUrl) {
  const $ = cheerio.load(html);
  return $(productSelector).map((_, element) => {
    const item = $(element);
    const relativeUrl = item.find('h3 a').attr('href') || '';
    return productFromFields({
      title: item.find('h3 a').attr('title') || '',
      price: item.find('.price_color').text(),
      ratingClass: item.find('.star-rating').attr('class') || '',
      stock: item.find('.availability').text(),
      url: new URL(relativeUrl, pageUrl).href,
      source: pageUrl,
    });
  }).get();
}

async function axiosFallback(url) {
  logger.warn(`Using Axios + Cheerio fallback for ${url}`);
  const { data } = await axios.get(url, { timeout: config.requestTimeout, headers: { 'User-Agent': 'Mozilla/5.0 PriceTracker/1.0' } });
  return { products: parseHtml(data, url), nextPage: null };
}

export async function scrapeProducts() {
  let browser;
  const allProducts = [];
  let pageUrl = config.targetUrl;
  try {
    browser = await puppeteer.launch({ headless: config.headless, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    page.setDefaultTimeout(config.requestTimeout);
    for (let currentPage = 1; currentPage <= config.maxPages && pageUrl; currentPage += 1) {
      logger.info(`Scraping page ${currentPage}: ${pageUrl}`);
      const result = await retry(async () => {
        await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: config.requestTimeout });
        await page.waitForSelector(productSelector);
        return page.evaluate((selector) => ({
          html: document.documentElement.outerHTML,
          nextPage: document.querySelector('li.next a')?.href || null,
          selector,
        }), productSelector);
      }, config.retryCount, (error, attempt) => logger.warn(`Attempt ${attempt} failed: ${error.message}`));
      const products = parseHtml(result.html, pageUrl);
      if (!products.length) throw new Error(`Selector '${productSelector}' returned no products. The site layout may have changed.`);
      allProducts.push(...products);
      pageUrl = result.nextPage;
    }
  } catch (error) {
    logger.error(`Puppeteer failed: ${error.message}`);
    if (allProducts.length === 0) {
      const fallback = await retry(() => axiosFallback(config.targetUrl), config.retryCount, (err, attempt) => logger.warn(`Fallback attempt ${attempt} failed: ${err.message}`));
      allProducts.push(...fallback.products);
    }
  } finally {
    await browser?.close();
  }
  return allProducts;
}
