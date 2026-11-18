# PFM HTML style and content guide

## Composition and wording rules
1. Cover: one customer goal, a short lead and correct segment. No invented results, ROI or universal accuracy claims.
2. Selected conversation: questions, practical relevance, named source layers and aligned periods/areas for derived KPIs. Use only selected topics.
3. Technical explanation: one sheet per selected method. Hardware beside the mechanism; three installation requirements; one principle visual beside the specification table. Alternative technologies remain labelled as alternatives. Deduplicate repeated sensors. Use model-specific validated data; explain missing specifications instead of guessing.
4. About PFM: company story and a compact proof block. Use renderCustomerProof with the approved customer-logo registry only. Logo presence is a portfolio reference, not evidence of a specific result or endorsement.
5. ARC and privacy: state the 98% objective as a target; privacy depends on the actual processing, transmission, retention and access configuration.
6. Optional certification section: use app/content/pfm-certifications.ts as the shared EN/DE/FR copy; RI&E is a risk assessment. No unsupported SOC 2 claim.
7. Close: concrete next step. The Quotation Builder inserts its own validated scope, pricing, VAT and conditions through its adapter.

## Visual treatment
- Hardware uses transparent PNG or alpha WebP; original product geometry stays intact. No rectangular photo backdrop inside a different card background.
- DocumentImage.background optionally defines a safe hex colour for the image stage: black for tracking/LiDAR video frames; blue for the Xovis depth example. It fills only the image stage, keeping the caption readable on its light surface.
- Use object-fit:contain for hardware, dashboards and technical evidence. Do not crop specification screenshots or put entire slides into content cards. Rebuild their text as HTML.
- Approved logo assets remain SVG/PNG with transparent backgrounds and equal visual weight.
- Keep captions brief, meaningful and honest about illustrative data. Captions are real text.
- Preserve PFM Black #0C111D, Purple #9E77ED, Red #F04438 and the supplied typography hierarchy. Avoid competing focal images in one sheet.

## PDF export
The standalone HTML has a Save as PDF / Print action. The brochure generator also opens a print-ready document and waits for images/fonts before invoking printing. Choose Save as PDF, A4, 100% scale; keep background graphics enabled and browser headers/footers disabled. A4 print styles preserve colours, text and vector logos, hide controls, and start each technology on a new page. Browser printing remains user-controlled; exact pagination can vary between engines.
For automated quotation exports, use Chromium page.pdf({printBackground:true, preferCSSPageSize:true}) after document.fonts.ready and decoding all images. Do not rasterise the entire HTML. A reference PDF is included for comparison.

## Export and ownership
Copy source/template.ts and source/styles.ts together, or import template.mjs with styles.mjs. Keep the structured data adapter in the receiving product. productLabel/footerLabel can name that product without forking styles. Carry approved visual assets and their provenance with the adapter. The sample files are review examples, not a customer quotation.
