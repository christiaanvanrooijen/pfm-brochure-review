/**
 * The drawer's content surface, as a fillable inventory.
 *
 * WHY THIS IS GENERATED AND NOT WRITTEN BY HAND
 *
 * "How does this work?" resolves five sections for every Core scene from the
 * typed runtime — technology, visuals, the segment+capability override, the
 * scene's dependency model and the proof runtime. A hand-kept list of what
 * exists would be wrong within a week, and wrong in the direction that matters:
 * it would claim coverage the product does not have.
 *
 * So this asks the runtime the same questions the drawer asks, and writes down
 * what came back. Re-run it after any content change and the answer is current.
 *
 * WHY FOUR TABLES AND NOT ONE
 *
 * The naive shape is one row per scene × section × item — 464 rows, of which
 * most are duplicates: 23 distinct implementations render 105 times, so a
 * per-scene sheet would ask for the same sensor photograph four times over.
 *
 * The content has two different lifetimes, and the sheets follow them:
 *
 *   views          what each scene's drawer shows today. Read this to see the
 *                  product; it is an overview, not a fill-in.
 *   capabilities   artwork and video, per SEGMENT + capability — because a
 *                  capability id is shared and footage is not.
 *   implementations photo, role, limitation, installation and privacy, per
 *                  supplier product. Filled once, reused everywhere.
 *   practice       customer proof, per scene. Empty everywhere today.
 *
 * Usage:  node scripts/content-inventory.mjs [outDir]
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { segmentDefinitions, allScenes } from "../app/content/segments/index.ts";
import {
  getSceneCapabilityViews,
  getScenePrivacyEntries,
  getSceneRequirementView,
} from "../app/content/scene-technology-runtime.ts";
import { getPlayableProofsForScene } from "../app/content/proof-runtime.ts";

const outDir = process.argv[2] ?? fileURLToPath(new URL("../docs/content", import.meta.url));
mkdirSync(outDir, { recursive: true });

/** RFC-4180 enough for Excel and Sheets: quote everything, double inner quotes. */
const csv = (rows) =>
  rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n") + "\n";

const write = (name, rows) => {
  const path = `${outDir}/${name}`;
  writeFileSync(path, csv(rows));
  console.log(`${String(rows.length - 1).padStart(4)} rows  ${path}`);
};

const segmentLabel = (segment) => segment.experienceName ?? segment.name;

/* ------------------------------------------------------------------ *
   1. VIEWS — what each scene's drawer shows today.
 * ------------------------------------------------------------------ */

const views = [[
  "segment", "segment_id", "scene_no", "scene_id", "scene_title", "stage",
  "section", "shows_today", "gap", "depends_on",
]];

/* ------------------------------------------------------------------ *
   2. CAPABILITIES — artwork and video, per segment + capability.
 * ------------------------------------------------------------------ */

const capabilityRows = new Map();

/* ------------------------------------------------------------------ *
   3. IMPLEMENTATIONS — per supplier product, filled once.
 * ------------------------------------------------------------------ */

const implementationRows = new Map();

/* ------------------------------------------------------------------ *
   4. PRACTICE — customer proof, per scene.
 * ------------------------------------------------------------------ */

const practice = [[
  "segment", "segment_id", "scene_no", "scene_id", "scene_title",
  "proofs_today", "gap", "TEXT_what_the_proof_shows", "ASSET_name", "ASSET_path", "NOTES",
]];

for (const segment of segmentDefinitions) {
  for (const [index, sceneId] of segment.coreRoute.entries()) {
    const scene = allScenes.find((s) => s.id === sceneId);
    const position = `${String(index + 1).padStart(2, "0")}/${String(segment.coreRoute.length).padStart(2, "0")}`;
    const base = [segmentLabel(segment), segment.id, position, scene.id, scene.title, scene.journeyStage];

    const capabilityViews = getSceneCapabilityViews(segment.id, scene);
    const privacyEntries = getScenePrivacyEntries(segment.id, scene);
    const requirements = getSceneRequirementView(scene);
    const proofs = getPlayableProofsForScene(segment.id, scene.id);

    const capabilityIds = capabilityViews.map((c) => c.capabilityId);
    const implementationIds = [
      ...new Set(capabilityViews.flatMap((c) => c.implementations.map((i) => i.id))),
    ];

    /* --- how ------------------------------------------------------- */
    const artwork = capabilityViews.filter((c) => c.explainerVisuals.length > 0).length;
    const videos = capabilityViews.filter((c) => c.explainerVideo).length;
    views.push([
      ...base, "How it works",
      `${capabilityViews.length} capability view(s), ${artwork} with an illustration, ${videos} with a video`,
      artwork < capabilityViews.length ? `missing illustration for ${capabilityViews.length - artwork} capability view(s)` : "",
      capabilityIds.join(" · "),
    ]);

    /* --- technology ------------------------------------------------ */
    const photos = capabilityViews.flatMap((c) => c.implementations).filter((i) => i.visual).length;
    const implCount = capabilityViews.flatMap((c) => c.implementations).length;
    views.push([
      ...base, "Technology",
      implCount === 0 ? "no implementation resolves here" : `${implCount} implementation card(s), ${photos} with a photo`,
      implCount === 0 ? "no implementation resolves" : photos < implCount ? `missing photo for ${implCount - photos} card(s)` : "",
      implementationIds.join(" · "),
    ]);

    /* --- requirements ---------------------------------------------- */
    const withProfile = capabilityViews
      .flatMap((c) => c.implementations)
      .filter((i) => i.requirementProfile).length;
    views.push([
      ...base, "Requirements",
      `${requirements.dependencies.length} derived output(s), ${withProfile}/${implCount} implementation(s) with installation essentials`,
      withProfile < implCount ? `missing installation essentials for ${implCount - withProfile} implementation(s)` : "",
      requirements.dependencies.map((d) => d.dependencyId).join(" · "),
    ]);

    /* --- privacy ---------------------------------------------------- */
    const backed = privacyEntries.filter((p) => p.privacyStatus === "source_backed").length;
    views.push([
      ...base, "Privacy",
      privacyEntries.length === 0 ? "no privacy entry resolves here" : `${privacyEntries.length} statement(s), ${backed} fully source-backed`,
      privacyEntries.length === 0 ? "no privacy entry resolves" : backed < privacyEntries.length ? `${privacyEntries.length - backed} statement(s) not yet fully source-backed` : "",
      [...new Set(privacyEntries.map((p) => p.implementationId))].join(" · "),
    ]);

    /* --- in practice ------------------------------------------------ */
    views.push([
      ...base, "In practice",
      proofs.length === 0 ? "nothing — no customer proof is permitted here yet" : `${proofs.length} proof(s)`,
      proofs.length === 0 ? "EMPTY — needs an approved customer proof, or stays deliberately empty" : "",
      proofs.map((p) => p.id ?? "").join(" · "),
    ]);

    practice.push([
      ...base.slice(0, 5),
      proofs.length,
      proofs.length === 0 ? "EMPTY" : "",
      "", "", "", "",
    ]);

    /* --- shared: capabilities -------------------------------------- */
    for (const view of capabilityViews) {
      const key = `${segment.id}|${view.capabilityId}`;
      if (capabilityRows.has(key)) {
        capabilityRows.get(key).scenes.push(`${position} ${scene.title}`);
        continue;
      }
      capabilityRows.set(key, {
        segment: segmentLabel(segment),
        segmentId: segment.id,
        capabilityId: view.capabilityId,
        name: view.name,
        purpose: view.purpose,
        illustrations: view.explainerVisuals.map((v) => v.assetPath).join(" · "),
        illustrationCount: view.explainerVisuals.length,
        video: view.explainerVideo?.video?.assetPath ?? "",
        scenes: [`${position} ${scene.title}`],
      });
    }

    /* --- shared: implementations ----------------------------------- */
    for (const view of capabilityViews) {
      for (const impl of view.implementations) {
        if (implementationRows.has(impl.id)) {
          implementationRows.get(impl.id).uses += 1;
          implementationRows.get(impl.id).segments.add(segmentLabel(segment));
          continue;
        }
        const privacy = privacyEntries.find((p) => p.implementationId === impl.id);
        implementationRows.set(impl.id, {
          id: impl.id,
          supplier: impl.supplier ?? "",
          product: impl.product ?? "",
          role: impl.implementationRole,
          readiness: impl.readiness,
          photo: impl.visual?.assetPath ?? "",
          installation: impl.requirementProfile ? "yes" : "",
          privacyStatus: impl.privacyStatus,
          privacyEvidence: impl.hasPrivacyEvidence ? "yes" : "",
          supported: impl.supportedClaims.length,
          blocked: impl.blockedClaims.length,
          sources: impl.sourceRefs.length,
          uses: 1,
          segments: new Set([segmentLabel(segment)]),
          privacyPrinciple: privacy?.privacyPrinciple ?? "",
        });
      }
    }
  }
}

/* ------------------------------------------------------------------ *
   Emit.
 * ------------------------------------------------------------------ */

write("01-views.csv", views);

write("02-capabilities.csv", [
  [
    "segment", "segment_id", "capability_id", "capability_name", "purpose",
    "scenes_using_it", "illustrations_today", "illustration_paths", "video_path",
    "gap", "TEXT_illustration_caption", "ASSET_name", "ASSET_path", "NOTES",
  ],
  ...[...capabilityRows.values()]
    .sort((a, b) => a.segmentId.localeCompare(b.segmentId) || a.capabilityId.localeCompare(b.capabilityId))
    .map((row) => [
      row.segment, row.segmentId, row.capabilityId, row.name, row.purpose,
      row.scenes.join(" · "), row.illustrationCount, row.illustrations, row.video,
      row.illustrationCount === 0 ? "NO ILLUSTRATION" : "",
      "", "", "", "",
    ]),
]);

write("03-implementations.csv", [
  [
    "implementation_id", "supplier", "product", "role", "readiness", "used_in_segments",
    "scene_uses", "photo_today", "installation_essentials", "privacy_status",
    "privacy_evidence", "supported_claims", "blocked_claims", "source_refs",
    "gap", "TEXT_one_limitation", "TEXT_installation_essentials", "TEXT_privacy_statement",
    "ASSET_name", "ASSET_path", "SOURCE_url_or_doc", "NOTES",
  ],
  ...[...implementationRows.values()]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((row) => [
      row.id, row.supplier, row.product, row.role, row.readiness,
      [...row.segments].join(" · "), row.uses, row.photo, row.installation,
      row.privacyStatus, row.privacyEvidence, row.supported, row.blocked, row.sources,
      [
        row.photo ? "" : "NO PHOTO",
        row.installation ? "" : "NO INSTALLATION ESSENTIALS",
        row.privacyStatus === "source_backed" ? "" : `PRIVACY: ${row.privacyStatus}`,
      ].filter(Boolean).join(" · "),
      "", "", "", "", "", "", "",
    ]),
]);

write("04-in-practice.csv", practice);

console.log(`
Summary
  ${views.length - 1} scene sections across ${segmentDefinitions.length} segments
  ${capabilityRows.size} segment+capability pairs (artwork is per segment, never shared)
  ${implementationRows.size} distinct implementations
  ${practiceSummary()}`);

function practiceSummary() {
  // Column 6 is proofs_today; row 0 is the header.
  const withProof = practice.slice(1).filter((row) => Number(row[5]) > 0).length;
  return withProof === 0
    ? `every "In practice" section is empty`
    : `${withProof} of ${practice.length - 1} "In practice" sections show approved proof`;
}
