# Privacy And Governance Notes

Source basis: `geolocation-cross-vertical-extraction.md`, public-location papers, travel papers, QSR extraction and current Tool 2 safety rules.

## Required Guardrails

| Guardrail | Practical rule for Tool 2 | Evidence level |
| --- | --- | --- |
| Aggregate outputs only | Show movement stories, not raw device paths, user IDs, individual locations or personal profiles. | source-backed |
| Data minimisation | Collect or request only the movement, time, zone and context fields needed for the stated decision. | source-informed |
| Consent and lawful basis | Treat mobile/app/telecom/GPS or workplace movement data as requiring explicit governance review. | source-informed |
| No re-identification | Do not imply individual tracking, home identification, demographic inference or Re-ID in customer-facing Tool 2 copy. | source-backed as safety rule |
| Validation before decision | Check representativeness, bias, source stability, comparability and spatial/temporal fit before making decisions. | source-backed |
| External benchmark caution | Compare against authoritative or approved benchmarks where possible; document mismatches in scope, geography and timing. | source-backed |
| Causality caution | Before/after charts are not proof of causality unless the design supports it. | source-backed |
| Human review | Any follow-up, proposal, quote, proof example or customer-facing claim needs human approval. | existing Tool 2 rule |

## Data Veracity Checklist

Use before turning geolocation insight into a sales claim:

1. What is the data source?
2. What does the metric actually measure?
3. Is the sample representative for the place, time and population?
4. Is the spatial resolution appropriate for the decision?
5. Are time periods comparable?
6. Has the metric been validated against an approved or authoritative source?
7. Are changes caused by data-source drift rather than real-world behaviour?
8. Is the data aggregated enough for privacy and governance?
9. Does the customer have rights to combine any commercial or contextual data?
10. Is the conclusion phrased as evidence, hypothesis or proof?

## Explicitly Unsupported In Tool 2

- No raw spreadsheet, paper, document, screenshot or source data commit.
- No individual tracking or personal profile.
- No real customer data.
- No customer logos or testimonials.
- No unsupported demographic targeting.
- No production integrations, API calls, Odoo, n8n, email sending or lead submission.
- No guaranteed ROI, uplift, queue reduction, safety, security, passenger-outcome or public-health claim.
