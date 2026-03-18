---
name: csv-dashboard-generator
description: |
  Generates standalone HTML dashboards from CSV data files.
  Uses ECharts for visualizations with a professional design system
  featuring dark/light mode, KPI cards, interactive charts, and sortable tables.
  Output is a single HTML file that opens directly in a browser — no build tools needed.
triggers:
  - dashboard
  - csv dashboard
  - generate dashboard
  - visualize csv
  - data visualization
  - create chart
  - html report
  - csv to html
  - data dashboard
  - turn csv into dashboard
---

# CSV Dashboard Generator

> Generate standalone HTML dashboards from CSV data files with professional-grade visualizations.

## When to Use This Skill

Activate this skill when the user:

- Provides a CSV file and wants a dashboard or visualization
- Asks to "visualize data", "create charts", or "generate a report"
- Wants to turn a spreadsheet or CSV into an interactive dashboard
- Asks for an HTML report with charts from their data
- Mentions "csv dashboard", "data dashboard", or similar phrases

## Workflow

Follow these 5 steps in order. Do NOT skip steps.

### Step 1: Data Discovery

Read the CSV file and analyze its structure.

1. **Read the file** using the Read tool (first 100 rows + full column list)
2. **Identify column types**:
   - **Date/time**: columns with date patterns (YYYY-MM-DD, timestamps, month names)
   - **Numeric**: columns with numbers (integers, floats, percentages)
   - **Categorical**: columns with repeated string values (< 20 unique values)
   - **Text**: columns with free-form text (> 20 unique values, long strings)
3. **Compute basic stats** for each numeric column: min, max, mean, count of non-null
4. **Count unique values** for categorical columns
5. **Report findings** to the user in a clear summary:
   - Total rows and columns
   - Column names with detected types
   - Date range (if date column exists)
   - Key numeric ranges
   - Categorical value lists

### Step 2: User Interview

Ask the user targeted questions to define the dashboard. Suggest defaults based on data patterns.

**Questions to ask:**

1. **KPIs**: "Which columns should be highlighted as KPI cards? I suggest: [list top 3-4 numeric columns]"
2. **Metric computation**: "How should each KPI be computed? (sum, average, latest value, rate)"
3. **Chart preferences**: "What charts would you like? Based on your data, I recommend:"
   - Has date column → line/area charts for trends
   - Has categories → bar charts for comparison, donut for distribution
   - Has scores/ratings → distribution charts, horizontal bars for ranking
   - Has performance metrics → threshold-colored KPIs, multi-line trends
4. **Grouping**: "Should data be grouped by [categorical column]?"
5. **Filters**: "Should I add filter controls for [categorical columns] or date ranges?"
6. **Layout suggestion**: Based on data characteristics, recommend one of:

| Data Pattern | Recommended Layout | Demo Reference |
|---|---|---|
| Date + numeric metrics | Time series dashboard | `demos/demo_timeseries.html` |
| Category + numeric values | Comparison dashboard | `demos/demo_comparison.html` |
| Timestamp + performance metrics | Monitoring dashboard | `demos/demo_monitoring.html` |
| Rating/score + categories | Survey/rating dashboard | `demos/demo_survey.html` |

### Step 3: Metric Computation

Process the full CSV data and prepare it for embedding.

1. **Read the complete CSV file** (all rows)
2. **Compute KPI values** based on user's choices (sums, averages, rates, etc.)
3. **Compute chart data**:
   - Time series: aggregate by date (daily/weekly/monthly)
   - Comparisons: group by category
   - Distributions: count by bins or values
   - Trends: compute period-over-period changes
4. **Handle large datasets** (> 2000 rows):
   - Aggregate data before embedding (daily/weekly rollups)
   - Keep detail table to reasonable size (show top 200 rows or paginate)
   - Embed aggregated data as JSON, not raw CSV
5. **Format data as JSON** arrays ready for embedding in HTML

### Step 4: HTML Generation

Generate the complete standalone HTML file. **Read the design reference first.**

1. **Read `docs/design-reference.md`** for the complete design system
2. **Select the closest demo** as a structural reference:
   - `demos/demo_timeseries.html` — for time-based data
   - `demos/demo_comparison.html` — for categorical comparisons
   - `demos/demo_monitoring.html` — for performance/health metrics
   - `demos/demo_survey.html` — for ratings/scores/surveys
3. **Generate the HTML file** with:

#### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Dashboard Title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>/* All CSS inline — see design reference */</style>
</head>
<body>
  <div class="dashboard-container">
    <!-- Header with title + filters -->
    <!-- KPI cards row -->
    <!-- Chart sections -->
    <!-- Data table -->
  </div>
  <button class="theme-toggle" onclick="toggleTheme()">
    <i class="fas fa-moon"></i>
  </button>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
  <script>/* All JS inline — data + logic */</script>
</body>
</html>
```

#### Required CSS (from design-reference.md)

Include these CSS sections in the `<style>` block:
- **CSS variables**: both light mode (`:root`) and dark mode (`:root[data-theme="dark"]`)
- **Typography**: Inter font family, heading/body/label sizes
- **Layout**: `.dashboard-container`, `.dashboard-header`, `.kpi-row`, `.chart-row`
- **KPI cards**: `.kpi-card`, `.kpi-label`, `.kpi-value`, `.kpi-change`, `.kpi-sparkline`
- **Chart cards**: `.chart-card`, `.chart-card-title`, `.chart-container`
- **Filter controls**: `.filter-bar`, `.filter-btn`, `.filter-select`
- **Data table**: `.data-table-wrapper`, `.data-table`, th/td styles, sort icons
- **Theme toggle**: `.theme-toggle` fixed position button
- **Status badges**: `.badge-success`, `.badge-warning`, `.badge-danger`
- **Responsive**: media queries for 1024px and 640px breakpoints

#### Required JavaScript

Include these JS sections in the `<script>` block:
- **Embedded data**: `const DATA = [...]` with pre-processed JSON
- **Color constants**: `SERIES_COLORS` array (20 colors)
- **Theme functions**: `initTheme()`, `toggleTheme()`, `getChartThemeColors()`
- **Chart functions**: one init+render function per chart
- **MutationObserver**: auto-update all charts on theme change
- **Filter functions**: update KPIs, charts, and table on filter change
- **Table sorting**: `sortTable()` with ascending/descending toggle
- **Initialization**: call all render functions on page load

#### Design Rules (MUST follow)

1. **No hardcoded colors** — use CSS variables or `SERIES_COLORS` / `STATUS_COLORS` constants
2. **All charts theme-aware** — use `getChartThemeColors()` and re-render on theme change
3. **ECharts 5.5.1** — do not use any other version
4. **Font Awesome 6.5.1** — do not use any other version
5. **Single file** — all CSS and JS inline (except CDN links)
6. **Data as JSON** — no external data files
7. **File size < 200KB** — aggregate data if CSV is large
8. **No console errors** — clean JavaScript
9. **Responsive** — no horizontal scroll on 1280px+ screens

### Step 5: Validation

After generating the HTML file:

1. **Confirm the file was created** — report the file path and size
2. **Suggest opening in browser** — "Open this file in your browser to verify the dashboard"
3. **Offer adjustments** — "Would you like me to adjust any charts, colors, or layout?"

## Design Specification Summary

> Full details in `docs/design-reference.md`

### CSS Variables

| Variable | Light | Dark |
|---|---|---|
| `--bg-primary` | `#f4f6f9` | `#0f172a` |
| `--bg-card` | `#ffffff` | `#1e293b` |
| `--text-primary` | `#1e293b` | `#f8fafc` |
| `--text-secondary` | `#64748b` | `#cbd5e1` |
| `--accent` | `#4f6ef7` | `#4f6ef7` |
| `--border` | `#e2e8f0` | `#475569` |
| `--success` | `#22c55e` | `#22c55e` |
| `--warning` | `#f59e0b` | `#f59e0b` |
| `--danger` | `#ef4444` | `#ef4444` |

### Chart Series Colors

```javascript
const SERIES_COLORS = [
  '#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#319795',
  '#3182CE', '#5A67D8', '#805AD5', '#D53F8C', '#718096',
  '#C05621', '#2C7A7B', '#2B6CB0', '#6B46C1', '#B7791F',
  '#2D3748', '#4A5568', '#B83280', '#276749', '#1A365D',
];
```

### Chart Types and When to Use

| Chart Type | Use When | ECharts Pattern |
|---|---|---|
| Sparkline | Mini trend in KPI cards | `type: 'line'`, no axis, 40px height |
| Multi-series line | Trend comparison over time | `type: 'line'`, smooth, dual Y-axis optional |
| Stacked area | Part-of-whole trends | `type: 'line'`, stack + areaStyle |
| Donut/pie | Distribution breakdown | `type: 'pie'`, radius ['40%', '70%'] |
| Horizontal bar | Top-N ranking | `type: 'bar'`, category on Y-axis, inverse |
| Grouped bar | Category comparison | `type: 'bar'`, multiple series same X-axis |
| Score distribution | Rating/score frequency | `type: 'bar'`, custom colors per bar |

### Interactive Features

| Feature | Implementation |
|---|---|
| Dark mode | `data-theme` attribute + CSS variables + localStorage |
| Date range filter | Button group, filters all components |
| Dropdown filter | `<select>` element, filters all components |
| Table sorting | Click column headers, toggle asc/desc |
| Chart resize | `window.addEventListener('resize', chart.resize)` |

## Demo References

| # | Demo | Data Pattern | File |
|---|---|---|---|
| 1 | E-Commerce Sales | Daily data + categories | `demos/demo_timeseries.html` |
| 2 | Product Comparison | Regions x products x months | `demos/demo_comparison.html` |
| 3 | API Monitoring | Hourly metrics + thresholds | `demos/demo_monitoring.html` |
| 4 | NPS Survey | Scores + departments + channels | `demos/demo_survey.html` |

When generating a new dashboard, **read the closest demo file** to understand the exact HTML structure, JavaScript patterns, and styling conventions. Use it as a template — adapt the data, charts, and KPIs but keep the same code patterns and design system.

## Example Usage

**User**: "I have a CSV file at `data/monthly_revenue.csv` — can you create a dashboard from it?"

**AI workflow**:
1. Read `data/monthly_revenue.csv` → discover columns: month, product_line, revenue, units, profit_margin
2. Ask: "I found 5 columns. I recommend: Revenue and Units as KPI cards, a line chart for monthly trend, a bar chart for product comparison. Sound good?"
3. User confirms → compute totals, monthly aggregates, product breakdowns
4. Read `docs/design-reference.md` and `demos/demo_timeseries.html` as references
5. Generate `data/monthly_revenue_dashboard.html`
6. Report: "Dashboard created at `data/monthly_revenue_dashboard.html` (45KB). Open it in your browser to see the result."
