import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePrice, productFromFields, ratingFromClass } from '../src/parser.js';

test('normalizes price with a currency symbol', () => {
  assert.deepEqual(normalizePrice('£51.77'), { currency: '£', currentPrice: 51.77 });
});

test('maps ratings and stock fields into a consistent product', () => {
  const product = productFromFields({ title: ' A Book ', price: '£10.00', ratingClass: 'star-rating Four', stock: ' In stock ', url: 'https://example.com/book' });
  assert.equal(product.rating, 4);
  assert.equal(product.inStock, true);
  assert.equal(product.currentPrice, 10);
});

test('returns null when no rating is present', () => assert.equal(ratingFromClass('star-rating'), null));
