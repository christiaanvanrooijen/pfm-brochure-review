/**
 * Every French and German string the brochure can show, beside its English
 * source — for review by native speakers.
 *
 *   node --experimental-strip-types scripts/translation-review-export.mjs > out.json
 *
 * Strings are read through the same resolvers the app renders with, so a row is
 * exactly what a reader sees, including where French or German silently falls
 * back to English (flagged, not hidden). Identical English/French/German
 * triples are listed once, with every place they appear.
 *
 * Output: JSON rows { area, where, en, fr, de, priority, frMissing, deMissing }.
 * `scripts/translation-review-workbook.py` dresses it as a review workbook.
 */

import { overviewCopy } from "../app/i18n/overview.ts";
import { introCopy } from "../app/i18n/intro.ts";
import { proofUiCopy, proofCaseTranslations } from "../app/i18n/proof.ts";
import { retailJourneyCopy } from "../app/i18n/journey-retail.ts";
import { retailParkJourneyCopy } from "../app/i18n/journey-retail-park.ts";
import { outletJourneyCopy } from "../app/i18n/journey-outlet.ts";
import { qsrJourneyCopy } from "../app/i18n/qsr-journey.ts";
import { sceneCopy } from "../app/i18n/scenes.ts";
import { startCopy, startCoverCopy } from "../app/i18n/starts.ts";
import { getMessages } from "../app/i18n/messages.ts";
import {
  resolveCapabilityCopy,
  resolveExplainerCopy,
  resolveVideoCopy,
  resolveFollowOnVideoCopy,
  resolveVideoViewLabel,
  resolvePrivacyCopy,
  resolveInputLabel,
} from "../app/i18n/domain.ts";
import { resolveLimitationClaim, resolveSupportedClaim } from "../app/i18n/domain-claims.ts";
import {
  resolveDataRoleCopy,
  resolveEssentialLabel,
  resolveEssentialBody,
  resolveDetailLabel,
  resolveDetailValue,
} from "../app/i18n/domain-requirements.ts";
import { drawerLimitations } from "../app/content/drawer-limitations.ts";
import { drawerMethodCopies, sceneMethodCopies } from "../app/content/drawer-method-copy.ts";
import {
  sceneDrawerOverrides,
  segmentDrawerSettings,
  drawerExplainerVisuals,
} from "../app/content/scene-drawer-overrides.ts";
import { capabilityExplainerVisuals, implementationRequirementProfiles } from "../app/content/technology-visuals.ts";
import { segmentCapabilityMediaOverrides } from "../app/content/segment-capability-media.ts";
import { capabilityExplainerVideos, explainerVideoViewLabels } from "../app/content/solution-directions.ts";
import { technologyImplementations, technologyCapabilities } from "../app/content/technology.ts";
import { evidenceInputs } from "../app/content/evidence-inputs.ts";
import { dataRoles } from "../app/content/types.ts";
import { segmentDefinitions } from "../app/content/segments/index.ts";
import { proofAssets } from "../app/content/proof-assets.ts";

const rows = new Map();

/* Written or rewritten during the 2026-09-27/28 review passes, by Claude: read
   these first. Everything else predates them. */
const recent = new Set([
  "Cover (Unified PFM Intro)",
  "Customer cases",
  "Drawer · limitations",
  "Drawer · how it works (method copy)",
  "Drawer · scene and segment purpose",
]);
/* Within older areas, the individual rows that are new: the seven schematic
   illustrations and the technology claims rewritten in the source pass. */
const recentWhere = [
  /· (retail-anonymous-classification|sc-threshold-counting|rp-unit-entrance-counting|rp-anonymous-reid|oc-entrance-counting|oc-zone-counting-lines|oc-anonymous-reid) ·/,
  /^impl-ip-detection-(indoor|outdoor)( · claim [23])?$/,
  /^impl-xovis-3d-entrance-outdoor/,
  /^impl-milesight-vs125p-entrance · claim 4$/,
  /^impl-isarsoft-camera-analytics · claim [23]$/,
];
const isRecent = (area, where) => recent.has(area) || recentWhere.some((re) => re.test(where));

function add(area, where, en, fr, de) {
  if (typeof en !== "string" || !en.trim()) return;
  if (/^(https?:|\/assets\/)/.test(en)) return;
  const key = `${en}\u0000${fr}\u0000${de}`;
  const existing = rows.get(key);
  if (existing) {
    if (!existing.where.includes(where)) existing.where.push(where);
    if (isRecent(area, where)) existing.priority = "High — new this week";
    return;
  }
  rows.set(key, {
    area,
    where: [where],
    en,
    fr: fr ?? "",
    de: de ?? "",
    priority: isRecent(area, where) ? "High — new this week" : "Normal",
    frMissing: !fr || fr === en,
    deMissing: !de || de === en,
  });
}

/** Walk an English tree beside its French and German twins. */
function pairWalk(area, path, en, fr, de) {
  if (typeof en === "string") return add(area, path, en, typeof fr === "string" ? fr : "", typeof de === "string" ? de : "");
  if (Array.isArray(en)) return en.forEach((v, i) => pairWalk(area, `${path}[${i}]`, v, fr?.[i], de?.[i]));
  if (en && typeof en === "object") {
    for (const k of Object.keys(en)) pairWalk(area, path ? `${path}.${k}` : k, en[k], fr?.[k], de?.[k]);
  }
}

/** Find every {en, fr, de} object anywhere in a structure. */
function findLocalized(area, path, node) {
  if (!node || typeof node !== "object") return;
  if ("en" in node && "fr" in node && "de" in node) return pairWalk(area, path, node.en, node.fr, node.de);
  if (Array.isArray(node)) return node.forEach((v, i) => findLocalized(area, `${path}[${i}]`, v));
  for (const k of Object.keys(node)) findLocalized(area, path ? `${path}.${k}` : k, node[k]);
}

// 1. Whole-locale tables.
const tables = [
  ["Cover (Unified PFM Intro)", introCopy],
  ["Segment picker", overviewCopy],
  ["Customer cases", proofUiCopy],
  ["Segment covers and first questions", startCopy],
  ["Segment covers and first questions", startCoverCopy],
  ["Journey · Retail", retailJourneyCopy],
  ["Journey · Retail Park", retailParkJourneyCopy],
  ["Journey · Outlet Centre", outletJourneyCopy],
  ["Journey · Drive-Thru", qsrJourneyCopy],
  ["Scenes", sceneCopy],
];
for (const [area, table] of tables) {
  if (table && "en" in table && "fr" in table) pairWalk(area, "", table.en, table.fr, table.de);
  else findLocalized(area, "", table);
}
pairWalk("Interface", "", getMessages("en"), getMessages("fr"), getMessages("de"));

// 2. Drawer layers with inline {en, fr, de}.
for (const l of drawerLimitations) pairWalk("Drawer · limitations", l.implementationId, l.copy.en, l.copy.fr, l.copy.de);
findLocalized("Drawer · how it works (method copy)", "segment", drawerMethodCopies);
findLocalized("Drawer · how it works (method copy)", "scene", sceneMethodCopies);
findLocalized("Drawer · scene and segment purpose", "scene", sceneDrawerOverrides);
findLocalized("Drawer · scene and segment purpose", "segment", segmentDrawerSettings);

// 3. Measurement illustrations (English in the model, FR/DE by approach).
const explainers = [
  ...capabilityExplainerVisuals,
  ...segmentCapabilityMediaOverrides.flatMap((o) => o.explainerVisuals ?? []),
  ...drawerExplainerVisuals,
];
for (const v of explainers) {
  const fr = resolveExplainerCopy("fr", v.approachId, null);
  const de = resolveExplainerCopy("de", v.approachId, null);
  for (const k of ["approachName", "explanation", "illustrationNote", "altText"]) {
    add("Drawer · measurement illustrations", `${v.segment} · ${v.approachId} · ${k}`, v[k], fr?.[k], de?.[k]);
  }
}

// 4. Capabilities, per segment.
for (const segment of segmentDefinitions) {
  for (const cap of technologyCapabilities) {
    // Drive-thru capabilities belong to the QSR segment and to no other.
    if ((segment.id === "qsr") !== cap.id.startsWith("TECH-QSR")) continue;
    const en = resolveCapabilityCopy("en", segment.id, cap.id);
    if (!en) continue;
    const fr = resolveCapabilityCopy("fr", segment.id, cap.id);
    const de = resolveCapabilityCopy("de", segment.id, cap.id);
    add("Capabilities", `${cap.id} · name`, en.name, fr?.name, de?.name);
    add("Capabilities", `${segment.id} · ${cap.id} · purpose`, en.purpose, fr?.purpose, de?.purpose);
  }
}

// 5. Technology: supported claims and limitation lines.
for (const impl of technologyImplementations) {
  impl.supportedClaims.forEach((claim, i) =>
    add("Technology · what it does", `${impl.id} · claim ${i}`, claim,
      resolveSupportedClaim("fr", impl.id, i, claim), resolveSupportedClaim("de", impl.id, i, claim)));
  const lim = impl.unsupportedClaims[0];
  if (lim) add("Technology · limitation (fallback)", impl.id, lim,
    resolveLimitationClaim("fr", impl.id, lim), resolveLimitationClaim("de", impl.id, lim));
}

// 6. Requirements.
for (const role of dataRoles) {
  pairWalk("Requirements · data roles", role, resolveDataRoleCopy("en", role), resolveDataRoleCopy("fr", role), resolveDataRoleCopy("de", role));
}
for (const profile of implementationRequirementProfiles) {
  for (const e of profile.essentials) {
    add("Requirements · installation essentials", `label`, e.label, resolveEssentialLabel("fr", e.label), resolveEssentialLabel("de", e.label));
    add("Requirements · installation essentials", `${profile.implementationId} · ${e.label}`, e.body,
      resolveEssentialBody("fr", profile.implementationId, e.label, e.body), resolveEssentialBody("de", profile.implementationId, e.label, e.body));
  }
  for (const r of profile.technicalDetail) {
    add("Requirements · technical detail", `label`, r.label, resolveDetailLabel("fr", r.label), resolveDetailLabel("de", r.label));
    add("Requirements · technical detail", `${profile.implementationId} · ${r.label}`, r.value,
      resolveDetailValue("fr", profile.implementationId, r.label, r.value), resolveDetailValue("de", profile.implementationId, r.label, r.value));
  }
}
for (const input of evidenceInputs) {
  add("Requirements · inputs", input.id, input.label, resolveInputLabel("fr", input.id, input.label), resolveInputLabel("de", input.id, input.label));
}

// 7. Explainer videos, privacy statement.
for (const v of capabilityExplainerVideos) {
  const en = { actionLabel: v.actionLabel, intro: v.intro, description: v.description };
  pairWalk("Drawer · example videos", `${v.capabilityId}`, en, resolveVideoCopy("fr", v.capabilityId, en), resolveVideoCopy("de", v.capabilityId, en));
  if (v.followOn) {
    const f = { actionLabel: v.followOn.actionLabel, intro: v.followOn.intro, description: v.followOn.description, distinctionNote: v.followOn.distinctionNote };
    pairWalk("Drawer · example videos", `${v.capabilityId} · follow-on`, f, resolveFollowOnVideoCopy("fr", f), resolveFollowOnVideoCopy("de", f));
  }
}
for (const [kind, label] of Object.entries(explainerVideoViewLabels)) {
  add("Drawer · example videos", `view ${kind}`, label, resolveVideoViewLabel("fr", kind, label), resolveVideoViewLabel("de", kind, label));
}
pairWalk("Privacy statement", "", resolvePrivacyCopy("en"), resolvePrivacyCopy("fr"), resolvePrivacyCopy("de"));

// 8. Customer cases.
for (const proof of proofAssets.filter((p) => p.externalUseApproved)) {
  for (const k of ["title", "challenge", "measurementApproach", "customerLearning", "truthBoundary"]) {
    add("Customer cases", `${proof.customerName} · ${k}`, proof[k], proofCaseTranslations.fr[proof.id]?.[k], proofCaseTranslations.de[proof.id]?.[k]);
  }
}

console.log(JSON.stringify([...rows.values()].map((r) => ({ ...r, where: r.where.join("; ") })), null, 1));
