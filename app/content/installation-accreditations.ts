/**
 * The accreditations that cover how PFM installs, shown in the drawer's
 * Requirements tab wherever a scene needs installed hardware.
 *
 * They are true of PFM, but they are about installing safely, not about who
 * PFM is, so they sit with installation rather than on the front door
 * (product lead, 2026-09-29). Source: `pfm-deck-accreditations`, see
 * docs/content/PFM-COMPANY-FACTS.md.
 */

import type { Locale } from "../i18n/locales.ts";

export interface InstallationAccreditation {
  name: string;
  text: string;
}

export const installationAccreditations: Readonly<
  Record<Locale, { heading: string; items: readonly InstallationAccreditation[] }>
> = {
  en: {
    heading: "Installed by accredited teams",
    items: [
      { name: "NICEIC approved contractor", text: "Electrical work to UK safety and compliance standards." },
      { name: "SafeContractor (SSIP)", text: "Health, safety and ethical standards, verified across our projects." },
      { name: "VCA", text: "Our technicians work to certified safety, health and environmental standards." },
      { name: "RI&E", text: "A risk inventory and evaluation keeps the site safe for staff and customers." },
    ],
  },
  fr: {
    heading: "Installé par des équipes accréditées",
    items: [
      { name: "NICEIC approved contractor", text: "Travaux électriques conformes aux normes britanniques de sécurité." },
      { name: "SafeContractor (SSIP)", text: "Normes de santé, de sécurité et d'éthique, vérifiées sur nos projets." },
      { name: "VCA", text: "Nos techniciens appliquent des normes certifiées de sécurité, de santé et d'environnement." },
      { name: "RI&E", text: "Un inventaire et une évaluation des risques protègent le personnel et les clients sur site." },
    ],
  },
  de: {
    heading: "Installiert von akkreditierten Teams",
    items: [
      { name: "NICEIC approved contractor", text: "Elektroarbeiten nach britischen Sicherheits- und Compliance-Standards." },
      { name: "SafeContractor (SSIP)", text: "Gesundheits-, Sicherheits- und Ethikstandards, in unseren Projekten geprüft." },
      { name: "VCA", text: "Unsere Techniker arbeiten nach zertifizierten Sicherheits-, Gesundheits- und Umweltstandards." },
      { name: "RI&E", text: "Eine Risikoinventur und -bewertung schützt Personal und Kunden vor Ort." },
    ],
  },
};
