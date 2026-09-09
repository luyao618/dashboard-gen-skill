const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../assets/source/model.js');
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('rates use their denominators and retain missing values', () => {
  const values = M.metrics([
    { revenue: 100, orders: 1, visitors: 10 },
    { revenue: 900, orders: 9, visitors: 990 },
  ], 'timeseries');
  assert.equal(values.aov, 100);
  close(values.conversion, .01);
  assert.equal(M.ratio(4, 0), null);
  assert.equal(M.mean([{ value: null }, { value: 0 }], 'value'), 0);
  assert.equal(M.metrics([], 'timeseries').revenue, null);
  assert.equal(M.metrics([{ revenue: null, orders: null }], 'timeseries').aov, null);
  assert.equal(M.metrics([{ revenue: null }], 'timeseries').revenue, null);
});

test('estimated returns are weighted by units, excluding missing rates', () => {
  const metrics = M.metrics([
    { units_sold: 10, return_rate: .5, revenue: 100 },
    { units_sold: 90, return_rate: .1, revenue: 900 },
    { units_sold: 100, return_rate: null, revenue: 300 },
  ], 'comparison');
  close(metrics.returns, .14);
  assert.equal(M.weighted([{ rate: .1, weight: 0 }], 'rate', 'weight'), null);
});

test('QPS sums endpoints per timestamp before averaging hours', () => {
  const data = [
    { timestamp: '2026-01-01T00:00:00', endpoint: 'a', qps: 10, p95_latency_ms: 100, error_rate: .1 },
    { timestamp: '2026-01-01T00:00:00', endpoint: 'b', qps: 90, p95_latency_ms: 300, error_rate: .01 },
    { timestamp: '2026-01-01T01:00:00', endpoint: 'a', qps: 20, p95_latency_ms: 200, error_rate: .1 },
    { timestamp: '2026-01-01T01:00:00', endpoint: 'b', qps: 180, p95_latency_ms: 400, error_rate: .01 },
  ];
  const metric = M.metrics(data, 'monitoring');
  assert.equal(metric.qps, 150);
  assert.equal(metric.p95, 250);
  assert.equal(metric.peak, 400);
  close(metric.errors, .019);
  assert.equal(M.metrics([], 'monitoring').peak, null);
});

test('NPS excludes invalid scores and empty NPS is unavailable', () => {
  const data = [9, 10, 8, 6, null, -1, 11, 2.5].map(nps_score => ({ nps_score }));
  assert.deepEqual(M.nps(data), { count: 4, promoters: 2, detractors: 1, passives: 1, score: 25 });
  assert.equal(M.nps([]).score, null);
  assert.equal(M.metrics([{ would_recommend: null }], 'survey').recommend, null);
});

test('prior windows are adjacent, equal, and use the selected category', () => {
  const config = { kind: 'timeseries', filters: [{ key: 'category' }] };
  const data = Array.from({ length: 15 }, (_, i) => ['A', 'B'].map(category => ({
    date: M.isoDay(M.dayNumber('2026-01-01') + i), category, revenue: i + 1,
  }))).flat();
  const state = { days: 7, filters: { category: 'A' } };
  const selected = M.filter(data, state, config);
  const previous = M.priorWindow(data, state, config);
  assert.equal(selected.length, 7); assert.equal(previous.length, 7);
  assert.equal(selected[0].date, '2026-01-09');
  assert.equal(previous[0].date, '2026-01-02');
  assert.equal(previous.at(-1).date, '2026-01-08');
  assert.ok(previous.every(row => row.category === 'A'));
  assert.equal(M.priorWindow(data.slice(10), state, config), null);
  assert.equal(M.priorWindow(data.filter(row => !(row.category === 'A' && row.date === '2026-01-04')), state, config), null);
  assert.equal(M.priorWindow(data.filter(row => !(row.category === 'B' && row.date === '2026-01-10')), { days: 7, filters: {} }, config), null);
});

test('calendar week and rolling average do not cross missing observations', () => {
  assert.equal(M.weekKey('2026-03-01'), '2026-02-23');
  assert.equal(M.weekKey('2026-03-02'), '2026-03-02');
  assert.deepEqual(M.rolling([1, 2, 3, null, 5, 6, 7], 3), [null, null, 2, null, null, null, 6]);
  assert.deepEqual(M.rolling([0, 0, 0], 3), [null, null, 0]);
});

test('CSV export preserves delimiters, Unicode and numeric negatives, neutralizes text formulas', () => {
  const csv = M.csv([{ name: '你好,"quoted"\nline', value: -12 }, { name: ' =2+2', value: null }], ['name', 'value']);
  assert.equal(csv, '\ufeff"name","value"\r\n"你好,""quoted""\nline","-12"\r\n"\' =2+2",""');
});
