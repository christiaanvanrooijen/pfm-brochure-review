/**
 * Customer logos for the "About PFM" band on the segment overview.
 *
 * Use approved by the product lead on 2026-09-29 (DECISION-LOG), which is the
 * documented approval AGENTS.md asks for. The set is the product lead's own:
 * the "Trusted by leading organisations" slide (`pfm-deck-scope-to-scale`)
 * without C&A, plus seven the product lead added. Files are black on
 * transparent, supplied by the product lead with their origins in
 * docs/content/PFM-COMPANY-FACTS.md.
 *
 * `aspect` is the artwork's width over its height, after trimming. The band
 * sizes every logo to the same AREA rather than the same height, so a long
 * wordmark (Value Retail, 11.6) and a roundel (Coolblue, 1.0) carry equal
 * visual weight instead of one shouting and the other whispering.
 */

export interface CustomerLogo {
  name: string;
  assetPath: string;
  aspect: number;
}

const logo = (name: string, file: string, aspect: number): CustomerLogo => ({
  name,
  assetPath: `/assets/customers/${file}`,
  aspect,
});

export const customerLogos: readonly CustomerLogo[] = [
  logo("Suitsupply", "suitsupply.svg", 9.45),
  logo("British Land", "british-land.svg", 2.15),
  logo("ASICS", "asics.svg", 3.08),
  logo("CBRE", "cbre.svg", 4.09),
  logo("Eurocommercial", "eurocommercial.png", 7.74),
  logo("Specsavers", "specsavers.svg", 2.62),
  logo("Vodafone", "vodafone.svg", 4.05),
  logo("Coolblue", "coolblue.svg", 1.0),
  logo("Rituals", "rituals.svg", 10.15),
  logo("GrandVision", "grandvision.png", 2.13),
  logo("Value Retail", "value-retail.svg", 11.59),
  logo("McDonald's", "mcdonalds.svg", 1.14),
  logo("Wereldhave", "wereldhave.svg", 5.02),
  logo("Pearle Opticiens", "pearle.svg", 3.98),
  logo("GrandOptical", "grandoptical.svg", 9.73),
  logo("KFC", "kfc.png", 3.28),
  logo("Odido", "odido.svg", 3.9),
  logo("Ace & Tate", "ace-tate.svg", 6.24),
  logo("Future Stores", "future-stores.svg", 11.3),
  logo("MADAQ", "madaq.png", 3.7),
];

/** The area, in CSS pixels, every logo is drawn at. */
const LOGO_AREA = 2600;

/** Width that gives this logo the common area; CSS caps height and cell width. */
export const logoWidth = (customer: CustomerLogo): number =>
  Math.round(Math.sqrt(LOGO_AREA * customer.aspect));
