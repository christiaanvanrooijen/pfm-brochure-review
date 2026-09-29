/**
 * Customer logos for the "About PFM" band on the segment overview.
 *
 * Use approved by the product lead on 2026-09-29 (DECISION-LOG), which is the
 * documented approval AGENTS.md asks for. Order and set follow the source
 * slide `pfm-deck-scope-to-scale` (docs/content/PFM-COMPANY-FACTS.md).
 *
 * The files are cut from that slide's screenshot, so they are small; replace
 * them with the originals when those are to hand, keeping the file names.
 */

export interface CustomerLogo {
  name: string;
  assetPath: string;
}

const logo = (name: string, file: string): CustomerLogo => ({
  name,
  assetPath: `/assets/customers/${file}.png`,
});

export const customerLogos: readonly CustomerLogo[] = [
  logo("Suitsupply", "suitsupply"),
  logo("British Land", "british-land"),
  logo("C&A", "c-and-a"),
  logo("ASICS", "asics"),
  logo("CBRE", "cbre"),
  logo("Eurocommercial", "eurocommercial"),
  logo("Specsavers", "specsavers"),
  logo("Vodafone", "vodafone"),
  logo("Coolblue", "coolblue"),
  logo("Rituals", "rituals"),
  logo("GrandVision", "grandvision"),
  logo("Value Retail", "value-retail"),
  logo("McDonald's", "mcdonalds"),
  logo("Wereldhave", "wereldhave"),
];
