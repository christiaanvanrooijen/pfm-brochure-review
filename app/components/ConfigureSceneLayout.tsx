"use client";

import { ProofCase } from "./ProofCase";
import { YouTubeOnRequest } from "./YouTubeOnRequest";
import { implementationPresentationNames } from "../content/technology-presentation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { SegmentId } from "../content/types";
import {
  configureDepthIds,
  configureDepthLabels,
  getConfigureSynthesis,
  getSolutionDirectionsForSegment,
  getSolutionImplementationOptions,
  getSolutionPrivacyDetail,
  getSolutionProof,
  getSolutionRequirements,
  getSolutionTechnologyDrilldown,
  type ConfigureAudience,
  type ConfigureDepthId,
  type SolutionDirectionDefinition,
  type SolutionTerritory,
} from "../content/solution-runtime";
import {
  resolveVisibleDepth,
  type ConfigureViewAction,
  type ConfigureViewState,
} from "../lib/configure-view";

interface ConfigureSceneLayoutProps {
  /** Which segment's directions and synthesis contract this stage renders. */
  segmentId: SegmentId;
  /**
   * Masthead copy. Presentation-layer rather than typed content: the typed
   * governing question is the architecture's question and is still rendered
   * below this, but it is not the right first sentence for a prospect. Each
   * segment supplies its own, because a centre is not a chain of stores.
   */
  headline: string;
  lead: string;
  /**
   * One glyph per territory THIS segment uses.
   *
   * A lookup rather than a switch with a default. The previous switch fell
   * through to the Retail performance glyph for any territory it did not know,
   * so a new segment would have silently inherited a chart-like mark implying
   * commercial performance. A missing entry now renders nothing at all, and each
   * segment's tests assert the set is complete, so the failure is loud instead.
   */
  glyphs: Readonly<Partial<Record<SolutionTerritory, ReactNode>>>;
  /** Qualifying sentence under an explainer video, in this segment's language. */
  videoNoteImplementation: string;
  videoNoteApproach: string;
  /**
   * The lede above a pair of explainer diagrams, in this segment's language.
   *
   * Segment-specific because it names the unit the choice is made for. It read
   * "the choice is made per store" for every segment, which reached Shopping
   * Centre under "How do visitors move through the centre" and told a centre
   * that its measurement design is decided per store.
   */
  explainerPairLede: string;
  /**
   * Which direction and depth layer are open. Owned by the journey shell rather
   * than by this component, so that stepping on to Act and back does not reset
   * the brochure to the Configure landing. The reducer itself is unchanged.
   */
  view: ConfigureViewState;
  onView: (action: ConfigureViewAction) => void;
  onNextStage: () => void;
  presentationMode?: boolean;
  /**
   * Whether Configure offers the step on to Act.
   *
   * Defaults to true, which is every segment whose Act exists. A segment without
   * one withholds the control rather than pointing it at another segment's Act —
   * the Act stage renders Retail's Act component, so a generic "next step" here
   * would walk a centre into a Retail page.
   */
  showNextStage?: boolean;
  /**
   * The sentence shown in place of the step-on control when `showNextStage` is
   * false.
   *
   * It exists because the default below is written in Shopping Centre's own
   * vocabulary — "the centre journey" — which was correct while Shopping Centre
   * was the only segment that could reach this state. A retail park has no
   * centre, and a shared layout must not put one segment's noun on another's
   * page. The default is unchanged, so Retail and Shopping Centre render
   * exactly as before.
   */
  terminalNote?: string;
}

/**
 * Number words for the back-control, so it reads as English rather than as a
 * count. Derived from the directions actually rendered: the label was the
 * literal string "All four directions", which would be a lie for any segment
 * that does not have exactly four.
 */
/**
 * The standing caption under an explainer.
 *
 * Kept here as the default rather than pushed out to every visual: it is true of
 * almost all of them, and repeating it per asset would invite it drifting. A
 * visual whose artwork makes it inaccurate overrides it with its own note.
 */
const DEFAULT_ILLUSTRATION_NOTE =
  "Illustration of the measurement principle. Not customer data, and not a picture of equipment.";

const COUNT_WORDS: Record<number, string> = {
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
};

/** Sales-Mode-only readiness chip. Never rendered to a prospect. */
function StatusChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="configure__status">
      <em>{label}</em>
      {value.replace(/_/g, " ")}
    </span>
  );
}


/**
 * The secondary line under an implementation's role: its functional name.
 *
 * A device with a functional name shows it ("3D Sensor Basic FoV"). A method
 * class with no supplier shows its class ("Compatible configured analytics or
 * plugin"), which names no vendor. A supplier's product without a functional
 * name yet shows nothing here: the role above already says what it is, and a
 * vendor or model name is what the naming rule keeps off the page.
 */
function functionalLine(impl: {
  id: string;
  supplier: string | null;
  product: string | null;
}): string | null {
  const functional =
    implementationPresentationNames[impl.id as keyof typeof implementationPresentationNames];
  if (functional) return functional;
  if (impl.supplier) return null;
  return impl.product ?? "Method class — no single supplier";
}

export function ConfigureSceneLayout({
  segmentId,
  headline,
  lead,
  glyphs,
  videoNoteImplementation,
  videoNoteApproach,
  explainerPairLede,
  view,
  onView,
  onNextStage,
  presentationMode = false,
  showNextStage = true,
  terminalNote = "This is as far as the centre journey goes today.",
}: ConfigureSceneLayoutProps) {
  const dispatch = onView;
  /** Which capabilities have had their implementation options opened. */
  const [openImplementations, setOpenImplementations] = useState<readonly string[]>([]);
  const [privacyDetailOpen, setPrivacyDetailOpen] = useState(false);
  /**
   * Which implementation is the hero under "What is needed", per capability.
   * One at a time, deliberately: the alternatives swap the hero rather than
   * adding a second card next to it, which is what would turn this section
   * into the hardware comparison it must not be.
   */
  const [heroImplementations, setHeroImplementations] = useState<
    Readonly<Record<string, string>>
  >({});
  const [technicalDetailOpen, setTechnicalDetailOpen] = useState<readonly string[]>([]);
  /**
   * Which capabilities have had their example-implementation video opened.
   *
   * The video sits behind a secondary action rather than playing inline so that
   * the vendor-neutral explanation is what answers "how does this work". Left
   * inline, a supplier's footage becomes the explanation, and the capability
   * text above it turns into a caption for someone else's product.
   */
  const [exampleVideoOpen, setExampleVideoOpen] = useState<readonly string[]>([]);
  /**
   * Which capabilities have had the SECOND, derived video opened.
   *
   * Separate state, and deliberately only ever rendered inside the primary
   * video's open block: the derived view is a further depth layer of the
   * measured one, not a second option beside it. Closing the primary drops this
   * key too, so backing out of the explanation cannot leave a reporting view
   * open with nothing above it to say what it was derived from.
   */
  const [derivedVideoOpen, setDerivedVideoOpen] = useState<readonly string[]>([]);

  const audience: ConfigureAudience = presentationMode ? "presentation" : "sales";

  const directions = useMemo(() => getSolutionDirectionsForSegment(segmentId), [segmentId]);
  const synthesis = useMemo(() => getConfigureSynthesis(segmentId), [segmentId]);

  const open: SolutionDirectionDefinition | null =
    directions.find((direction) => direction.id === view.openDirectionId) ?? null;

  const drilldown = useMemo(
    () => (open ? getSolutionTechnologyDrilldown(open.id) : null),
    [open],
  );
  const requirements = useMemo(
    () => (open ? getSolutionRequirements(open.id) : null),
    [open],
  );
  const implementationGroups = useMemo(
    () => (open ? getSolutionImplementationOptions(open.id, audience) : []),
    [open, audience],
  );
  const privacy = useMemo(
    () => (open ? getSolutionPrivacyDetail(open.id, audience) : null),
    [open, audience],
  );
  const proof = useMemo(
    () => (open ? getSolutionProof(open.id, audience) : null),
    [open, audience],
  );

  // Escape peels exactly one layer: the depth layer if one is open, otherwise
  // the solution direction. Same discipline as the approved branch panels.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch({ type: "DISMISS" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);

  // Implementation folds are remembered per direction rather than reset, so
  // stepping between directions and back does not undo what has been read.
  const implKey = (capabilityId: string) => `${view.openDirectionId}:${capabilityId}`;

  const depthAvailable = (depthId: ConfigureDepthId): boolean =>
    depthId === "see-it-in-practice" ? Boolean(proof?.actionAvailable) : true;

  // Resolved at render time, not trusted from when the layer was opened: a
  // layer opened in Sales Mode must not survive a switch into Presentation Mode
  // if the prospect is not allowed to see it.
  const visibleDepth = resolveVisibleDepth(view, depthAvailable);

  const nextStep = !showNextStage ? (
    /* Truthful terminal state: the journey genuinely stops here for this
       segment, and saying so is better than a control that leads nowhere. */
    <p className="configure__terminal">{terminalNote}</p>
  ) : (
    <button type="button" className="capture__cta" onClick={onNextStage}>
      See the next step
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M0 6h15" />
        <path d="M11.5 2.5L15 6l-3.5 3.5" />
      </svg>
    </button>
  );

  return (
    <div
      className={`configure${presentationMode ? " configure--presenting" : ""}${
        open ? " configure--detail" : ""
      }`}
    >
      <div className="configure__page">
        {/* In the detail layer the masthead collapses to its eyebrow. The
            direction's own question becomes the dominant type on the page,
            which is the correct hierarchy once a direction is open — and it
            returns roughly a third of the page to the content being read. */}
        <header className="configure__masthead">
          <p className="capture__eyebrow">
            Configure <span aria-hidden="true">·</span> Your solution
          </p>
          {!open && (
            <>
              <h1 className="configure__headline">{headline}</h1>
              <p className="configure__lead">{lead}</p>
              {/* The typed synthesis contract, bound rather than restated. */}
              {synthesis && (
                <p className="configure__governing">{synthesis.governingQuestion}</p>
              )}
            </>
          )}
        </header>

        {!open && (
          <>
            <div className="configure__chain" aria-hidden="true">
              {directions.map((direction) => (
                <span
                  key={direction.id}
                  className={`configure__chain-node configure__chain-node--${direction.territory}`}
                >
                  {direction.territoryLabel}
                </span>
              ))}
            </div>

            <div className="configure__territories">
              {directions.map((direction) => (
                <button
                  type="button"
                  key={direction.id}
                  className={`configure__territory configure__territory--${direction.territory}`}
                  onClick={() =>
                    dispatch({ type: "OPEN_DIRECTION", directionId: direction.id })
                  }
                >
                  {/* The territory is already named on the spine directly above
                      this card, so it is not repeated inside it. */}
                  <span className="configure__territory-head">
                    <span className="sr-only">{direction.territoryLabel}</span>
                    <span className="configure__territory-glyph" aria-hidden="true">
                      {glyphs[direction.territory] ?? null}
                    </span>
                  </span>
                  <span className="configure__ask">{direction.customerQuestion}</span>
                  {/* The lead, not the title: on the landing the title restates
                      the question almost word for word, and the lead is the
                      line that actually adds something. The title carries the
                      customer-first framing in the detail view instead. */}
                  <span className="configure__territory-title">{direction.lead}</span>
                  <span className="configure__phrases">
                    {direction.capabilityPhrases.map((phrase) => (
                      <span key={phrase}>{phrase}</span>
                    ))}
                  </span>
                  <span className="configure__boundary">{direction.boundaryNote}</span>
                  <span className="configure__more">
                    Tell me more
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M0 5h11" />
                      <path d="M8 2l3 3-3 3" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            <div className="configure__footer">
              <p className="configure__footer-note">
                Nothing here is selected, scored or priced. Open whichever
                direction is worth a conversation — or none of them.
              </p>
              {nextStep}
            </div>
          </>
        )}

        {open && (
          <div className="configure__detail-body">
            {/* Context is never lost: the other three directions stay one click
                away, and the way back to all four is the first control. */}
            <nav className="configure__switch" aria-label="Solution directions">
              <button
                type="button"
                className="configure__switch-back"
                onClick={() => dispatch({ type: "CLOSE_DIRECTION" })}
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 5H3" />
                  <path d="M6 2L3 5l3 3" />
                </svg>
                {`All ${COUNT_WORDS[directions.length] ?? directions.length} directions`}
              </button>
              {directions.map((direction) => (
                <button
                  type="button"
                  key={direction.id}
                  className={`configure__switch-item${
                    direction.id === open.id ? " is-current" : ""
                  }`}
                  aria-current={direction.id === open.id ? "true" : undefined}
                  onClick={() =>
                    dispatch({ type: "OPEN_DIRECTION", directionId: direction.id })
                  }
                >
                  {direction.territoryLabel}
                </button>
              ))}
            </nav>

            <header className={`configure__detail-head configure__detail-head--${open.territory}`}>
              <span className="configure__detail-glyph" aria-hidden="true">
                {glyphs[open.territory] ?? null}
              </span>
              <div>
                <p className="configure__territory-kicker">{open.territoryLabel}</p>
                <h2 className="configure__detail-ask">{open.customerQuestion}</h2>
                <p className="configure__detail-title">{open.title}</p>
                <p className="configure__detail-lead">{open.lead}</p>
                <p className="configure__detail-boundary">{open.boundaryNote}</p>
              </div>
            </header>

            {/* The value story, before any optional depth is asked for. Left:
                the same three phrases as the landing card, so opening a
                direction never loses what made it recognisable. Right: the
                outputs this direction actually makes answerable, taken from the
                related scenes' own typed derived dependencies — real declared
                outputs, not a feature list. Both are value; technology is still
                behind a deliberate second click. */}
            <div className="configure__glance">
              <section>
                <p className="configure__glance-kicker">What this covers</p>
                <ul>
                  {open.capabilityPhrases.map((phrase) => (
                    <li key={phrase}>{phrase}</li>
                  ))}
                </ul>
              </section>
              {drilldown && drilldown.answerableOutputs.length > 0 && (
                <section>
                  <p className="configure__glance-kicker">What becomes answerable</p>
                  <ul>
                    {drilldown.answerableOutputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Four optional questions, deliberately quiet and deliberately not
                four panels shown at once. */}
            <div className="configure__depth-actions" role="group" aria-label="Ask more about this direction">
              {configureDepthIds.filter(depthAvailable).map((depthId) => (
                <button
                  type="button"
                  key={depthId}
                  className={`configure__depth-action${
                    visibleDepth === depthId ? " is-open" : ""
                  }`}
                  aria-expanded={visibleDepth === depthId}
                  onClick={() => dispatch({ type: "TOGGLE_DEPTH", depthId })}
                >
                  {configureDepthLabels[depthId]}
                  <span aria-hidden="true">{visibleDepth === depthId ? "×" : "›"}</span>
                </button>
              ))}
            </div>

            {visibleDepth && (
              <section
                className="configure__depth"
                aria-label={configureDepthLabels[visibleDepth]}
              >
                <header className="configure__depth-head">
                  <h3>{configureDepthLabels[visibleDepth]}</h3>
                  <button
                    type="button"
                    className="configure__depth-close"
                    onClick={() => dispatch({ type: "CLOSE_DEPTH" })}
                  >
                    Close <span aria-hidden="true">×</span>
                  </button>
                </header>

                {/* ---------------------------------------------------------
                    HOW WE DO THIS
                    question -> capability -> what it provides -> possible
                    implementations -> source & readiness. Implementations stay
                    folded until the capability has been read, so the first
                    technology view is never four supplier cards.
                    --------------------------------------------------------- */}
                {visibleDepth === "how-we-do-this" && drilldown && (
                  <div className="configure__how">
                    <p className="configure__how-question">
                      <span>Your question</span>
                      {drilldown.customerQuestion}
                    </p>

                    {drilldown.answerableOutputs.length > 0 && (
                      <p className="configure__how-outputs">
                        <span>What this makes answerable</span>
                        {drilldown.answerableOutputs.join(" · ")}
                      </p>
                    )}

                    {drilldown.capabilities.map((entry) => {
                      const key = implKey(entry.capabilityId);
                      const implOpen = openImplementations.includes(key);
                      return (
                        <article className="configure__capability" key={entry.capabilityId}>
                          <p className="configure__capability-kicker">Capability</p>
                          <h4>{entry.name}</h4>
                          <p className="configure__capability-purpose">{entry.purpose}</p>
                          <p className="configure__capability-provides">
                            Provides {entry.provides.join(" and ")} evidence.
                          </p>
                          <p className="configure__capability-privacy">
                            {entry.privacyPrinciple}
                          </p>

                          {/* MEASUREMENT-PRINCIPLE EXPLAINERS. How the
                              measurement physically works, before any product
                              exists in the reading order. Deliberately above
                              the example video and above the implementation
                              fold: the answer to "how does this work" must be
                              vendor-neutral, and a supplier's footage is an
                              illustration of it, never a replacement for it.

                              Where a capability has two, they render as two
                              cards side by side — two ways of answering the
                              same question, not one method with two pictures.
                              Customer-appropriate, so they survive into
                              Presentation Mode exactly as the video does. */}
                          {entry.explainerVisuals.length > 0 && (
                            <div
                              className={`configure__explainers${
                                entry.explainerVisuals.length > 1
                                  ? " configure__explainers--pair"
                                  : ""
                              }`}
                            >
                              {entry.explainerVisuals.length > 1 && (
                                <p className="configure__explainers-lede">
                                  {explainerPairLede}
                                </p>
                              )}
                              {entry.explainerVisuals.map((explainer) => (
                                <figure
                                  className="configure__explainer"
                                  key={explainer.approachId}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={explainer.assetPath}
                                    alt={explainer.altText}
                                    loading="lazy"
                                  />
                                  <figcaption>
                                    <span className="configure__explainer-kicker">
                                      How the measurement works
                                    </span>
                                    <span className="configure__explainer-approach">
                                      {explainer.approachName}
                                    </span>
                                    <span className="configure__explainer-body">
                                      {explainer.explanation}
                                    </span>
                                    <span className="configure__explainer-note">
                                      {explainer.illustrationNote ?? DEFAULT_ILLUSTRATION_NOTE}
                                    </span>
                                  </figcaption>
                                </figure>
                              ))}
                            </div>
                          )}

                          {/* CAPABILITY CONTEXT VISUAL. Currently only the
                              catchment reference map under Geo, mobility and
                              GIS. It sits under the capability, like the
                              video, and it is captioned as context rather
                              than measurement — the one sentence that keeps
                              aggregate area context from being read as a
                              physical passer-by count. */}
                          {entry.contextVisual && (
                            <figure className="configure__context-visual">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={entry.contextVisual.assetPath}
                                alt={entry.contextVisual.altText}
                                loading="lazy"
                              />
                              <figcaption>
                                <span className="configure__context-kicker">
                                  Illustrative reference — not customer data
                                </span>
                                {entry.contextVisual.caption}
                              </figcaption>
                            </figure>
                          )}

                          {!presentationMode && (
                            <p className="configure__status-row">
                              <StatusChip label="Capability readiness" value={entry.readiness} />
                            </p>
                          )}

                          {/* VISUAL EXPLANATION. Sits under the capability that
                              owns it and above the implementation options, so
                              the reading order stays question -> capability ->
                              how we do this -> what it looks like -> which
                              implementations exist. It is customer-appropriate,
                              so unlike the readiness chips it survives into
                              Presentation Mode.

                              Where a second, DERIVED view exists it is rendered
                              inside this block, never beside it. Two clips of
                              equal prominence would read as a media library and
                              would also flatten the one distinction that has to
                              survive: the first is the physical space being
                              measured, the second is a representation
                              calculated from that measurement afterwards. */}
                          {(() => {
                            const video = entry.explainerVideo;
                            if (!video) return null;
                            const videoOpen = exampleVideoOpen.includes(key);
                            const derivedOpen = derivedVideoOpen.includes(key);
                            return (
                              <>
                                <button
                                  type="button"
                                  className="configure__example-toggle"
                                  aria-expanded={videoOpen}
                                  onClick={() => {
                                    setExampleVideoOpen((current) =>
                                      current.includes(key)
                                        ? current.filter((id) => id !== key)
                                        : [...current, key],
                                    );
                                    // Closing the measured view closes the
                                    // derived one with it. A reporting view left
                                    // open on its own has nothing above it
                                    // saying what it was derived from.
                                    setDerivedVideoOpen((current) =>
                                      current.filter((id) => id !== key),
                                    );
                                  }}
                                >
                                  {videoOpen ? "Hide" : "See"} {video.actionLabel}
                                  <span aria-hidden="true">{videoOpen ? "×" : "›"}</span>
                                </button>
                                {videoOpen && (
                              <figure className="configure__video">
                                <p className="configure__video-intro">{video.intro}</p>
                                {/* Native controls only: no autoplay, no sound
                                    on load, and pause/restart behave exactly as
                                    a presenter expects. Nothing moves until
                                    someone presses play, which also settles
                                    prefers-reduced-motion.

                                    The frame reserves the source footage's own
                                    ratio before metadata loads, so pressing play
                                    never shifts the panel underneath it and
                                    nothing is ever cropped or stretched. */}
                                <video
                                  className="configure__video-player"
                                  style={{ aspectRatio: video.frameRatio }}
                                  src={video.src}
                                  controls
                                  preload="metadata"
                                  playsInline
                                  aria-label={video.description}
                                />
                                <figcaption className="configure__video-caption">
                                  {/* Names an implementation only where the
                                      content names one. Where it does not, the
                                      kicker says what KIND of view this is
                                      instead — which is the honest label, and
                                      keeps a product name out of a layer that
                                      exists to explain a principle. */}
                                  {video.exampleImplementationRole ? (
                                    <span className="configure__video-example">
                                      Example implementation
                                      <span aria-hidden="true"> · </span>
                                      {video.exampleImplementationRole}
                                      {video.exampleImplementationName
                                        ? ` · ${video.exampleImplementationName}`
                                        : ""}
                                    </span>
                                  ) : (
                                    <span className="configure__video-example">
                                      {video.viewLabel}
                                      {video.approachName ? (
                                        <>
                                          <span aria-hidden="true"> · </span>
                                          {video.approachName}
                                        </>
                                      ) : null}
                                    </span>
                                  )}
                                  <span className="configure__video-note">
                                    {video.exampleImplementationRole
                                      ? videoNoteImplementation
                                      : videoNoteApproach}
                                  </span>
                                  <button
                                    type="button"
                                    className="configure__video-privacy"
                                    onClick={() =>
                                      dispatch({ type: "OPEN_DEPTH", depthId: "privacy" })
                                    }
                                  >
                                    Privacy by design
                                    <span aria-hidden="true"> →</span>
                                  </button>
                                </figcaption>

                                {/* SECOND LAYER — nested inside the first, and
                                    only reachable from it. Quieter than the
                                    action that opened this block, because it
                                    answers a later question. */}
                                {video.followOn && (
                                  <div className="configure__video-derived">
                                    <button
                                      type="button"
                                      className="configure__derived-toggle"
                                      aria-expanded={derivedOpen}
                                      onClick={() =>
                                        setDerivedVideoOpen((current) =>
                                          current.includes(key)
                                            ? current.filter((id) => id !== key)
                                            : [...current, key],
                                        )
                                      }
                                    >
                                      {derivedOpen ? "Hide" : "See"}{" "}
                                      {video.followOn.actionLabel}
                                      <span aria-hidden="true">
                                        {derivedOpen ? " ×" : " →"}
                                      </span>
                                    </button>
                                    {derivedOpen && (
                                      <figure className="configure__video configure__video--derived">
                                        <p className="configure__video-intro">
                                          {video.followOn.intro}
                                        </p>
                                        <video
                                          className="configure__video-player configure__video-player--derived"
                                          style={{ aspectRatio: video.followOn.frameRatio }}
                                          src={video.followOn.src}
                                          controls
                                          preload="metadata"
                                          playsInline
                                          aria-label={video.followOn.description}
                                        />
                                        <figcaption className="configure__video-caption">
                                          <span className="configure__video-example">
                                            {video.followOn.viewLabel}
                                          </span>
                                          <span className="configure__video-note">
                                            {video.followOn.distinctionNote}
                                          </span>
                                        </figcaption>
                                      </figure>
                                    )}
                                  </div>
                                )}
                              </figure>
                                )}
                              </>
                            );
                          })()}

                          {/* A segment that resolves no implementation for this
                              capability gets the honest note instead of a
                              control that opens an empty list. */}
                          {entry.implementations.length === 0 ? (
                            entry.implementationNote && (
                              <p className="configure__impl-note">{entry.implementationNote}</p>
                            )
                          ) : (
                          <button
                            type="button"
                            className="configure__impl-toggle"
                            aria-expanded={implOpen}
                            onClick={() =>
                              setOpenImplementations((current) =>
                                current.includes(key)
                                  ? current.filter((id) => id !== key)
                                  : [...current, key],
                              )
                            }
                          >
                            {implOpen ? "Hide" : "Show"} possible implementations (
                            {entry.implementations.length})
                            <span aria-hidden="true">{implOpen ? "×" : "›"}</span>
                          </button>
                          )}

                          {implOpen && (
                            <div className="configure__impls">
                              {entry.implementations.map((impl) => (
                                <div className="configure__impl" key={impl.id}>
                                  {/* The role leads. The secondary line is the
                                      device's functional name — never a vendor
                                      or model (product lead, 2026-09-27; applied
                                      to Configure 2026-09-28). Supplier and
                                      product stay in the model, and in the
                                      Sales-mode source line below. */}
                                  <strong>{impl.implementationRole}</strong>
                                  <span className="configure__impl-product">
                                    {[functionalLine(impl), impl.measurementMethod]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </span>
                                  {impl.assetPath && (
                                    <figure className="configure__impl-figure">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={impl.assetPath}
                                        alt={impl.altText ?? ""}
                                        loading="lazy"
                                      />
                                      {/* An infrastructure photograph says what
                                          it is. A camera pictured beside an
                                          analytics implementation is an example
                                          of compatible hardware — it is not
                                          evidence that the analytics exist,
                                          classify anything or handle data in
                                          any particular way. */}
                                      {impl.visualShowsInfrastructureOnly && (
                                        <figcaption>
                                          Example of compatible infrastructure.
                                          The analytics are configured on top of it.
                                        </figcaption>
                                      )}
                                    </figure>
                                  )}
                                  {impl.supportedClaims.length > 0 && (
                                    <ul className="configure__impl-claims">
                                      {impl.supportedClaims.map((claim) => (
                                        <li key={claim}>{claim}</li>
                                      ))}
                                    </ul>
                                  )}
                                  {!presentationMode && (
                                    <>
                                      <p className="configure__status-row">
                                        <StatusChip label="Source" value={impl.sourceStatus} />
                                        <StatusChip label="Privacy" value={impl.privacyStatus} />
                                        <StatusChip
                                          label="Technical detail"
                                          value={impl.technicalDetailStatus}
                                        />
                                      </p>
                                      {impl.blockedClaims.length > 0 && (
                                        <p className="configure__impl-blocked">
                                          <span>Not claimed</span>
                                          {impl.blockedClaims.join(" · ")}
                                        </p>
                                      )}
                                      {/* Internal only: the id, and the supplier and
                                          model the functional name stands for. */}
                                      <p className="configure__impl-id">
                                        {[impl.id, impl.supplier, impl.product]
                                          .filter(Boolean)
                                          .join(" · ")}
                                      </p>
                                    </>
                                  )}
                                </div>
                              ))}
                              <p className="configure__impl-note">
                                These are alternatives, not a ranking. Nothing is
                                pre-selected, and they do not produce identical
                                outputs.
                              </p>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}

                {/* ---------------------------------------------------------
                    WHAT IS NEEDED — derived from the related scenes' own
                    declared dependencies, plus the commercial alignments.

                    ORDER IS THE WHOLE POINT HERE.

                    The question a prospect asks at this moment is "what would
                    go in my store". The honest answer to it is a picture and
                    three sentences, and that is what has to meet them first —
                    at 1440x900, without scrolling. The data-alignment list
                    ("what would we need from you") answers a different, later
                    question, so it now sits *below* the hero rather than in
                    front of it. It used to run five rows deep before the
                    picture even started, which pushed the one thing this layer
                    exists to show off the bottom of the screen.

                    Nothing here changes what is said, which sources back it,
                    or what a prospect is allowed to see. Only the sequence.
                    --------------------------------------------------------- */}
                {visibleDepth === "what-is-needed" && requirements && (
                  <div className="configure__needs">
                    {/* -----------------------------------------------------
                        WHAT WOULD BE AT THE LOCATION

                        One hero per capability, never a grid of them. The
                        capability is named first, the implementation is the
                        subtitle, the picture is large, and the three site
                        concerns are sentences rather than a spec table. The
                        specification only appears if someone asks for it.

                        Performance intelligence has no section here at all —
                        `getSolutionImplementationOptions` returns nothing for
                        it, because nothing is installed for it. In that case
                        the alignment list below is the whole layer, and it
                        leads by falling through to first position.
                        ----------------------------------------------------- */}
                    {implementationGroups.map((group) => {
                      const groupKey = `${view.openDirectionId}:${group.capabilityId}`;
                      const heroId = heroImplementations[groupKey];
                      const hero =
                        group.options.find((option) => option.implementationId === heroId) ??
                        group.options[0];
                      const alternatives = group.options.filter(
                        (option) => option.implementationId !== hero.implementationId,
                      );
                      const detailKey = `${groupKey}:${hero.implementationId}`;
                      const detailOpen = technicalDetailOpen.includes(detailKey);

                      return (
                        <section className="configure__site" key={group.capabilityId}>
                          <p className="configure__site-kicker">
                            What this needs at the location
                            <span aria-hidden="true"> · </span>
                            {group.capabilityName}
                          </p>

                          <div className="configure__site-hero">
                            {hero.assetPath && (
                              <figure className="configure__site-figure">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={hero.assetPath}
                                  alt={hero.altText ?? ""}
                                  loading="lazy"
                                />
                                {/* Qualifies the photograph, so it belongs
                                    under the photograph. It used to sit in the
                                    text column, where it read as a claim about
                                    the implementation and pushed the third
                                    site concern off a 900px screen. Here it is
                                    unambiguously a caption: this picture is an
                                    example of compatible hardware, and is not
                                    evidence that any analytics exist, classify
                                    anything or handle data in any way. */}
                                {hero.visualShowsInfrastructureOnly && (
                                  <figcaption className="configure__site-infra">
                                    Uses compatible IP-camera infrastructure with
                                    configured analytics for the selected
                                    measurement question.
                                  </figcaption>
                                )}
                              </figure>
                            )}

                            <div className="configure__site-body">
                              {/* Capability above, implementation here. Never
                                  the other way round, and never a camera model
                                  as the headline of the page. */}
                              <p className="configure__site-name">{hero.headline}</p>
                              <p className="configure__site-role">
                                {hero.implementationRole}
                              </p>
                              {/* Fallback only: with no photograph there is no
                                  caption to hang it on, and the statement must
                                  still be made. */}
                              {!hero.assetPath && hero.visualShowsInfrastructureOnly && (
                                <p className="configure__site-infra">
                                  Uses compatible IP-camera infrastructure with
                                  configured analytics for the selected
                                  measurement question.
                                </p>
                              )}

                              <dl className="configure__site-essentials">
                                {hero.essentials.map((essential) => (
                                  <div key={essential.label}>
                                    <dt>{essential.label}</dt>
                                    <dd>{essential.body}</dd>
                                  </div>
                                ))}
                              </dl>

                              {/* PFM explaining this implementation. Labelled as
                                  such and kept out of "See it in practice": it
                                  is an explanation, not a customer result. */}
                              {hero.explainerVideo && (
                                <section className="configure__explainer" aria-label="PFM explains">
                                  <p className="proof-case__kicker">PFM explains</p>
                                  <p className="configure__explainer-body">
                                    {hero.explainerVideo.description}
                                  </p>
                                  <YouTubeOnRequest
                                    videoId={hero.explainerVideo.videoId}
                                    title={hero.explainerVideo.publishedTitle}
                                    playLabel="Play PFM's explanation"
                                    note="Plays from YouTube, only when you start it."
                                    durationSeconds={hero.explainerVideo.durationSeconds}
                                  />
                                  <p className="configure__explainer-note">
                                    {hero.explainerVideo.notProofNote}
                                  </p>
                                </section>
                              )}
                            </div>
                          </div>

                          {/* ---------------------------------------------
                              SECONDARY ROW

                              Everything that is not the answer to "what
                              would be at my store" lives here, on one line,
                              under the hero: the specification reveal and
                              the switch to another implementation. Both used
                              to sit inside the right-hand column, where they
                              competed with the three site concerns for the
                              first thing the eye landed on.

                              The alternatives stay text buttons rather than
                              cards on purpose. One implementation is in focus
                              at a time; choosing another replaces the hero,
                              it never puts a second product beside it.
                              --------------------------------------------- */}
                          <div className="configure__site-secondary">
                            {hero.technicalDetail.length > 0 ? (
                              <button
                                type="button"
                                className="configure__impl-toggle"
                                aria-expanded={detailOpen}
                                onClick={() =>
                                  setTechnicalDetailOpen((current) =>
                                    current.includes(detailKey)
                                      ? current.filter((id) => id !== detailKey)
                                      : [...current, detailKey],
                                  )
                                }
                              >
                                Technical detail
                                <span aria-hidden="true">{detailOpen ? "×" : "→"}</span>
                              </button>
                            ) : (
                              <p className="configure__site-onrequest">
                                {hero.detailUnavailableNote}
                              </p>
                            )}

                            {alternatives.length > 0 && (
                              <div className="configure__site-alternatives">
                                <span>Other possible implementations</span>
                                {alternatives.map((option) => (
                                  <button
                                    type="button"
                                    key={option.implementationId}
                                    onClick={() =>
                                      setHeroImplementations((current) => ({
                                        ...current,
                                        [groupKey]: option.implementationId,
                                      }))
                                    }
                                  >
                                    {option.headline}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {hero.technicalDetail.length > 0 && detailOpen && (
                            <dl className="configure__site-detail">
                              {hero.technicalDetail.map((row) => (
                                <div key={row.label}>
                                  <dt>{row.label}</dt>
                                  <dd>
                                    {row.value}
                                    {/* A row no mapped document supports is
                                        labelled as such for the presenter,
                                        and is not shown to a prospect at
                                        all. */}
                                    {!presentationMode &&
                                      row.status === "user_approved_product_input" && (
                                        <em> · product input, not yet source-mapped</em>
                                      )}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          )}
                        </section>
                      );
                    })}

                    {/* -----------------------------------------------------
                        WHAT WE WOULD ALIGN WITH YOU

                        The data side of "what is needed", demoted to below the
                        hero and set at a quieter weight. Same content, same
                        derivation, same presenter-only data-role labels — it
                        simply no longer stands between the prospect and the
                        picture. When a direction installs nothing, this is
                        the first and only thing in the layer.
                        ----------------------------------------------------- */}
                    <div className="configure__needs-align">
                      <p className="configure__needs-framing">{requirements.framing}</p>
                      <ul className="configure__needs-list">
                        {requirements.primary.map((item) => (
                          <li key={item.label}>
                            <span>{item.label}</span>
                            {!presentationMode && item.dataRole && (
                              <em>{item.dataRole.replace("_", " & ")}</em>
                            )}
                          </li>
                        ))}
                      </ul>
                      {!presentationMode && requirements.additional.length > 0 && (
                        <p className="configure__needs-additional">
                          <span>Also aligned during scoping</span>
                          {requirements.additional.map((item) => item.label).join(" · ")}
                        </p>
                      )}
                    </div>

                    <p className="configure__needs-note">
                      This is a conversation, not a survey. Nothing has to be
                      answered today, and nothing shown here is selected,
                      ranked or priced.
                    </p>
                  </div>
                )}

                {/* ---------------------------------------------------------
                    PRIVACY — one statement, four principles, and only then
                    implementation-specific detail. Nothing is generalised
                    across suppliers, and a missing source stays visible.
                    --------------------------------------------------------- */}
                {visibleDepth === "privacy" && privacy && (
                  <div className="configure__privacy">
                    <h4 className="configure__privacy-headline">
                      {privacy.statement.headline}
                    </h4>
                    <p className="configure__privacy-lead">{privacy.statement.lead}</p>
                    <div className="configure__principles">
                      {privacy.statement.principles.map((principle) => (
                        <div key={principle.title}>
                          <strong>{principle.title}</strong>
                          <p>{principle.body}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="configure__impl-toggle"
                      aria-expanded={privacyDetailOpen}
                      onClick={() => setPrivacyDetailOpen((current) => !current)}
                    >
                      {privacyDetailOpen ? "Hide" : "View"} implementation-specific
                      privacy detail
                      <span aria-hidden="true">{privacyDetailOpen ? "×" : "›"}</span>
                    </button>

                    {privacyDetailOpen && (
                      <div className="configure__privacy-detail">
                        {privacy.entries.map((entry) => (
                          <div className="configure__impl" key={entry.implementationId}>
                            <strong>{entry.implementationRole}</strong>
                            <span className="configure__impl-product">
                              {[
                                functionalLine({
                                  id: entry.implementationId,
                                  supplier: entry.supplier,
                                  product: entry.product,
                                }),
                                entry.capabilityName,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                            {entry.hasPrivacyEvidence ? (
                              <ul className="configure__impl-claims">
                                {entry.supportedClaims.map((claim) => (
                                  <li key={claim}>{claim}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="configure__privacy-unmapped">
                                {entry.unmappedNote}
                              </p>
                            )}
                            {!presentationMode && (
                              <>
                                <p className="configure__status-row">
                                  <StatusChip label="Privacy" value={entry.privacyStatus} />
                                </p>
                                {entry.blockedClaims.length > 0 && (
                                  <p className="configure__impl-blocked">
                                    <span>Not claimed</span>
                                    {entry.blockedClaims.join(" · ")}
                                  </p>
                                )}
                                <p className="configure__impl-id">
                                  {[entry.implementationId, entry.supplier, entry.product, ...entry.sourceRefs]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                        <p className="configure__impl-note">
                          Privacy evidence belongs to one implementation. It is
                          never carried across to another.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------------------------------------------------
                    SEE IT IN PRACTICE — permission-gated. In Presentation Mode
                    this action does not exist unless approved, playable,
                    externally-cleared proof exists, so this branch is only ever
                    reached with something real to show.
                    --------------------------------------------------------- */}
                {visibleDepth === "see-it-in-practice" && proof && (
                  <div className="configure__proof">
                    {proof.usable.length > 0 ? (
                      <div className="configure__proof-list">
                        {proof.usable.map((asset) => (
                          <ProofCase key={asset.id} proof={asset} locale="en" />
                        ))}
                      </div>
                    ) : (
                      <div className="configure__proof-empty" role="note">
                        <strong>{proof.internalStatusNote}</strong>
                        <p>
                          Case and video material plugs in here per solution
                          direction, once an asset is approved for external use.
                        </p>
                        {proof.internal.length > 0 && (
                          <p className="configure__impl-id">
                            Internal slots ·{" "}
                            {proof.internal
                              .map((asset) => `${asset.id} (${asset.status})`)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            <div className="configure__footer">
              <p className="configure__footer-note">
                Looking at a direction does not select it. Nothing is saved,
                scored or priced here.
              </p>
              {nextStep}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
