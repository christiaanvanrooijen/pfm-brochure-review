"use client";

import { useMemo, useState } from "react";
import type { DataRole, SceneId, SegmentId } from "../content/types";
import { getSceneForSegment } from "../content/runtime";
import { evidenceInputs } from "../content/evidence-inputs";
import { getSceneEvidenceRuntime } from "../content/evidence-runtime";
import { getTechnologyDrilldownForScene } from "../content/technology-runtime";
import type { LensId } from "../lib/types";

/**
 * Presentation mapping only.
 *
 * The underlying typed model keeps its own role names (`DataRole`); this map
 * translates them into the four stable presenter labels used in the
 * experience shell. It does not rename or replace the typed roles.
 */
const LENS_DISPLAY: ReadonlyArray<{
  role: DataRole;
  label: string;
  lensId: LensId | null;
  note: string;
}> = [
  { role: "physical", label: "Physical", lensId: "physical", note: "Measured at the location" },
  { role: "mobile_geo", label: "Mobile & geo", lensId: "mobile-geo", note: "Aggregate area context" },
  { role: "business", label: "Business", lensId: "business", note: "Customer-connected context" },
  { role: "insight", label: "Insight", lensId: null, note: "Derived from its named source layers" },
];

/** Presentational glyph for a data layer. Carries no state or behaviour. */
function LensIcon({ role }: { role: DataRole }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (role) {
    case "physical":
      return (
        <svg {...common}><path d="M4 19V9l8-5 8 5v10" /><path d="M9.5 19v-5h5v5" /></svg>
      );
    case "mobile_geo":
      return (
        <svg {...common}><circle cx="12" cy="12" r="2.2" /><path d="M7.8 7.8a6 6 0 000 8.4M16.2 16.2a6 6 0 000-8.4" /><path d="M4.8 4.8a10 10 0 000 14.4M19.2 19.2a10 10 0 000-14.4" /></svg>
      );
    case "business":
      return (
        <svg {...common}><path d="M4.5 8.5h15l-1.2 11h-12.6z" /><path d="M8.8 8.5V6.4a3.2 3.2 0 016.4 0v2.1" /></svg>
      );
    default:
      return (
        <svg {...common}><path d="M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6L5.5 10l4.6-1.9z" /><path d="M18 16.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" /></svg>
      );
  }
}

const inputRoleById = new Map<string, DataRole>(
  evidenceInputs.map((input) => [input.id, input.dataRole]),
);

interface SceneLensRailProps {
  segmentId: SegmentId;
  sceneId: SceneId;
  activeLenses: LensId[];
  activeRoles: readonly DataRole[];
  onToggleLens: (lens: LensId) => void;
  /**
   * Optional per-scene replacement for a role's supporting note.
   *
   * The global notes in `LENS_DISPLAY` are deliberately generic because the
   * same role plays the same structural part in most scenes. A few scenes need
   * a role for a narrower reason than the generic label suggests — Zone
   * engagement requires Business purely for zone and layout definitions, not
   * for POS, staffing or merchandising data — and a generic
   * "Customer-connected context" would misdescribe that.
   *
   * This only replaces the supporting line. It does not rename or re-type the
   * role, does not change which roles a scene declares, and scenes that pass
   * nothing keep the existing global text unchanged.
   */
  roleNotes?: Partial<Record<DataRole, string>>;
}

/**
 * The four-lens rail, shared by every scene in the experience.
 *
 * Three states, all derived from typed content and the evidence runtime —
 * never hard-coded per scene:
 *
 * - unavailable: the scene declares no evidence input of that role at all.
 * - offered: the scene declares an input of that role, but the role currently
 *   contributes nothing to what is on screen (either switched off, or it is
 *   optional context with no demo values). It stays toggleable and toggling it
 *   cannot change any value the scene does not draw from it.
 * - active: the role currently supplies available evidence to this scene.
 *
 * Because the Capture chain (passer-by count, store visits, capture rate) is
 * now entirely Physical + Insight, switching Mobile & geo cannot affect it,
 * and switching Physical off correctly removes all three.
 */
export function SceneLensRail({
  segmentId,
  sceneId,
  activeLenses,
  activeRoles,
  onToggleLens,
  roleNotes,
}: SceneLensRailProps) {
  const [methodOpen, setMethodOpen] = useState(false);

  const scene = useMemo(() => getSceneForSegment(segmentId, sceneId), [segmentId, sceneId]);

  // Roles this scene can be told with at all, taken from the evidence inputs
  // its typed content actually declares (plus the roles it declares as
  // required or optional data). A role absent here has no compatible input.
  const declaredRoles = useMemo(() => {
    const roles = new Set<DataRole>();
    for (const evidence of scene.evidence) {
      for (const inputId of evidence.inputIds ?? []) {
        const role = inputRoleById.get(inputId);
        if (role) roles.add(role);
      }
    }
    for (const role of scene.dataRequirements.required) roles.add(role);
    return roles;
  }, [scene]);

  const evidenceRuntime = useMemo(
    () => getSceneEvidenceRuntime(segmentId, sceneId, activeRoles),
    [segmentId, sceneId, activeRoles],
  );

  // Roles currently supplying something the scene can show.
  const contributingRoles = useMemo(() => {
    const roles = new Set<DataRole>();
    for (const evidence of evidenceRuntime.availableEvidence) {
      roles.add(evidence.dataRole);
    }
    return roles;
  }, [evidenceRuntime]);

  // Whether this scene has any approved demo values at all. A scene without
  // them reports "awaiting demo evidence" instead of implying a switched-off
  // layer is the reason nothing is shown.
  const hasDemoEvidence = evidenceRuntime.evidence.length > 0;

  const technology = useMemo(
    () => getTechnologyDrilldownForScene(segmentId, sceneId),
    [segmentId, sceneId],
  );

  return (
    <aside className="capture__lenses" aria-label="Data lenses">
      <h2>Data lenses</h2>
      <ul>
        {LENS_DISPLAY.map((lens) => {
          const supported = declaredRoles.has(lens.role);
          const active = supported && contributingRoles.has(lens.role);
          const interactive = supported && lens.lensId !== null;
          const switchedOn = lens.lensId === null || activeLenses.includes(lens.lensId);
          const className = `capture__lens${active ? " is-active" : ""}${supported ? "" : " is-unavailable"}`;

          // A scene-supplied note describes what the role is for in this scene,
          // never what it currently contains, so it is safe to use wherever the
          // generic note would be used — and, for a role the scene requires, in
          // place of the bare "Awaiting demo evidence" line too. Scenes that
          // supply nothing keep the previous text exactly.
          const roleNote = roleNotes?.[lens.role];
          const required = scene.dataRequirements.required.includes(lens.role);

          let note: string;
          if (!supported) {
            note = "No compatible input enabled";
          } else if (active) {
            note = roleNote ?? lens.note;
          } else if (!hasDemoEvidence) {
            note = required ? roleNote ?? "Awaiting demo evidence" : "Awaiting demo evidence";
          } else if (!switchedOn) {
            // A role the scene REQUIRES and the presenter has switched off is
            // reported plainly: something the reading needs is missing, and the
            // note must say so rather than describe what the layer is for.
            //
            // A role the scene only lists as OPTIONAL is a different case. It
            // is switched off because the scene never used it, so "Switched
            // off" alone invites exactly the wrong inference — that a
            // contributing source was disabled. Where the scene has supplied a
            // note for such a role, that note says what the layer would and
            // would not do here, which stays true whether it is on or off. The
            // toggle's own indicator already carries the off state.
            note = required ? "Switched off" : roleNote ?? "Switched off";
          } else if (required) {
            note = roleNote ?? lens.note;
          } else {
            note = "Optional context · not used in this reading";
          }

          const body = (
            <>
              <span className="capture__lens-mark" aria-hidden="true">
                <LensIcon role={lens.role} />
              </span>
              <span className="capture__lens-text">
                <strong>{lens.label}</strong>
                <small>{note}</small>
              </span>
              <span className="capture__lens-state" aria-hidden="true" />
            </>
          );
          return (
            <li key={lens.role}>
              {interactive ? (
                <button
                  type="button"
                  className={className}
                  aria-pressed={active}
                  onClick={() => lens.lensId && onToggleLens(lens.lensId)}
                >
                  {body}
                </button>
              ) : (
                <div className={className} aria-disabled={!supported}>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="capture__method"
        aria-expanded={methodOpen}
        onClick={() => setMethodOpen((open) => !open)}
      >
        How we measure this
        <span aria-hidden="true">{methodOpen ? "×" : "›"}</span>
      </button>

      {methodOpen && technology && (
        <div className="capture__method-panel">
          {technology.capabilities.map((entry) => (
            <div key={entry.capability.id}>
              <strong>{entry.capability.name}</strong>
              <p>{entry.capability.purpose}</p>
              <p className="capture__privacy">{entry.capability.privacyPrinciple}</p>
            </div>
          ))}
          <p className="capture__method-note">
            Implementation options are compared later, in Configure.
          </p>
        </div>
      )}
    </aside>
  );
}

/** Map the presenter lens ids onto the typed data roles used by the runtime. */
export function lensesToRoles(activeLenses: LensId[]): readonly DataRole[] {
  // Insight is not a source layer a presenter switches off; it is the derived
  // layer. It is always queried, and the evidence runtime decides whether the
  // derived value may be shown from its named source layers.
  const roles = new Set<DataRole>(["insight"]);
  for (const lens of activeLenses) {
    if (lens === "physical") roles.add("physical");
    if (lens === "mobile-geo") roles.add("mobile_geo");
    if (lens === "business") roles.add("business");
  }
  return [...roles];
}
