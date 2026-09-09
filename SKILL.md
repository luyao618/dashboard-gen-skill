---
name: csv-dashboard-generator
description: Create or improve interactive HTML dashboards from CSV data, with ECharts visualizations, clear metric definitions, coordinated filters, accessible tables, and light/dark themes. Use for CSV-to-dashboard and data exploration pages; not narrative research reports or full application backends.
---

# CSV Dashboard Generator

Turn a CSV into a dashboard that helps its reader answer a concrete question. Deliver a portable HTML file with embedded data, purposeful charts, and verified interactions.

## 1. Understand the data and the decision

Inspect the schema and representative rows, then profile the **whole file** with a CSV parser. Do not infer totals from a preview or split CSV on commas.

Establish:
- The row grain, date coverage, timezone (or its absence), dimensions, units, and candidate measures.
- Missing/invalid values, duplicate keys, category cardinality, and gaps in expected time buckets.
- Which values are additive, rates, snapshots, or precomputed statistics.
- The audience and primary question: change over time, category comparison, operational exceptions, or survey distribution.

Report a compact data summary. Mention quality issues that change the analysis. Preserve identifiers as strings and missing observations as missing.

Read [data semantics](references/data-semantics.md) before calculating rates, comparisons, time buckets, or survey/monitoring metrics.

## 2. Align on a useful dashboard

Keep the interview-first workflow: if the brief leaves the analysis open, present a **single concise recommendation** covering the main question, KPIs with formulas, charts, and filters. Ask for adjustments, then wait before generating HTML. Include an “auto / use your judgment” option.

Honor choices and authorization already provided. If the user already supplied a clear design/metric brief, approved a proposal, or asked you to decide, proceed with stated assumptions instead of repeating the interview. Ask about unresolved units or denominators when a wrong assumption would materially change the result; optional styling choices need not block work.

Choose a structural reference by the question, not just column types:

| Main question | Reference | What to adapt |
|---|---|---|
| What changed over time? | `assets/demo_timeseries.html` | Dominant trend, comparable windows, category contribution |
| Which category contributes most? | `assets/demo_comparison.html` | Sorted ranking, composition, weighted rates |
| Where is performance degrading? | `assets/demo_monitoring.html` | Hourly detail, reference line, shared-scale heatmap |
| How are responses distributed? | `assets/demo_survey.html` | Score distribution, NPS, group sample sizes |

These are working examples, not compulsory layouts. A single good chart may be enough for a small dataset.

## 3. Build the analytical model

Compute from the complete dataset before formatting. Define each metric's formula, unit, population, missing-value policy, and filter scope. Reconcile at least one total, one rate, and a representative subgroup against the source.

Use one filtered dataset for KPIs, charts, and contextual observations. Keep table search separate only when labeled “table only”; export all matching rows in the current sort order, including rows on other pages.

For large files, choose an aggregation that preserves the question, denominators, extrema, and required filter dimensions. Disclose detail reduction. A size target must never silently drop records. Avoid embedding repeated copies of the same derived data.

## 4. Design and implement

Read [design reference](references/design-reference.md), then the closest example or its source. For implementation mechanics, read [runtime patterns](references/runtime-patterns.md).

Choose the visual hierarchy before writing markup: primary question → essential metrics → main chart → supporting explanation → inspectable records. Use the user's brand when supplied; otherwise choose a restrained palette and typography appropriate to the subject. Make a deliberate choice about density and chart prominence.

Quality invariants:
- Show chart units, scope, and evidence for any observation. Do not invent a causal explanation, benchmark, target, or refresh time.
- Use stable category colors and semantic status colors with text or shape cues. Supply readable light and dark tokens.
- Use native labeled controls, keyboard focus, semantic tables, and text summaries alongside charts. Respect reduced motion.
- Make empty selections, zero denominators, sparse series, and unavailable comparisons explicit.
- Reuse chart instances, resize with their containers, and preserve filter/search/zoom state across theme changes.
- Render data strings with `textContent`; serialize embedded JSON safely. Quote exported CSV correctly and neutralize spreadsheet formulas in text fields.

Deliver a **single HTML file**: CSS, application JavaScript, and data inline. The examples use pinned ECharts **5.5.1** from a CDN. Such a file requires network access for charts; call it “single-file, CDN-assisted,” not fully offline. Use system fonts or optional brand fonts with fallbacks; an icon library is not required. If offline delivery is requested, inline a licensed local ECharts bundle, preserve its notices, and verify with networking disabled. Report the actual file size; 200 KB is a preference, not a correctness constraint.

No feature is mandatory just because a demo has it. Add zoom for long timelines, rolling means for a meaningful smoothing window, a distribution when spread matters, or chart filtering when it saves effort. Do not require dual axes, donuts, gradients, animated counters, fake skeletons, rainbow bars, or cross-chart links on every page.

## 5. Verify and deliver

Use the [validation checklist](references/validation.md). When a browser is available, open the result and exercise it yourself; do not delegate basic verification to the user.

Minimum evidence:
1. Independently recomputed values agree with displayed KPIs and selected chart buckets.
2. Filters update all scoped views; empty results, search, sorting, pagination, and full-result export work.
3. Light/dark screenshots at desktop and narrow mobile sizes show legible labels, no page overflow, and no clipped controls. Test keyboard focus and reduced motion.
4. No JavaScript errors; a failed chart dependency leaves usable metrics/table and an explanatory message.

Fix demonstrated failures, then report the output path, size, key design/metric decisions, and any verification limits. Share a preview when useful.

## Maintaining this skill

The examples are built from `assets/source/` and the included CSV fixtures. Edit shared source and `scripts/build_demos.py`, then run:

```bash
python3 scripts/build_demos.py
python3 scripts/build_demos.py --check
node --test tests/model.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
```

See [README.md](README.md) for browser checks. The compiler knows these four sample schemas; it does not automatically infer an arbitrary user's dataset. For a new dashboard, adapt the closest example and its metric model to the user's data.
