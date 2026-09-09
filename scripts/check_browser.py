#!/usr/bin/env python3
"""Exercise generated demos with agent-browser; save screenshots under --output.

Requires agent-browser on PATH and an installed browser. No Python packages needed.
"""
import argparse
import csv
import functools
import http.server
import json
import math
import os
from pathlib import Path
import re
import subprocess
import tempfile
import threading
from datetime import date, timedelta

ROOT = Path(__file__).resolve().parents[1]
SESSION = f'dashboard-check-{os.getpid()}'


def browser(*args):
    # This CLI version does not reliably scroll offscreen targets before a click.
    if args[0] in ('click', 'download'):
        browser('scrollintoview', args[1])
    result = subprocess.run(['agent-browser', '--session', SESSION, '--json', *map(str, args)], capture_output=True, text=True, timeout=45)
    if result.returncode:
        raise RuntimeError(result.stderr or result.stdout)
    payload = json.loads(result.stdout)
    if not payload.get('success'):
        raise RuntimeError(payload)
    return payload.get('data', {})


def evaluate(code):
    return browser('eval', code).get('result')


def check(expression, message):
    result = evaluate(expression)
    if not result:
        raise AssertionError(f'{message}: {result}')


def source(kind, days=0, selection=None):
    files = {'timeseries': 'timeseries_sales', 'comparison': 'comparison_products', 'monitoring': 'monitoring_api', 'survey': 'survey_nps'}
    with (ROOT / 'assets/sample_data' / f'{files[kind]}.csv').open(newline='') as stream:
        data = list(csv.DictReader(stream))
    if days:
        key = 'timestamp' if kind == 'monitoring' else 'date'
        last = max(date.fromisoformat(row[key][:10]) for row in data)
        data = [row for row in data if date.fromisoformat(row[key][:10]) >= last - timedelta(days=days-1)]
    if selection:
        data = [row for row in data if all(row[key] == value for key, value in selection.items())]
    return data


def check_kpis(kind, data):
    def total(key): return sum(float(row[key]) for row in data)
    def mean(key): return total(key) / len(data)
    if kind == 'timeseries':
        expected = {'revenue': total('revenue'), 'orders': total('orders'), 'aov': total('revenue') / total('orders'), 'conversion': 100 * total('orders') / total('visitors')}
    elif kind == 'comparison':
        expected = {'revenue': total('revenue'), 'units': total('units_sold'), 'price': total('revenue') / total('units_sold'),
                    'returns': 100 * sum(float(row['return_rate']) * float(row['units_sold']) for row in data) / total('units_sold')}
    elif kind == 'monitoring':
        expected = {'p95': mean('p95_latency_ms'), 'errors': 100 * sum(float(row['error_rate']) * float(row['qps']) for row in data) / total('qps'),
                    'qps': total('qps') / len(set(row['timestamp'] for row in data)), 'peak': max(float(row['p95_latency_ms']) for row in data)}
    else:
        expected = {'nps': 100 * (sum(int(row['nps_score']) >= 9 for row in data) - sum(int(row['nps_score']) <= 6 for row in data)) / len(data),
                    'responses': len(data), 'satisfaction': mean('satisfaction'), 'recommend': 100 * sum(row['would_recommend'] == 'yes' for row in data) / len(data)}
    actual = evaluate("Object.fromEntries([...document.querySelectorAll('[data-metric]')].map(el => [el.dataset.metric, el.title]))")
    for key, expected_value in expected.items():
        value = float(re.search(r'[+\-]?[\d,]+(?:\.\d+)?', actual[key]).group().replace(',', ''))
        tolerance = .51 if key in ('qps', 'orders', 'units', 'responses') else .051 if key in ('p95', 'peak', 'nps') else .011
        if not math.isclose(value, expected_value, abs_tol=tolerance, rel_tol=0):
            raise AssertionError(f'{kind}.{key}: displayed {value}, source {expected_value}')


def check_chart_data(kind, data):
    chart = evaluate("(() => { const o = echarts.getInstanceByDom(document.getElementById('chart-primary')).getOption(); return {series: o.series, labels: o.xAxis[0].data}; })()")
    if kind == 'timeseries':
        first = min(row['date'] for row in data)
        expected = sum(float(row['revenue']) for row in data if row['date'] == first)
        assert math.isclose(chart['series'][0]['data'][0], expected, abs_tol=1e-6)
    elif kind == 'comparison':
        totals = [sum(float(row['revenue']) for row in data if row['product'] == name) for name in set(row['product'] for row in data)]
        assert math.isclose(chart['series'][0]['data'][0]['value'], max(totals), abs_tol=1e-6)
    elif kind == 'monitoring':
        first = min(row['timestamp'] for row in data)
        for series in chart['series']:
            expected = next(float(row['p95_latency_ms']) for row in data if row['endpoint'] == series['name'] and row['timestamp'] == first)
            assert series['data'][0] == expected
    else:
        counts = [sum(int(row['nps_score']) == score for row in data) for score in range(11)]
        assert [point['value'] for point in chart['series'][0]['data']] == counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=Path(tempfile.gettempdir()) / 'dashboard-skill-checks')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *_): pass
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/assets/'
    try:
        for kind, days in [('timeseries', 30), ('comparison', 0), ('monitoring', 7), ('survey', 0)]:
            browser('set', 'viewport', 1440, 1120)
            browser('open', base + f'demo_{kind}.html')
            browser('wait', '#chart-primary svg')
            if evaluate("document.documentElement.dataset.theme === 'dark'"):
                browser('click', '#theme-toggle')
            check("document.querySelectorAll('.chart svg').length === 3", kind + ' chart rendering')
            check("document.documentElement.scrollWidth <= innerWidth", kind + ' desktop overflow')
            check_kpis(kind, source(kind, days))
            check_chart_data(kind, source(kind, days))
            browser('screenshot', args.output / f'{kind}-light.png', '--full')
            browser('click', '#theme-toggle')
            check("document.documentElement.dataset.theme === 'dark'", kind + ' dark theme')
            browser('screenshot', args.output / f'{kind}-dark.png', '--full')
            browser('set', 'viewport', 800, 1080)
            check("document.documentElement.scrollWidth <= innerWidth", kind + ' tablet overflow')
            browser('set', 'viewport', 390, 1000)
            check("document.documentElement.scrollWidth <= innerWidth", kind + ' mobile overflow')
            browser('screenshot', args.output / f'{kind}-mobile.png', '--full')
            browser('fill', '#search', '__no_matching_rows__')
            check("document.getElementById('table-count').textContent === '0 matching rows' && document.getElementById('export').disabled && document.getElementById('next').disabled", kind + ' empty search')
            check_kpis(kind, source(kind, days))
            browser('fill', '#search', '')
            browser('set', 'viewport', 1440, 1120)
            errors = browser('errors')
            if errors.get('errors'):
                raise AssertionError(errors)
            print(f'PASS {kind}: CSV/KPIs/chart values, 3 charts, both themes, tablet/mobile, empty search, runtime', flush=True)

        # Coordinated filters, sortable raw numerics, full export and persistent theme/search.
        browser('open', base + 'demo_timeseries.html')
        browser('wait', '#chart-primary svg')
        browser('select', '#filter-category', 'Electronics')
        browser('select', '#filter-days', '7')
        check_kpis('timeseries', source('timeseries', 7, {'category': 'Electronics'}))
        check("document.getElementById('scope-count').textContent.startsWith('7 of')", 'filter count')
        browser('select', '#filter-days', '30')
        browser('fill', '#search', 'Electronics')
        browser('click', '#theme-toggle')
        check("document.getElementById('filter-category').value === 'Electronics' && document.getElementById('search').value === 'Electronics'", 'theme preserves state')
        browser('click', '#table-head th:nth-child(3) button')
        browser('click', '#table-head th:nth-child(3) button')
        check("document.querySelector('#table-head th:nth-child(3)').getAttribute('aria-sort') === 'descending'", 'numeric sort direction')
        browser('click', '#next')
        check("document.getElementById('table-count').textContent.startsWith('13–24 of 30')", 'pagination')
        download = args.output / 'filtered.csv'
        browser('download', '#export', download)
        with download.open(encoding='utf-8-sig', newline='') as stream:
            exported = list(csv.DictReader(stream))
        expected = sorted(source('timeseries', 30, {'category': 'Electronics'}), key=lambda row: float(row['revenue']), reverse=True)
        assert len(exported) == 30
        assert [float(row['revenue']) for row in exported] == [float(row['revenue']) for row in expected]
        browser('focus', '#filter-category')
        check("getComputedStyle(document.activeElement).outlineStyle !== 'none'", 'visible keyboard focus')
        browser('press', 'Tab')
        check("document.activeElement.id === 'reset'", 'keyboard navigation')
        browser('click', '#reset')
        check("document.getElementById('search').value === '' && document.getElementById('filter-category').value === ''", 'reset')
        print('PASS interactions: multi-filter metrics, search/theme, numeric sort, pagination, 30-row CSV export, focus, reset', flush=True)

        # Validate a chart click, zoom restoration, and reduced motion without private app hooks.
        browser('open', base + 'demo_monitoring.html')
        browser('wait', '#chart-primary svg')
        browser('scrollintoview', '#chart-secondary')
        point = evaluate("(() => { const el = document.getElementById('chart-secondary'); const chart = echarts.getInstanceByDom(el); const p = chart.convertToPixel({seriesIndex: 0}, [0,0]); const r = el.getBoundingClientRect(); return {x:r.left+p[0], y:r.top+p[1]}; })()")
        browser('mouse', 'move', round(point['x']), round(point['y']))
        browser('mouse', 'down')
        browser('mouse', 'up')
        check("document.getElementById('filter-endpoint').value !== ''", 'heatmap click filters endpoint')
        browser('click', '#reset')
        evaluate("echarts.getInstanceByDom(document.getElementById('chart-primary')).dispatchAction({type:'dataZoom', start:25, end:65})")
        browser('click', '#theme-toggle')
        check("Math.abs(echarts.getInstanceByDom(document.getElementById('chart-primary')).getOption().dataZoom[0].start - 25) < .01", 'theme retains zoom')
        browser('set', 'media', 'light', 'reduced-motion')
        browser('reload')
        browser('wait', '#chart-primary svg')
        check("matchMedia('(prefers-reduced-motion: reduce)').matches && echarts.getInstanceByDom(document.getElementById('chart-primary')).getOption().animation === false", 'reduced motion')
        print('PASS monitoring: zoom persistence and reduced motion', flush=True)

        browser('open', (ROOT / 'assets/demo_survey.html').as_uri())
        browser('wait', '#chart-primary svg')
        check_kpis('survey', source('survey'))
        print('PASS direct file opening', flush=True)
        evaluate("(() => { const option = document.createElement('option'); option.value = '__empty__'; option.textContent = 'Empty test cohort'; document.getElementById('filter-department').append(option); })()")
        browser('select', '#filter-department', '__empty__')
        check("!document.getElementById('empty-state').hidden && document.getElementById('analysis').hidden && document.querySelector('[data-metric=nps]').textContent === '—'", 'empty dashboard has no misleading score')
        print('PASS empty global selection', flush=True)
        # Use a fresh browser so cached CDN bytes cannot defeat the offline check.
        browser('close')
        browser('open', 'about:blank')
        browser('set', 'offline', 'on')
        browser('open', (ROOT / 'assets/demo_comparison.html').as_uri())
        browser('wait', '#chart-error')
        check("!document.getElementById('chart-error').hidden && document.querySelectorAll('#table-body tr').length > 0", 'dependency fallback')
        browser('select', '#filter-region', 'North')
        check_kpis('comparison', source('comparison', selection={'region': 'North'}))
        print('PASS blocked CDN: readable error, working filters, metrics and table', flush=True)
        print(f'Screenshots and checked CSV: {args.output}', flush=True)
    finally:
        browser('close')
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    main()
