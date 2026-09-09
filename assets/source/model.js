/* Pure computations shared by the demos. Missing values are never coerced to zero. */
(function (root) {
  'use strict';
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const sum = (rows, key) => rows.reduce((total, row) => total + (finite(row[key]) ? row[key] : 0), 0);
  const total = (rows, key) => rows.some(row => finite(row[key])) ? sum(rows, key) : null;
  const ratio = (numerator, denominator) => finite(numerator) && finite(denominator) && denominator > 0 ? numerator / denominator : null;
  const mean = (rows, key) => {
    const valid = rows.filter(row => finite(row[key]));
    return valid.length ? sum(valid, key) / valid.length : null;
  };
  const weighted = (rows, value, weight) => {
    const valid = rows.filter(row => finite(row[value]) && finite(row[weight]) && row[weight] > 0);
    return ratio(valid.reduce((total, row) => total + row[value] * row[weight], 0), sum(valid, weight));
  };
  const group = (rows, key) => {
    const result = new Map();
    rows.forEach(row => {
      const value = typeof key === 'function' ? key(row) : row[key];
      if (!result.has(value)) result.set(value, []);
      result.get(value).push(row);
    });
    return result;
  };
  const dateKey = row => String(row.date ?? row.timestamp ?? row.month).slice(0, 10);
  const dayNumber = value => Date.parse(value.slice(0, 10) + 'T00:00:00Z') / 86400000;
  const isoDay = value => new Date(value * 86400000).toISOString().slice(0, 10);
  const weekKey = value => {
    const day = dayNumber(value);
    const weekday = new Date(day * 86400000).getUTCDay();
    return isoDay(day - (weekday + 6) % 7);
  };
  const filter = (rows, state, config) => {
    const maxDay = Math.max(...rows.map(row => dayNumber(dateKey(row))).filter(Number.isFinite));
    return rows.filter(row => {
      const day = dayNumber(dateKey(row));
      if (state.days && day < maxDay - state.days + 1) return false;
      return config.filters.every(({ key }) => !state.filters[key] || String(row[key]) === state.filters[key]);
    });
  };
  // Adjacent equal calendar windows; reject incomplete windows instead of manufacturing deltas.
  const priorWindow = (rows, state, config) => {
    if (!state.days || config.kind === 'comparison') return null;
    const maxDay = Math.max(...rows.map(row => dayNumber(dateKey(row))).filter(Number.isFinite));
    const end = maxDay - state.days;
    const start = end - state.days + 1;
    const candidates = rows.filter(row => config.filters.every(({ key }) => !state.filters[key] || String(row[key]) === state.filters[key]));
    const current = candidates.filter(row => dayNumber(dateKey(row)) > end);
    const previous = candidates.filter(row => dayNumber(dateKey(row)) >= start && dayNumber(dateKey(row)) <= end);
    const identity = row => JSON.stringify(config.filters.map(({ key }) => row[key]));
    const identities = new Set(candidates.map(identity));
    const hours = config.kind === 'monitoring' ? 24 : 1;
    const coverage = data => new Set(data.map(row => dateKey(row) + '|' + identity(row) + (hours > 1 ? '|' + row.timestamp.slice(11, 13) : ''))).size;
    const expected = state.days * identities.size * hours;
    return coverage(current) === expected && coverage(previous) === expected ? previous : null;
  };
  const nps = rows => {
    const valid = rows.filter(row => Number.isInteger(row.nps_score) && row.nps_score >= 0 && row.nps_score <= 10);
    const promoters = valid.filter(row => row.nps_score >= 9).length;
    const detractors = valid.filter(row => row.nps_score <= 6).length;
    return { count: valid.length, promoters, detractors, passives: valid.length - promoters - detractors,
      score: valid.length ? (promoters - detractors) / valid.length * 100 : null };
  };
  const metrics = (rows, kind) => {
    if (kind === 'timeseries') return { revenue: total(rows, 'revenue'),
      orders: total(rows, 'orders'), aov: ratio(total(rows, 'revenue'), total(rows, 'orders')),
      conversion: ratio(total(rows, 'orders'), total(rows, 'visitors')) };
    if (kind === 'comparison') return { revenue: total(rows, 'revenue'),
      units: total(rows, 'units_sold'), price: ratio(total(rows, 'revenue'), total(rows, 'units_sold')),
      returns: weighted(rows, 'return_rate', 'units_sold') };
    if (kind === 'monitoring') {
      const traffic = [...group(rows, 'timestamp').values()].map(bucket => ({ value: sum(bucket, 'qps') }));
      return { p95: mean(rows, 'p95_latency_ms'), errors: weighted(rows, 'error_rate', 'qps'),
        qps: mean(traffic, 'value'), peak: rows.some(row => finite(row.p95_latency_ms)) ? Math.max(...rows.map(row => row.p95_latency_ms).filter(finite)) : null };
    }
    const result = nps(rows);
    return { nps: result.score, responses: result.count, satisfaction: mean(rows, 'satisfaction'),
      recommend: ratio(rows.filter(row => row.would_recommend === 'yes').length,
        rows.filter(row => ['yes', 'no'].includes(row.would_recommend)).length) };
  };
  const rolling = (values, windowSize) => values.map((_, index) => {
    if (index < windowSize - 1) return null;
    const slice = values.slice(index - windowSize + 1, index + 1);
    return slice.every(finite) ? slice.reduce((a, b) => a + b, 0) / windowSize : null;
  });
  const csvCell = value => {
    let text = value == null ? '' : String(value);
    // Neutralize spreadsheet formulas only in text, keeping actual negative numbers numeric.
    if (typeof value === 'string' && /^\s*[=+\-@\t\r\n]/u.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const csv = (rows, columns) => '\ufeff' + [columns.map(csvCell).join(','),
    ...rows.map(row => columns.map(key => csvCell(row[key])).join(','))].join('\r\n');
  const api = { finite, sum, total, ratio, mean, weighted, group, dateKey, dayNumber, isoDay, weekKey, filter, priorWindow, nps, metrics, rolling, csv };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DashboardModel = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
