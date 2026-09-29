/**
 * Browser-level check: an empty Conversation Review offers no Configure preview.
 *
 * WHY THIS EXISTS SEPARATELY FROM THE SUITE
 *
 * The defect it guards shipped past a source-level check and past my own
 * reading of the page. The aside sat OUTSIDE the empty/non-empty branch, so a
 * review of nothing still offered "Explore measurement scope — separate
 * preview", and the structural tests were all satisfied because every piece
 * they asserted was present and correct. Only the rendered page was wrong.
 *
 * So this asks the running application for the actual bytes it serves, for
 * every segment that HAS a Configure preview, in every language, and fails if
 * the offer appears on a page with no conversation behind it.
 *
 * Usage (with the app running):
 *   node scripts/verify-empty-review.mjs [baseUrl]
 */

const base = process.argv[2] ?? "http://localhost:3000";

/* The three segments with an implemented Configure preview. Outlet Centre and
   QSR have none and can never show the offer, which the suite covers. */
const SEGMENTS = ["retail", "shopping-centre", "retail-park"];
const LOCALES = ["en", "fr", "de"];

/* The label the offer renders under, in each language. Matched on the copy the
   reader would actually see — a class name could be renamed and the offer
   still be there. */
const CONFIGURE_LABEL = {
  en: "Explore measurement scope",
  fr: "Explorer le périmètre de mesure",
  de: "Messumfang erkunden",
};

/* The explanation the empty state must carry, so "no offer" cannot be passed
   by a page that failed to render at all. */
const EMPTY_TEXT = {
  en: "No scenes were opened in this session",
  fr: "Aucune scène n'a été ouverte dans cette session",
  de: "In dieser Sitzung wurden keine Szenen geöffnet",
};

const ACTION = {
  en: "Open the journey",
  fr: "Ouvrir le parcours",
  de: "Journey öffnen",
};

/* Server-rendered HTML escapes apostrophes, so compare on a normalized form
   rather than on the raw bytes. */
const normalize = (html) =>
  html
    .replace(/&#x27;|&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/’/g, "'");

let failures = 0;
const report = (ok, message) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "✔" : "✖"} ${message}`);
};

for (const segment of SEGMENTS) {
  for (const locale of LOCALES) {
    const url = `${base}/preview/demo?segment=${segment}&view=review&locale=${locale}`;
    let html;
    try {
      const response = await fetch(url);
      report(response.ok, `${segment} ${locale}: HTTP ${response.status}`);
      html = normalize(await response.text());
    } catch (error) {
      report(false, `${segment} ${locale}: could not reach ${url} — ${error.message}`);
      continue;
    }

    // The page is the empty review, in the requested language.
    report(
      html.includes(normalize(EMPTY_TEXT[locale])),
      `${segment} ${locale}: empty state explains itself`,
    );
    report(
      html.includes(ACTION[locale]),
      `${segment} ${locale}: offers a way into the journey`,
    );

    // And it does NOT offer the separate Configure preview.
    report(
      !html.includes(CONFIGURE_LABEL[locale]),
      `${segment} ${locale}: no Configure offer on a review of nothing`,
    );

    // Nor any of the things a review with content would carry.
    report(
      !html.includes("rd-review__coverage") && !html.includes("rd-review__visual"),
      `${segment} ${locale}: no coverage count and no picture`,
    );
  }
}

console.log(failures === 0 ? "\nAll empty-review checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
