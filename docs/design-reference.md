# Design Reference — CSV Dashboard Generator

> Complete CSS + ECharts design system extracted from the Copilot Connectivity Kanban project.
> This document is the single source of truth for generating consistent, professional dashboards.

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
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;

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

```css
.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  box-shadow: var(--shadow-md);
}

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

### 5.3 Filter Bar

```css
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
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

### 5.4 Data Table

```css
.data-table-wrapper {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

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

.data-table tbody tr:hover {
  background: var(--accent-light);
}
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

.badge-success { background: rgba(34,197,94,0.1); color: #16a34a; }
.badge-warning { background: rgba(245,158,11,0.1); color: #d97706; }
.badge-danger  { background: rgba(239,68,68,0.1);  color: #dc2626; }
.badge-info    { background: rgba(59,130,246,0.1);  color: #2563eb; }
```

---

## 6. Color Palettes

### 6.1 Chart Series Colors (up to 20)

Use these for multi-series charts (lines, bars, pie slices):

```javascript
const SERIES_COLORS = [
  '#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#319795',
  '#3182CE', '#5A67D8', '#805AD5', '#D53F8C', '#718096',
  '#C05621', '#2C7A7B', '#2B6CB0', '#6B46C1', '#B7791F',
  '#2D3748', '#4A5568', '#B83280', '#276749', '#1A365D',
];
```

### 6.2 Status Colors

```javascript
const STATUS_COLORS = {
  good:    '#22c55e',   // green — within threshold
  warning: '#f59e0b',   // amber — approaching threshold
  danger:  '#ef4444',   // red — exceeds threshold
  neutral: '#64748b',   // gray — no threshold defined
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

### 8.2 Date Range Filter

```javascript
function filterByDateRange(days) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const filtered = DATA.filter(row => new Date(row.date) >= cutoff);

  renderKPIs(filtered);
  renderCharts(filtered);
  renderTable(filtered);
}
```

### 8.3 Dropdown Filter

```javascript
function filterByDropdown(filterKey, value) {
  let filtered = DATA;
  if (value !== 'all') {
    filtered = DATA.filter(row => row[filterKey] === value);
  }
  renderKPIs(filtered);
  renderCharts(filtered);
  renderTable(filtered);
}
```

### 8.4 Table Sorting

```javascript
let sortState = { column: -1, direction: 1 };

function sortTable(columnIndex) {
  const tbody = document.querySelector('.data-table tbody');
  const rows = Array.from(tbody.rows);

  if (sortState.column === columnIndex) {
    sortState.direction *= -1;
  } else {
    sortState.column = columnIndex;
    sortState.direction = 1;
  }

  rows.sort((a, b) => {
    const va = a.cells[columnIndex].getAttribute('data-value') || a.cells[columnIndex].textContent;
    const vb = b.cells[columnIndex].getAttribute('data-value') || b.cells[columnIndex].textContent;
    const na = parseFloat(va), nb = parseFloat(vb);
    if (!isNaN(na) && !isNaN(nb)) return sortState.direction * (na - nb);
    return sortState.direction * va.localeCompare(vb);
  });

  rows.forEach(row => tbody.appendChild(row));
  updateSortIcons(columnIndex);
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

---

## 9. Responsive Considerations

```css
/* Tablet: stack KPI cards 2x2 */
@media (max-width: 1024px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-row {
    flex-direction: column;
  }
}

/* Mobile: single column */
@media (max-width: 640px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
  body {
    padding: 12px;
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
    /* CSS variables (see Section 2) */
    /* Component styles (see Section 5) */
    /* Layout styles (see Section 4) */
    /* Responsive (see Section 9) */
  </style>
</head>
<body>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">{Title}</h1>
      <div class="filter-bar">
        <!-- Date range buttons or dropdown filters -->
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      <!-- 3-5 kpi-card elements -->
    </div>

    <!-- Charts -->
    <div class="chart-row">
      <!-- chart-card elements with chart-container divs -->
    </div>

    <!-- Data Table -->
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>...</thead>
        <tbody>...</tbody>
      </table>
    </div>
  </div>

  <!-- Theme toggle (floating) -->
  <button class="theme-toggle" onclick="toggleTheme()">
    <i class="fas fa-moon"></i>
  </button>

  <!-- ECharts CDN -->
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
  <script>
    // Embedded data
    const DATA = [/* ... */];

    // Theme functions (see Section 8.1)
    // Chart init and render functions (see Section 7)
    // Filter functions (see Section 8.2-8.3)
    // Table sorting (see Section 8.4)

    // Initialize
    initTheme();
    renderKPIs(DATA);
    renderCharts(DATA);
    renderTable(DATA);
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
