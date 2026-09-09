# Data semantics

## Start at the row grain

Write down what a row represents and its expected key: one category-day, one product-region-month, one endpoint-hour, or one respondent. Duplicate keys may be valid events or accidental duplicate exports; don't deduplicate without understanding the grain.

Profile the full CSV with a real parser. Preserve leading-zero IDs, Unicode, quoted newlines, and nulls. Detect explicit date and numeric formats rather than guessing from the first nonempty value. Keep units in the schema: `0.032` as a fraction and `3.2` as percent are different.

For every reported KPI record: **formula, unit, valid population, missing-value policy, aggregation, filter scope**. If the input does not establish a denominator, label an assumption or ask before presenting the result as exact.

## Aggregations that change the answer

| Input | Appropriate computation | Common mistake |
|---|---|---|
| Revenue / orders / counts | Sum additive, disjoint rows | Adding overlapping cohorts or cumulative snapshots |
| Conversion / error rate | Sum numerator ÷ sum denominator | Unweighted mean of percentages |
| Average order value | Total revenue ÷ total orders | Mean of row averages |
| Return rate + units sold | Unit-weighted estimate, if units are the denominator | Treating rounded rates as exact returned counts |
| QPS | Sum endpoints per time bucket; average time buckets | Sum QPS across hours and call it throughput |
| P50/P95/P99 per interval | Display interval values or explicitly labeled summaries | Calling a mean/max of percentiles the pooled percentile |
| Survey NPS | 100 × (promoters − detractors) ÷ valid score count | Mean score, percentage label, or averaging group NPS |
| Unique users | Deduplicate identifiers at the intended scope | Sum daily distinct users as monthly distinct users |

For rate-only monitoring data, a QPS-weighted rate is an estimate under equal-duration, complete buckets. If intervals differ, weight by duration × QPS. Without representative traffic or request counts, do not claim a precise global error rate.

Keep missing separate from zero. A zero denominator means “— / unavailable.” An empty filtered dataset does not imply zero NPS, perfect reliability, or no errors. Exclude invalid values using a documented rule and disclose exclusions that affect interpretation. Use unrounded values for computation, rounded values for display.

## Time and period comparisons

Use explicit dates and stable timezone rules. Date-only strings should not move a day when the browser timezone changes. For naive timestamps, display them as recorded unless a timezone is supplied; never silently label them UTC.

Compute periods from dates, not array halves:
- Define inclusive/exclusive bounds and the displayed calendar grain.
- Compare adjacent, equal-duration windows with the same category filters.
- If weekday seasonality matters, use weekday-matched windows and label that choice.
- Require sufficient coverage in both windows. Do not turn missing prior data or a zero baseline into a fabricated 0% change.
- State partial periods. “Month to date” against a full prior month is not an equivalent comparison.

Use **relative change** for a quantity: `(current / prior − 1) × 100%`. For a rate, distinguish **percentage-point difference** from relative change. NPS differences use points. Improvement depends on the metric; higher latency is worse, and greater QPS is not automatically better.

Materialize missing expected buckets as null when plotting time series. Do not connect across absent observations or use a category axis to make irregular spacing look regular. A seven-day rolling mean needs a declared policy for missing days and incomplete leading windows; a seven-row average is not necessarily seven days.

## Survey comparisons

NPS valid scores are integers 0–10. Promoters are 9–10, passives 7–8, and detractors 0–6. Retain the −100 to +100 range and show n next to group comparisons. For weekly trends, use an explicit week start and note partial boundary weeks.

Do not interpret a tiny subgroup's extreme value as a reliable difference. Small samples, response bias, and unequal participation may change what a comparison supports. Only add confidence intervals when you compute them using a method appropriate for the statistic; never decorate charts with invented uncertainty bands.

## Audit trail and large datasets

Expose the source filename, observed coverage, total and selected record counts, and key metric definitions. An export timestamp, file timestamp, page generation time, and data observation time are different facts. Do not call the time a page was opened “last updated.”

Aggregate only after identifying needed dimensions. Keep numerators and denominators so filters can recompute ratios. Preserve spikes if the question concerns incidents. If details are sampled, capped, or omitted, label that clearly and make export scope explicit. Pagination alone does not reduce embedded data size.

Before delivery reconcile: additive totals across groups; a weighted rate from its numerator/denominator; the first and last time bucket; one filtered subgroup; survey distribution counts versus valid n. Document a missing-data caveat instead of silently “fixing” the CSV.
