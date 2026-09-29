# QSR visual asset catalogue

Status: asset naming and semantic placement guide. This catalogue does not expose QSR in production and does not replace the typed scene and capability models.

## Usage rules

- Resolve scene order and capability IDs from `app/content/segments/qsr.ts`; never infer them from a filename.
- The twelve location visuals use the exact scene ID in their filename. Keep that convention when wiring them into `app/content/visual-assets.ts`.
- Open an image before using it. The descriptions below identify intended meaning, but the image itself remains the visual source.
- Purple overlays indicate configured detection, elapsed-time evidence or communication links. They do not establish cause, identity, order accuracy, revenue, conversion, labour savings or ROI.
- HME and NEXEO are possible implementation layers behind PFM capabilities. Do not turn a capability scene into a vendor catalogue.
- Voice AI is progressive disclosure only. It requires a compatible NEXEO Pro configuration and a separate compatible provider. Fox AI may be described as an example only after current commercial compatibility is confirmed; the image itself does not name or select a provider.
- Do not use `qsr-bottleneck-hero.png` as a literal lane-layout plan. Its purple/red areas are a conceptual stage comparison.

All assets are 1672×941 pixels (16:9) and contain no intended brochure copy.

## Core route

| Order | Scene ID and canonical label | Asset | What is visibly shown | Correct brochure use | Suggested alt text |
| --- | --- | --- | --- | --- | --- |
| 1 | `qsr-drive-thru-context` — Complete drive-thru journey | `public/assets/location-visuals/qsr/qsr-drive-thru-context-hero.png` | Elevated overview of one restaurant, vehicles at successive service points and one purple route through the site. | Opening overview of the measurable journey from entry through order and service to exit. | `Elevated view of a drive-thru restaurant with vehicles following a highlighted route through successive service points.` |
| 2 | `qsr-queue` — Queue formation before ordering | `public/assets/location-visuals/qsr/qsr-queue-hero.png` | One line of vehicles approaching the order point, with small purple interval markers between vehicles. | Waiting and queue formation before a guest can order; spacing is illustrative, not a measured value. | `Vehicles queue in one drive-thru lane before the order point, with subtle interval markers between them.` |
| 3 | `qsr-order` — Order-point communication | `public/assets/location-visuals/qsr/qsr-order-hero.png` | Driver stopped beside a speaker post at the driver-side window, with a purple audio waveform. | The order moment as both an elapsed-time stage and a guest-to-crew audio interaction. | `Driver speaks to a drive-thru order post positioned beside the open driver-side window.` |
| 4 | `qsr-bottleneck` — Stage bottleneck visibility | `public/assets/location-visuals/qsr/qsr-bottleneck-hero.png` | Elevated restaurant view with several vehicles in a purple service area and one vehicle in a contrasting red service area. | Conceptual comparison of where time accumulates across configured stages. Never present the colours as an automatic diagnosis of cause. | `Drive-thru service stages are highlighted in contrasting areas to show where elapsed time may accumulate.` |
| 5 | `qsr-respond` — Closed-loop crew response | `public/assets/location-visuals/qsr/qsr-respond-hero.png` | Waiting vehicle at the service window connected by a purple signal to a crew member wearing a headset. | A configured threshold or timer event reaching the person who can respond. The alert enables action; it does not produce the outcome itself. | `A waiting vehicle is linked by a subtle alert signal to a crew member wearing a drive-thru headset.` |
| 6 | `qsr-estate` — Comparable multi-restaurant view | `public/assets/location-visuals/qsr/qsr-estate-hero.png` | Several restaurant locations across one landscape connected by a restrained purple line. | Estate, hierarchy, daypart or historical comparison across restaurants using aligned definitions and periods. | `Several drive-thru restaurants across an estate are connected by a shared comparison line.` |

## Optional branches

| Branch scene and canonical label | Parent | Asset | What is visibly shown | Correct brochure use | Suggested alt text |
| --- | --- | --- | --- | --- | --- |
| `qsr-arrival` — Journey entry detection | `qsr-queue` | `public/assets/location-visuals/qsr/qsr-arrival-hero.png` | A vehicle crossing one purple entry line, followed by vehicles continuing along the lane. | The configured point where the measurable drive-thru journey begins. Not ANPR, origin or identity. | `A vehicle crosses a highlighted entry line that marks the start of the measurable drive-thru journey.` |
| `qsr-beyond-lane` — Pull-forward and pickup waiting | `qsr-queue` | `public/assets/location-visuals/qsr/qsr-beyond-lane-hero.png` | Main drive-thru lane plus two separate waiting bays, including a pull-forward vehicle and a pickup vehicle. | Waiting that continues after a vehicle leaves the main lane; moving the car does not end the guest wait. | `Drive-thru traffic continues in the main lane while vehicles wait in separate pull-forward and pickup bays.` |
| `qsr-payment` — Order/POS context at payment | `qsr-order` | `public/assets/location-visuals/qsr/qsr-payment-hero.png` | Driver and crew member completing a payment handoff at the window while vehicles wait behind. | Compatible POS or order context associated with measured wait time. Do not infer basket, value or conversion without approved data. | `A driver completes payment at the service window while other vehicles wait in the lane behind.` |
| `qsr-handoff` — Pickup handoff and journey completion | `qsr-order` | `public/assets/location-visuals/qsr/qsr-handoff-hero.png` | Crew member hands a bag to the driver at the pickup window; a completion marker sits beneath the vehicle. | The final configured service stage and completion of the measured guest journey. | `A crew member hands an order to a driver at the pickup window as the measured journey reaches its final stage.` |
| `qsr-daypart` — Repeatable pattern by period | `qsr-bottleneck` | `public/assets/location-visuals/qsr/qsr-daypart-hero.png` | The same restaurant spans daylight and evening, with a restrained timeline across the foreground. | Daypart and historical pattern comparison; distinguishes a one-off shift from a recurring pattern. | `A drive-thru restaurant transitions from daytime to evening above a simple comparison timeline.` |
| `qsr-improvement-proof` — Before/change/after review | `qsr-estate` | `public/assets/location-visuals/qsr/qsr-improvement-proof-hero.png` | Split before-and-after restaurant operation with matched purple timelines and a team reviewing the change at centre. | Review of a recorded operational change using identical definitions and comparable periods. It is not customer proof by itself. | `Matched before-and-after drive-thru views frame a team review of an operational change.` |

## Technology progressive disclosure

These images support capability explanations and Configure exploration. They are not additional Core scenes and must not be presented as preselected products.

| Canonical label | Asset | Capability mapping | What is visibly shown | Correct brochure use | Suggested alt text |
| --- | --- | --- | --- | --- | --- |
| HME ZOOM Nitro — stage timing and bottleneck insight | `public/assets/technology/qsr/qsr-hme-zoom-nitro-stage-timing-hero.png` | `TECH-QSR-01`, `TECH-QSR-02`, optionally `TECH-QSR-07` | Four vehicles in one orderly lane cross sequential purple detection lines; an abstract stage view is shown at a manager station. | Explain how compatible detection and ZOOM Nitro can turn configured journey stages into elapsed-time and operational insight. The abstract screen is not a reproduction of the HME interface. | `Vehicles cross sequential drive-thru timing points while an abstract stage view translates lane progress into operational insight.` |
| Compatible Voice AI — assisted ordering with human handoff | `public/assets/technology/qsr/qsr-compatible-voice-ai-order-and-human-handoff-hero.png` | `TECH-QSR-09`, with `TECH-QSR-03` for the human communication path | Driver speaks at a correctly positioned order post; audio passes through abstract intent nodes and remains connected to a headset-wearing crew member. | Explain optional third-party voice AI readiness with visible human monitoring and takeover. Never imply autonomous operation, guaranteed accuracy or provider selection. | `A driver speaks to an order post as an abstract voice AI layer remains connected to a headset-wearing crew member for human takeover.` |
| NEXEO headset — timer alert and targeted crew communication | `public/assets/technology/qsr/qsr-nexeo-headset-alert-and-crew-communication-hero.png` | `TECH-QSR-03`, and `TECH-QSR-06` with a compatible ZOOM Nitro configuration | Team lead wears a professional headset; selective purple links connect the order point, kitchen and pickup colleague, with an amber alert anchored to the earpiece. | Explain guest-to-crew and crew-to-crew communication, plus the closed loop in which a timer alert reaches the person who can act. Do not generalise functions across NEXEO tiers. | `A team lead receives a headset alert and coordinates selectively with colleagues at the kitchen pass and pickup window.` |

## Deliberate non-mappings

- The Voice AI asset is not a replacement for `qsr-order-hero.png`: the Core order scene explains communication and elapsed time; Voice AI is an optional compatible implementation.
- The NEXEO headset asset is not a replacement for `qsr-respond-hero.png`: the Core scene proves the human-response concept; the technology asset explains a possible communication layer.
- The HME ZOOM Nitro asset is not a generic dashboard or proof asset. It supports capability and implementation explanation only.
- None of these visuals may be used as external customer proof, an HME benchmark or evidence of achieved performance.
