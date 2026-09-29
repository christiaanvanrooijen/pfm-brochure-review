/**
 * Shopping Centre solution directions — the typed content behind Configure for
 * the Shopping Centre segment.
 *
 * WHY THIS IS A SEPARATE FILE
 *
 * The shared type, the id union and the territory union live in
 * `solution-directions.ts` alongside the frozen Retail definitions. Only the
 * identities were added there. The definitions live here so that extending the
 * model for a second segment cannot touch a single line of approved Retail
 * content.
 *
 * THE SHOPPING CENTRE BUSINESS BOUNDARY — the load-bearing fact in this file
 *
 * No Shopping Centre scene declares TECH-08 (Business data connection and
 * analytics). Four Core scenes nevertheless REQUIRE the `business` data role.
 * In this segment `business` therefore means the operational and leasing context
 * that makes a spatial reading interpretable:
 *
 *   floor plans, zone definitions, unit boundaries, tenancy schedules,
 *   opening hours, event calendars, operating calendars.
 *
 * It does NOT mean tenant sales, turnover, ATV, transactions, basket, spend,
 * conversion, POS data or ROI. Retail's business layer is the opposite — it is
 * transactions and sales value — so Retail's boundary sentences must never be
 * copied across. Every boundary note below is written for this segment.
 *
 * WHAT A DIRECTION IS NOT
 *
 * Not a product bundle, not a ranking, not a recommendation. The segment's
 * `synthesis.configure.recommendationMode` is the literal `"none"`. Territories
 * are customer problems; capabilities may legitimately overlap between them
 * where the measurement architecture genuinely requires it, and no attempt is
 * made to give each capability a single owner.
 *
 * [Source: SEGMENT-STORY-ARCHITECTURE.md, Shopping Centre — product architecture;
 *          SALES-EXPERIENCE-DIRECTION.md §22 Configure direction]
 */

import type { SolutionDirectionDefinition } from "./solution-directions.ts";

const storyArchitecture = "SEGMENT-STORY-ARCHITECTURE.md";
const salesDirection = "SALES-EXPERIENCE-DIRECTION.md";

const centreSource = (section: string): readonly string[] => [
  `${storyArchitecture}: Shopping Centre synthesis route`,
  `${salesDirection}: §22 Configure direction — ${section}`,
];

export const shoppingCentreSolutionDirections: readonly SolutionDirectionDefinition[] = [
  {
    id: "solution-sc-arrival-and-rhythm",
    segment: "shopping-centre",
    territory: "arrival",
    // "Visits & rhythm" rather than "Arrival": this territory carries overall
    // visit length as well as entries, and calling it Arrival would frame Time
    // in centre as an entrance metric, which it is not.
    territoryLabel: "Visits & rhythm",
    title: "Know how busy the centre really is",
    customerQuestion: "How busy is the centre, when, and through which doors?",
    lead:
      "Entries, the anonymous mix behind them and how long a visit lasts — read against the hours the centre actually operates.",
    capabilityPhrases: [
      "Entries by entrance, hour and day",
      "Anonymous visitor mix, where it is enabled",
      "Visit length, where matching covers it",
    ],
    // Two boundaries in one sentence, because both are places this direction
    // could overclaim: duration has TWO alternative input paths and needs only
    // one of them, and a vehicle is not a visitor.
    boundaryNote:
      "Visit length needs either matched anonymous entrance events or a supported continuous journey — one path is enough, and neither covers every visit. Where parking context is included, a vehicle is still not a visitor.",
    relatedSceneIds: [
      "shopping-centre-entrances",
      "shopping-centre-visitor-composition",
      "shopping-centre-time-in-centre",
    ],
    // TECH-06 is declared only because vehicle and parking context is an
    // explicit, optional choice in this direction. It is optional depth from a
    // branch, never a Core member of the territory.
    technologyCapabilityIds: ["TECH-02", "TECH-03", "TECH-05", "TECH-06"],
    // Classification (TECH-03) is deliberately absent, per the schema
    // convention: it configures a device already in the list rather than adding
    // one. TECH-05 installs nothing — it is matching across existing coverage.
    siteCapabilityIds: ["TECH-02", "TECH-06"],
    alignmentNotes: [
      "The entrances in scope, and the sensing tier chosen for each",
      "The operating periods a rhythm is read against — opening hours, event and operating calendars",
      "Which single visit-duration input path is supported at this centre",
      "Whether anonymous classification is enabled, configured and permitted",
      "Whether vehicle and parking context is included at all",
    ],
    sourceRefs: centreSource("centre question -> required measurement"),
  },
  {
    id: "solution-sc-movement-and-space",
    segment: "shopping-centre",
    territory: "movement",
    territoryLabel: "Movement & space",
    title: "See how the space is actually used",
    customerQuestion: "How do visitors move through the centre, and where do they stop?",
    lead:
      "Routes between floors, corridors and anchors, and the areas that hold attention — read against your own plan of the asset.",
    capabilityPhrases: [
      "Routes, transitions and bottlenecks",
      "Zone and anchor exposure",
      "Where visitors dwell, by area",
    ],
    boundaryNote:
      "Movement is anonymous and area-level: nobody is followed through the centre. A busy area is not a good area and a quiet one is not a failure, and nothing outside the agreed coverage is answered by it.",
    relatedSceneIds: [
      "shopping-centre-internal-circulation",
      "shopping-centre-zone-anchor-exposure",
    ],
    technologyCapabilityIds: ["TECH-04"],
    siteCapabilityIds: ["TECH-04"],
    // Business context is not optional in this territory: without an agreed plan
    // of the asset there is nothing for movement to be attributed to.
    alignmentNotes: [
      "An agreed floor plan, with the floors and corridors in scope",
      "Zone and anchor boundaries, and who signs a boundary change off",
      "The camera coverage and placement the reading is based on",
      "Whether the reading is route-level or zone-level",
      "How long a visit lasts overall, which conditions how a dwell reading is interpreted",
    ],
    sourceRefs: centreSource("required measurement -> available insight"),
  },
  {
    id: "solution-sc-tenant-and-brand",
    segment: "shopping-centre",
    territory: "tenancy",
    territoryLabel: "Tenant & brand",
    title: "Bring evidence to tenant and adjacency conversations",
    customerQuestion: "Which units are actually visited, and which are visited together?",
    lead:
      "Anonymous visits to a tenant boundary, and the sequences between tenants — evidence for leasing, adjacency and unit positioning.",
    capabilityPhrases: [
      "Visits by tenant and unit",
      "Sequences between tenants",
      "Adjacency and unit positioning context",
    ],
    // The single most important sentence in this file. PFM declares no
    // business-data capability anywhere in this segment, so a tenant-sales
    // reading is not a boundary this direction is choosing — it is one it
    // cannot cross.
    boundaryNote:
      "This is visitation, not trade. PFM measures anonymous visits to a unit boundary and never tenant sales, turnover or spend, and a sequence between two tenants is not a purchase journey or a recognised shopper.",
    relatedSceneIds: ["shopping-centre-brand-counting", "shopping-centre-brand-flow"],
    technologyCapabilityIds: ["TECH-02", "TECH-04", "TECH-05"],
    siteCapabilityIds: ["TECH-02", "TECH-04"],
    alignmentNotes: [
      "The tenancy schedule, and the tenant or brand mapping behind it",
      "Which tenant thresholds and units are in scope",
      "How a unit boundary is drawn where a unit has more than one opening",
      "Whether cross-tenant sequence is in scope, or tenant visits alone",
      "Zone and anchor exposure, where an area-level reading gives a unit its context",
    ],
    sourceRefs: centreSource("available insight -> commercial interpretation"),
  },
  {
    id: "solution-sc-catchment-and-positioning",
    segment: "shopping-centre",
    territory: "reach",
    territoryLabel: "Reach & positioning",
    title: "Describe the catchment the centre actually draws from",
    customerQuestion: "Where do our visitors come from, and who lives in that reach?",
    lead:
      "Catchment bands, origin mix and travel-time reach — the context a positioning, marketing or leasing conversation is built on.",
    capabilityPhrases: [
      "Catchment bands and travel-time reach",
      "Origin mix and area context",
      "Competitive destinations and white spots",
    ],
    boundaryNote:
      "This layer is aggregate area context, not a measurement of the centre's visitors. It sits beside entrance measurement and never replaces it, and no origin reading identifies anyone.",
    relatedSceneIds: [
      "shopping-centre-catchment-area",
      "shopping-centre-competitive-visitation-white-spots",
    ],
    // TECH-06 is optional supporting context only: vehicle origin adds
    // destination context where it is genuinely supported.
    technologyCapabilityIds: ["TECH-07", "TECH-06"],
    // Nothing is installed at the asset for this direction. Geo connects an
    // approved external source; the optional vehicle-origin layer belongs to a
    // branch that declares its own site capability elsewhere.
    siteCapabilityIds: [],
    alignmentNotes: [
      "An approved geo, mobility or GIS source",
      "The catchment definition and travel-time model in use",
      "Whether competitive destination and white-spot layers are included",
      "Whether vehicle-origin context is added, where it is genuinely supported",
    ],
    sourceRefs: centreSource("commercial interpretation -> positioning context"),
  },
];
