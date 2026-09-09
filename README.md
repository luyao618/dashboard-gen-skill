# CSV Dashboard Generator

An AI skill for turning CSV files into useful, interactive HTML dashboards. It guides the agent through understanding the data, choosing the right visual comparisons, computing reliable metrics, and verifying the result in a browser.

The output is one HTML file with embedded data, CSS, and application JavaScript. **Charts load ECharts 5.5.1 from a CDN**, so the default output requires internet access for charts. No build tools are needed to open a generated dashboard. Fully offline delivery is an optional adaptation that embeds the chart library with its license notices.

## What the skill emphasizes

- **An analytical hierarchy:** a clear question, scoped metrics, a prominent chart, supporting evidence, and inspectable records.
- **Correct metric semantics:** weighted rates, comparable date windows, explicit missing data, survey sample sizes, and honest percentile labels.
- **Purposeful visualization:** rankings for comparisons, lines for trends, fixed-scale heatmaps for patterns, and distributions for survey scores.
- **Consistent interaction:** coordinated filters, visible scope, a reset action, table-only search, numeric sorting, pagination, and export of all matching records.
- **Readable themes and responsive layouts:** stable category colors, system fonts, visible keyboard focus, semantic tables, and reduced motion support.
- **Verified delivery:** source reconciliation, browser interaction checks, desktop/mobile screenshots, and a working table when the chart CDN is unavailable.

The skill starts with a concise recommendation and asks for alignment when the analysis is open-ended. It proceeds directly when the user has already provided a clear brief or authorized the agent to decide.

## Try the examples

| Example | Main view | Analytical detail |
|---|---|---|
| [Sales performance](assets/demo_timeseries.html) | Daily revenue and category ranking | Equal prior windows; conversion from orders/visitors |
| [Product performance](assets/demo_comparison.html) | Product ranking and regional composition | Return rates weighted by units sold |
| [API performance](assets/demo_monitoring.html) | Hourly latency and a heatmap | Explicit hourly P95; QPS summed by timestamp |
| [Customer sentiment](assets/demo_survey.html) | Score distribution and group NPS | Valid-score denominator and visible sample sizes |

All four examples retain the complete source CSV, including the monitoring example's 2,880 endpoint-hours. File sizes are roughly **59–237 KB**; preserving useful detail takes priority over an arbitrary size ceiling. The examples are static sample datasets, not live services.

Open an HTML file directly, or serve the repository:

```bash
python3 -m http.server 8000
# http://localhost:8000/assets/demo_timeseries.html
```

Example prompts after installing this folder as `csv-dashboard-generator` in your agent's skills directory:

```text
Create a dashboard from data/sales.csv. Focus on revenue trends and category mix.

把这个 CSV 做成中文 dashboard，主要看错误率和延迟，你来决定布局。

Improve this existing dashboard. Keep the brand colors, verify its metrics,
and make the charts and filters usable on mobile.
```

## Project structure

```text
SKILL.md                          Entry point and generation workflow
references/
  data-semantics.md                Grain, rates, periods, missing data, NPS
  design-reference.md              Chart selection, visual system, accessibility
  runtime-patterns.md              Safe embedding, state, theme, chart lifecycle
  validation.md                    Data, interaction and rendering checks
assets/
  demo_*.html                     Ready-to-open standalone examples
  sample_data/*.csv                Source fixtures
  source/
    dashboard.html                Shared semantic page
    dashboard.css                 Tokens and responsive styles
    dashboard.js                  Interactions and four chart compositions
    model.js                      Pure metric/date/export functions
scripts/
  build_demos.py                  Rebuild examples from the known sample schemas
  check_browser.py                Browser regressions and screenshots
tests/
  model.test.cjs                  Numerical and state invariants
  test_build.py                  Complete CSV round-trip and safe JSON embedding
```

The demo compiler only understands the four included schemas. For an arbitrary CSV, the skill guides the agent to inspect the data and adapt a suitable example. It does not guess a metric's meaning from a column name alone.

## Develop and verify

Edit `assets/source/` for shared presentation or behavior, and `scripts/build_demos.py` for demo definitions. Rebuild the standalone outputs instead of editing their generated copies:

```bash
python3 scripts/build_demos.py
python3 scripts/build_demos.py --check
node --test tests/model.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
```

These checks use Python's standard library and Node's built-in test runner. They cover weighted metrics, missing data, complete comparison windows, NPS, date bucketing, CSV quoting/formula handling, safe JSON serialization, and full fixture preservation.

For browser validation, install `agent-browser` and its browser runtime, then run:

```bash
python3 scripts/check_browser.py
# Optional screenshot/download directory:
python3 scripts/check_browser.py --output /tmp/dashboard-previews
```

The check starts a temporary localhost server in an isolated browser session. It reconciles displayed KPIs against the CSVs, checks responsive layouts and themes, exercises filtering/search/sort/pagination/export, verifies file opening and CDN failure handling, and saves screenshots for visual inspection. The generated dashboards themselves do not require Python, Node, or agent-browser.

## License

MIT
