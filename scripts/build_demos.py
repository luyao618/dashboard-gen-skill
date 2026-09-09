#!/usr/bin/env python3
"""Rebuild standalone examples from their CSVs and shared source. Python stdlib only.

This is a demo compiler, not a generic CSV schema inference engine.
"""
import argparse
import csv
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets' / 'source'

CONFIGS = {
    'timeseries': dict(
        file='timeseries_sales.csv', title='Sales performance', eyebrow='Commerce / Revenue analytics',
        description='Track demand, understand the sales mix, and see what changed.',
        analysis='Revenue & demand', days=30, ranges=[['All 90 days', 0], ['Last 30 days', 30], ['Last 7 days', 7]],
        filters=[dict(key='category', label='Category')],
        metrics=[['revenue', 'Revenue', 'currency', 'Sum of revenue', 'higher'], ['orders', 'Orders', 'integer', 'Sum of orders', 'higher'], ['aov', 'Average order value', 'money', 'Revenue ÷ orders', 'neutral'], ['conversion', 'Conversion rate', 'percent', 'Orders ÷ visitors', 'higher']],
        charts=[['Daily revenue', 'Revenue in USD · daily totals'], ['Revenue by category', 'Ranked by revenue · select a bar to filter'], ['Conversion over time', 'Orders ÷ visitors · daily rate']],
        columns=[['date', 'Date', 'text'], ['category', 'Category', 'text'], ['revenue', 'Revenue', 'money'], ['orders', 'Orders', 'integer'], ['visitors', 'Visitors', 'integer'], ['avg_order_value', 'Source AOV', 'money'], ['conversion_rate', 'Source conv. %', 'number']],
        numeric=['revenue', 'orders', 'avg_order_value', 'conversion_rate', 'visitors'],
        methodology='Revenue and orders are additive. Average order value = total revenue / total orders; conversion = total orders / total visitors, assuming visitors are additive across categories in this sample. Source row rates are retained in the table. Changes compare the selected window with the immediately preceding equal number of calendar days, using the same category filter. Incomplete prior coverage has no comparison. Conversion changes use percentage points. The trailing 7-day average requires seven consecutive observed days; missing days remain gaps. Currency is assumed USD for this demo.'),
    'comparison': dict(
        file='comparison_products.csv', title='Product performance', eyebrow='Commerce / Portfolio analytics',
        description='Compare product revenue, regional contribution, and return rates.',
        analysis='Portfolio breakdown', days=0, ranges=[],
        filters=[dict(key='region', label='Region'), dict(key='product', label='Product'), dict(key='month', label='Month')],
        metrics=[['revenue', 'Revenue', 'currency', 'Sum of revenue', 'higher'], ['units', 'Units sold', 'integer', 'Sum of units sold', 'higher'], ['price', 'Revenue per unit', 'money', 'Revenue ÷ units sold', 'neutral'], ['returns', 'Estimated return rate', 'percent', 'Weighted by units sold', 'lower']],
        charts=[['Revenue by product', 'Revenue in USD · select a bar to filter'], ['Regional revenue mix', 'Revenue by product · common zero baseline'], ['Estimated returns by product', 'Return rate weighted by units sold']],
        columns=[['month', 'Month', 'text'], ['region', 'Region', 'text'], ['product', 'Product', 'text'], ['units_sold', 'Units sold', 'integer'], ['revenue', 'Revenue', 'money'], ['return_rate', 'Return rate', 'percent']],
        numeric=['units_sold', 'revenue', 'return_rate'],
        methodology='Revenue and units sold are summed. Revenue per unit = total revenue / total units sold. Estimated return rate = sum(row return rate × units sold) / total units sold, assuming each row rate uses units sold as its denominator. Rates in the sample are rounded, so this does not reconstruct exact returned-unit counts. Product colors stay fixed when filtering. Currency is assumed USD for this demo.'),
    'monitoring': dict(
        file='monitoring_api.csv', title='API performance', eyebrow='Engineering / Service observability',
        description='Inspect latency, locate slow endpoints, and compare traffic patterns.',
        analysis='Latency & traffic', days=7, ranges=[['All 30 days', 0], ['Last 7 days', 7], ['Last 24 hours', 1]],
        filters=[dict(key='endpoint', label='Endpoint')],
        metrics=[['p95', 'Mean hourly P95', 'ms', 'Mean of endpoint-hour P95s', 'lower'], ['errors', 'Estimated error rate', 'percent', 'Weighted by QPS', 'lower'], ['qps', 'Mean total QPS', 'integer', 'Sum endpoints, then mean hours', 'neutral'], ['peak', 'Peak hourly P95', 'ms', 'Maximum observed endpoint-hour', 'lower']],
        charts=[['Hourly P95 by endpoint', 'Per-hour P95 in ms · zoom for detail'], ['Where latency concentrates', 'Mean hourly P95 by day and endpoint · ms'], ['Total request throughput', 'Sum of endpoint QPS at each hour']],
        columns=[['timestamp', 'Timestamp', 'text'], ['endpoint', 'Endpoint', 'text'], ['p50_latency_ms', 'Hourly P50 (ms)', 'integer'], ['p95_latency_ms', 'Hourly P95 (ms)', 'integer'], ['p99_latency_ms', 'Hourly P99 (ms)', 'integer'], ['error_rate', 'Error rate', 'percent'], ['qps', 'QPS', 'integer'], ['error_type', 'Error type', 'text']],
        numeric=['p50_latency_ms', 'p95_latency_ms', 'p99_latency_ms', 'error_rate', 'qps'],
        methodology='Each row is one endpoint-hour. Mean hourly P95 averages the supplied P95 values; it is not a pooled request percentile. Peak hourly P95 is the maximum supplied hourly P95. Total QPS sums endpoints at each timestamp before averaging across timestamps. Estimated error rate is QPS-weighted, assuming complete, equally long hourly buckets and QPS representative of each bucket. Missing endpoint-hours would make total traffic partial. The 300 ms reference is illustrative, not an agreed SLO. Timestamps have no timezone in the CSV and are displayed as recorded.'),
    'survey': dict(
        file='survey_nps.csv', title='Customer sentiment', eyebrow='Research / Voice of customer',
        description='Read the score distribution, compare groups, and follow sentiment over time.',
        analysis='The shape of feedback', days=0, ranges=[],
        filters=[dict(key='department', label='Department'), dict(key='channel', label='Channel')],
        metrics=[['nps', 'Net promoter score', 'score', 'Promoters % − detractors %', 'higher'], ['responses', 'Valid NPS responses', 'integer', 'Scores from 0 to 10', 'neutral'], ['satisfaction', 'Mean satisfaction', 'rating', 'On a 1–5 scale', 'higher'], ['recommend', 'Would recommend', 'percent', 'Yes ÷ valid yes/no responses', 'higher']],
        charts=[['NPS score distribution', 'Response count · 0–6 detractor, 7–8 passive, 9–10 promoter'], ['NPS by department', 'Points on a −100 to +100 scale · sample sizes shown'], ['Weekly sentiment', 'NPS points · Monday-start weeks']],
        columns=[['response_id', 'Response ID', 'integer'], ['date', 'Date', 'text'], ['department', 'Department', 'text'], ['channel', 'Channel', 'text'], ['nps_score', 'NPS score', 'integer'], ['satisfaction', 'Satisfaction', 'integer'], ['would_recommend', 'Recommend', 'text'], ['comment_length', 'Comment length', 'integer']],
        numeric=['response_id', 'nps_score', 'satisfaction', 'comment_length'],
        methodology='NPS = 100 × (promoters − detractors) / valid responses. Promoters score 9–10; passives 7–8; detractors 0–6. Invalid or missing scores are excluded from the NPS denominator. Scores stay unrounded until display. NPS uses points, not percent. Mean satisfaction uses the 1–5 scale. Recommendation rate uses valid yes/no responses. Weekly buckets begin Monday using calendar dates; boundary weeks may be partial. Sample size accompanies comparisons; descriptive differences do not establish statistical significance.'),
}


def safe_json(value):
    """Prevent data strings from closing an inline script element."""
    return json.dumps(value, ensure_ascii=False, allow_nan=False, separators=(',', ':')).replace('&', '\\u0026').replace('<', '\\u003c').replace('>', '\\u003e').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')


def build(kind):
    config = dict(CONFIGS[kind], kind=kind)
    path = ROOT / 'assets' / 'sample_data' / config['file']
    with path.open(encoding='utf-8-sig', newline='') as stream:
        reader = csv.DictReader(stream)
        columns = reader.fieldnames
        rows = []
        for record in reader:
            for key in config['numeric']:
                value = record[key].strip()
                record[key] = float(value) if value else None
                if record[key] is not None and record[key].is_integer():
                    record[key] = int(record[key])
            rows.append([record[key] for key in columns])
    replacements = {
        '__TITLE__': html.escape(config['title']), '__KIND__': kind,
        '__DATA__': safe_json(dict(config=config, columns=columns, rows=rows)),
        '__CSS__': (SOURCE / 'dashboard.css').read_text(),
        '__MODEL__': (SOURCE / 'model.js').read_text(),
        '__APP__': (SOURCE / 'dashboard.js').read_text(),
    }
    output = (SOURCE / 'dashboard.html').read_text()
    for key, value in replacements.items():
        output = output.replace(key, value)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if committed demos differ from their sources.')
    args = parser.parse_args()
    stale = []
    for kind in CONFIGS:
        output = build(kind)
        target = ROOT / 'assets' / f'demo_{kind}.html'
        if args.check:
            if not target.exists() or target.read_text() != output:
                stale.append(str(target.relative_to(ROOT)))
        else:
            target.write_text(output)
            print(f'{target.relative_to(ROOT)}: {len(output.encode()):,} bytes')
    if stale:
        parser.exit(1, 'Rebuild stale demos: ' + ', '.join(stale) + '\n')
    if args.check:
        print('All four demos match their CSVs and source files.')


if __name__ == '__main__':
    main()
