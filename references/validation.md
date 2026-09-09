# Verification before delivery

Check the generated artifact, not only the source template. Scale the checks to its complexity; record which were actually performed.

## Data

- Recompute headline values independently from the source CSV, before formatting.
- Reconcile grouped totals, a rate denominator, a selected subgroup, and first/last time buckets.
- Check missing values, zero denominators, incomplete comparison windows, and any sample-size or percentile claims.
- Verify raw records survive embedding and export; disclose aggregation or sampling.
- Confirm displayed dates describe the source and current filters, not today's browser date.

## Interactions

- Change each global filter and verify metric, chart, observation, and table scope together.
- Use an empty selection or no-match search; no `NaN`, `Infinity`, stale chart, misleading zero, or invalid page number.
- Sort numeric columns both directions; paginate; search; export a selection spanning several pages.
- Parse the downloaded CSV and compare its record count/order/content with all matching rows, not only the visible page.
- Change the theme after filtering/searching/zooming. The selection and zoom should survive.
- Operate filters and sortable headers by keyboard. Check visible focus and accessible names.
- If chart clicks filter, exercise the action and its keyboard equivalent and reset.

## Visuals

Capture desktop (around 1440 px), tablet (around 800 px), and narrow mobile (375–390 px) screenshots. Inspect both light and dark themes. Confirm:

- The primary question and scope are clear, with a useful hierarchy.
- Labels, units, legends, reference values, and long category names are readable.
- Marks and status cues remain legible across themes.
- Tooltips stay in view; responsive resizing does not leave zero-size or clipped charts.
- Controls do not overflow and the page does not horizontally scroll; the source table may have its own scroll area.
- Reduced motion is respected. No fake shimmer or counter animation obscures a static metric.

## Runtime

Check console/page errors and JavaScript syntax. Test direct `file://` opening when that is the promised delivery mode. Block the CDN in a fresh browser context and confirm the explanation, metrics, filters, and table remain functional. For offline output, disable networking and verify charts too.

For changes to this repository:

```bash
python3 scripts/build_demos.py
python3 scripts/build_demos.py --check
node --test tests/model.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
python3 scripts/check_browser.py
```

The browser check requires `agent-browser` and its browser runtime. It uses a temporary local server and its own session. Numerical/model and build checks are independent of the browser dependency. If browser tools are unavailable, report static/numeric validation and explicitly state that rendering was not verified.
