# E-Commerce Real-Time Price Tracker & Scraper

A portfolio-ready Node.js scraper that extracts accurate product prices, ratings and stock status from public e-commerce pages. It uses **Puppeteer** for browser automation and **Axios + Cheerio** as a fast HTML parsing fallback.

> The default target is [Books to Scrape](https://books.toscrape.com/), a site designed for responsible scraping practice. Check a site's terms of use and `robots.txt` before changing targets.

## Features

- Extracts title, current price, currency, rating, stock status and product URL
- Navigates pagination using Puppeteer (works with client-rendered pages after adapting selectors)
- Retries transient network/browser failures with backoff
- Fails safely when expected CSS selectors return no products
- Uses Axios and Cheerio as a fallback if browser launch/navigation fails
- Writes timestamped, clean JSON and CSV output to `data/`
- Includes parser tests and a Postman collection for inspecting the source endpoint

## Stack

JavaScript (ES6+), Node.js, Puppeteer, Cheerio, Axios, HTML/CSS selectors, JSON, Postman and Git.

## Quick start

```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-price-tracker.git
cd ecommerce-price-tracker
npm install
cp .env.example .env
npm run scrape
```

Output is written as `data/products-<timestamp>.json` and `.csv`.

## Commands

```bash
npm run scrape  # Run the scraper
npm test        # Run unit tests
```

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `TARGET_URL` | `https://books.toscrape.com/` | Initial listing URL |
| `MAX_PAGES` | `3` | Maximum listing pages to visit |
| `HEADLESS` | `true` | Set `false` to watch Chromium |
| `REQUEST_TIMEOUT` | `30000` | Navigation timeout in ms |
| `RETRY_COUNT` | `3` | Attempts for transient failures |

## Adapting to another store

Update `productSelector` and the selectors inside `parseHtml()` in `src/scraper.js`. Keep selectors specific and validate the output with a small page limit before larger runs. For lazy-loaded stores, add a scroll/click routine before `page.evaluate()`.

## Example output

```json
{
  "title": "A Light in the Attic",
  "currentPrice": 51.77,
  "currency": "£",
  "discount": null,
  "rating": 3,
  "stockStatus": "In stock",
  "inStock": true
}
```

## Resume bullets

- Developed an automated web-scraping pipeline using Node.js and Puppeteer to extract product pricing, ratings and inventory data.
- Parsed and normalized raw product data into timestamped JSON and CSV payloads using Cheerio and Axios.
- Implemented selector validation, retry logic and error logging to handle missing DOM elements and network timeouts gracefully.
