/**
 * Gate 1 pilot — Shopping Centre Internal circulation, in the redesigned
 * composition, in English, French and German.
 *
 * ISOLATED BY CONSTRUCTION. This route is the only way to reach the redesign.
 * The shell at `/` is untouched and still renders the approved components, so
 * nothing here activates globally and every frozen baseline is still the
 * baseline. Returns 404 in a production build, like every other preview route.
 *
 * `?locale=en|fr|de` selects the language for a headless capture; the switcher
 * in the header does the same thing interactively. `?depth=<section>` opens the
 * technical-depth drawer on that section, `?focus=<id>` selects a subject and
 * `?point=open` opens that subject's point of interest,
 * for the same reason: a state a reviewer must see is a state a capture must
 * be able to address.
 */

import { notFound } from "next/navigation";
import { isLocale, defaultLocale } from "../../../i18n/locales";
import { getMessages } from "../../../i18n/messages";
import { getSegment } from "../../../content/runtime";
import type { SceneId } from "../../../content/types";
import { CirculationPilot } from "./pilot";

export default async function CirculationPilotPreview({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const params = await searchParams;
  const raw = params.locale;
  const value = Array.isArray(raw) ? raw[0] : raw;

  const depth = params.depth;
  const section = Array.isArray(depth) ? depth[0] : depth;

  const rawScene = params.scene;
  const requested = Array.isArray(rawScene) ? rawScene[0] : rawScene;

  /* A scene is only addressable when the segment's own coreRoute contains it
     AND the pilot has localized copy for it. Two conditions, because either
     alone would let a URL reach a half-built page. */
  const route = getSegment("shopping-centre")?.coreRoute ?? [];
  const pilotScenes = getMessages(defaultLocale).scene;
  const sceneId = (route.find((id) => id === requested && pilotScenes[id])
    ?? "shopping-centre-internal-circulation") as SceneId;

  const rawFocus = params.focus;
  const focus = Array.isArray(rawFocus) ? rawFocus[0] : rawFocus;

  const rawPoint = params.point;
  const point = (Array.isArray(rawPoint) ? rawPoint[0] : rawPoint) === "open";

  return (
    <CirculationPilot
      initialLocale={isLocale(value) ? value : defaultLocale}
      initialSceneId={sceneId}
      initialFocusId={focus ?? null}
      initialPointOpen={point}
      initialDepthSection={section ?? null}
    />
  );
}
