# Design Reference — CSV Dashboard Generator

> Complete CSS + ECharts design system for generating consistent, professional dashboards.
> This document is the single source of truth — all generated dashboards MUST follow these patterns.

---

## 1. CDN Dependencies

```html
<!-- ECharts -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Google Fonts: Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 2. CSS Variable System

### 2.1 Light Mode (Default)

```css
:root {
  /* Backgrounds */
  --bg-primary: #f4f6f9;
  --bg-card: #ffffff;

  /* Text */
  --text-primary: #1e293b;
  --text-secondary: #64748b;

  /* Accent */
  --accent: #4f6ef7;
  --accent-light: #e8ecff;
  --accent-dark: #3b52c7;

  /* Status colors */
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #f87171;
  --info: #60a5fa;

  /* Borders & Surfaces */
  --border: #e2e8f0;
  --radius: 10px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08);
  --shadow-lg: 0 10px 30px rgba(0,0,0,.1);

  /* Transitions */
  --transition: .2s ease;
}
```

### 2.2 Dark Mode

```css
:root[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-card: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --accent-light: #1e3a5f;
  --border: #475569;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,.4);
  --shadow-lg: 0 10px 30px rgba(0,0,0,.5);
}
```

> **Note**: `--accent`, `--success`, `--warning`, `--danger`, `--info` remain the same in dark mode.
> The dark theme only overrides backgrounds, text, borders, and shadows.

---

## 3. Typography

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings */
h1 { font-size: 24px; font-weight: 700; color: var(--text-primary); }
h2 { font-size: 18px; font-weight: 700; color: var(--text-primary); }
h3 { font-size: 14px; font-weight: 600; color: var(--text-primary); }

/* Body */
body { font-size: 14px; font-weight: 400; line-height: 1.5; color: var(--text-primary); }

/* Labels & Captions */
.label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.caption { font-size: 13px; font-weight: 500; color: var(--text-secondary); }

/* Small text */
.small { font-size: 11px; }
```

---

## 4. Layout Patterns

### 4.1 Page Structure

```css
body {
  margin: 0;
  padding: 20px 24px;
  background: var(--bg-primary);
  min-height: 100vh;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
```

### 4.2 Header

```css
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.dashboard-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}
```

```html
<div class="dashboard-header">
  <div>
    <h1 class="dashboard-title">{Title}</h1>
    <p class="dashboard-subtitle" id="dashboard-subtitle">Loading data...</p>
  </div>
  <div class="filter-bar"><!-- filter groups --></div>
</div>
```

### 4.3 KPI Card Grid

```css
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

/* For 3 cards: repeat(3, 1fr)
   For 5 cards: repeat(5, 1fr) */
```

### 4.4 Chart Row (2-column)

```css
.chart-row {
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
}

.chart-card {
  flex: 1;
  min-width: 0;
}

/* For unequal columns: */
.chart-card.wide { flex: 2; }
.chart-card.narrow { flex: 1; }
```

### 4.5 Full-width Section

```css
.full-width {
  width: 100%;
  margin-bottom: 20px;
}
```

---

## 5. Component CSS

### 5.1 KPI Card

Each KPI card has a **colored left border**, a **header row with icon**, and an **animated hover effect**.

```css
.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
  border-left: 4px solid var(--kpi-color, var(--accent));
}

/* Per-card accent colors (matches SERIES_COLORS[0-3]) */
.kpi-card:nth-child(1) { --kpi-color: #818cf8; }  /* Indigo */
.kpi-card:nth-child(2) { --kpi-color: #fbbf24; }  /* Amber */
.kpi-card:nth-child(3) { --kpi-color: #34d399; }  /* Emerald */
.kpi-card:nth-child(4) { --kpi-color: #fb7185; }  /* Rose */

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(129, 140, 248, 0.15);
}
```

#### KPI Header with Icon

```css
.kpi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.kpi-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
  background: var(--kpi-color, var(--accent));
  flex-shrink: 0;
}
```

```html
<!-- KPI card HTML structure -->
<div class="kpi-card">
  <div class="kpi-header">
    <div class="kpi-icon"><i class="fas fa-dollar-sign"></i></div>
    <div class="kpi-label">Total Revenue <i class="fas fa-info-circle kpi-info" title="Total revenue across all categories"></i></div>
  </div>
  <div class="kpi-value" id="kpi-revenue">
    <span class="skeleton" style="width:120px;height:28px;">&nbsp;</span>
  </div>
  <div class="kpi-change" id="kpi-revenue-change">
    <span class="skeleton" style="width:140px;height:14px;">&nbsp;</span>
  </div>
  <div class="kpi-sparkline" id="spark-revenue"></div>
</div>
```

#### KPI Info Tooltip

```css
.kpi-info {
  opacity: 0.4;
  font-size: 10px;
  margin-left: 4px;
  cursor: help;
}
.kpi-info:hover { opacity: 0.8; }
```

#### KPI Label, Value, Change, Sparkline

```css
.kpi-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.kpi-change {
  font-size: 12px;
  font-weight: 600;
}

.kpi-change.positive { color: var(--success); }
.kpi-change.negative { color: var(--danger); }

.kpi-sparkline {
  width: 100%;
  height: 40px;
  margin-top: 8px;
}
```

### 5.2 Chart Card

```css
.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition);
}

.chart-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.chart-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.chart-container {
  width: 100%;
  height: 300px;
}
```

### 5.3 Filter Bar (with Groups and Category Buttons)

Filter bars now use **filter groups** with labels and a **divider** between sections.
Time-range buttons use class `.time-btn`, category buttons use `.cat-btn` — this prevents
toggling conflicts between the two filter dimensions.

```css
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-group-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 2px;
}

.filter-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
  margin: 0 8px;
}

.filter-btn {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}

.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

/* Dropdown filter */
.filter-select {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
}
```

```html
<!-- Filter bar HTML structure -->
<div class="filter-bar">
  <div class="filter-group">
    <span class="filter-group-label">Period</span>
    <button class="filter-btn time-btn" onclick="setDateRange(7, this)">7d</button>
    <button class="filter-btn time-btn active" onclick="setDateRange(30, this)">30d</button>
    <button class="filter-btn time-btn" onclick="setDateRange(90, this)">90d</button>
    <button class="filter-btn time-btn" onclick="setDateRange(365, this)">All</button>
  </div>
  <div class="filter-divider"></div>
  <div class="filter-group">
    <span class="filter-group-label">Category</span>
    <button class="filter-btn cat-btn active" onclick="setCategoryFilter('all', this)">All</button>
    <button class="filter-btn cat-btn" onclick="setCategoryFilter('Electronics', this)">Electronics</button>
    <!-- ... more categories ... -->
  </div>
</div>
```

### 5.4 Data Table (with Toolbar, Search, Export, Pagination)

Tables now include a **toolbar** (title + search + export), **row click highlighting**,
**conditional formatting** (heat colors), and **pagination** (15 rows per page).

```css
.data-table-wrapper {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

/* ── Table toolbar ── */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.table-search {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition);
  width: 200px;
}

.table-search:focus {
  border-color: var(--accent);
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* ── Table styles ── */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.data-table th:hover {
  color: var(--accent);
}

.data-table th .sort-icon {
  margin-left: 4px;
  font-size: 10px;
  opacity: 0.4;
}

.data-table th.sorted .sort-icon {
  opacity: 1;
  color: var(--accent);
}

.data-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}

/* Row interaction */
.data-table tbody tr {
  cursor: pointer;
  transition: background var(--transition);
}

.data-table tbody tr:hover {
  background: var(--accent-light);
}

.data-table tbody tr.row-selected {
  background: var(--accent-light) !important;
}

/* ── Pagination ── */
.table-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.table-pagination button {
  padding: 4px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition);
}

.table-pagination button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.table-pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

```html
<!-- Table HTML structure -->
<div class="data-table-wrapper full-width">
  <div class="table-toolbar">
    <div class="chart-card-title">Daily Data</div>
    <div class="table-actions">
      <input type="text" placeholder="Search..." class="table-search" oninput="filterTableSearch(this.value)">
      <button class="filter-btn" onclick="exportCSV()"><i class="fas fa-download"></i> Export</button>
    </div>
  </div>
  <table class="data-table" id="data-table">
    <thead><tr>
      <th onclick="sortTable(0)">Date <i class="sort-icon fas fa-sort"></i></th>
      <!-- more columns -->
    </tr></thead>
    <tbody></tbody>
  </table>
  <div class="table-pagination" id="table-pagination"></div>
</div>
```

### 5.5 Theme Toggle Button

```css
.theme-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  z-index: 1000;
}

.theme-toggle:hover {
  box-shadow: var(--shadow-lg);
  transform: scale(1.05);
}
```

### 5.6 Status Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.badge-success { background: rgba(74,222,128,0.1); color: #16a34a; }
.badge-warning { background: rgba(251,191,36,0.1); color: #d97706; }
.badge-danger  { background: rgba(248,113,113,0.1);  color: #dc2626; }
.badge-info    { background: rgba(96,165,250,0.1);  color: #2563eb; }
```

### 5.7 Top Accent Bar

A thin gradient bar fixed at the top of the page, using the primary palette colors:

```css
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #818cf8, #4ade80, #fbbf24, #f87171);
  z-index: 9999;
}
```

### 5.8 Dashboard Subtitle

An auto-populated subtitle below the dashboard title showing data range and active filters:

```css
.dashboard-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}
```

```html
<div>
  <h1 class="dashboard-title">Dashboard Title</h1>
  <p class="dashboard-subtitle" id="dashboard-subtitle">Loading data...</p>
</div>
```

### 5.9 Skeleton Loading Animation

Show placeholder shimmer effects while data loads. Used inside KPI value and change elements.

```css
.skeleton {
  background: linear-gradient(90deg, var(--border) 25%, var(--bg-primary) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  display: inline-block;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

```html
<!-- Usage: skeleton placeholders replaced by JS after data loads -->
<div class="kpi-value" id="kpi-revenue">
  <span class="skeleton" style="width:120px;height:28px;">&nbsp;</span>
</div>
```

---

## 6. Color Palettes

### 6.1 Chart Series Colors (up to 20)

Use these for multi-series charts (lines, bars, pie slices). The palette starts with
indigo, amber, emerald, and rose — a modern feel suited to business dashboards.

```javascript
const SERIES_COLORS = [
  '#818cf8', // Indigo
  '#fbbf24', // Amber
  '#34d399', // Emerald
  '#fb7185', // Rose
  '#60a5fa', '#a78bfa', '#f472b6', '#2dd4bf',
  '#fb923c', '#22d3ee', '#a3e635', '#c084fc',
  '#f87171', '#38bdf8', '#facc15', '#e879f9',
  '#4ade80', '#94a3b8', '#fda4af', '#67e8f9',
];
```

> **Note**: The first 4 colors also serve as KPI card left-border accent colors
> (via `--kpi-color` on `.kpi-card:nth-child(n)`).

### 6.2 Status Colors

```javascript
const STATUS_COLORS = {
  good:    '#4ade80',   // green — within threshold
  warning: '#fbbf24',   // amber — approaching threshold
  danger:  '#f87171',   // red — exceeds threshold
  neutral: '#94a3b8',   // gray — no threshold defined
};
```

### 6.3 ECharts Theme Colors

```javascript
function getChartThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    textColor:      isDark ? '#cbd5e1' : '#64748b',
    axisLineColor:  isDark ? '#475569' : '#e2e8f0',
    splitLineColor: isDark ? 'rgba(71,85,105,0.4)' : '#f1f5f9',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
  };
}
```

### 6.4 Sparkline Colors

```javascript
// Light mode
const SPARKLINE_LIGHT = {
  lineColor: '#2d4a6e',
  areaColor: 'rgba(45,74,110,0.10)',
};

// Dark mode
const SPARKLINE_DARK = {
  lineColor: '#60a5fa',
  areaColor: 'rgba(96,165,250,0.15)',
};
```

---

## 7. ECharts Configuration Patterns

### 7.1 Common Setup

```javascript
// Initialize chart with auto-resize
function initChart(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return null;
  const chart = echarts.init(el);
  window.addEventListener('resize', () => chart.resize());
  return chart;
}

// Re-render all charts on theme change
function updateAllCharts() {
  // Call each chart's render function
  // Charts should read theme colors fresh on each render
}

// Theme change observer
const observer = new MutationObserver(() => updateAllCharts());
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme'],
});
```

### 7.2 Sparkline (Mini Chart in KPI Card)

```javascript
sparklineChart.setOption({
  animation: false,
  grid: { left: 0, right: 0, top: 2, bottom: 2 },
  xAxis: { type: 'category', show: false, data: dates },
  yAxis: { type: 'value', show: false },
  series: [{
    type: 'line',
    data: values,
    symbol: 'none',
    smooth: true,
    lineStyle: { color: sparklineColor, width: 2 },
    areaStyle: { color: sparklineAreaColor },
  }],
}, true);
```

### 7.3 Multi-series Line Chart

```javascript
const theme = getChartThemeColors();
lineChart.setOption({
  tooltip: {
    trigger: 'axis',
    backgroundColor: theme.backgroundColor,
    borderColor: theme.axisLineColor,
    textStyle: { color: theme.textColor },
  },
  legend: {
    top: 5,
    textStyle: { fontSize: 12, color: theme.textColor },
  },
  grid: { left: 55, right: 20, top: 36, bottom: 40 },
  xAxis: {
    type: 'category',
    data: dates,
    axisLabel: { rotate: 30, fontSize: 10, color: theme.textColor },
    axisLine: { lineStyle: { color: theme.axisLineColor } },
  },
  yAxis: {
    type: 'value',
    name: 'Value',
    nameTextStyle: { color: theme.textColor },
    axisLabel: { color: theme.textColor },
    splitLine: { lineStyle: { color: theme.splitLineColor } },
  },
  series: seriesData.map((s, i) => ({
    name: s.name,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,
    lineStyle: { width: 2 },
    itemStyle: { color: SERIES_COLORS[i] },
    data: s.values,
  })),
}, true);
```

### 7.4 Dual Y-Axis Line Chart

```javascript
dualChart.setOption({
  tooltip: { trigger: 'axis' },
  legend: { top: 5, textStyle: { color: theme.textColor } },
  grid: { left: 60, right: 60, top: 40, bottom: 40 },
  xAxis: {
    type: 'category',
    data: dates,
    axisLabel: { rotate: 30, fontSize: 10, color: theme.textColor },
  },
  yAxis: [
    {
      type: 'value', name: 'Left Metric',
      nameTextStyle: { color: theme.textColor },
      axisLabel: { color: theme.textColor },
      splitLine: { lineStyle: { color: theme.splitLineColor } },
    },
    {
      type: 'value', name: 'Right Metric',
      nameTextStyle: { color: theme.textColor },
      axisLabel: { color: theme.textColor },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: 'Left', type: 'line', yAxisIndex: 0,
      smooth: true, data: leftData,
      itemStyle: { color: SERIES_COLORS[0] },
    },
    {
      name: 'Right', type: 'line', yAxisIndex: 1,
      smooth: true, data: rightData,
      itemStyle: { color: SERIES_COLORS[1] },
    },
  ],
}, true);
```

### 7.5 Donut / Pie Chart

```javascript
donutChart.setOption({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { fontSize: 11, color: theme.textColor },
  },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['40%', '50%'],
    data: items.map((item, i) => ({
      name: item.name,
      value: item.value,
      itemStyle: { color: SERIES_COLORS[i] },
    })),
    label: {
      formatter: params => `${params.percent.toFixed(1)}%`,
      fontSize: 11,
      color: theme.textColor,
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 8,
        shadowColor: 'rgba(0,0,0,0.2)',
      },
    },
  }],
}, true);
```

### 7.6 Horizontal Bar Chart

```javascript
hbarChart.setOption({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: { left: 140, right: 50, top: 10, bottom: 30 },
  xAxis: {
    type: 'value',
    axisLabel: { color: theme.textColor },
    splitLine: { lineStyle: { color: theme.splitLineColor } },
  },
  yAxis: {
    type: 'category',
    data: labels,
    inverse: true,
    axisLabel: {
      fontSize: 11,
      width: 130,
      overflow: 'truncate',
      color: theme.textColor,
    },
  },
  series: [{
    type: 'bar',
    data: values.map((v, i) => ({
      value: v,
      itemStyle: { color: SERIES_COLORS[i] },
    })),
    barWidth: '60%',
    label: { show: true, position: 'right', fontSize: 10, color: theme.textColor },
  }],
}, true);
```

### 7.7 Grouped / Stacked Bar Chart

```javascript
groupedBarChart.setOption({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 5, textStyle: { color: theme.textColor } },
  grid: { left: 55, right: 20, top: 36, bottom: 40 },
  xAxis: {
    type: 'category',
    data: categories,
    axisLabel: { fontSize: 11, color: theme.textColor },
    axisLine: { lineStyle: { color: theme.axisLineColor } },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: theme.splitLineColor } },
    axisLabel: { color: theme.textColor },
  },
  series: groups.map((g, i) => ({
    name: g.name,
    type: 'bar',
    data: g.values,
    itemStyle: { color: SERIES_COLORS[i] },
    // For stacked: add stack: 'total'
  })),
}, true);
```

### 7.8 Stacked Area Chart

```javascript
areaChart.setOption({
  tooltip: { trigger: 'axis' },
  legend: { top: 5, textStyle: { color: theme.textColor } },
  grid: { left: 55, right: 20, top: 36, bottom: 40 },
  xAxis: {
    type: 'category',
    data: dates,
    boundaryGap: false,
    axisLabel: { rotate: 30, fontSize: 10, color: theme.textColor },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: theme.splitLineColor } },
    axisLabel: { color: theme.textColor },
  },
  series: seriesData.map((s, i) => ({
    name: s.name,
    type: 'line',
    stack: 'total',
    smooth: true,
    symbol: 'none',
    areaStyle: { opacity: 0.4 },
    lineStyle: { width: 2 },
    itemStyle: { color: SERIES_COLORS[i] },
    data: s.values,
  })),
}, true);
```

### 7.9 Gradient Area Fill

Use `echarts.graphic.LinearGradient` for a subtle fading area under line charts:

```javascript
{
  name: 'Revenue',
  type: 'line',
  smooth: true,
  symbol: 'circle',
  symbolSize: 4,
  lineStyle: { width: 2 },
  itemStyle: { color: SERIES_COLORS[0] },
  areaStyle: {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(129, 140, 248, 0.3)' },
      { offset: 1, color: 'rgba(129, 140, 248, 0.02)' },
    ]),
  },
  data: values,
}
```

> Match the gradient RGB to the series line color. Use `0.3` opacity at top, `0.02` at bottom.

### 7.10 DataZoom Slider

Add scroll zoom + a visual slider for time-series charts. Increase grid `bottom` to `60` to make room.

```javascript
dataZoom: [
  { type: 'inside', start: 0, end: 100 },
  {
    type: 'slider',
    bottom: 5,
    height: 20,
    start: 0,
    end: 100,
    borderColor: theme.axisLineColor,
    textStyle: { color: theme.textColor },
  },
],
grid: { left: 70, right: 70, top: 40, bottom: 60 },
```

### 7.11 Rolling Average Lines

Overlay a rolling 7-day (or N-day) average as a dashed line on trend charts.

```javascript
// Compute rolling average
function rollingAvg(arr, window) {
  return arr.map((_, i) => {
    if (i < window - 1) return null;
    let sum = 0;
    for (let j = i - window + 1; j <= i; j++) sum += arr[j];
    return Math.round(sum / window * 100) / 100;
  });
}

// Series config for rolling average overlay:
{
  name: 'Revenue (7d Avg)',
  type: 'line',
  smooth: true,
  symbol: 'none',
  lineStyle: { width: 2.5, color: '#fbbf24' },
  itemStyle: { color: '#fbbf24' },
  data: rollingAvg(revenueArr, 7),
}
```

**On stacked area charts**, rolling averages must use a **separate stack group** to avoid
being added to the stacked total. Use `stack: 'avg'` with `areaStyle: { opacity: 0 }`:

```javascript
// Per-category rolling average on stacked chart
CATEGORIES.forEach((cat, i) => {
  series.push({
    name: cat + ' (7d Avg)',
    type: 'line',
    stack: 'avg',            // separate from 'total' stack group
    smooth: true,
    symbol: 'none',
    lineStyle: { width: 2, type: 'dashed', color: SERIES_COLORS[i] },
    itemStyle: { color: SERIES_COLORS[i] },
    areaStyle: { opacity: 0 },  // transparent — no fill
    data: rollingAvg(catData, 7),
  });
});
```

### 7.12 Prior Period Comparison (Dashed Lines)

Show the prior half of the date range as a dashed overlay for comparison:

```javascript
const halfLen = Math.floor(data.length / 2);
const priorData = data.map((_, i) => {
  if (i < halfLen) return null;
  return data[i - halfLen] ? data[i - halfLen].revenue : null;
});

// Series config:
{
  name: 'Revenue (Prior Period)',
  type: 'line',
  smooth: true,
  symbol: 'none',
  lineStyle: { type: 'dashed', width: 1, color: '#cbd5e1' },
  itemStyle: { color: '#cbd5e1' },
  data: priorData,
}
```

### 7.13 Custom Tooltip with Color Dots

Use an HTML `formatter` function to show colored dot indicators next to each series:

```javascript
tooltip: {
  trigger: 'axis',
  backgroundColor: theme.backgroundColor,
  borderColor: theme.axisLineColor,
  textStyle: { color: theme.textColor },
  formatter: function(params) {
    let html = '<strong>' + params[0].axisValue + '</strong><br/>';
    params.forEach(p => {
      if (p.value == null) return;
      html += '<span style="display:inline-block;width:10px;height:10px;'
            + 'border-radius:50%;background:' + p.color
            + ';margin-right:6px;"></span>';
      html += p.seriesName + ': ' + formatValue(p.value) + '<br/>';
    });
    return html;
  },
},
```

### 7.14 markLine on Chart (Row Click Highlight)

Place a vertical marker line on a chart when a table row is clicked:

```javascript
chart.setOption({
  series: [{
    markLine: {
      silent: true,
      symbol: 'none',
      lineStyle: { color: '#fb7185', type: 'solid', width: 2 },
      label: { formatter: dateLabel, fontSize: 10 },
      data: [{ xAxis: dateValue }],
    },
  }],
});
```

---

## 8. Interactive Features

### 8.1 Dark Mode Toggle

```javascript
function initTheme() {
  const saved = localStorage.getItem('dashboard-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateToggleIcon();
}

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('dashboard-theme', next);
  updateToggleIcon();
}

function updateToggleIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}
```

### 8.2 Multi-Dimension Filtering (Date Range + Category)

Maintain separate state variables for each filter dimension. Use `.time-btn` and `.cat-btn`
classes to avoid toggling conflicts.

```javascript
let currentDays = 30;
let currentCategory = 'all';

function setDateRange(days, btn) {
  currentDays = days;
  document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAll();
}

function setCategoryFilter(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAll();
}

function filterData(days) {
  const dates = getUniqueDates(RAW_DATA);
  const maxDate = new Date(dates[dates.length - 1]);
  const cutoff = new Date(maxDate);
  cutoff.setDate(cutoff.getDate() - days + 1);
  let filtered = RAW_DATA.filter(r => new Date(r.date) >= cutoff);
  if (currentCategory !== 'all') {
    filtered = filtered.filter(r => r.category === currentCategory);
  }
  return filtered;
}

function renderAll() {
  const filtered = filterData(currentDays);
  renderKPIs(filtered);
  renderCharts(filtered);
  renderTable(filtered);
  // Update subtitle
}
```

### 8.3 CountUp Animation

Animate KPI values from 0 to their final value on load using `requestAnimationFrame`:

```javascript
function animateValue(el, end, formatter, duration = 800) {
  const start = 0;
  const range = end - start;
  const startTime = performance.now();
  function step(timestamp) {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = formatter(start + range * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Usage:
animateValue(document.getElementById('kpi-revenue'), totalRev, v => fmtCurrency(v));
```

### 8.4 Table Sorting (Data-Driven)

Sort the data array directly and re-render, rather than manipulating DOM rows:

```javascript
let sortState = { column: -1, direction: 1 };

function sortTable(columnIndex) {
  const fields = ['date', 'revenue', 'orders', 'aov', 'conv'];
  if (sortState.column === columnIndex) {
    sortState.direction *= -1;
  } else {
    sortState.column = columnIndex;
    sortState.direction = 1;
  }
  const field = fields[columnIndex];
  tableData.sort((a, b) => {
    const va = a[field], vb = b[field];
    if (typeof va === 'string') return sortState.direction * va.localeCompare(vb);
    return sortState.direction * (va - vb);
  });
  updateSortIcons(columnIndex);
  renderTablePage();
}

function updateSortIcons(activeCol) {
  document.querySelectorAll('.data-table th').forEach((th, i) => {
    th.classList.toggle('sorted', i === activeCol);
    const icon = th.querySelector('.sort-icon');
    if (icon) {
      icon.className = 'sort-icon fas ' +
        (i === activeCol
          ? (sortState.direction === 1 ? 'fa-sort-up' : 'fa-sort-down')
          : 'fa-sort');
    }
  });
}
```

### 8.5 Table Search

Filter table rows by a search query. Resets pagination to page 1.

```javascript
let tableSearchQuery = '';

function filterTableSearch(query) {
  tableSearchQuery = query;
  tablePage = 1;
  renderTablePage();
}

function getFilteredTableData() {
  if (!tableSearchQuery) return tableData;
  const q = tableSearchQuery.toLowerCase();
  return tableData.filter(d =>
    d.date.includes(q) ||
    fmtCurrency(d.revenue).toLowerCase().includes(q) ||
    String(d.orders).includes(q)
  );
}
```

### 8.6 CSV Export

Export the current (filtered) table data as a CSV file download:

```javascript
function exportCSV() {
  const data = getFilteredTableData();
  let csv = 'Date,Revenue,Orders,Avg Order Value,Conversion Rate\n';
  data.forEach(d => {
    csv += d.date + ',' + d.revenue.toFixed(2) + ',' + d.orders + ','
         + d.aov.toFixed(2) + ',' + d.conv.toFixed(2) + '%\n';
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dashboard_data.csv';
  a.click();
  URL.revokeObjectURL(url);
}
```

### 8.7 Table Pagination

Paginate the table at 15 rows per page with Prev/Next buttons:

```javascript
let tablePage = 1;
const PAGE_SIZE = 15;

function renderTablePage() {
  const data = getFilteredTableData();
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  if (tablePage > totalPages) tablePage = totalPages;
  const start = (tablePage - 1) * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);

  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';
  pageData.forEach(d => {
    // Build and append rows
  });

  // Render pagination controls
  const paginationEl = document.getElementById('table-pagination');
  if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
  paginationEl.innerHTML =
    '<button onclick="changePage(-1)"' + (tablePage <= 1 ? ' disabled' : '') + '>'
    + '<i class="fas fa-chevron-left"></i> Prev</button>'
    + '<span>Page ' + tablePage + ' of ' + totalPages + '</span>'
    + '<button onclick="changePage(1)"' + (tablePage >= totalPages ? ' disabled' : '') + '>'
    + 'Next <i class="fas fa-chevron-right"></i></button>';
}

function changePage(delta) {
  const data = getFilteredTableData();
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  tablePage = Math.max(1, Math.min(totalPages, tablePage + delta));
  renderTablePage();
}
```

### 8.8 Conditional Formatting (Heat Colors)

Apply a green background whose opacity scales with the value's position in the min-max range:

```javascript
const allValues = data.map(d => d.revenue);
const maxVal = Math.max(...allValues);
const minVal = Math.min(...allValues);
const range = maxVal - minVal || 1;

// Per row:
const normalized = (d.revenue - minVal) / range;
const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
const heatBg = isDark
  ? 'rgba(45, 212, 191, ' + (normalized * 0.25) + ')'
  : 'rgba(74, 222, 128, ' + (normalized * 0.2) + ')';

// Applied inline:
td.style.background = heatBg;
```

### 8.9 Chart Linking (Cross-Chart Interaction)

Click a donut slice to temporarily highlight the corresponding series in another chart:

```javascript
donutChart.on('click', function(params) {
  if (stackedChart) {
    const catIndex = CATEGORIES.indexOf(params.name);
    if (catIndex >= 0) {
      stackedChart.dispatchAction({ type: 'highlight', seriesIndex: catIndex });
      setTimeout(() => {
        stackedChart.dispatchAction({ type: 'downplay', seriesIndex: catIndex });
      }, 2000);
    }
  }
});
```

### 8.10 Table Row Click → markLine

Click a table row to place a vertical marker line on the trend chart and highlight the row:

```javascript
tr.addEventListener('click', function() {
  document.querySelectorAll('#data-table tbody tr').forEach(r => r.classList.remove('row-selected'));
  tr.classList.add('row-selected');
  if (trendChart) {
    trendChart.setOption({
      series: [{
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: '#fb7185', type: 'solid', width: 2 },
          label: { formatter: d.date, fontSize: 10 },
          data: [{ xAxis: formattedDate }],
        },
      }],
    });
  }
});
```

### 8.11 Dynamic Dashboard Subtitle

Auto-populate the subtitle with date range, last-updated timestamp, and active filter:

```javascript
function updateSubtitle(filtered) {
  const dates = getUniqueDates(filtered);
  if (dates.length === 0) return;
  const first = dates[0], last = dates[dates.length - 1];
  const now = new Date();
  const updated = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const catLabel = currentCategory === 'all' ? 'All Categories' : currentCategory;
  document.getElementById('dashboard-subtitle').textContent =
    'Last updated: ' + updated + ' · Data range: ' + first + ' – ' + last + ' · ' + catLabel;
}
```

### 8.12 Format Helpers

Compact currency, number, percentage, and date formatting utilities:

```javascript
function fmtCurrency(v) {
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
  return '$' + v.toFixed(0);
}

function fmtNumber(v) {
  return v.toLocaleString('en-US');
}

function fmtPct(v) {
  return v.toFixed(1) + '%';
}

function fmtDate(d) {
  const parts = d.split('-');
  return parts[1] + '/' + parts[2];
}
```

---

## 9. Responsive Considerations

```css
/* Tablet: stack KPI cards 2x2, charts single column */
@media (max-width: 1024px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-row {
    flex-direction: column;
  }
}

/* Mobile: single column, hide sparklines, wrap filters */
@media (max-width: 640px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
  body {
    padding: 12px;
  }
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .filter-bar {
    flex-wrap: wrap;
  }
  .filter-divider {
    display: none;
  }
  .kpi-sparkline {
    display: none;
  }
  .table-search {
    width: 100%;
  }
}
```

---

## 10. HTML Template Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Dashboard Title}</title>
  <!-- CDN links (see Section 1) -->
  <style>
    /* Accent bar: body::before (see Section 5.7) */
    /* CSS variables (see Section 2) */
    /* Skeleton animation (see Section 5.9) */
    /* Layout styles (see Section 4) */
    /* Component styles (see Section 5) */
    /* Responsive (see Section 9) */
  </style>
</head>
<body>
  <div class="dashboard-container">
    <!-- Header with subtitle -->
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">{Title}</h1>
        <p class="dashboard-subtitle" id="dashboard-subtitle">Loading data...</p>
      </div>
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-group-label">Period</span>
          <button class="filter-btn time-btn active" onclick="setDateRange(30, this)">30d</button>
          <!-- more time buttons -->
        </div>
        <div class="filter-divider"></div>
        <div class="filter-group">
          <span class="filter-group-label">Category</span>
          <button class="filter-btn cat-btn active" onclick="setCategoryFilter('all', this)">All</button>
          <!-- more category buttons -->
        </div>
      </div>
    </div>

    <!-- KPI Row (with icons, skeletons, sparklines) -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-header">
          <div class="kpi-icon"><i class="fas fa-dollar-sign"></i></div>
          <div class="kpi-label">Revenue <i class="fas fa-info-circle kpi-info" title="..."></i></div>
        </div>
        <div class="kpi-value" id="kpi-revenue">
          <span class="skeleton" style="width:120px;height:28px;">&nbsp;</span>
        </div>
        <div class="kpi-change" id="kpi-revenue-change">
          <span class="skeleton" style="width:140px;height:14px;">&nbsp;</span>
        </div>
        <div class="kpi-sparkline" id="spark-revenue"></div>
      </div>
      <!-- more kpi-card elements -->
    </div>

    <!-- Charts -->
    <div class="chart-row">
      <!-- chart-card elements with chart-container divs -->
    </div>

    <!-- Data Table with toolbar + pagination -->
    <div class="data-table-wrapper full-width">
      <div class="table-toolbar">
        <div class="chart-card-title">Data Table</div>
        <div class="table-actions">
          <input type="text" placeholder="Search..." class="table-search" oninput="filterTableSearch(this.value)">
          <button class="filter-btn" onclick="exportCSV()"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>
      <table class="data-table" id="data-table">
        <thead><tr>
          <th onclick="sortTable(0)">Column <i class="sort-icon fas fa-sort"></i></th>
          <!-- more columns -->
        </tr></thead>
        <tbody></tbody>
      </table>
      <div class="table-pagination" id="table-pagination"></div>
    </div>
  </div>

  <!-- Theme toggle (floating) -->
  <button class="theme-toggle" onclick="toggleTheme()">
    <i class="fas fa-moon"></i>
  </button>

  <!-- ECharts CDN -->
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
  <script>
    // Color constants (see Section 6)
    const SERIES_COLORS = [/* ... */];

    // Embedded data
    const RAW_DATA = [/* ... */];

    // State
    let currentDays = 30;
    let currentCategory = 'all';
    let tablePage = 1;
    const PAGE_SIZE = 15;
    let tableSearchQuery = '';

    // Format helpers (see Section 8.12)
    // Theme functions (see Section 8.1)
    // CountUp animation (see Section 8.3)
    // Filter functions (see Section 8.2)
    // Chart init and render functions (see Section 7)
    // Table: sorting, search, export, pagination (see Sections 8.4-8.7)
    // Chart linking & row click (see Sections 8.9-8.10)

    // Initialize
    initTheme();
    renderAll();
  </script>
</body>
</html>
```

---

## 11. Quality Rules

1. **No hardcoded colors** — always use CSS variables or JS constants from this reference
2. **All charts must be theme-aware** — read colors via `getChartThemeColors()` and re-render on theme change
3. **ECharts version must be 5.5.1** — do not use other versions
4. **Font Awesome version must be 6.5.1** — do not use other versions
5. **All styles inline** — no external CSS files; everything in `<style>` block
6. **All scripts inline** — no external JS files; everything in `<script>` block (except CDN)
7. **Data embedded as JSON** — no external data files; CSV data pre-computed and embedded
8. **File size < 200KB** — excluding CDN downloads
9. **No console errors** — test in browser DevTools before delivery
10. **Responsive** — must not have horizontal scroll on 1280px+ screens
11. **KPI cards must have** — colored left border, icon header, countUp animation, skeleton loading, sparklines
12. **Tables must have** — toolbar with search + CSV export, data-driven sorting, pagination (15 rows/page)
13. **Time-series charts must have** — DataZoom slider, gradient area fill, rolling average overlay
14. **Cross-chart interaction** — at least one linking pattern (donut→stacked highlight, row→markLine)
15. **Top accent gradient bar** — every dashboard must include `body::before` accent bar
16. **Dashboard subtitle** — auto-populated with data range, last updated, and active filter
