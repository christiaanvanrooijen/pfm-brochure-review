/**
 * Retail Park solution directions — the typed content behind Configure for the
 * Retail Park segment.
 *
 * WHY THIS IS A SEPARATE FILE
 *
 * The shared type, the id union and the territory union live in
 * `solution-directions.ts` alongside the frozen Retail definitions and the
 * approved Shopping Centre identities. Only the identities were added there.
 * The definitions live here so that extending the model for a third segment
 * cannot touch a single line of approved Retail or Shopping Centre content.
 *
 * THE RETAIL PARK BUSINESS BOUNDARY — the load-bearing fact in this file
 *
 * No Retail Park scene declares TECH-08 (business data connection and
 * analytics). Four Core scenes nevertheless REQUIRE the `business` data role.
 * In this segment `business` therefore means the operational and leasing
 * definitions that make a physical reading interpretable:
 *
 *   unit boundaries and tenant mapping, category mapping, parking capacity,
 *   parking zone and operating definitions, opening hours and operating
 *   calendars.
 *
 * It does NOT mean tenant sales, turnover, transactions, basket, spend,
 * conversion, POS data or ROI. Retail's business layer is the opposite — it is
 * transactions and sales value — so Retail's boundary sentences must never be
 * copied across. Shopping Centre's sentences must not be copied either: a park
 * has a car park and no internal circulation, so its boundaries sit in
 * different places. Every boundary note below is written for this segment.
 *
 * THE FIVE CAPABILITY BOUNDARIES THIS SEGMENT MUST HOLD
 *
 * Each of these is a place the Core route drew a line, and Configure is where a
 * synthesis could quietly erase it by grouping two readings under one promise:
 *
 *   1. A vehicle arrival is not a parking occupancy.
 *   2. Parking occupancy is unreadable without a defined capacity.
 *   3. A unit visit is not a person, a vehicle, a sale or a transaction.
 *   4. Cross-visitation is neither identity nor causal movement.
 *   5. Time on site is a visitor duration, not a vehicle dwell.
 *   6. Exposure is not a ranking, an intent, a conversion or a sale.
 *
 * Boundaries 1 and 2 live in "Arrival & parking", 3 and 6 in
 * "Units & visitation", 4 and 5 in "Movement & dwell".
 *
 * ANPR, LICENCE PLATES AND VEHICLE ORIGIN
 *
 * `retail-park-vehicle-origin` is typed `priority: "advanced"`, and the typed
 * Configure contract does not require it. It therefore appears in NO
 * `relatedSceneIds` and contributes NO capability here, so no licence-plate
 * implementation is resolved onto this stage. It is named once, in a single
 * alignment note, as a separate lawful configuration that is explicitly not
 * part of this path — because a prospect who has seen the vehicle scenes will
 * ask, and silence would read as either a promise or a concealment.
 *
 * WHAT A DIRECTION IS NOT
 *
 * Not a product bundle, not a ranking, not a recommendation, not a chosen or
 * validated solution. The segment's `synthesis.configure.recommendationMode` is
 * the literal `"none"`. Territories are customer problems; capabilities may
 * legitimately overlap between them where the measurement architecture
 * genuinely requires it, and no attempt is made to give each capability a
 * single owner.
 *
 * [Source: SEGMENT-STORY-ARCHITECTURE.md, Retail Park — product architecture;
 *          SALES-EXPERIENCE-DIRECTION.md §22 Configure direction]
 */

import type { SolutionDirectionDefinition } from "./solution-directions.ts";

const storyArchitecture = "SEGMENT-STORY-ARCHITECTURE.md";
const salesDirection = "SALES-EXPERIENCE-DIRECTION.md";

const parkSource = (section: string): readonly string[] => [
  `${storyArchitecture}: Retail Park synthesis route`,
  `${salesDirection}: §22 Configure direction — ${section}`,
];

export const retailParkSolutionDirections: readonly SolutionDirectionDefinition[] = [
  {
    id: "solution-rp-arrival-and-parking",
    segment: "retail-park",
    territory: "vehicles",
    // "Arrival & parking" rather than "Parking": the territory holds two
    // separate readings, and naming it after one of them would let the other
    // inherit its claims.
    territoryLabel: "Arrival & parking",
    title: "See how the park is reached, and how the car park behaves",
    customerQuestion: "How many vehicles arrive, and how much of the parking is actually used?",
    lead:
      "Arrivals across the day and the pressure on the car park — two separate readings of the same asset, each with its own sensing and its own conditions.",
    capabilityPhrases: [
      "Vehicle arrivals by hour and day",
      "Occupancy read against a defined capacity",
      "Where pressure sits across parking zones",
    ],
    // Boundaries 1 and 2, stated together because the second is what makes the
    // first insufficient: a park that installs arrival sensing alone cannot
    // read occupancy, and a prospect must not leave Configure believing it can.
    boundaryNote:
      "An arrival is not an occupancy, and a vehicle is not a visitor. Arrivals count vehicles crossing a sensed point; occupancy needs an agreed capacity and zone definition before any share of it can be read at all, and neither reading counts people or identifies a car.",
    relatedSceneIds: ["retail-park-vehicle-arrival", "retail-park-parking-occupancy"],
    technologyCapabilityIds: ["TECH-06"],
    siteCapabilityIds: ["TECH-06"],
    alignmentNotes: [
      "The entries and exits in scope, and the sensing position at each",
      "The parking capacity, zone and operating definitions occupancy is read against",
      "Whether arrival and occupancy are both in scope, or one of them alone",
      "The operating periods an arrival rhythm is read against",
      "That a lawfully configured vehicle-origin branch is a separate, permitted configuration and is not part of this path",
    ],
    sourceRefs: parkSource("park question -> required measurement"),
  },
  {
    id: "solution-rp-units-and-visitation",
    segment: "retail-park",
    territory: "units",
    territoryLabel: "Units & visitation",
    title: "Bring visit evidence to unit and category conversations",
    customerQuestion: "Which units are visited, and how does exposure vary across them?",
    lead:
      "Anonymous visits to a covered unit boundary, the categories those units sit in, and — where it is enabled — the anonymous mix arriving.",
    capabilityPhrases: [
      "Visits by unit and period",
      "How exposure varies across units and categories",
      "Anonymous visitor mix, where it is enabled",
    ],
    // Boundaries 3 and 6. The coverage sentence is repeated from Scene 7
    // deliberately: unknown-not-zero is the single easiest thing to lose when
    // seven scenes are compressed into one offer.
    boundaryNote:
      "A unit visit is not a person, a vehicle, a sale or a transaction, and exposure ranks nothing. A unit outside coverage has unknown exposure rather than none, and PFM measures no tenant trade anywhere in this segment.",
    relatedSceneIds: [
      "retail-park-unit-visits",
      "retail-park-visitor-composition",
      "retail-park-unit-category-exposure",
    ],
    // Classification (TECH-03) is declared because the anonymous mix is a real
    // optional reading here, but it is deliberately absent from the site list,
    // per the schema convention: it configures a device already in that list
    // rather than adding another one to install.
    technologyCapabilityIds: ["TECH-02", "TECH-03"],
    siteCapabilityIds: ["TECH-02"],
    alignmentNotes: [
      "The units and thresholds in scope, and where each unit boundary is drawn",
      "The tenant, unit and category mapping a category reading is expressed against",
      "How a unit with more than one opening is covered",
      "Whether anonymous classification is enabled, configured and permitted",
      "Which units are deliberately left outside coverage, and how that gap is reported",
    ],
    sourceRefs: parkSource("required measurement -> available insight"),
  },
  {
    id: "solution-rp-movement-and-dwell",
    segment: "retail-park",
    territory: "dwell",
    territoryLabel: "Movement & dwell",
    title: "See how a visit moves across the park, and how long it lasts",
    customerQuestion: "How do visitors move between units, and how long do they stay?",
    lead:
      "Sequences between covered units, and overall time on site — read from matched anonymous events across coverage that already exists.",
    capabilityPhrases: [
      "Sequences between covered units",
      "Overall time on site",
      "How duration is distributed across a day",
    ],
    // Boundaries 4 and 5.
    boundaryNote:
      "A sequence between two units is not an identity, a recognised shopper or a cause: it shows that visits happened in an order, never why. Time on site is a visitor duration and is not the same measurement as how long a vehicle stood in the car park.",
    relatedSceneIds: ["retail-park-cross-visitation", "retail-park-time-on-site"],
    technologyCapabilityIds: ["TECH-05", "TECH-06"],
    // Nothing is installed for this direction. Matching (TECH-05) runs across
    // coverage that already exists, and where a duration comes from a supported
    // vehicle path the sensing behind it is the sensing already declared and
    // shown under Arrival & parking. Repeating that hardware under a movement
    // heading would both duplicate it and blur boundary 5.
    siteCapabilityIds: [],
    alignmentNotes: [
      "Which duration path this park supports — matched visitor events, or a supported vehicle duration",
      "That the chosen path is stated on the reading, because a vehicle duration and a visitor visit are not the same measurement",
      "The unit mapping a sequence is expressed against",
      "Which covered units a sequence may be read between",
      "The operating periods a duration distribution is read against",
    ],
    sourceRefs: parkSource("available insight -> commercial interpretation"),
  },
  {
    id: "solution-rp-catchment-and-demand",
    segment: "retail-park",
    territory: "catchment",
    territoryLabel: "Catchment & demand",
    title: "Describe the demand the park actually draws from",
    customerQuestion: "Where does demand around the park come from, and who else attracts it?",
    lead:
      "Catchment reach, the area context behind it, and the competing destinations drawing on the same audience.",
    capabilityPhrases: [
      "Catchment reach and travel-time bands",
      "Area and demand context",
      "Competing parks and white spots",
    ],
    boundaryNote:
      "This layer is aggregate area context, not a measurement of this park's own visitors. It sits beside the readings measured at the asset and never replaces them, and no origin reading here identifies anyone or names a vehicle.",
    relatedSceneIds: [
      "retail-park-catchment-area",
      "retail-park-competitive-visitation-white-spots",
    ],
    // TECH-07 alone. Shopping Centre's equivalent direction also declares
    // TECH-06 for optional vehicle-origin context; this segment deliberately
    // does not, because Retail Park's origin branch is typed `advanced` and
    // declaring it here would resolve licence-plate implementations onto the
    // default Configure path.
    technologyCapabilityIds: ["TECH-07"],
    // Nothing is installed at the asset for this direction: geo connects an
    // approved external source.
    siteCapabilityIds: [],
    alignmentNotes: [
      "An approved geo, mobility or GIS source",
      "The catchment definition and travel-time model in use",
      "Whether competing destinations and white spots are included",
      "That an area reading is reported beside, never instead of, what is measured at the park",
    ],
    sourceRefs: parkSource("commercial interpretation -> positioning context"),
  },
];
