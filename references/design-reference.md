# Dashboard design reference

Read this when choosing a page structure or tuning its visual expression. For formulas use [data semantics](data-semantics.md); for working implementation use [runtime patterns](runtime-patterns.md).

## Start with the reading order

The first viewport should make the question, scope, and most important result obvious. A useful default for a substantial dashboard is:

```text
Title / purpose                              Coverage / source
Scope controls                                      Reset
Essential metrics with units and definitions
Primary chart (most of the width)        Selection observation
Supporting comparison                   Different analytical view
Searchable source table / export
Metric definitions and source notes
```

This is one composition, not a required grid. For a small comparison, let a horizontal ranking dominate and omit the KPI row. For operational triage, elevate the exception and show the affected period. For a survey, give the distribution more space than a single aggregate score. Keep metrics that answer different questions visibly separate.

Decide the reader's task before choosing components. Every extra chart must add a distinct comparison, distribution, relationship, or detail. Do not repeat the same metric in a donut, a stacked area, and a ranking simply to fill space.

## Choose the chart by the claim

| Need | Prefer | Guardrail |
|---|---|---|
| Trend | Straight line with a time axis | Sort dates; preserve missing buckets; show units |
| Compare a few time series | Shared-scale lines or small multiples | Stable identities; direct labels or concise legend |
| Rank categories | Sorted horizontal bars | Zero baseline; allow long labels; name the measure |
| Compare two periods per category | Grouped bars or a dot/slope chart | Comparable windows and population |
| Composition | Stacked bars or a 100% bar | Use 100% only for shares; expose denominators |
| Part of a whole, 2–4 categories | Optional donut or stacked bar | Only nonnegative parts; label values and total |
| Rating distribution | Ordered frequency bars | Keep score order; show valid n and category cutoffs |
| Continuous distribution | Histogram, box plot, or dot plot | Explain bins; don't reduce spread to a mean |
| Magnitude across two dimensions | Heatmap | Ordered axes; one labeled scale; gaps distinct from zero |
| Relationship | Scatter plot | No causal claims from correlation; show units |
| Actual against a target | Reference line or bullet chart | Supplied target or explicitly labeled illustrative reference |

Avoid dual axes unless the user needs them and the scales are unmistakable; aligned plots are usually easier to compare. Use a sequential palette for magnitude and a diverging palette only with a meaningful midpoint. Rainbow palettes create artificial boundaries.

Do not smooth lines by default: spline curves can invent intermediate peaks. A rolling mean should name its window and weighting, show its relationship to the raw series, and leave incomplete windows unavailable. Zoom is useful when there are enough points to obscure detail; it need not occupy space on a seven-point series.

## Visual system

Use a small token system for surfaces, text, boundaries, categorical data, and status. The maintained examples use a cool workspace palette and a system font stack; adapt these to the brief instead of imposing them on every output.

| Role | Light | Dark |
|---|---|---|
| Page | `#f2f5f8` | `#101a28` |
| Surface | `#ffffff` | `#172438` |
| Soft surface | `#f7f9fc` | `#1c2c42` |
| Main text | `#192b43` | `#e6edf7` |
| Secondary text | `#57687d` | `#a5b6cc` |
| Boundary | `#dce3eb` | `#31445d` |
| Primary data | `#315cce` | `#90adff` |
| Secondary data | `#087e8b` | `#5bc8cb` |
| Amber data | `#a86a12` | `#e7b75e` |
| Rose data | `#bb466b` | `#f189a9` |
| Purple data | `#7f56b0` | `#bc9fe9` |
| Orange data | `#bd5828` | `#efab86` |

Map category → palette slot once from the full dataset. Filtering or sorting must not recolor a category. Reserve “success / warning / danger” for interpreted status, not arbitrary series identity. Pastel fills can support darker strokes; pale text on a white surface is rarely readable.

Use 3:1 contrast for essential chart marks and control outlines; normal text should meet 4.5:1. Check both themes and the actual adjacent colors. Where categories touch or colors alone are insufficient, add borders, direct labels, shapes, line styles, or decals. Do not rely on red/green alone to communicate direction.

Aim for 4–6 visible series per chart. With more categories, use an explicit Top N + Other (reconciled to the total), filtering, or small multiples. A 20-color legend is not a solution to high cardinality.

### Type and spacing

The examples pair `Avenir Next / Segoe UI / PingFang SC` for interface text with `SFMono-Regular / Consolas` for data captions. System fonts avoid font-network failures; choose another pairing when it better fits the user's brand.

- Title: roughly 28–42 px, compact line-height. Scale down on narrow screens.
- Section and chart titles: 15–18 px; keep them sentence case and specific.
- KPI value: roughly 28–38 px, tabular numerals, units nearby.
- Interface: 13–14 px; metadata: 11–12 px. Avoid shrinking the whole page to fit more content.
- Use a spacing rhythm such as 4/8/12/16/24/32. Card padding usually 18–24 px, with smaller mobile gutters.
- Borders divide analytical groups; restrained rounding makes containers approachable. Shadows and hover lifts should signal an action, not animate static charts.

Prefer a quiet background and intentional whitespace around the primary chart. A signature element can be a useful observation panel, a ranked list with direct values, or a well-annotated exception. Decoration should not compete with the data.

## Chart finishing

- Put the question in the title and the measure/unit in the subtitle or axis.
- Keep gridlines faint; remove unnecessary ticks, borders, symbols, and legends.
- Use zero baselines for bars. When narrowing a line-axis range, make the scale explicit; do not exaggerate a minor change.
- Keep comparable charts on a shared scale. For a filterable heatmap, either hold the domain fixed or visibly explain that it changes.
- Format tooltips with enough precision to inspect a claim; compact ticks and KPI labels can be shorter.
- Label reference lines in visible text, including whether they are targets or illustrative values.
- Truncate long category labels only when a tooltip, direct label, or source table reveals the complete value. Never truncate units.
- A prose observation must be computed from the same selection as the chart and updated with it. Name the population (“of selected revenue”) and distinguish observation from explanation.

## Interaction and accessibility

Make scope visible: date bounds, dimensions, record counts, active filters, and a clear reset. Native selects work well for long categories and mobile; segmented buttons work well for a few stable choices. Labels must remain visible.

Cross-chart interactions are optional. If a click filters, show the change in a visible control, provide a reset, and offer the same action by keyboard. Avoid surprise filtering from a legend whose conventional purpose is hiding a series. No chart-only actions without an equivalent control.

Charts need text equivalents: a useful summary of the trend/distribution, key values or sample sizes, and an inspectable table. ECharts ARIA helps but does not replace these. Keep source tables semantic, use buttons in sortable headers and `aria-sort`, and label the scrollable table region.

Use state announcements for filter results and empty tables. Avoid narrating every chart animation to screen readers. Do not simulate loading when data is already embedded. If animation is used, keep it short, cancel stale animations after a new selection, and respect `prefers-reduced-motion`.

## Responsive and delivery behavior

At wide widths, let the main chart occupy more space than supporting details. At tablet widths, collapse secondary columns before labels become unreadable. At 375–390 px, stack controls/cards, keep a readable chart height, and place overflow inside the source table instead of the page.

Validate tooltip clipping, legend height, control widths, and long labels on real screenshots. Container resizing is more reliable than listening only for window resize. Check light and dark surfaces, selected controls, chart labels, reference lines, and empty states.

A single file can still have a network dependency. Tell the recipient if charts need a CDN; show useful metrics/table and a clear error if the chart library cannot load. For a fully offline artifact, embed the chart library with its license notices and test offline. Do not use a misleading “live” or “last updated now” label for static CSV data.
