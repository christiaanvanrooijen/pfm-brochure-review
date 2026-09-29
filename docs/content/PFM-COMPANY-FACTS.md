# PFM company facts — for the "About PFM" band

Status: supplied by the product lead on 2026-09-29; extracted summary, not the raw slides.

Used by: `app/i18n/overview.ts` (`about*` fields) and `app/content/customer-logos.ts`, rendered at the foot of the segment overview; `app/content/installation-accreditations.ts`, in the drawer.

## Sources

| Source ID | What it is | Supplied |
| --- | --- | --- |
| `pfm-deck-scope-to-scale` | PFM sales-deck slide "Confidence from scope to scale" (screenshot) | 2026-09-29, product lead |
| `pfm-deck-local-support` | PFM sales-deck slide "Local support. European scale." (screenshot) | 2026-09-29, product lead |
| `pfm-deck-special-care` | PFM slide "Special care & attention. Local support. National consistency." (screenshot) | 2026-09-29, product lead |
| `pfm-deck-accreditations` | PFM slide "PFM Accreditations" (screenshot) | 2026-09-29, product lead |
| `pfm-website-nl-home` | PFM Dutch website copy ("Elke menselijke beweging maakt twee dingen vrij…") | 2026-09-29, product lead |

## Facts used

| Fact | Source |
| --- | --- |
| PFM turns movement data into actionable insights, with historical data, so commercial locations make the right choices | `pfm-website-nl-home`, opening paragraph |
| Trusted by retailers, landlords and advisors across Europe | `pfm-deck-scope-to-scale`, subtitle |
| Offices: Alphen aan den Rijn, Birmingham, Paris, Berlin | `pfm-deck-local-support`, "Local presence" |
| In-country teams in native languages; local capability in the Netherlands, Belgium, the United Kingdom, France and Germany, with a partner network | `pfm-deck-special-care`, paragraphs 1–2 |
| ISO/IEC 27001 (information security), ISO 9001 (quality), ISO 14001 (environmental management) | `pfm-deck-local-support`, "Accredited foundation"; `pfm-deck-accreditations` |

## Customer logos

Approved for use in the brochure by the product lead on 2026-09-29 (DECISION-LOG). Set and order from `pfm-deck-scope-to-scale`, "Trusted by leading organisations":

Suitsupply, British Land, C&A, ASICS, CBRE, Eurocommercial, Specsavers, Vodafone, Coolblue, Rituals, GrandVision, Value Retail, McDonald's, Wereldhave.

Files: `public/assets/customers/`, cut from the slide screenshot (about 160 px wide). Replace with original logo files when available, keeping the file names.

## Used elsewhere

- **Installation accreditations** (NICEIC, SafeContractor/SSIP, VCA, RI&E — `pfm-deck-accreditations`). True, but about installing safely rather than who PFM is, so they close the drawer's Requirements tab wherever a scene needs installed hardware (`app/content/installation-accreditations.ts`), not the front door.

## Deliberately not used

- **Forward-looking statements** ("will continue expanding…"). Not a fact to show a prospect.

FR and DE are translations of the EN copy and are covered by the open FR/DE copy review.
