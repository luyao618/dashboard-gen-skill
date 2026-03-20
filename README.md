# CSV Dashboard Generator

An AI skill that transforms CSV data files into standalone, interactive HTML dashboards — no build tools, no dependencies, just open in a browser.

## What It Does

Give your AI agent a CSV file, and it generates a **single-file HTML dashboard** with:

- **KPI cards** with animated counters, sparklines, and trend indicators
- **Interactive ECharts visualizations** — line charts, bar charts, donut charts, heatmaps, stacked areas
- **Sortable, searchable data tables** with pagination and CSV export
- **Dark / Light mode** toggle with full theme persistence
- **Cross-chart interactions** — click a table row to highlight data points, click a donut slice to focus a stacked chart
- **Responsive layout** that works on desktop and tablet

The output is a self-contained `.html` file (all data embedded as JSON, all CSS/JS inline). Share it via email, Slack, or host it anywhere — recipients just open it in a browser.

## Features

| Feature | Details |
|---|---|
| Single-file output | All CSS, JS, and data inline — only ECharts & Font Awesome loaded via CDN |
| Dual theme | Light and dark mode with CSS variables, auto-saved to localStorage |
| KPI cards | Colored accent border, icon header, countUp animation, skeleton loading |
| ECharts 5.5.1 | Line, bar, donut, heatmap, stacked area, dual Y-axis, sparklines |
| DataZoom | Scroll zoom + slider on time-series charts |
| Rolling averages | 7-day dashed overlay lines on trend charts |
| Chart linking | Donut click highlights stacked chart; table row click adds markLine |
| Data table | Column sorting, live search, CSV export, pagination (15 rows/page) |
| Conditional formatting | Heat-colored backgrounds on numeric table cells |
| Responsive | Graceful layout at 1280px, 1024px, and 640px breakpoints |
| File size | Under 200KB per dashboard |

## Demo Dashboards

Four production-quality demos are included, each tailored to a different data pattern:

| Demo | Data Pattern | File |
|---|---|---|
| E-Commerce Sales | Daily time series + categories | `assets/demo_timeseries.html` |
| Product Comparison | Regions x products x months | `assets/demo_comparison.html` |
| API Monitoring | Performance metrics + thresholds | `assets/demo_monitoring.html` |
| NPS Survey | Scores + departments + channels | `assets/demo_survey.html` |

Open any demo directly in your browser to see the result. Sample CSV data is in `assets/sample_data/`.

## Project Structure

```
csv-dashboard-generator/
├── SKILL.md                        # AI skill instructions (5-step workflow)
├── README.md                       # This file
├── references/
│   └── design-reference.md         # Complete design system specification
└── assets/
    ├── demo_timeseries.html        # Demo: time-series dashboard
    ├── demo_comparison.html        # Demo: comparison dashboard
    ├── demo_monitoring.html        # Demo: monitoring dashboard
    ├── demo_survey.html            # Demo: survey/NPS dashboard
    └── sample_data/
        ├── timeseries_sales.csv    # Sample data for timeseries demo
        ├── comparison_products.csv # Sample data for comparison demo
        ├── monitoring_api.csv      # Sample data for monitoring demo
        └── survey_nps.csv          # Sample data for survey demo
```

| Directory | Purpose |
|---|---|
| `SKILL.md` | The AI reads this to understand the 5-step workflow: data discovery, user interview, metric computation, HTML generation, validation |
| `references/` | Detailed design system docs — color palette, CSS variables, chart patterns, interaction specs. Loaded by the AI on demand |
| `assets/` | Demo HTML dashboards (used as templates) and sample CSV data |

## How to Use

### As an AI Skill

Install this as a skill in your AI coding agent, then:

```
User: I have a CSV at data/sales.csv — create a dashboard from it
```

The AI will:
1. Read and analyze the CSV structure
2. Ask what KPIs and charts you want (with smart defaults)
3. Compute metrics and aggregations
4. Generate a standalone HTML dashboard
5. Report the file path and size

### Viewing Demos

```bash
# Open a demo directly
open assets/demo_timeseries.html

# Or serve locally
python3 -m http.server 8000
# Then visit http://localhost:8000/assets/demo_timeseries.html
```

## Design System

- **Typography**: Inter (Google Fonts)
- **Icons**: Font Awesome 6.5.1
- **Charts**: ECharts 5.5.1
- **Color palette**: Tailwind CSS 400-level (soft, eye-friendly)
  - Primary series: Indigo `#818cf8`, Amber `#fbbf24`, Emerald `#34d399`, Rose `#fb7185`
  - 20 total series colors for multi-series charts
  - Status colors: Success `#4ade80`, Warning `#fbbf24`, Danger `#f87171`

Full design specification in [`references/design-reference.md`](references/design-reference.md).

## License

MIT
