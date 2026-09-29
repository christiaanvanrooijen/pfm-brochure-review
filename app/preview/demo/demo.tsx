"use client";

/**
 * The demo, which is a journey and nothing else.
 *
 * WHAT THIS DELIBERATELY NO LONGER HAS
 *
 * A picker of its own. It used to carry one — a second grid of five segments,
 * with its own names ("Retail Chain", "Quick Service Restaurant"), its own card
 * design and its own lead paragraph — so a reader who entered from the overview
 * and then chose "All segments" arrived somewhere that looked like a different
 * product. There is one front door now, at `/`, and this route renders that
 * same component when it is opened without a segment.
 *
 * WHAT IT OWNS INSTEAD
 *
 * The address, and the list of scenes the reader has actually opened. Both have
 * to outlive a Back: the journey remounts when the reader moves through
 * history, so anything held inside it would be quietly reset — which is exactly
 * how the closing summary came to omit scenes the person had seen.
 */

import { useCallback, useEffect, useState } from "react";
import { DemoJourney, journeySceneCopy } from "./journey";
import { ConversationReview } from "./review";
import { ConversationBrief } from "./brief";
import { demoEnding } from "./registry";
import { defaultLocale, type Locale } from "../../i18n/locales";
import { segmentDefinitions } from "../../content/segments";
import type { SceneId, SegmentId } from "../../content/types";
import {
  addressAfter,
  openingScene,
  parseDemoUrl,
  briefUrl,
  pickerUrl,
  reviewUrl,
  conversationAfterRestart,
  visitedAfter,
  type DemoView,
} from "./navigation";

const KNOWN: readonly SegmentId[] = segmentDefinitions.map((s) => s.id);

export function Demo({
  initialSegment,
  initialLocale,
  initialScene,
  initialView = "scene",
  initialFocus = null,
  initialPointOpen = false,
  initialDepthSection = null,
}: {
  initialSegment: SegmentId;
  initialLocale?: Locale;
  initialScene?: string;
  /** `review` opens the journey's close directly, from a link. */
  initialView?: DemoView;
  initialFocus?: string | null;
  initialPointOpen?: boolean;
  initialDepthSection?: string | null;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? defaultLocale);

  /**
   * Where the reader is.
   *
   * `epoch` exists so a history move re-enters the journey on the scene the
   * address names. Moving forward must NOT remount — the journey would lose the
   * focus and the open point the reader is working with — but moving backwards
   * is a return to a state this component no longer holds, and re-entering it
   * from the address is both simpler and more truthful than replaying it.
   */
  const [place, setPlace] = useState<{
    segmentId: SegmentId;
    sceneId: SceneId | null;
    view: DemoView;
    epoch: number;
  }>({
    segmentId: initialSegment,
    sceneId: (initialScene as SceneId | undefined) ?? null,
    view: initialView,
    epoch: 0,
  });

  /**
   * The scenes this person has actually opened, in the order they opened them.
   *
   * Held HERE, above the remount, for the reason the summary exists: it reports
   * a conversation. When this lived inside the journey, one Back emptied it and
   * the summary then listed fewer scenes than the person had just been shown —
   * a quiet, plausible-looking untruth, which is the worst kind.
   */
  const [visited, setVisited] = useState<readonly SceneId[]>([]);

  /**
   * The presenter's own note for the conversation brief.
   *
   * Held here, above the remount a history move causes, for the same reason
   * `visited` is: a person who types a note, presses Back to check a scene and
   * returns would otherwise find it gone. It lives in this component and
   * nowhere else — no storage, no address, no request — so closing the tab
   * ends it, which is the only promise this gate is allowed to make.
   */
  const [note, setNote] = useState("");
  const noteVisit = useCallback((sceneId: SceneId) => {
    setVisited((seen) => visitedAfter(seen, sceneId));
  }, []);

  /* Back and Forward. The demo pushes its own history entries, so it has to
     answer for them. A history entry with no segment is the picker, which lives
     outside this route — the browser is already on its way there, and this
     handler leaves it alone.

     It writes no address of its own, and leaves nothing set for the next move
     to find: the browser has already moved, and the reader's next action is
     entitled to be treated as what it is. */
  useEffect(() => {
    const onPop = () => {
      const next = parseDemoUrl(window.location.search, KNOWN);
      if (!next.segmentId) return;

      /* The language the reader chose survives the move, and the entry they
         landed on is corrected to say so.

         A history entry remembers the language it was written in, so without
         this a Back would silently undo a language change made after it — the
         reader would be returned to a scene they had already read in French
         and find it in English. Where they are is a place; which language they
         read it in is not, so only the place comes from the address. */
      const url = new URL(window.location.href);
      if (url.searchParams.get("locale") !== locale) {
        url.searchParams.set("locale", locale);
        window.history.replaceState(null, "", `${url.pathname}${url.search}`);
      }

      setPlace((current) => ({
        segmentId: next.segmentId as SegmentId,
        sceneId: next.sceneId,
        view: next.view,
        epoch: current.epoch + 1,
      }));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [locale]);

  const segmentId = place.segmentId;
  const route = segmentDefinitions.find((s) => s.id === segmentId)!.coreRoute;

  /* Keep the address honest when a brief was asked for and there is no
     conversation to write one from. */
  const briefWithoutConversation = place.view === "brief" && visited.length === 0;
  useEffect(() => {
    if (!briefWithoutConversation) return;
    window.history.replaceState(null, "", reviewUrl(segmentId, locale));
  }, [briefWithoutConversation, locale, segmentId]);

  /** Move to a place inside this journey, and say so in the address. */
  const goToPlace = useCallback(
    (sceneId: SceneId | null, view: DemoView) => {
      setPlace((current) => ({ segmentId, sceneId, view, epoch: current.epoch + 1 }));
      window.history.pushState(
        null,
        "",
        addressAfter("step", segmentId, sceneId, locale, view).url,
      );
    },
    [locale, segmentId],
  );

  /**
   * Begin again — from the journey bar or from the review, identically.
   *
   * One function, because the two paths must forget the same things. The note
   * is part of the conversation, so it goes with the scenes.
   */
  const forget = useCallback((firstSceneId: SceneId) => {
    const next = conversationAfterRestart(firstSceneId);
    setVisited(next.visited);
    setNote(next.note);
  }, []);

  const restart = useCallback(() => {
    forget(route[0]);
    goToPlace(route[0], "scene");
  }, [forget, goToPlace, route]);

  /* A brief of nothing is a document that reports a conversation which did not
     happen. Asked for one — by a hand-typed address, or a Restart that has not
     been walked yet — the demo answers with the review, which says honestly
     that nothing was opened. The address is corrected to match, because an
     address that says "brief" while the page says "review" is its own small
     untruth. */
  const wantsBrief = place.view === "brief" && visited.length > 0;
  const view: DemoView = place.view === "brief" && !wantsBrief ? "review" : place.view;

  if (wantsBrief) {
    return (
      <ConversationBrief
        segmentId={segmentId}
        locale={locale}
        visited={visited}
        copyFor={(sceneId, briefLocale) => journeySceneCopy(segmentId, sceneId, briefLocale)}
        note={note}
        onNote={setNote}
        onLocale={(next) => {
          setLocale(next);
          window.history.replaceState(null, "", briefUrl(segmentId, next));
        }}
        onBack={() => goToPlace(null, "review")}
        exitHref={pickerUrl(locale)}
      />
    );
  }

  if (view === "review") {
    const ending = demoEnding[segmentId];
    return (
      <ConversationReview
        segmentId={segmentId}
        locale={locale}
        visited={visited}
        copyFor={(sceneId, reviewLocale) => journeySceneCopy(segmentId, sceneId, reviewLocale)}
        onLocale={(next) => {
          setLocale(next);
          /* Same place, other words — it rewrites the entry rather than adding
             one, exactly as a language change does inside a scene. */
          window.history.replaceState(null, "", reviewUrl(segmentId, next));
        }}
        /* Back into the conversation at its furthest point, which is where the
           reader left it. */
        onResume={() => goToPlace(visited[visited.length - 1] ?? route[0], "scene")}
        onRestart={restart}
        onPrepareBrief={() => goToPlace(null, "brief")}
        exitHref={pickerUrl(locale)}
        /* Only where one genuinely exists. Outlet Centre and QSR have none, and
           are offered nothing rather than something that looks like it. */
        configureHref={ending.kind === "configure" ? ending.href : null}
      />
    );
  }

  return (
    <DemoJourney
      /* Keyed on the history position, not only the segment: a Back into a
         different scene of the SAME segment has to re-enter it there. */
      key={`${segmentId}-${place.epoch}`}
      segmentId={segmentId}
      initialLocale={locale}
      initialSceneId={place.sceneId ?? initialScene}
      initialFocusId={initialFocus}
      initialPointOpen={initialPointOpen}
      initialDepthSection={initialDepthSection}
      exitHref={pickerUrl(locale)}
      onVisit={noteVisit}
      onRestart={forget}
      onOpenReview={() => goToPlace(null, "review")}
      onNavigate={(sceneId, sceneLocale, move) => {
        setLocale(sceneLocale);
        /* Every move the reader makes is written, whatever the move before it
           was. Only moves the reader makes reach here. */
        const next = addressAfter(move, segmentId, sceneId, sceneLocale);
        if (next.mode === "push") window.history.pushState(null, "", next.url);
        else window.history.replaceState(null, "", next.url);
      }}
    />
  );
}
