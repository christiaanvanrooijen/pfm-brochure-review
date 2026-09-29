# PFM Commercial Experience — Engineering Foundation v1

Date: 2026-08-15

Status: engineering checkpoint

Visual status: design freeze active

## Purpose

This checkpoint captures the stable engineering foundation before the high-fidelity visual experience is redesigned and approved.

## Included foundation

### Typed content architecture

- 4 segment definitions
- 45 matrix scenes
- Retail = implementation_ready
- Shopping Centre = architecture_only
- Retail Park = architecture_only
- Outlet Centre = architecture_only
- Core / Optional / Advanced story priorities
- machine-readable evidence dependencies
- visual asset registry
- technology registry
- proof asset registry

### Scene Runtime

Generic content/query runtime supporting:

- segment-safe scene lookup
- canonical journey stages
- Core route resolution
- next / previous Core scene
- route metadata
- stage lookup
- implementation readiness

Current Core routes:

Retail: 6 scenes
Shopping Centre: 8 scenes
Retail Park: 7 scenes
Outlet Centre: 10 scenes

### Branch Runtime

Scene-specific Optional / Advanced branch support.

Current explicitly approved Retail relationships:

retail-visitor-composition
→ retail-visit-duration

retail-in-store-journey
→ retail-product-category-journey

retail-zone-engagement
→ retail-staff-interaction

retail-conversion-sales-context
→ retail-portfolio-comparison

Branch-parent relationships for the other three segments remain unresolved rather than inferred.

### Technology Runtime

Vendor-neutral capability-first architecture:

Scene
→ capability
→ possible implementation
→ source / privacy / technical readiness

Important product semantics preserved:

Entrance measurement:
- Xovis Premium 3D
- Milesight VS125-P Basic 3D
- Isarsoft IP-camera analytics

Outdoor opportunity measurement:
- Milesight VS361
- measurement method: passive infrared

Spatial movement intelligence:
- LiDAR
- Xovis 3D where applicable

No automatic technology recommendation, ranking or pricing logic exists.

Missing source evidence remains explicit.

### Proof / Case Runtime

Contextual proof architecture supporting:

- scene → proof
- capability → proof
- internal availability
- external-use approval
- playability/viewability
- content readiness
- permission status

Current state:

13 proof assets
13 placeholders
0 externally available/playable proof assets

Proof remains contextual depth and is not part of the Core route.

### Validation

Current automated suite:

135 tests passing

Required verification:

- lint
- typecheck
- tests
- production build

## Design freeze

The visual design remains frozen at this checkpoint.

The current Retail Measure / Store Visits implementation is:

FUNCTIONAL PROTOTYPE ONLY

Visual approval: false

It must NOT be used as the approved visual reference for other scenes.

Do not propagate its:

- layout
- spacing
- typography
- hero composition
- CSS patterns
- Presentation Mode treatment

Future visual design must follow:

- docs/design/SALES-EXPERIENCE-DIRECTION.md
- approved/reference visual assets
- future explicitly approved high-fidelity scene proofs

## Deferred experience work

Not included in this engineering checkpoint:

- approved Retail Capture visual design
- final scene composition
- final typography / spacing
- final Presentation Mode
- technology drilldown UI
- proof / video UI
- final interaction and motion design
- rollout of visual DNA across Retail
- visual implementation of Shopping Centre
- visual implementation of Retail Park
- visual implementation of Outlet Centre

## Checkpoint intent

This checkpoint is the safe rollback point before the visual experience layer is resumed.

Engineering foundation = stable.

Visual experience = intentionally unfinished.
