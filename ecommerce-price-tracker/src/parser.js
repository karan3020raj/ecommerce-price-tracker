export function normalizePrice(rawPrice = '') {
  const match = rawPrice.replaceAll(',', '').match(/([£$€₹])?\s*(\d+(?:\.\d+)?)/);
  if (!match) return { currency: '', currentPrice: null };
  return { currency: match[1] || '', currentPrice: Number(match[2]) };
}

export function ratingFromClass(className = '') {
  const ratings = ['One', 'Two', 'Three', 'Four', 'Five'];
  const found = ratings.find((rating) => className.includes(rating));
  return found ? ratings.indexOf(found) + 1 : null;
}

export function productFromFields({ title = '', price = '', ratingClass = '', stock = '', url = '', source = '' }) {
  const { currency, currentPrice } = normalizePrice(price);
  const stockStatus = stock.trim().replace(/\s+/g, ' ');
  return {
    title: title.trim(), currentPrice, currency, discount: null,
    rating: ratingFromClass(ratingClass), stockStatus,
    inStock: /in stock/i.test(stockStatus), productUrl: url, source,
  };
}
