"use client";

import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import {
  accounts,
  challenges,
  discoveryQuestions,
  retailStory,
  stages,
} from "../lib/fixtures";
import {
  experienceReducer,
  initialState,
} from "../lib/session";
import type { ExperienceAction, ExperienceState, StageId } from "../lib/types";
import type { SegmentId } from "../content/types";
import { getAllSegments, getCanonicalJourneyStages, getScenesForStage } from "../content/runtime";
import { LocationCanvas } from "./LocationCanvas";
import { RetailMeasureScene } from "./RetailMeasureScene";
import { RetailVisitorCompositionScene } from "./RetailVisitorCompositionScene";
import { RetailInStoreJourneyScene } from "./RetailInStoreJourneyScene";
import { RetailZoneEngagementScene } from "./RetailZoneEngagementScene";
import { RetailConversionSalesContextScene } from "./RetailConversionSalesContextScene";
import { RetailConfigureScene } from "./RetailConfigureScene";
import { RetailActScene } from "./RetailActScene";
import { ShoppingCentreConfigureScene } from "./ShoppingCentreConfigureScene";
import { ShoppingCentreActScene } from "./ShoppingCentreActScene";
import { shoppingCentreSceneComponents } from "./shopping-centre-scenes";
import { getSegmentJourney, shellCanRunSegment, shellRunsSegment } from "../lib/segment-journey";

/**
 * What a Shopping Centre Act calls the asset.
 *
 * Deliberately generic. The session's accounts are Retail retailers carrying a
 * `locationCount`, and a centre is one property rather than a portfolio, so
 * there is no truthful name to borrow. Inventing one would put a fictional brand
 * into a customer-facing line.
 */
const SHOPPING_CENTRE_ASSET_FALLBACK = "Selected shopping centre";
import { getSegment, getSceneForSegment } from "../content/runtime";
import type { SceneId } from "../content/types";
import {
  configureViewReducer,
  initialConfigureViewState,
} from "../lib/configure-view";

const dispatchSet = (
  dispatch: React.Dispatch<ExperienceAction>,
  action: ExperienceAction,
) => dispatch(action);

function BrandLockup({ quiet = false }: { quiet?: boolean }) {
  return (
    <div className={`brand-lockup${quiet ? " brand-lockup--quiet" : ""}`}>
      <strong>PFM</strong>
      <span>Commercial experience</span>
    </div>
  );
}

function EntryScreen({
  state,
  dispatch,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}) {
  const [query, setQuery] = useState("");
  const filteredAccounts = accounts.filter((account) =>
    `${account.name} ${account.opportunity}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="entry-screen">
      <section className="entry-content">
        <header className="entry-header">
          <BrandLockup />
          <span className="demo-badge">Internal go-demo · local fixtures</span>
        </header>

        <div className="entry-copy">
          <span className="eyebrow">Unlocking location potential</span>
          <h1>See the whole location.</h1>
          <p>
            Start with a retail question. Add context, direct measurement and the data needed for a clearer next decision.
          </p>
        </div>

        <div className="mode-switch mode-switch--single" aria-label="Current experience mode">
          <div className="is-active"><span>Sales Mode</span><small>Canonical Retail go-demo slice · simulated signed-in presenter</small></div>
        </div>

        <section className="entry-panel" aria-label="Sales Mode opportunity entry">
          <div className="entry-panel__heading">
            <div>
              <span className="step-label">Simulated Odoo 18 data</span>
              <h2>Who are you meeting?</h2>
            </div>
            <span>Fictional record</span>
          </div>
          <label className="search-field">
            <span className="sr-only">Search fictional accounts</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company or opportunity"
            />
          </label>
          <div className="account-list" role="radiogroup" aria-label="Fictional accounts">
            {filteredAccounts.map((account) => (
              <button
                type="button"
                role="radio"
                aria-checked={state.accountId === account.id}
                className={state.accountId === account.id ? "is-selected" : ""}
                key={account.id}
                onClick={() => dispatchSet(dispatch, { type: "SET_ACCOUNT", accountId: account.id })}
              >
                <span className="account-initial" aria-hidden="true">{account.name.slice(0, 1)}</span>
                <span>
                  <strong>{account.name}</strong>
                  <small>{account.opportunity} · {account.locationCount} locations</small>
                </span>
                <span className="account-check" aria-hidden="true">✓</span>
              </button>
            ))}
          </div>
          <div className="entry-action-row">
            <span>Northstar Retail Group · Utrecht Central Store</span>
            <button className="primary-action" type="button" onClick={() => dispatchSet(dispatch, { type: "START" })}>
              Continue with opportunity <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="entry-disclaimer">No records will be changed. All account and opportunity data shown here is simulated.</p>
        </section>
      </section>

      <aside className="entry-visual" aria-label="Layered location preview">
        <div className="entry-map">
          <span className="entry-orbit entry-orbit--one" />
          <span className="entry-orbit entry-orbit--two" />
          <span className="entry-orbit entry-orbit--three" />
          <span className="entry-flow entry-flow--one" />
          <span className="entry-flow entry-flow--two" />
          <span className="entry-flow entry-flow--three" />
          <div className="entry-location">
            <span>Retail</span>
            <i />
          </div>
          <div className="entry-glass entry-glass--one">Context</div>
          <div className="entry-glass entry-glass--two">Measure</div>
          <div className="entry-glass entry-glass--three">Decide</div>
        </div>
        <div className="entry-visual-copy">
          <span>One location · four data roles</span>
          <strong>Context outside. Truth at the location.</strong>
          <p>Mobile and geo sources add sampled context. Physical measurement stays visibly distinct.</p>
        </div>
      </aside>
    </main>
  );
}

function DiscoveryScreen({
  state,
  dispatch,
}: PanelProps) {
  return (
    <main className="entry-screen discovery-screen">
      <section className="entry-content">
        <header className="entry-header">
          <BrandLockup />
          <span className="demo-badge">Sales Mode · discovery question</span>
        </header>
        <div className="entry-copy">
          <span className="eyebrow">Northstar Retail Group · Utrecht Central Store</span>
          <h1>What do you want to understand?</h1>
          <p>Choose the question that will bind the location story from Context through Act.</p>
        </div>
        <section className="entry-panel" aria-label="Discovery question">
          <div className="entry-panel__heading">
            <div>
              <span className="step-label">Store opportunity and conversion review</span>
              <h2>Set the thread for this conversation.</h2>
            </div>
            <span>One primary question</span>
          </div>
          <div className="challenge-grid discovery-grid">
            {discoveryQuestions.map((question) => {
              const selected = state.discoveryQuestionId === question.id;
              return (
                <button
                  type="button"
                  key={question.id}
                  aria-pressed={selected}
                  className={selected ? "is-selected" : ""}
                  onClick={() => dispatchSet(dispatch, { type: "SET_DISCOVERY_QUESTION", questionId: question.id })}
                >
                  <span>{selected ? "Selected question" : "Explore question"}</span>
                  <strong>{question.label}</strong>
                  <small>{question.description}</small>
                </button>
              );
            })}
          </div>
          <div className="entry-action-row">
            <span>Captured locally · illustrative demo data only</span>
            <button className="primary-action" type="button" onClick={() => dispatchSet(dispatch, { type: "EXPLORE" })}>
              Explore this question <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </section>
      <aside className="entry-visual" aria-label="Location question preview">
        <div className="entry-map">
          <span className="entry-orbit entry-orbit--one" />
          <span className="entry-orbit entry-orbit--two" />
          <span className="entry-orbit entry-orbit--three" />
          <span className="entry-flow entry-flow--one" />
          <span className="entry-flow entry-flow--two" />
          <span className="entry-flow entry-flow--three" />
          <div className="entry-location"><span>Retail</span><i /></div>
          <div className="entry-glass entry-glass--one">Question</div>
          <div className="entry-glass entry-glass--two">Evidence</div>
          <div className="entry-glass entry-glass--three">Decision</div>
        </div>
        <div className="entry-visual-copy">
          <span>One question · one location</span>
          <strong>Separate potential from performance.</strong>
          <p>PFM keeps sampled context, direct measurement and connected business data visibly distinct.</p>
        </div>
      </aside>
    </main>
  );
}

function ContextPanel({ state, dispatch }: PanelProps) {
  const [concept, setConcept] = useState("Catchment");
  const conceptCopy: Record<string, string> = {
    Catchment: "Origin and reach around the selected store, shown as aggregate context.",
    Approach: "Illustrative approach directions, not individual routes or identities.",
    "Cross-visitation": "Illustrative aggregate overlap, not identity matching.",
  };
  return (
    <div className="panel-flow">
      <div className="stage-reading">
        <span className="truth-tag truth-tag--contextual">External context · illustrative sampled/modelled data</span>
        <div className="reading-row">
          <span>Outside opportunity</span>
          <strong>{retailStory.context.displayValue}</strong>
        </div>
        <p>Passers-by · illustrative aggregate estimate · {retailStory.periods[1].label.replace("Illustrative ", "")}.</p>
        <span className="scope-note">{retailStory.areaDefinition}</span>
      </div>
      <div className="concept-switch" role="group" aria-label="Context concepts">
        {["Catchment", "Approach", "Cross-visitation"].map((item) => (
          <button key={item} type="button" className={concept === item ? "is-active" : ""} aria-pressed={concept === item} onClick={() => setConcept(item)}>
            {item}
          </button>
        ))}
      </div>
      <p className="scene-note"><strong>{concept}</strong> · {conceptCopy[concept]}</p>
      <fieldset className="selection-fieldset">
        <legend>Questions to carry forward</legend>
        {challenges.map((challenge) => (
          <label key={challenge.id}>
            <input
              type="checkbox"
              checked={state.selectedChallenges.includes(challenge.id)}
              onChange={() => dispatchSet(dispatch, { type: "TOGGLE_CHALLENGE", challengeId: challenge.id })}
            />
            <span><strong>{challenge.label}</strong><small>{challenge.description}</small></span>
          </label>
        ))}
      </fieldset>
      <button className="panel-secondary" type="button" onClick={() => dispatchSet(dispatch, { type: "TOGGLE_CHALLENGE", challengeId: "understand-capture" })}>
        Add context question <span aria-hidden="true">＋</span>
      </button>
    </div>
  );
}

function UnderstandPanel({ state, dispatch }: PanelProps) {
  const canDerive = state.activeLenses.includes("physical") && state.activeLenses.includes("business");
  const derivedOn = state.activeLenses.includes("derived");
  const morning = retailStory.periods[0];
  const afternoon = retailStory.periods[1];
  return (
    <div className="panel-flow">
      <div className="truth-list">
        <div><i className="truth-dot truth-dot--contextual" /><span><strong>Outside opportunity</strong><small>Sampled aggregate passing audience around the frontage.</small></span></div>
        <div><i className="truth-dot truth-dot--measured" /><span><strong>Store entries</strong><small>Anonymous physical visits at the primary entrance.</small></span></div>
        <div><i className="truth-dot truth-dot--connected" /><span><strong>Customer business data</strong><small>Illustrative point-of-sale transactions and value context.</small></span></div>
        <div><i className="truth-dot truth-dot--derived" /><span><strong>Derived insight</strong><small>Comparison calculated from the named source layers.</small></span></div>
      </div>
      <section className="performance-chain" aria-label="Illustrative performance chain">
        <span className="step-label">Performance chain · illustrative afternoon</span>
        <div className="chain-grid">
          <div><strong>{afternoon.passingAudience.displayValue}</strong><small>Outside opportunity</small><span>passers-by</span></div>
          <i aria-hidden="true">→</i>
          <div><strong>{afternoon.visits.displayValue}</strong><small>Store entries</small><span>visits</span></div>
          <i aria-hidden="true">→</i>
          <div><strong>{afternoon.transactions.displayValue}</strong><small>Transactions</small><span>customer-supplied POS</span></div>
          <i aria-hidden="true">→</i>
          <div><strong>{afternoon.transactionValue.displayValue}</strong><small>Transaction value</small><span>context only</span></div>
        </div>
      </section>
      <div className="derived-toggle">
        <div><span className="step-label">Derived insight</span><strong>{derivedOn ? "On" : "Off by default"}</strong></div>
        <button type="button" className="panel-secondary" disabled={!canDerive} aria-pressed={derivedOn} onClick={() => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId: "derived" })}>
          {canDerive ? (derivedOn ? "Hide comparison" : "Reveal comparison") : "Turn on measurement + business data"}
        </button>
      </div>
      {derivedOn && (
        <>
          <div className="comparison-table" role="table" aria-label="Illustrative morning and afternoon comparison">
            <div className="comparison-table__row comparison-table__row--head" role="row"><span role="columnheader">Comparable period</span><span role="columnheader">Visits</span><span role="columnheader">Conversion</span></div>
            {[morning, afternoon].map((period) => (
              <div className="comparison-table__row" role="row" key={period.id}><span role="cell">{period.label.replace("Illustrative ", "")}</span><strong role="cell">{period.visits.displayValue}</strong><strong role="cell">{period.conversionDisplay}</strong></div>
            ))}
          </div>
          <div className="decision-prompt"><span className="truth-tag truth-tag--derived">Decision observation · illustrative, not a diagnosis</span><strong>Visits rise during the afternoon, while conversion does not.</strong><p>This identifies a question to examine; it does not prove cause or lost revenue.</p></div>
        </>
      )}
      <button className="panel-secondary" type="button" onClick={() => dispatchSet(dispatch, { type: "TOGGLE_CHALLENGE", challengeId: "understand-the-visit" })}>
        Add performance question <span aria-hidden="true">＋</span>
      </button>
    </div>
  );
}

function PlaceholderPanel({ stage }: { stage: "prove" | "configure" }) {
  const copy = {
    prove: {
      question: "Why can we trust the direction?",
      note: "Method, evidence and Why PFM content are held for the next demo slice.",
    },
    configure: {
      question: "What should we examine first?",
      note: "Capability selection and the Quote Builder handoff follow in the next demo slice.",
    },
  }[stage];

  return (
    <div className="panel-flow panel-placeholder">
      <span className="truth-tag truth-tag--decision">Decision stage · shell only</span>
      <div className="placeholder-rule" aria-hidden="true" />
      <h3>{copy.question}</h3>
      <p>{copy.note}</p>
      <div className="placeholder-state" role="status">Content/function follows in next demo slice</div>
      <p className="placeholder-boundary">This slice proves the narrative handoff without production content, pricing, integrations or customer actions.</p>
    </div>
  );
}

interface PanelProps {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}

function StagePanel({ state, dispatch }: PanelProps) {
  const stage = stages[state.stageIndex];
  let content: React.ReactNode;
  switch (stage.id) {
    case "context": content = <ContextPanel state={state} dispatch={dispatch} />; break;
    case "measure": content = null; break;
    case "understand": content = <UnderstandPanel state={state} dispatch={dispatch} />; break;
    case "prove": content = <PlaceholderPanel stage="prove" />; break;
    case "configure": content = <PlaceholderPanel stage="configure" />; break;
    // Configure and Act both have scene components now; this legacy stage
    // workspace is only ever reached for a stage that does not.
    case "act": content = null; break;
  }
  return (
    <aside className={`stage-panel stage-panel--${stage.id}`} aria-labelledby="stage-title">
      <div className="stage-panel__intro">
        <span className="eyebrow">{stage.kicker}</span>
        <h1 id="stage-title">{stage.title}</h1>
        <p>{stage.description}</p>
      </div>
      <div className="stage-panel__content">{content}</div>
      <div className="stage-panel__footer">
        <button type="button" className="text-action" disabled={state.stageIndex === 0} onClick={() => dispatchSet(dispatch, { type: "SET_STAGE", stageIndex: state.stageIndex - 1 })}>← Previous</button>
        {state.stageIndex < stages.length - 1 && (
          <button type="button" className="primary-action primary-action--small" onClick={() => dispatchSet(dispatch, { type: "SET_STAGE", stageIndex: state.stageIndex + 1 })}>{stage.nextLabel}<span aria-hidden="true">→</span></button>
        )}
      </div>
    </aside>
  );
}

/* Stage descriptors are no longer a single map: what the rail calls a stage is
   part of a segment's own language, and Retail's "Inside" and "Performance" name
   things a shopping centre does not have. They now come from the active
   segment's journey config, where Retail's values are unchanged. */

function StageGlyph({ stage }: { stage: StageId }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (stage) {
    case "context":
      return (
        <svg {...common}><path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>
      );
    case "measure":
      return (
        <svg {...common}><path d="M5 20V11" /><path d="M12 20V5" /><path d="M19 20v-6" /></svg>
      );
    case "understand":
      return (
        <svg {...common}><path d="M4 15a8 8 0 1113.6 5" /><path d="M4 20v-5h5" /></svg>
      );
    case "prove":
      return (
        <svg {...common}><path d="M4 16l5-5 4 3.5L20 7" /><path d="M15 7h5v5" /></svg>
      );
    case "configure":
      return (
        <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></svg>
      );
    default:
      return (
        <svg {...common}><path d="M6 21V4" /><path d="M6 5h11l-2 3.5L17 12H6" /></svg>
      );
  }
}

function JourneyScreen({ state, dispatch }: PanelProps) {
  const account = accounts.find((item) => item.id === state.accountId);
  const stage = stages[state.stageIndex];
  const segments = getAllSegments();
  const journeyStages = getCanonicalJourneyStages();

  // The Measure stage holds more than one Retail Core scene (Store visits, then
  // Visitor composition). Their order comes from the typed stage mapping, so no
  // second navigation system is introduced: the canonical rail still shows the
  // six stages, and the scene CTA is the only progression control.
  const journey = getSegmentJourney(state.segmentId);
  const isRetail = state.segmentId === "retail";

  const measureScenes = getScenesForStage("retail", "measure");

  /* THE JOURNEY-RESTART INVARIANT

     Navigation state is split: the reducer owns `stageIndex`, this component
     owns the three per-route scene positions below. `SET_SEGMENT` and `RESTART`
     reset the first and used to leave the others untouched — so advancing
     Shopping Centre to Internal circulation, switching to Retail and returning
     showed that scene under a rail that said Context, with a next action that
     continued from scene five. Retail's version was quieter: the journey
     silently resumed Measure at its second scene.

     The three positions are held as ONE value stamped with the reducer's
     restart counter, and a stale stamp resolves to the start. The reset is
     therefore derived rather than synchronised: there is no effect to fire, no
     call site to remember it, and a future action that restarts a journey
     inherits the behaviour by bumping the epoch alone. */
  const [storedScenePositions, setScenePositions] = useState({
    epoch: 0,
    measure: 0,
    understand: 0,
    centre: 0,
  });
  const scenePositions =
    storedScenePositions.epoch === state.journeyEpoch
      ? storedScenePositions
      : { epoch: state.journeyEpoch, measure: 0, understand: 0, centre: 0 };

  const measureSceneIndex = scenePositions.measure;
  const setMeasureSceneIndex = (index: number) =>
    setScenePositions({ ...scenePositions, measure: index });

  /* Shopping Centre walks its typed `coreRoute` as one ordered list rather than
     three per-stage indices.

     Its Core route crosses three canonical stages — Catchment sits in Context,
     Entrances and Visitor composition in Measure, and five scenes in Understand
     — and the stage a presenter is standing in is simply the stage of the scene
     they are on. Retail's per-stage indices are left exactly as they were.

     Configure is NOT part of this list. `coreRoute` ends at Time in centre, and
     moving on to Configure is a stage transition, not a ninth scene. */
  const centreCoreRoute = getSegment("shopping-centre")?.coreRoute ?? [];
  const centreSceneIndex = scenePositions.centre;
  const setCentreSceneIndex = (index: number) =>
    setScenePositions({ ...scenePositions, centre: index });
  const centreSceneId = centreCoreRoute[centreSceneIndex] ?? null;
  const CentreScene = centreSceneId
    ? shoppingCentreSceneComponents[centreSceneId] ?? null
    : null;

  /* Which canonical stage a Core scene belongs to. The rail follows the scene,
     because for this segment the stage is a property of where the presenter is
     standing rather than a separate position to keep in sync by hand. */
  const centreStageOf = (sceneId: SceneId) =>
    getSceneForSegment("shopping-centre", sceneId)?.journeyStage ?? "context";

  /* Configure and Act are stages, not scenes. Without this the Core branch would
     keep rendering a scene after the presenter moved on to Configure. */
  const onCentreCoreRoute = !isRetail && stage.id !== "configure" && stage.id !== "act";

  // The Understand stage holds Core and branch scenes side by side in the typed
  // stage mapping, so the presenter route follows only its Core scenes, in
  // corePathOrder: In-store journey (4), then Zone engagement (5). Both now
  // have a scene component; the stage workspace remains the fallback for any
  // stage that does not.
  const understandScenes = getScenesForStage("retail", "understand")
    .filter((scene) => scene.priority === "core")
    .slice()
    .sort((a, b) => (a.corePathOrder ?? 0) - (b.corePathOrder ?? 0));
  const understandSceneIndex = scenePositions.understand;
  const setUnderstandSceneIndex = (index: number) =>
    setScenePositions({ ...scenePositions, understand: index });

  // The Prove stage holds one Core scene (Conversion & sales context, order 6)
  // alongside branch scenes in the typed stage mapping. It is the last Core
  // scene on the route, so it has no next Core scene: its CTA moves the
  // presenter on to the Configure synthesis stage.
  const proveScene = getScenesForStage("retail", "prove").find(
    (item) => item.priority === "core",
  );

  // Configure's view state lives here rather than inside the Configure scene so
  // that leaving Configure does not throw it away. The prospect who opens
  // "Capture & visits", walks on to Act and then steps back to Configure lands
  // on the direction they were reading, not on the Configure landing — the
  // brochure does not reset itself when someone turns a page and turns back.
  // The reducer is unchanged and still pure; only its owner moved up one level.
  const [configureView, configureDispatch] = useReducer(
    configureViewReducer,
    initialConfigureViewState,
  );

  // Which scene the presenter is currently standing in, from the same typed
  // stage mapping the render below uses — no second source of truth. `null`
  // means a stage that has no scene component yet (Context, Configure, Act).
  const activeSceneId = !isRetail
    ? centreSceneId
    : stage.id === "measure"
      ? measureScenes[measureSceneIndex]?.id ?? null
      : stage.id === "understand"
        ? understandScenes[understandSceneIndex]?.id ?? null
        : stage.id === "prove"
          ? proveScene?.id ?? null
          : null;

  // Scene entry is the only moment a scene-specific lens default is applied,
  // and leaving that scene restores the presenter's previous lens state. Scenes
  // that declare no default (every scene but Conversion & sales context) are
  // untouched by this effect.
  useEffect(() => {
    dispatch({ type: "ENTER_SCENE", sceneId: activeSceneId });
  }, [activeSceneId, dispatch]);

  const goToStage = (stageIndex: number) => {
    setMeasureSceneIndex(0);
    setUnderstandSceneIndex(0);
    // Entering a stage from the rail lands on that stage's first Core scene, so
    // the rail and the scene never disagree about where the presenter is.
    const targetStageId = journeyStages[stageIndex];
    const firstOfStage = centreCoreRoute.findIndex(
      (sceneId) => centreStageOf(sceneId) === targetStageId,
    );
    setCentreSceneIndex(firstOfStage >= 0 ? firstOfStage : 0);
    dispatchSet(dispatch, { type: "SET_STAGE", stageIndex });
  };

  /* Advancing through the Core route carries the rail with it: crossing from
     Catchment into Entrances is also crossing from Context into Measure. */
  const goToCentreScene = (index: number) => {
    setCentreSceneIndex(index);
    const nextStageIndex = journeyStages.indexOf(centreStageOf(centreCoreRoute[index]));
    if (nextStageIndex >= 0 && nextStageIndex !== state.stageIndex) {
      dispatchSet(dispatch, { type: "SET_STAGE", stageIndex: nextStageIndex });
    }
  };

  return (
    <main className={`ce-shell${state.presentationMode ? " ce-shell--presenting" : ""}`}>
      <header className="ce-topbar">
        {/* The lockup is the way back to the segment overview. The shell is no
            longer the front door, so it needs one. */}
        <Link className="ce-identity" href="/" title="All segments">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ce-identity__logo"
            src="/assets/logo/pfm-logo-black.png"
            alt="PFM"
            width={54}
            height={16}
          />
          <span className="ce-identity__text">Commercial Experience</span>
        </Link>

        <nav className="ce-segments" aria-label="Segment">
          {segments.map((segment) => {
            /* Two different questions, deliberately not merged.
               `implementation_ready` is a PRODUCT claim — a complete demo
               vertical — and Shopping Centre is not one: its Act does not exist.
               Whether the SHELL can run a journey is a separate, smaller fact.
               So a segment the shell can run becomes selectable outside
               production, while production keeps showing only what is genuinely
               ready. Nothing a prospect can reach changes. */
            const active = segment.id === state.segmentId;
            const label = segment.experienceName ?? segment.name;
            return shellRunsSegment(segment) ? (
              <button
                type="button"
                key={segment.id}
                className={`ce-segment${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  if (active) return;
                  // Configure's open direction belongs to the journey being
                  // left. Its ids are segment-scoped, so carrying one across
                  // would leave the next segment holding a direction it does
                  // not have.
                  configureDispatch({ type: "CLOSE_DIRECTION" });
                  dispatchSet(dispatch, { type: "SET_SEGMENT", segmentId: segment.id });
                }}
              >
                {label}
              </button>
            ) : (
              /* Inert, and deliberately so. The local preview does run this
                 segment's Core journey, but the shell is the APPROVED
                 customer-facing experience and a preview reached from inside it
                 is read as part of it. The preview has its own front door. */
              <span
                key={segment.id}
                className="ce-segment is-pending"
                aria-disabled="true"
                title="Architecture is in place; the visual experience is not available yet."
              >
                {label}
              </span>
            );
          })}
        </nav>

        <div className="ce-account">
          <span className="ce-account__name">
            {state.mode === "sales" ? account?.name ?? state.prospectName : journey.explorationLabel}
          </span>
          <button
            type="button"
            className={`ce-mode${state.presentationMode ? " is-active" : ""}`}
            aria-pressed={state.presentationMode}
            onClick={() => dispatchSet(dispatch, { type: "TOGGLE_PRESENTATION_MODE" })}
          >
            {state.presentationMode ? "Exit presentation" : "Presentation mode"}
          </button>
          <button
            type="button"
            className="ce-restart"
            onClick={() => dispatchSet(dispatch, { type: "RESTART" })}
          >
            Restart
          </button>
        </div>
      </header>

      <div className="ce-body">
        <nav className="ce-journey" aria-label="Location journey">
          {journeyStages.map((stageId, index) => {
            const item = stages[index];
            const current = index === state.stageIndex;
            // The rail always shows all six canonical stages — that architecture
            // is the same for every segment — but a stage this segment has no
            // content for is not somewhere to go. Shopping Centre's Prove is
            // empty and its Act is not built, so both render as visible markers
            // that do not navigate.
            const navigable = journey.navigableStages.includes(item.id);
            return (
              <button
                type="button"
                key={stageId}
                className={`ce-journey__step${current ? " is-current" : ""}${index < state.stageIndex ? " is-visited" : ""}${navigable ? "" : " is-inert"}`}
                aria-current={current ? "step" : undefined}
                aria-disabled={navigable ? undefined : true}
                onClick={() => {
                  if (navigable) goToStage(index);
                }}
              >
                <span className="ce-journey__mark">
                  <StageGlyph stage={item.id} />
                </span>
                <span className="ce-journey__text">
                  <strong>{item.label}</strong>
                  <small>{journey.stageDescriptors[item.id]}</small>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="ce-stage">
          {/* One branch for the whole Shopping Centre Core route. The component
              comes from the scene registry, so the shell never names a scene: it
              walks the typed route and renders what it lands on. The CTA moves to
              the next scene, and at the end of the route moves the presenter on
              to Configure — a stage transition, because Time in centre types no
              `nextSceneId` and Configure is not a scene. */}
          {onCentreCoreRoute && CentreScene ? (
            <CentreScene
              activeLenses={state.activeLenses}
              onToggleLens={(lens) => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId: lens })}
              onNextScene={() => {
                if (centreSceneIndex + 1 < centreCoreRoute.length) {
                  goToCentreScene(centreSceneIndex + 1);
                } else {
                  goToStage(journeyStages.indexOf("configure"));
                }
              }}
              presentationMode={state.presentationMode}
            />
          ) : stage.id === "measure" ? (
            measureScenes[measureSceneIndex]?.id === "retail-visitor-composition" ? (
              <RetailVisitorCompositionScene
                activeLenses={state.activeLenses}
                onToggleLens={(lens) => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId: lens })}
                onNextScene={() => goToStage(state.stageIndex + 1)}
                presentationMode={state.presentationMode}
              />
            ) : (
              <RetailMeasureScene
                activeLenses={state.activeLenses}
                onToggleLens={(lens) => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId: lens })}
                onNextScene={() =>
                  measureSceneIndex + 1 < measureScenes.length
                    ? setMeasureSceneIndex(measureSceneIndex + 1)
                    : goToStage(state.stageIndex + 1)
                }
                presentationMode={state.presentationMode}
              />
            )
          ) : stage.id === "understand" &&
            understandScenes[understandSceneIndex]?.id === "retail-zone-engagement" ? (
            <RetailZoneEngagementScene
              activeLenses={state.activeLenses}
              onToggleLens={(lens) => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId: lens })}
              onNextScene={() =>
                understandSceneIndex + 1 < understandScenes.length
                  ? setUnderstandSceneIndex(understandSceneIndex + 1)
                  : goToStage(state.stageIndex + 1)
              }
              presentationMode={state.presentationMode}
            />
          ) : stage.id === "configure" ? (
            // Configure is a synthesis stage: `stageMapping.configure` is empty
            // and stays empty, so this is not reached through `nextSceneId` and
            // no scene id is entered. `activeSceneId` remains null here, which
            // is what restores the presenter's own lens state on arrival.
            journey.configureVariant === "shopping-centre" ? (
              <ShoppingCentreConfigureScene
                view={configureView}
                onView={configureDispatch}
                onNextStage={() => goToStage(state.stageIndex + 1)}
                presentationMode={state.presentationMode}
                /* Withheld, not pointed somewhere false: this segment's Act does
                   not exist, and the Act stage renders Retail's Act component. */
                showNextStage={journey.configureHandsOnToAct}
              />
            ) : (
            <RetailConfigureScene
              view={configureView}
              onView={configureDispatch}
              onNextStage={() => goToStage(state.stageIndex + 1)}
              presentationMode={state.presentationMode}
            />
            )
          ) : stage.id === "act" ? (
            // Act is the sixth and final canonical stage, and also a synthesis
            // stage: `stageMapping.act` is empty and stays empty, so this is
            // not reached through `nextSceneId` and no scene id is entered.
            journey.actVariant === "shopping-centre" ? (
              /* The centre's Act, resolved the same way Configure is. The two
                 middles stay separate: Retail converges into three
                 next-conversation offers, this one closes on four decisions.

                 No asset name is passed from the session. Both fixture accounts
                 are retailers with a `locationCount`, and neither is a shopping
                 centre — naming one here would put a retailer's name on a
                 property conversation. The scene falls back to a neutral label. */
              <ShoppingCentreActScene
                assetName={state.mode === "sales" ? SHOPPING_CENTRE_ASSET_FALLBACK : null}
                presentationMode={state.presentationMode}
              />
            ) : (
            <RetailActScene
              clientName={state.mode === "sales" ? account?.name ?? null : null}
              locationCount={state.locationCount}
              presentationMode={state.presentationMode}
            />
            )
          ) : stage.id === "prove" && proveScene?.id === "retail-conversion-sales-context" ? (
            <RetailConversionSalesContextScene
              activeLenses={state.activeLenses}
              onToggleLens={(lens) => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId: lens })}
              onNextScene={() => goToStage(state.stageIndex + 1)}
              presentationMode={state.presentationMode}
            />
          ) : stage.id === "understand" &&
            understandScenes[understandSceneIndex]?.id === "retail-in-store-journey" ? (
            <RetailInStoreJourneyScene
              activeLenses={state.activeLenses}
              onToggleLens={(lens) => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId: lens })}
              onNextScene={() =>
                understandSceneIndex + 1 < understandScenes.length
                  ? setUnderstandSceneIndex(understandSceneIndex + 1)
                  : goToStage(state.stageIndex + 1)
              }
              presentationMode={state.presentationMode}
            />
          ) : (
            <div className="journey-workspace">
              <LocationCanvas
                stage={stage.id as StageId}
                activeLenses={state.activeLenses}
                onToggleLens={(lensId) => dispatchSet(dispatch, { type: "TOGGLE_LENS", lensId })}
                presentationMode={state.presentationMode}
              />
              <StagePanel state={state} dispatch={dispatch} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export function CommercialExperience({
  initialSegmentId,
}: {
  /**
   * Which segment the shell opens in, when it was entered from the overview.
   *
   * Only the segment: the shell still begins on its own entry screen, because
   * who the presenter is meeting is a question the overview never asked and
   * must not answer on their behalf. A segment the shell cannot run is ignored
   * rather than honoured — otherwise a hand-typed URL could put the shell in a
   * journey it has no config for.
   */
  initialSegmentId?: SegmentId;
} = {}) {
  const [state, dispatch] = useReducer(
    experienceReducer,
    initialSegmentId && shellCanRunSegment(initialSegmentId)
      ? { ...initialState, segmentId: initialSegmentId }
      : initialState,
  );
  if (state.screen === "entry") return <EntryScreen state={state} dispatch={dispatch} />;
  if (state.screen === "discovery") return <DiscoveryScreen state={state} dispatch={dispatch} />;
  return <JourneyScreen state={state} dispatch={dispatch} />;
}
