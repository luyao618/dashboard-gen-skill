# Runtime patterns

The maintained demos are single-file outputs of four shared sources:

| File | Purpose |
|---|---|
| `assets/source/dashboard.html` | Semantic page, theme initialization, embedded JSON slot |
| `assets/source/dashboard.css` | Tokens, layout, responsive and accessibility states |
| `assets/source/model.js` | Pure aggregation, date windows, NPS, filters, CSV serialization |
| `assets/source/dashboard.js` | Chart configurations, DOM rendering, theme and table state |
| `scripts/build_demos.py` | Known sample schemas and deterministic demo compilation |

Paths above are relative to the skill root. Read only what needs adapting. These samples make documented assumptions about their own CSVs; their compiler is not an arbitrary-CSV importer.

## Keep one explicit state

```javascript
const state = {
  days: 30,
  filters: {},
  search: '',        // table only, explicitly labeled
  sort: 'date',
  direction: 1,
  page: 1,
};
```

Derive the dashboard selection once. Use it for KPIs, chart datasets, insight copy, and source table. Derive table search/sort from that selection, then paginate last. Export the same sorted matching set before pagination. Preserve search and sort on normal filter changes; reset page to 1. A Reset action can restore all defaults.

Keep chart viewport zoom distinct from a global data filter and label that difference when it could be confusing. Theme changes should not alter the selected data or viewport. Capture zoom state if rebuilding ECharts options.

## Embed data as data

Use a JSON serializer, not string interpolation. A `type="application/json"` script still needs escaping because HTML parsers recognize its closing tag:

```python
payload = json.dumps(data, ensure_ascii=False, allow_nan=False)
payload = payload.replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
```

Parse with `JSON.parse(element.textContent)`. Render cell/label strings using `textContent` and DOM creation. For ECharts tooltips, `renderMode: 'richText'` avoids placing raw data in HTML; if using HTML tooltips, escape every data-derived value. Treat filenames and category labels as untrusted text too.

Quote CSV fields, double internal quotes, retain embedded newlines, use consistent newlines, and neutralize formula-leading **text** fields for spreadsheet export. Preserve real numeric negatives as numbers. Use a UTF-8 BOM when spreadsheet compatibility is useful. Export through a Blob, revoke its URL after download, and include all matching rows.

## Chart lifecycle

Initialize each visible container once, reuse the instance, and attach its event handlers once (or replace them explicitly). Resize with `ResizeObserver`. If containers are removed, disconnect observers and dispose their instances.

Read colors from theme tokens. Give each category a stable identity from the full dataset rather than the current sorted series index. Use `notMerge` or targeted replacement to avoid old series surviving after filters, while deliberately restoring any viewport state that should persist.

Use `animation: false` for static data unless motion has a clear purpose. If enabling it, honor `matchMedia('(prefers-reduced-motion: reduce)')`. Inside zoom should not trap ordinary page scrolling; use a modifier or a visible slider. Chart clicks that filter need an equivalent native control.

## Theme and dependency loading

Apply a valid saved theme before the first paint, otherwise use the system preference. Guard storage reads and writes with `try/catch`; file URLs or restrictive browser settings may deny storage. Update the button's accessible name/state and all chart surfaces, text, scales, and reference lines.

Render metrics, controls, and tables independently of ECharts. Load the pinned library with explicit success/failure handling. On failure show an actionable explanation while keeping non-chart content usable. Avoid needless font/icon CDNs.

Single-file CDN-assisted delivery and fully offline delivery are distinct. The examples pin ECharts 5.5.1 for reproducibility. Upgrading is a deliberate maintenance change with a browser regression pass; do not swap versions casually while copying an example. For offline output, use a trusted local library bundle and retain the license notices.

## Table and empty states

Use `<th scope="col">`, a real button in each sortable header, and `aria-sort`. Compare raw numeric values instead of formatted strings; keep missing values at the end. Restore focus to the activated header after DOM replacement.

Search has a visible scope description. Display `0 matching rows`, a helpful empty row, and disabled pagination/export controls when no results match. Clamp the page after filtering. Put horizontal overflow on a labeled, keyboard-focusable table wrapper; the overall document should fit the viewport.
