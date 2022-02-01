import { Analytics } from '../../../lib/models/analytics.model';
import { filterAnalytics } from '../../../src/handlers/reports/credit-score-tracking';

test('filter analytics for only specific events', () => {
  const mocks = MOCK_ANALYTICS as Analytics[];
  const filtered = mocks.filter(filterAnalytics);
  expect(filtered.length).toEqual(4);
});

// test("Middle tier", () => {
//   const storage = 100;

//   const cost = 20000;
//   const expectedCost = calculateCost(storage);

//   expect(cost).toEqual(expectedCost);
// });

// test("Highest tier", () => {
//   const storage = 101;

//   const cost = 10100;
//   const expectedCost = calculateCost(storage);

//   expect(cost).toEqual(expectedCost);
// });

const MOCK_ANALYTICS = [
  { sub: 'abc', event: 'dashboard_product' },
  { sub: 'abc', event: 'dashboard_product' },
  { sub: 'abc', event: 'dashboard_product' },
  { sub: 'abc', event: 'dashboard_product' },
  { sub: 'xyz', event: 'other' },
];
