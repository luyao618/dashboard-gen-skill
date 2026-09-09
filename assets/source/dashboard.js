(function () {
  'use strict';
  const { config, columns, rows: packed } = JSON.parse(document.getElementById('dashboard-data').textContent);
  const rows = packed.map(values => Object.fromEntries(columns.map((key, index) => [key, values[index]])));
  const M = DashboardModel;
  const $ = id => document.getElementById(id);
  const state = { days: config.days, filters: {}, search: '', sort: config.columns[0][0], direction: 1, page: 1 };
  const pageSize = 12;
  const charts = new Map();
  const zoom = new Map();
  let selected = [];
  let tableRows = [];
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 });
  function format(value, kind = 'number') {
    if (value == null || (typeof value === 'number' && !Number.isFinite(value))) return '—';
    if (kind === 'text') return String(value);
    if (kind === 'currency') return '$' + compact.format(value);
    if (kind === 'money') return money.format(value);
    if (kind === 'percent') return (value * 100).toFixed(2) + '%';
    if (kind === 'integer') return Math.round(value).toLocaleString('en-US');
    if (kind === 'ms') return number.format(value) + ' ms';
    if (kind === 'score') return (value > 0 ? '+' : '') + value.toFixed(1);
    if (kind === 'rating') return value.toFixed(2) + ' / 5';
    return number.format(value);
  }
  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text != null) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function colors() {
    const style = getComputedStyle(document.documentElement);
    const get = name => style.getPropertyValue('--' + name).trim();
    return { text: get('ink'), muted: get('muted'), border: get('border'), grid: get('grid'), surface: get('surface'),
      accent: get('accent'), teal: get('teal'), rose: get('rose'), amber: get('amber'),
      palette: ['accent', 'teal', 'amber', 'purple', 'rose', 'orange'].map(get) };
  }
  const categories = key => [...new Set(rows.map(row => row[key]))].sort();
  const seriesColor = (key, value) => colors().palette[categories(key).indexOf(value) % colors().palette.length];
  function addSelect(key, label, options, current) {
    const wrap = node('div', null, 'control');
    const labelEl = node('label', label); labelEl.htmlFor = 'filter-' + key;
    const select = node('select'); select.id = labelEl.htmlFor;
    options.forEach(([text, value]) => { const option = node('option', text); option.value = value; select.append(option); });
    select.value = current;
    select.addEventListener('change', () => {
      if (key === 'days') state.days = Number(select.value); else state.filters[key] = select.value;
      state.page = 1; zoom.clear(); renderAll();
    });
    wrap.append(labelEl, select); $('filter-controls').append(wrap);
  }
  function setFilter(key, value) {
    state.filters[key] = state.filters[key] === value ? '' : value;
    $('filter-' + key).value = state.filters[key];
    state.page = 1; zoom.clear(); renderAll();
  }
  if (config.ranges.length) addSelect('days', 'Period', config.ranges, state.days);
  config.filters.forEach(({ key, label }) => addSelect(key, label, [['All ' + (key === 'category' ? 'categories' : label.toLowerCase() + 's'), ''], ...categories(key).map(value => [value, value])], ''));
  $('reset').addEventListener('click', () => {
    state.days = config.days; state.filters = {}; state.search = ''; state.page = 1;
    state.sort = config.columns[0][0]; state.direction = 1; $('search').value = '';
    if ($('filter-days')) $('filter-days').value = state.days;
    config.filters.forEach(({ key }) => { $('filter-' + key).value = ''; });
    zoom.clear(); renderAll();
  });
  $('eyebrow').textContent = config.eyebrow;
  $('description').textContent = config.description;
  $('analysis-title').textContent = config.analysis;
  ['primary', 'secondary', 'tertiary'].forEach((key, index) => {
    $(key + '-title').textContent = config.charts[index][0];
    $(key + '-description').textContent = config.charts[index][1];
  });
  $('methodology').textContent = config.methodology;
  $('source-note').textContent = `Source: ${config.file} · ${rows.length.toLocaleString()} records. Sample data only. The displayed period is the CSV coverage, not the date the page was opened. All source records are embedded; the table is paginated, not truncated.`;
  $('footer-source').textContent = config.file + ' / ' + rows.length.toLocaleString() + ' source rows';

  function renderMetrics() {
    const values = M.metrics(selected, config.kind);
    const previous = M.priorWindow(rows, state, config);
    const prior = previous && M.metrics(previous, config.kind);
    $('kpis').replaceChildren();
    config.metrics.forEach(([key, label, kind, definition, polarity]) => {
      const card = node('article', null, 'kpi');
      const value = node('p', format(values[key], kind), 'kpi-value');
      value.dataset.metric = key;
      value.title = kind === 'currency' ? format(values[key], 'money') : format(values[key], kind);
      const note = node('div', null, 'kpi-note');
      if (prior && M.finite(prior[key]) && M.finite(values[key]) && prior[key] !== 0) {
        const difference = kind === 'percent' ? (values[key] - prior[key]) * 100 : (values[key] / prior[key] - 1) * 100;
        const favorable = polarity === 'lower' ? difference < 0 : difference > 0;
        const precision = kind === 'percent' ? 2 : 1;
        const minimum = 10 ** -precision;
        const amount = difference !== 0 && Math.abs(difference) < minimum ? `${difference < 0 ? '−' : '+'}<${minimum.toFixed(precision)}` : `${difference > 0 ? '+' : ''}${difference.toFixed(precision)}`;
        const delta = node('span', `${amount}${kind === 'percent' ? ' pp' : '%'} `,
          'delta' + (difference && polarity !== 'neutral' ? (favorable ? ' positive' : ' negative') : ''));
        note.append(delta, node('span', `vs preceding ${state.days} days`), node('br'));
      } else if (state.days && config.kind === 'timeseries') {
        note.append(node('span', 'Prior comparison unavailable'), node('br'));
      }
      note.append(node('span', definition));
      card.append(node('h2', label, 'kpi-label'), value, note); $('kpis').append(card);
    });
  }
  const grouped = (data, key, value) => [...M.group(data, key)].map(([name, bucket]) => ({ name, value: value(bucket), count: bucket.length }));
  const ranked = (data, key, value) => grouped(data, key, value).sort((a, b) => b.value - a.value || String(a.name).localeCompare(String(b.name)));
  function insight(value, title, copy, facts) {
    $('insight-value').textContent = value; $('insight-title').textContent = title; $('insight-copy').textContent = copy;
    $('insight-list').replaceChildren(...facts.map(([label, text]) => {
      const row = node('div', null, 'insight-row'); row.append(node('span', label), node('strong', text)); return row;
    }));
  }
  function renderInsight() {
    if (!selected.length) { insight('—', 'No data selected', 'Adjust the filters to explore the dataset.', []); return; }
    if (config.kind === 'timeseries') {
      const ranking = ranked(selected, 'category', bucket => M.sum(bucket, 'revenue'));
      const top = ranking[0]; const total = M.sum(selected, 'revenue');
      insight(format(M.ratio(top.value, total), 'percent'), top.name + ' leads revenue', 'Share of revenue within the current selection. Compare category contributions in the ranking below.',
        [['Leading category', format(top.value, 'currency')], ['Categories in view', String(ranking.length)], ['Observed days', String(new Set(selected.map(M.dateKey)).size)]]);
    } else if (config.kind === 'comparison') {
      const ranking = ranked(selected, 'region', bucket => M.sum(bucket, 'revenue'));
      const top = ranking[0];
      insight(format(M.ratio(top.value, M.sum(selected, 'revenue')), 'percent'), top.name + ' is the largest market', 'Share of selected revenue. Regional size and product mix should be read together.',
        [['Leading region', format(top.value, 'currency')], ['Products in view', String(new Set(selected.map(row => row.product)).size)], ['Regions in view', String(ranking.length)]]);
    } else if (config.kind === 'monitoring') {
      const peak = selected.reduce((a, b) => a.p95_latency_ms > b.p95_latency_ms ? a : b);
      const above = selected.filter(row => row.p95_latency_ms > 300).length;
      insight(format(peak.p95_latency_ms, 'ms'), peak.endpoint + ' has the highest hourly P95', 'Peak observed in this selection at ' + peak.timestamp.replace('T', ' ') + '. This is an endpoint-hour percentile.',
        [['Above 300 ms reference', `${above.toLocaleString()} / ${selected.length.toLocaleString()}`], ['Reference type', 'Illustrative'], ['Endpoint-hours', selected.length.toLocaleString()]]);
    } else {
      const nps = M.nps(selected);
      insight(format(M.ratio(nps.promoters, nps.count), 'percent'), 'of responses are promoters', 'Promoters score 9–10. NPS subtracts the share of detractors from the share of promoters.',
        [['Promoters · 9–10', `${nps.promoters} / ${nps.count}`], ['Passives · 7–8', `${nps.passives} / ${nps.count}`], ['Detractors · 0–6', `${nps.detractors} / ${nps.count}`]]);
    }
  }
  function baseOption() {
    const c = colors();
    return { animation: false, color: c.palette, backgroundColor: 'transparent',
      textStyle: { fontFamily: "'Avenir Next', 'Segoe UI', sans-serif", color: c.text },
      aria: { enabled: true, decal: { show: false } },
      tooltip: { trigger: 'axis', confine: true, renderMode: 'richText', backgroundColor: c.surface, borderColor: c.border, textStyle: { color: c.text, fontSize: 12 } },
      grid: { left: 24, right: 28, top: 42, bottom: 26, containLabel: true },
      xAxis: { type: 'category', axisTick: { show: false }, axisLine: { lineStyle: { color: c.border } }, axisLabel: { color: c.muted, fontSize: 10, hideOverlap: true }, splitLine: { show: false } },
      yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted, fontSize: 10 }, splitLine: { lineStyle: { color: c.grid, type: 'dashed' } } } };
  }
  function draw(id, option, onClick) {
    if (!window.echarts) return;
    const target = $('chart-' + id);
    if (!charts.has(id)) {
      const chart = echarts.init(target, null, { renderer: 'svg' }); charts.set(id, chart);
      chart.on('datazoom', () => {
        const item = chart.getOption().dataZoom?.[0];
        if (item) zoom.set(id, { start: item.start, end: item.end });
      });
      new ResizeObserver(() => chart.resize()).observe(target);
    }
    const chart = charts.get(id);
    if (option.dataZoom && zoom.has(id)) option.dataZoom.forEach(item => Object.assign(item, zoom.get(id)));
    chart.setOption(option, { notMerge: true });
    chart.off('click');
    if (onClick) chart.on('click', onClick);
  }
  function line(id, labels, series, kind, { zoomable = false, min, max, threshold } = {}) {
    const c = colors(); const option = baseOption();
    option.xAxis.data = labels;
    option.xAxis.axisLabel.formatter = value => value.includes('T') ? value.slice(5, 10) + '\n' + value.slice(11, 16) : value.slice(5);
    option.yAxis.axisLabel.formatter = value => kind === 'currency' ? '$' + compact.format(value) : kind === 'percent' ? (value * 100).toFixed(1) + '%' : compact.format(value);
    if (min !== undefined) option.yAxis.min = min;
    if (max !== undefined) option.yAxis.max = max;
    option.tooltip.valueFormatter = value => format(value, kind);
    option.legend = { top: 12, left: 24, right: 16, type: 'scroll', textStyle: { color: c.muted, fontSize: 11 }, itemWidth: 15, itemHeight: 7 };
    option.series = series.map((item, index) => ({ name: item.name, type: 'line', data: item.data, smooth: false, connectNulls: false,
      showSymbol: labels.length <= 10, symbolSize: 5, itemStyle: { color: item.color || c.palette[index] },
      lineStyle: { width: item.dashed ? 1.8 : 2.3, type: item.dashed ? 'dashed' : 'solid' }, emphasis: { focus: 'series' } }));
    if (threshold !== undefined) option.series[0].markLine = { silent: true, symbol: 'none', label: { show: false }, lineStyle: { color: c.amber, type: 'dashed' }, data: [{ yAxis: threshold }] };
    if (zoomable && labels.length > 60) {
      const compactScreen = window.innerWidth < 480;
      option.grid.bottom = 68;
      option.dataZoom = [{ type: 'slider', bottom: 13, height: 18, borderColor: c.border, textStyle: { color: c.muted }, showDataShadow: false, brushSelect: false, showDetail: false },
        { type: 'inside', zoomOnMouseWheel: 'ctrl', moveOnMouseWheel: false, moveOnMouseMove: !compactScreen }];
    }
    draw(id, option);
  }
  function bars(id, data, kind, { colorKey, clickKey, signed = false, showCount = false, bounds } = {}) {
    const c = colors(); const option = baseOption();
    option.tooltip.trigger = 'item'; option.tooltip.valueFormatter = value => format(value, kind);
    option.grid = { left: 22, right: showCount ? 66 : 75, top: 25, bottom: 24, containLabel: true };
    option.xAxis = { ...option.yAxis, splitNumber: 3, min: bounds?.[0] ?? (signed ? undefined : 0), max: bounds?.[1],
      axisLabel: { color: c.muted, fontSize: 10, hideOverlap: true, formatter: value => kind === 'percent' ? (value * 100).toFixed(0) + '%' : kind === 'currency' ? '$' + compact.format(value) : value } };
    option.yAxis = { type: 'category', inverse: true, data: data.map(item => item.name), axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: c.text, fontSize: 11, width: window.innerWidth < 480 ? 80 : 130, overflow: 'truncate' } };
    option.series = [{ type: 'bar', barMaxWidth: 26, data: data.map(item => ({ value: item.value, itemStyle: {
      color: colorKey ? seriesColor(colorKey, item.name) : signed && item.value < 0 ? c.rose : c.accent, borderRadius: 3 } })),
      label: { show: true, position: 'right', color: c.text, fontSize: 10, formatter: item => showCount ? `${format(item.value, 'score')} · n=${data[item.dataIndex].count}` : format(item.value, kind) } }];
    draw(id, option, clickKey ? event => setFilter(clickKey, data[event.dataIndex].name) : null);
  }
  function daily(data, key, reducer) {
    const groups = M.group(data, key);
    const keys = [...groups.keys()].sort();
    if (!keys.length) return { labels: [], values: [] };
    const labels = [];
    for (let day = M.dayNumber(keys[0]); day <= M.dayNumber(keys.at(-1)); day++) labels.push(M.isoDay(day));
    return { labels, values: labels.map(label => groups.has(label) ? reducer(groups.get(label)) : null) };
  }
  function renderCharts() {
    if (!selected.length) { charts.forEach(chart => chart.clear()); return; }
    const c = colors();
    if (config.kind === 'timeseries') {
      const revenue = daily(selected, 'date', bucket => M.sum(bucket, 'revenue'));
      line('primary', revenue.labels, [{ name: 'Daily revenue', data: revenue.values }, { name: 'Trailing 7-day mean', data: M.rolling(revenue.values, 7), dashed: true, color: c.teal }], 'currency');
      const rank = ranked(selected, 'category', bucket => M.sum(bucket, 'revenue'));
      bars('secondary', rank, 'currency', { colorKey: 'category', clickKey: 'category' });
      const conversion = daily(selected, 'date', bucket => M.ratio(M.sum(bucket, 'orders'), M.sum(bucket, 'visitors')));
      line('tertiary', conversion.labels, [{ name: 'Conversion rate', data: conversion.values, color: c.teal }], 'percent', { min: 0 });
      $('primary-summary').textContent = `${revenue.labels.length} calendar days in view. Dashed line: trailing 7-day mean; missing dates stay as gaps.`;
      $('secondary-summary').textContent = `Category colors stay consistent across filters. Use the Category selector for keyboard access.`;
      $('tertiary-summary').textContent = 'Rates are recomputed from orders and visitors, not averaged from row percentages.';
    } else if (config.kind === 'comparison') {
      const rank = ranked(selected, 'product', bucket => M.sum(bucket, 'revenue'));
      bars('primary', rank, 'currency', { colorKey: 'product', clickKey: 'product' });
      const regions = [...new Set(selected.map(row => row.region))].sort();
      const products = [...new Set(selected.map(row => row.product))].sort();
      const option = baseOption(); option.xAxis.data = regions;
      option.yAxis.axisLabel.formatter = value => '$' + compact.format(value);
      option.legend = { top: 10, left: 24, right: 16, type: 'scroll', textStyle: { color: c.muted, fontSize: 11 }, itemWidth: 10, itemHeight: 10 };
      option.grid.top = 50; option.tooltip.valueFormatter = value => format(value, 'currency');
      option.series = products.map(product => ({ name: product, type: 'bar', stack: 'revenue', barMaxWidth: 46, itemStyle: { color: seriesColor('product', product) },
        data: regions.map(region => M.sum(selected.filter(row => row.region === region && row.product === product), 'revenue')) }));
      draw('secondary', option);
      const returns = ranked(selected, 'product', bucket => M.weighted(bucket, 'return_rate', 'units_sold'));
      bars('tertiary', returns, 'percent', { colorKey: 'product' });
      $('primary-summary').textContent = `${rank.length} products ranked by selected revenue. Use the Product selector for keyboard access.`;
      $('secondary-summary').textContent = 'Compare total regional revenue by bar height; the colored segments show product contribution.';
      $('tertiary-summary').textContent = 'Estimated from rounded source rates, weighted by units sold. Lower means fewer returns per unit.';
    } else if (config.kind === 'monitoring') {
      const times = [...new Set(selected.map(row => row.timestamp))].sort();
      const endpoints = [...new Set(selected.map(row => row.endpoint))].sort();
      const lookup = new Map(selected.map(row => [row.timestamp + '|' + row.endpoint, row]));
      line('primary', times, endpoints.map(endpoint => ({ name: endpoint, color: seriesColor('endpoint', endpoint),
        data: times.map(time => lookup.get(time + '|' + endpoint)?.p95_latency_ms ?? null) })), 'ms', { zoomable: true, min: 0, threshold: 300 });
      const dates = [...new Set(selected.map(M.dateKey))].sort();
      const heat = [];
      const buckets = M.group(selected, row => M.dateKey(row) + '|' + row.endpoint);
      dates.forEach((date, x) => endpoints.forEach((endpoint, y) => {
        const bucket = buckets.get(date + '|' + endpoint);
        if (bucket) heat.push([x, y, M.mean(bucket, 'p95_latency_ms')]);
      }));
      const option = baseOption();
      option.grid = { left: 20, right: 22, top: 30, bottom: 74, containLabel: true };
      option.xAxis.data = dates; option.xAxis.axisLabel.formatter = value => value.slice(5);
      option.yAxis = { type: 'category', data: endpoints.map(value => value.replace('/api/', '/')), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted, fontSize: 11 } };
      option.tooltip = { ...option.tooltip, trigger: 'item', formatter: event => `${endpoints[event.value[1]]}\n${dates[event.value[0]]}\nMean hourly P95: ${format(event.value[2], 'ms')}` };
      const fullBuckets = M.group(rows, row => M.dateKey(row) + '|' + row.endpoint);
      const heatMax = Math.ceil(Math.max(...[...fullBuckets.values()].map(bucket => M.mean(bucket, 'p95_latency_ms'))) / 50) * 50;
      option.visualMap = { min: 0, max: heatMax, orient: 'horizontal', left: 'center', bottom: 12,
        calculable: false, itemWidth: 10, itemHeight: 120, text: [heatMax + ' ms', '0 ms'], textStyle: { color: c.muted, fontSize: 10 },
        inRange: { color: document.documentElement.dataset.theme === 'dark' ? ['#233b54', '#337c9b', '#8dd9e8'] : ['#e8f2fa', '#70adce', '#184875'] } };
      option.series = [{ type: 'heatmap', data: heat, itemStyle: { borderWidth: 3, borderColor: c.surface, borderRadius: 3 } }];
      draw('secondary', option, event => setFilter('endpoint', endpoints[event.value[1]]));
      const traffic = M.group(selected, 'timestamp');
      line('tertiary', times, [{ name: 'Total QPS', data: times.map(time => M.sum(traffic.get(time), 'qps')), color: c.teal }], 'number', { zoomable: true, min: 0 });
      $('primary-summary').textContent = 'Dashed reference: 300 ms (illustrative). These are hourly endpoint percentiles, not a percentile over the whole period.';
      $('secondary-summary').textContent = 'One shared color scale across selections. Select a cell or use the Endpoint selector to focus an endpoint.';
      $('tertiary-summary').textContent = `${times.length} hourly buckets. Endpoint QPS is summed at each timestamp; it is never summed across time.`;
    } else {
      const nps = M.nps(selected);
      const distribution = Array.from({ length: 11 }, (_, score) => selected.filter(row => row.nps_score === score).length);
      const option = baseOption(); option.xAxis.data = distribution.map((_, score) => String(score)); option.yAxis.minInterval = 1;
      option.tooltip.valueFormatter = value => `${value} responses`;
      option.series = [{ type: 'bar', barMaxWidth: 38, data: distribution.map((value, score) => ({ value,
        itemStyle: { color: score <= 6 ? c.rose : score <= 8 ? c.amber : c.teal, borderRadius: [4, 4, 0, 0] } })),
        label: { show: true, position: 'top', color: c.text, fontSize: 10 } }];
      draw('primary', option);
      const departments = ranked(selected, 'department', bucket => M.nps(bucket).score).map(item => ({ ...item, count: M.nps(selected.filter(row => row.department === item.name)).count }));
      bars('secondary', departments, 'score', { signed: true, showCount: true, bounds: [-100, 100] });
      const weeks = M.group(selected, row => M.weekKey(row.date));
      const labels = [...weeks.keys()].sort();
      line('tertiary', labels, [{ name: 'NPS', data: labels.map(week => M.nps(weeks.get(week)).score), color: c.teal }], 'score', { min: -100, max: 100 });
      $('primary-summary').textContent = `${nps.count} valid responses: ${nps.detractors} detractors, ${nps.passives} passives, ${nps.promoters} promoters.`;
      $('secondary-summary').textContent = 'Sample sizes matter. These descriptive differences do not establish statistical significance.';
      $('tertiary-summary').textContent = labels.map(week => `${week}: n=${M.nps(weeks.get(week)).count}`).join(' · ') + '. Boundary weeks may be partial.';
    }
  }

  function renderTable() {
    const query = state.search.trim().toLocaleLowerCase();
    tableRows = selected.filter(row => !query || columns.some(key => String(row[key] ?? '').toLocaleLowerCase().includes(query))).sort((a, b) => {
      const av = a[state.sort], bv = b[state.sort];
      if (av == null) return bv == null ? 0 : 1;
      if (bv == null) return -1;
      return state.direction * (typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv)));
    });
    const totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
    state.page = Math.max(1, Math.min(state.page, totalPages));
    const first = (state.page - 1) * pageSize;
    const head = node('tr');
    config.columns.forEach(([key, label, kind]) => {
      const cell = node('th', null, kind === 'text' ? '' : 'num'); cell.scope = 'col';
      const active = key === state.sort; cell.setAttribute('aria-sort', active ? (state.direction === 1 ? 'ascending' : 'descending') : 'none');
      const button = node('button', label + (active ? (state.direction === 1 ? ' ↑' : ' ↓') : ' ↕')); button.type = 'button';
      button.addEventListener('click', () => {
        state.direction = key === state.sort ? -state.direction : 1; state.sort = key; state.page = 1; renderTable();
        [...$('table-head').querySelectorAll('button')][config.columns.findIndex(col => col[0] === key)].focus();
      });
      cell.append(button); head.append(cell);
    });
    $('table-head').replaceChildren(head);
    $('table-body').replaceChildren(...tableRows.slice(first, first + pageSize).map(row => {
      const tr = node('tr'); config.columns.forEach(([key, , kind]) => tr.append(node('td', format(row[key], kind), kind === 'text' ? '' : 'num'))); return tr;
    }));
    if (!tableRows.length) {
      const tr = node('tr'); const td = node('td', 'No matching rows. Clear the search or reset the filters.', 'empty-cell'); td.colSpan = config.columns.length; tr.append(td); $('table-body').append(tr);
    }
    $('table-count').textContent = tableRows.length ? `${first + 1}–${Math.min(first + pageSize, tableRows.length)} of ${tableRows.length.toLocaleString()} matching rows` : '0 matching rows';
    $('page-label').textContent = `${state.page} / ${totalPages}`;
    $('previous').disabled = state.page <= 1; $('next').disabled = state.page >= totalPages;
    $('export').disabled = !tableRows.length;
  }
  $('search').addEventListener('input', event => { state.search = event.target.value; state.page = 1; renderTable(); });
  $('previous').addEventListener('click', () => { state.page--; renderTable(); });
  $('next').addEventListener('click', () => { state.page++; renderTable(); });
  $('export').addEventListener('click', () => {
    const blob = new Blob([M.csv(tableRows, columns)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = node('a');
    a.href = url; a.download = config.kind + '-filtered.csv'; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  function updateThemeButton() {
    const dark = document.documentElement.dataset.theme === 'dark';
    $('theme-toggle').textContent = dark ? 'Light theme ☀' : 'Dark theme ◐';
    $('theme-toggle').setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    $('theme-toggle').setAttribute('aria-pressed', String(dark));
  }
  $('theme-toggle').addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('csv-dashboard-theme', document.documentElement.dataset.theme); } catch (_) { /* Theme still works without storage. */ }
    updateThemeButton(); renderCharts();
  });
  function renderAll() {
    selected = M.filter(rows, state, config);
    const dates = [...new Set(selected.map(M.dateKey))].sort();
    $('date-range').textContent = dates.length ? dates[0] + ' — ' + dates.at(-1) : 'No dates selected';
    $('scope-count').textContent = `${selected.length.toLocaleString()} of ${rows.length.toLocaleString()} source records`;
    $('filter-status').textContent = `Showing ${selected.length.toLocaleString()} records. ${Object.values(state.filters).filter(Boolean).join(', ') || 'All groups'}.`;
    $('empty-state').hidden = selected.length > 0; $('analysis').hidden = !selected.length;
    renderMetrics(); renderInsight(); renderCharts(); renderTable();
  }
  updateThemeButton(); renderAll();
  // Render useful content first. A blocked CDN must not disable filters, metrics, or the table.
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
  script.onload = () => { $('chart-error').hidden = true; renderCharts(); };
  script.onerror = () => { $('chart-error').hidden = false; };
  document.head.append(script);
})();
