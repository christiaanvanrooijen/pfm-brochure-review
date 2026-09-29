"use client";

/**
 * Technical depth, as a modal right-side drawer.
 *
 * A calmer main screen must make this material EASIER to find, not smaller.
 * Everything here is resolved from `scene-technology-runtime.ts`, which itself
 * composes the existing runtimes — technology, technology-visuals, the
 * segment+capability override, the scene's own dependency model and the proof
 * runtime. Nothing is restated, and nothing is invented.
 *
 * THE FIVE SECTIONS
 *
 *   How it works  the relevant measurement illustration first, then what is
 *                 observed, what the customer supplies and what may be
 *                 derived — plus a user-initiated example video where one is
 *                 permitted for this segment.
 *   Technology    capability FIRST, then compatible sensors, software and
 *                 communication components as restrained cards: a real photo
 *                 where one exists, name, role and one limitation — with one
 *                 sentence on how they relate, never a bundling claim.
 *   Requirements  what this scene's derived outputs actually need — mandatory
 *                 inputs, the alternative combinations that also satisfy them,
 *                 optional enrichment, and per-implementation installation
 *                 essentials where they are documented.
 *   Privacy       implementation-specific, source-backed statements. Never
 *                 generalised across suppliers, and never generalised across
 *                 segments either.
 *   In practice   customer proof only where the proof runtime explicitly
 *                 permits it. A demonstration video is not proof, and stays
 *                 under "How it works".
 *
 * WHAT AN OVERRIDE DOES HERE
 *
 * Every one of the five sections reads implementations, explainers and video
 * from `getSceneCapabilityViews`, which applies the segment override's
 * narrowing ONCE. Shopping Centre's TECH-04 override sets
 * `allowCapabilityVideo: false` and narrows implementations to none: no video
 * plays, no implementation card renders, and both absences are stated rather
 * than hidden anywhere in the panel. Outlet Centre's TECH-04 override
 * withholds only the video (see `segment-capability-media.ts`) — its
 * implementations and explainers are unaffected, because nothing found fault
 * with those. A shared TECH id never authorises shared footage.
 */

import { useState, type Ref } from "react";
import type { SceneDefinition, SegmentId } from "../../content/types";
import {
  getSceneCapabilityViews,
  getScenePrivacyEntries,
  getSceneRequirementView,
  type SceneCapabilityView,
  type SceneImplementationView,
} from "../../content/scene-technology-runtime";
import { getPlayableProofsForScene } from "../../content/proof-runtime";
import { ProofCase } from "../ProofCase";
import {
  accessoriesFor,
  presentationNameOf,
  staffExclusionFor,
} from "../../content/technology-presentation";
import { getDrawerMethodCopy } from "../../content/drawer-method-copy";
import { getDrawerLimitation } from "../../content/drawer-limitations";
import { installationAccreditations } from "../../content/installation-accreditations";
import type { Locale } from "../../i18n/locales";
import {
  resolveCapabilityCopy,
  resolveExplainerCopy,
  resolveFollowOnVideoCopy,
  resolvePrivacyCopy,
  resolveVideoCopy,
  resolveVideoViewLabel,
  resolveWatchLabel,
} from "../../i18n/domain";
import {
  resolveDataRoleCopy,
  resolveDetailLabel,
  resolveDetailValue,
  resolveEssentialBody,
  resolveEssentialLabel,
} from "../../i18n/domain-requirements";
import { resolveLimitationClaim, resolveSupportedClaim } from "../../i18n/domain-claims";
import { resolveInputLabel } from "../../i18n/domain";
import { getMessages, type SceneCopy } from "../../i18n/messages";

type SectionId = "how" | "technology" | "requirements" | "privacy" | "practice";

interface DepthPanelProps {
  locale: Locale;
  segmentId: SegmentId;
  scene: SceneDefinition;
  copy: SceneCopy;
  /** Preview-only: opens on a named section so a capture can address one. */
  initialSection?: string | null;
  onClose: () => void;
  /** Focus lands here when the panel opens. */
  ref?: Ref<HTMLElement>;
}

const SECTION_IDS: readonly SectionId[] = ["how", "technology", "requirements", "privacy", "practice"];

export function DepthPanel({
  locale,
  segmentId,
  scene,
  copy,
  initialSection = null,
  onClose,
  ref,
}: DepthPanelProps) {
  const t = getMessages(locale).ui;
  const [section, setSection] = useState<SectionId>(
    SECTION_IDS.find((id) => id === initialSection) ?? "how",
  );

  const capabilityViews = getSceneCapabilityViews(segmentId, scene);
  const privacy = resolvePrivacyCopy(locale);
  const privacyEntries = getScenePrivacyEntries(segmentId, scene);
  const requirementView = getSceneRequirementView(scene);
  const proofs = getPlayableProofsForScene(segmentId, scene.id);

  const tabs: readonly { id: SectionId; label: string }[] = [
    { id: "how", label: t.depthHowItWorks },
    { id: "technology", label: t.depthTechnology },
    { id: "requirements", label: t.depthRequirements },
    { id: "privacy", label: t.depthPrivacy },
    { id: "practice", label: t.depthInPractice },
  ];

  return (
    <section
      className="rd-depth"
      role="dialog"
      /* Genuinely modal: the page behind is dimmed and inert, focus moves in on
         open, Tab is trapped inside while it is open, and Escape or Close hands
         focus back to the trigger. */
      aria-modal="true"
      aria-label={t.depthTitle}
      ref={ref}
      tabIndex={-1}
    >
      <div className="rd-depth__head">
        <h2 className="rd-depth__title">{t.howThisWorks}</h2>
        <p className="rd-depth__lead">{t.depthLead}</p>
        <button type="button" className="rd-depth__close" onClick={onClose}>
          {t.close}
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="rd-depth__tabs" role="tablist" aria-label={t.depthTitle}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === section}
            className={`rd-depth__tab${tab.id === section ? " is-active" : ""}`}
            onClick={() => setSection(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rd-depth__body">
        {section === "how" && (
          <HowItWorksTab
            locale={locale}
            segmentId={segmentId}
            sceneId={scene.id}
            capabilityViews={capabilityViews}
            t={t}
          />
        )}
        {section === "technology" && (
          <TechnologyTab locale={locale} segmentId={segmentId} capabilityViews={capabilityViews} t={t} />
        )}
        {section === "requirements" && (
          <RequirementsTab locale={locale} segmentId={segmentId} copy={copy} requirementView={requirementView} capabilityViews={capabilityViews} t={t} />
        )}
        {section === "privacy" && (
          <PrivacyTab locale={locale} privacy={privacy} entries={privacyEntries} t={t} />
        )}
        {section === "practice" && <PracticeTab proofs={proofs} locale={locale} t={t} />}
      </div>
    </section>
  );
}

/* ==========================================================================
   HOW IT WORKS — measurement illustration, then the video where permitted
   ========================================================================== */

function HowItWorksTab({
  locale,
  segmentId,
  sceneId,
  capabilityViews,
  t,
}: {
  locale: Locale;
  segmentId: SegmentId;
  sceneId: SceneDefinition["id"];
  capabilityViews: readonly SceneCapabilityView[];
  t: Readonly<Record<string, string>>;
}) {
  // Explainers for EVERY capability the scene declares, in typed order — not
  // just the first one. QSR's response scene lists timing, alerting and
  // communication; showing only the first answered "how does this work?" with
  // stage timing on the one scene that is about an alert reaching a person.
  const explainers = capabilityViews.flatMap((cv) => cv.explainerVisuals);

  // One picture, however many capabilities it explains. TECH-QSR-01 and
  // TECH-QSR-02 are both explained by the same lane frame — detection at the
  // points, and the time between them — so listing them as two figures showed
  // the identical photograph twice. They are grouped by asset instead: the
  // image once, each approach under it.
  const explainerGroups = explainers.reduce<
    { assetPath: string; altText: string; illustrationNote?: string; approachIds: string[] }[]
  >((groups, visual) => {
    const existing = groups.find((group) => group.assetPath === visual.assetPath);
    if (existing) {
      if (!existing.approachIds.includes(visual.approachId)) existing.approachIds.push(visual.approachId);
      return groups;
    }
    groups.push({
      assetPath: visual.assetPath,
      altText: visual.altText,
      illustrationNote: visual.illustrationNote,
      approachIds: [visual.approachId],
    });
    return groups;
  }, []);

  const contextVisuals = capabilityViews
    .map((cv) => (cv.contextVisual ? { view: cv, visual: cv.contextVisual } : null))
    .filter((entry): entry is { view: SceneCapabilityView; visual: NonNullable<SceneCapabilityView["contextVisual"]> } => entry !== null);

  const videos = capabilityViews
    .map((cv) => (cv.explainerVideo ? { view: cv, video: cv.explainerVideo } : null))
    .filter((entry): entry is { view: SceneCapabilityView; video: NonNullable<SceneCapabilityView["explainerVideo"]> } => entry !== null);

  // The method sentence is the text fallback for every segment + capability
  // pair. It also stays visible when an approved illustration exists, because
  // the picture or video shows a principle while this sentence names the
  // physical, geo, business and derived inputs in customer language.
  const methods = capabilityViews.flatMap((view) => {
    const method = getDrawerMethodCopy(segmentId, view.capabilityId, sceneId);
    return method ? [{ view, method }] : [];
  });

  // A capability with neither an explainer nor a context visual is a genuinely
  // empty "how it works" for THAT capability. Keep the absence attached to
  // the capability so a mixed scene does not imply that every method lacks an
  // approved illustration.
  const capabilitiesWithoutIllustration = capabilityViews.filter(
    (view) => view.explainerVisuals.length === 0 && view.contextVisual === null,
  );

  return (
    <div className="rd-depth__how">
      {contextVisuals.map(({ view, visual }) => (
        <figure className="rd-depth__figure rd-depth__figure--context" key={`ctx-${view.capabilityId}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={visual.assetPath} alt={visual.altText} />
          <figcaption>
            <strong>{view.name}</strong>
            <span>{visual.caption}</span>
            <em>{t.contextVisualCaption}</em>
          </figcaption>
        </figure>
      ))}

      {explainerGroups.length > 0 &&
        explainerGroups.map((group) => {
          const entries = group.approachIds.map((approachId) => {
            const visual = explainers.find((item) => item.approachId === approachId)!;
            return resolveExplainerCopy(locale, approachId, {
              approachName: visual.approachName,
              explanation: visual.explanation,
              illustrationNote: visual.illustrationNote ?? "",
              altText: visual.altText,
            });
          });
          return (
            <figure className="rd-depth__figure" key={group.assetPath}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={group.assetPath} alt={entries[0].altText} />
              {/* One approach renders flat, exactly as it always has, so every
                  surface that already had a single explainer is untouched to
                  the pixel. The wrapper appears only where there is genuinely a
                  second approach to separate. */}
              <figcaption>
                {entries.length === 1 ? (
                  <>
                    <strong>{entries[0].approachName}</strong>
                    <span>{entries[0].explanation}</span>
                  </>
                ) : (
                  entries.map((text) => (
                    <span className="rd-depth__approach" key={text.approachName}>
                      <strong>{text.approachName}</strong>
                      <span>{text.explanation}</span>
                    </span>
                  ))
                )}
                <em>{entries[0].illustrationNote}</em>
              </figcaption>
            </figure>
          );
        })}

      {methods.map(({ view, method }) => (
        <section className="rd-depth__method" key={`method-${view.capabilityId}`}>
          {/* The English name is the model's own; other languages resolve it,
              as the Technology tab and the missing-illustration line already do. */}
          <h3>
            {locale === "en"
              ? view.name
              : resolveCapabilityCopy(locale, segmentId, view.capabilityId)?.name ?? view.name}
          </h3>
          <p>{method.copy[locale]}</p>
        </section>
      ))}

      {capabilitiesWithoutIllustration.length > 0 &&
        capabilitiesWithoutIllustration.map((view) => {
          const capabilityName =
            resolveCapabilityCopy(locale, segmentId, view.capabilityId)?.name ?? view.name;
          return (
            /* A missing illustration is not a missing video. Reusing the
               video sentence here told an Outlet Centre reader that no
               example video existed, when what is actually absent is the
               measurement illustration for this capability. */
            <p className="rd-depth__absent" key={`explainer-none-${view.capabilityId}`}>
              {capabilityName}: {t.explainerNone}
            </p>
          );
        })}

      {videos.map(({ view, video }) => (
        <ExplainerVideo key={`video-${view.capabilityId}`} locale={locale} video={video} t={t} />
      ))}

      {videos.length === 0 && explainers.length > 0 && (
        <p className="rd-depth__absent">{t.videoNone}</p>
      )}
    </div>
  );
}

/**
 * The example video: user-initiated, native controls, loaded on demand.
 *
 * Nothing plays until the reader clicks "See …" — no autoplay on drawer open,
 * and no network fetch of the video file before that click either, since the
 * `<video>` element itself does not exist in the DOM until then. The follow-on
 * (a derived, reporting-style view) is reachable only once the primary is
 * open, exactly as the typed model nests it, and is its own independent
 * player with its own play state.
 */
function ExplainerVideo({
  locale,
  video,
  t,
}: {
  locale: Locale;
  video: NonNullable<SceneCapabilityView["explainerVideo"]>;
  t: Readonly<Record<string, string>>;
}) {
  const [open, setOpen] = useState(false);
  const [followOnOpen, setFollowOnOpen] = useState(false);
  const copy = resolveVideoCopy(locale, video.capabilityId, {
    actionLabel: video.actionLabel,
    intro: video.intro,
    description: video.description,
  });
  const viewLabel = resolveVideoViewLabel(locale, video.viewKind, video.viewLabel);

  return (
    <div className="rd-depth__video">
      <p className="rd-depth__video-intro">{copy.intro}</p>
      {!open ? (
        <button type="button" className="rd-depth__video-trigger" onClick={() => setOpen(true)}>
          <span className="rd-depth__video-play" aria-hidden="true" />
          {resolveWatchLabel(locale, t.watchAction, copy.actionLabel)}
        </button>
      ) : (
        <div className="rd-depth__video-frame">
          <p className="rd-depth__video-kicker">{viewLabel}</p>
          <video
            src={video.src}
            controls
            autoPlay
            playsInline
            style={{ aspectRatio: video.frameRatio }}
            aria-label={copy.description}
          />
          <p className="rd-depth__video-description">{copy.description}</p>
          {video.exampleImplementationRole && (
            <p className="rd-depth__video-example">
              {[video.exampleImplementationName, video.exampleImplementationRole].filter(Boolean).join(" — ")}
            </p>
          )}
          <button type="button" className="rd-depth__video-close" onClick={() => { setOpen(false); setFollowOnOpen(false); }}>
            {t.closeVideo}
          </button>

          {video.followOn && (
            <div className="rd-depth__followon">
              {!followOnOpen ? (
                <>
                  <p className="rd-depth__video-intro">{t.followOnIntro}</p>
                  <button type="button" className="rd-depth__video-trigger" onClick={() => setFollowOnOpen(true)}>
                    <span className="rd-depth__video-play" aria-hidden="true" />
                    {resolveWatchLabel(
                      locale,
                      t.watchAction,
                      resolveFollowOnVideoCopy(locale, {
                        actionLabel: video.followOn.actionLabel,
                        intro: video.followOn.intro,
                        description: video.followOn.description,
                        distinctionNote: video.followOn.distinctionNote,
                      }).actionLabel,
                    )}
                  </button>
                </>
              ) : (
                <FollowOnVideo locale={locale} followOn={video.followOn} t={t} onClose={() => setFollowOnOpen(false)} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FollowOnVideo({
  locale,
  followOn,
  t,
  onClose,
}: {
  locale: Locale;
  followOn: NonNullable<NonNullable<SceneCapabilityView["explainerVideo"]>["followOn"]>;
  t: Readonly<Record<string, string>>;
  onClose: () => void;
}) {
  const copy = resolveFollowOnVideoCopy(locale, {
    actionLabel: followOn.actionLabel,
    intro: followOn.intro,
    description: followOn.description,
    distinctionNote: followOn.distinctionNote,
  });
  const viewLabel = resolveVideoViewLabel(locale, followOn.viewKind, "Derived representation");
  return (
    <div className="rd-depth__video-frame rd-depth__video-frame--followon">
      <p className="rd-depth__video-kicker">{viewLabel}</p>
      <video
        src={followOn.src}
        controls
        autoPlay
        playsInline
        style={{ aspectRatio: followOn.frameRatio }}
        aria-label={copy.description}
      />
      <p className="rd-depth__video-description">{copy.description}</p>
      {/* The sentence that stops a reporting view being read as the
          measurement. Rendered every time this view is, in both audiences. */}
      <p className="rd-depth__distinction">{copy.distinctionNote}</p>
      <button type="button" className="rd-depth__video-close" onClick={onClose}>
        {t.closeVideo}
      </button>
    </div>
  );
}

/* ==========================================================================
   TECHNOLOGY — capability first, then restrained implementation cards
   ========================================================================== */

function TechnologyTab({
  locale,
  segmentId,
  capabilityViews,
  t,
}: {
  locale: Locale;
  segmentId: SegmentId;
  capabilityViews: readonly SceneCapabilityView[];
  t: Readonly<Record<string, string>>;
}) {
  return (
    <div className="rd-depth__tech">
      {capabilityViews.map((cv) => {
        const capabilityCopy = resolveCapabilityCopy(locale, segmentId, cv.capabilityId);
        return (
          <section className="rd-depth__tech-capability" key={cv.capabilityId}>
            <p className="rd-depth__kicker">{t.capabilityFirst}</p>
            <h3>{capabilityCopy?.name ?? cv.name}</h3>
            <p>{cv.scenePurpose?.[locale] ?? capabilityCopy?.purpose ?? cv.purpose}</p>

            {cv.implementations.length > 0 ? (
              <>
                {cv.implementations.length > 1 && (
                  <p className="rd-depth__relation">{t.capabilityRelation}</p>
                )}
                <ul className="rd-depth__cards">
                  {cv.implementations.map((impl) => (
                    <ImplementationCard key={impl.id} locale={locale} impl={impl} t={t} />
                  ))}
                </ul>
              </>
            ) : (
              <p className="rd-depth__absent">{t.implementationsNone}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function ImplementationCard({
  locale,
  impl,
  t,
}: {
  locale: Locale;
  impl: SceneImplementationView;
  t: Readonly<Record<string, string>>;
}) {
  /* The functional name, never the vendor or the model number — see
     `technology-presentation.ts`. The supplier stays in the model because the
     requirement profile and the privacy source are attached to it; it simply
     does not reach a prospect. */
  const name = presentationNameOf(impl);
  const showRole = name !== impl.implementationRole;
  // Restrained: the single most load-bearing limitation, not all of them. The
  // model orders `unsupportedClaims` with the most important one first in
  // every implementation; the rest are fully available in Privacy, framed as
  // what privacy evidence does not cover.
  const limitationOverride = getDrawerLimitation(impl.id);
  const limitation = limitationOverride
    ? limitationOverride.copy[locale]
    : impl.blockedClaims[0]
      ? resolveLimitationClaim(locale, impl.id, impl.blockedClaims[0])
      : null;

  return (
    <li className="rd-depth__card">
      <div className="rd-depth__card-visual">
        {impl.visual ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={impl.visual.assetPath} alt={impl.visual.altText} />
        ) : (
          <span className="rd-depth__card-blank" aria-hidden="true" />
        )}
      </div>
      <div className="rd-depth__card-body">
        <strong>{name}</strong>
        {showRole && <span className="rd-depth__card-role">{impl.implementationRole}</span>}
        {limitation && (
          <span className="rd-depth__card-limitation">
            <span className="rd-depth__card-limitation-label">{t.limitation}</span> {limitation}
          </span>
        )}
      </div>
    </li>
  );
}

/* ==========================================================================
   REQUIREMENTS — mandatory, alternative and optional, distinguished
   ========================================================================== */

function RequirementsTab({
  locale,
  segmentId,
  copy,
  requirementView,
  capabilityViews,
  t,
}: {
  locale: Locale;
  segmentId: SegmentId;
  copy: SceneCopy;
  requirementView: ReturnType<typeof getSceneRequirementView>;
  capabilityViews: readonly SceneCapabilityView[];
  t: Readonly<Record<string, string>>;
}) {
  const implementationIds = capabilityViews.flatMap((cv) => cv.implementations.map((i) => i.id));
  const accessories = [...new Set(implementationIds)].flatMap((id) => accessoriesFor(id));
  const staffExclusion = staffExclusionFor(segmentId, implementationIds);

  const implementationsWithProfiles = capabilityViews.flatMap((cv) =>
    cv.implementations.filter((impl) => impl.requirementProfile !== null),
  );
  const hasAnyImplementation = capabilityViews.some((cv) => cv.implementations.length > 0);

  return (
    <div className="rd-depth__requirements">
      <p className="rd-depth__kicker">{t.requiredDataHeading}</p>
      <ul className="rd-depth__roles">
        {requirementView.requiredRoles.map((role) => {
          const roleCopy = resolveDataRoleCopy(locale, role);
          return (
            <li key={role}>
              <strong>{roleCopy.label}</strong>
              <span>{roleCopy.note}</span>
            </li>
          );
        })}
      </ul>

      {requirementView.optionalRoles.length > 0 && (
        <>
          <p className="rd-depth__kicker">{t.optionalDataHeading}</p>
          <ul className="rd-depth__roles rd-depth__roles--optional">
            {requirementView.optionalRoles.map((role) => {
              const roleCopy = resolveDataRoleCopy(locale, role);
              return (
                <li key={role}>
                  <strong>{roleCopy.label}</strong>
                  <span>{roleCopy.note}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {requirementView.dependencies.map((dep) => (
        <div className="rd-depth__dependency" key={dep.dependencyId}>
          <p className="rd-depth__kicker">{dep.output}</p>
          {dep.required.length > 0 && (
            <>
              <p className="rd-depth__requires-label">{t.requiresAll}:</p>
              <ul className="rd-depth__list">
                {dep.required.map((input) => (
                  <li key={input.id}>
                    <strong>{resolveInputLabel(locale, input.id, input.label)}</strong>
                  </li>
                ))}
              </ul>
            </>
          )}
          {dep.alternativeGroups.length > 0 && (
            <>
              <p className="rd-depth__requires-label">{t.requiresOneOf}:</p>
              <ul className="rd-depth__alternatives">
                {dep.alternativeGroups.map((group, index) => (
                  <li key={index}>
                    {group.map((input) => resolveInputLabel(locale, input.id, input.label)).join(" + ")}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}

      <p className="rd-depth__kicker">{t.essentialsHeading}</p>
      {implementationsWithProfiles.length > 0 ? (
        implementationsWithProfiles.map((impl) => (
          <div className="rd-depth__essentials" key={impl.id}>
            <p className="rd-depth__essentials-name">
              {presentationNameOf(impl)}
            </p>
            <ul className="rd-depth__list">
              {impl.requirementProfile!.essentials.map((essential) => (
                <li key={essential.label}>
                  <strong>{resolveEssentialLabel(locale, essential.label)}</strong>
                  <span>{resolveEssentialBody(locale, impl.id, essential.label, essential.body)}</span>
                </li>
              ))}
            </ul>
            {impl.requirementProfile!.technicalDetail.length > 0 && (
              <TechnicalDetailReveal locale={locale} impl={impl} t={t} />
            )}
          </div>
        ))
      ) : (
        <p className="rd-depth__absent">{hasAnyImplementation ? t.installationNone : t.implementationsNone}</p>
      )}

      {/* A device another device cannot work without. It belongs in "what would
          we need", because leaving it out makes that answer wrong in the
          direction that costs someone money after they have decided. */}
      {accessories.length > 0 && (
        <>
          <p className="rd-depth__kicker">{t.accessoriesHeading}</p>
          <ul className="rd-depth__list">
            {accessories.map((accessory) => (
              <li key={accessory.name}>
                <strong>{accessory.name}</strong>
                <span>
                  {accessory.purpose} {accessory.condition ?? t.accessoryAlways}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Narrow on purpose: available on one device family, in one segment. */}
      {staffExclusion && (
        <>
          <p className="rd-depth__kicker">{t.staffExclusionHeading}</p>
          <ul className="rd-depth__list">
            <li>
              <strong>{staffExclusion.name}</strong>
              <span>{staffExclusion.body}</span>
            </li>
          </ul>
        </>
      )}

      {/* How we install, wherever the scene needs something installed. About
          PFM rather than this scene, so it closes the installation answer. */}
      {hasAnyImplementation && (
        <>
          <p className="rd-depth__kicker">{installationAccreditations[locale].heading}</p>
          <ul className="rd-depth__list">
            {installationAccreditations[locale].items.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <ul className="rd-depth__sequence">
        {copy.sequence.map((step) => (
          <li key={step.kicker}>
            <span>{step.kicker}</span>
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechnicalDetailReveal({
  locale,
  impl,
  t,
}: {
  locale: Locale;
  impl: SceneImplementationView;
  t: Readonly<Record<string, string>>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rd-depth__detail">
      <button type="button" className="rd-depth__detail-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? t.hideTechnicalDetail : t.showTechnicalDetail}
      </button>
      {open && (
        <ul className="rd-depth__list rd-depth__list--detail">
          {impl.requirementProfile!.technicalDetail.map((row) => (
            <li key={row.label}>
              <strong>{resolveDetailLabel(locale, row.label)}</strong>
              <span>{resolveDetailValue(locale, impl.id, row.label, row.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ==========================================================================
   PRIVACY — per implementation, never merged
   ========================================================================== */

function PrivacyTab({
  locale,
  privacy,
  entries,
  t,
}: {
  locale: Locale;
  privacy: ReturnType<typeof resolvePrivacyCopy>;
  entries: ReturnType<typeof getScenePrivacyEntries>;
  t: Readonly<Record<string, string>>;
}) {
  return (
    <div className="rd-depth__privacy">
      <h3>{privacy.headline}</h3>
      <p>{privacy.lead}</p>
      <ul className="rd-depth__list">
        {privacy.principles.map((principle) => (
          <li key={principle.title}>
            <strong>{principle.title}</strong>
            <span>{principle.body}</span>
          </li>
        ))}
      </ul>

      {entries.length > 0 ? (
        entries.map((entry) => (
          <div className="rd-depth__privacy-entry" key={`${entry.capabilityId}-${entry.implementationId}`}>
            <p className="rd-depth__privacy-name">
              {presentationNameOf({ id: entry.implementationId, implementationRole: entry.implementationRole })}
            </p>
            {entry.hasPrivacyEvidence ? (
              <ul className="rd-depth__list">
                {entry.supportedClaims.map((claim, index) => (
                  <li key={claim}>
                    <span>{resolveSupportedClaim(locale, entry.implementationId, index, claim)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rd-depth__absent">{t.privacyUnmapped}</p>
            )}
          </div>
        ))
      ) : (
        <p className="rd-depth__absent">{t.privacyNoImplementation}</p>
      )}
    </div>
  );
}

/* ==========================================================================
   IN PRACTICE — customer proof only where the runtime permits it
   ========================================================================== */

function PracticeTab({
  proofs,
  locale,
  t,
}: {
  proofs: ReturnType<typeof getPlayableProofsForScene>;
  locale: Locale;
  t: Readonly<Record<string, string>>;
}) {
  return (
    <div className="rd-depth__practice">
      {proofs.length > 0 ? (
        proofs.map((proof) => <ProofCase key={proof.id} proof={proof} locale={locale} />)
      ) : (
        <>
          <p className="rd-depth__absent">{t.proofUnavailable}</p>
          <p>{t.proofUnavailableBody}</p>
        </>
      )}
    </div>
  );
}
