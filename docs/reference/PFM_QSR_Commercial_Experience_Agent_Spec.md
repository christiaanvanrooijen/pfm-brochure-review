# PFM Commercial Experience — QSR / Drive‑Thru Experience Specification

**Status:** Working specification for design / product / coding agents  
**Audience:** GPT/Codex/Claude/Nemotron-style implementation agents, UX designers, frontend developers, commercial stakeholders  
**Research baseline:** 15 August 2026  
**Primary implementation context:** PFM Commercial Experience web brochure  
**Technology context:** PFM as distributor / implementation partner for HME drive-thru timer and communication solutions  

---

## 0. Read this first — what this document is for

This is **not** a conventional HME product brochure and it must not be implemented as one.

The goal is to translate the QSR / drive-thru proposition into the same premium, visual, commercial web experience used by the PFM Commercial Experience for Retail, Shopping Centres, Retail Parks and Outlet Centres.

The experience should help a QSR operator, franchise group, operations director or restaurant manager understand a simple commercial story:

> **Every vehicle is an opportunity. The drive-thru system should make the journey visible, reduce avoidable delay, improve communication, and help the operation serve more guests with greater consistency.**

The experience should begin with the **business question and the physical drive-thru journey**, not with hardware names.

HME products are revealed later as the **technology implementation layer** behind the capability.

The preferred narrative pattern is:

**physical scene → operational question → measured journey → bottleneck → crew response → business impact → how it is enabled**

The reference visual direction is the existing PFM Commercial Experience Retail screen: dominant photorealistic location hero, one large commercial question, purple movement overlays, a slim left journey rail, right-side data lenses, a narrative metric progression at the bottom, and progressive disclosure through **“How we measure this”**.

---

# 1. Core experience principle

## 1.1 What the QSR experience should feel like

The digital brochure should feel like the prospect is **stepping into a live drive-thru operation** and discovering where time, capacity and service quality are won or lost.

It should feel:

- premium;
- calm;
- cinematic;
- operationally intelligent;
- visual before analytical;
- commercial without becoming salesy;
- presentation-ready on a large screen;
- credible to an Operations Director but understandable to a restaurant manager within seconds.

It should **not** feel like:

- a dashboard gallery;
- an HME catalogue;
- a technical installation manual;
- a collection of KPI cards;
- an AI-generated infographic;
- a generic “future of restaurants” website;
- an over-animated gaming interface.

The experience should communicate that PFM understands the entire **drive-thru operating model**, while HME supplies important enabling technology.

---

# 2. The commercial QSR story

A drive-thru is a time-sensitive service journey.

A vehicle can be treated as a moving operational unit that passes through a series of measurable moments:

1. **Arrival / lane entry**
2. **Queue formation**
3. **Order point**
4. **Payment**
5. **Pickup / present window**
6. **Pull-forward / waiting bay**, where applicable
7. **Exit**
8. **Mobile pickup / curbside / bypass**, where applicable

The commercial value does not come from “measuring seconds” in isolation. It comes from connecting time and flow to operational decisions.

The core business logic is:

> **More visibility → faster intervention → less avoidable waiting → more vehicles served → better guest experience → stronger revenue capacity.**

The system can also improve the crew experience because operational signals can be delivered directly to the right employees rather than requiring someone to stare at a screen.

---

# 3. Canonical journey navigation

To remain consistent with the PFM Commercial Experience, keep the existing canonical left-side journey where possible:

1. **Context**
2. **Measure**
3. **Understand**
4. **Prove**
5. **Configure**
6. **Act**

Do **not** create a completely different navigation model only because the segment is QSR.

Instead, make the content inside each stage QSR-specific.

## QSR interpretation

| Canonical stage | QSR meaning |
|---|---|
| Context | Understand restaurant format, lane geometry, dayparts, operating model and guest channels. |
| Measure | Detect vehicles and measure time through the drive-thru journey. |
| Understand | Identify queue formation, bottlenecks, slow stages, drive-offs, variation and operational friction. |
| Prove | Show multi-store comparisons, historical change, goal attainment and measurable performance improvement. |
| Configure | Reveal which capabilities and HME components can enable the required operating model. |
| Act | Turn live signals into crew actions, alerts, staffing decisions, coaching and continuous optimization. |

---

# 4. Experience-level headline

The main segment landing page should not start with “HME Drive-Thru Systems.”

Recommended hero questions:

### Preferred
> **Where does your drive-thru lose time?**

### Alternatives
> **How fast does opportunity move from arrival to handoff?**

> **How many more guests could this drive-thru serve?**

> **What happens between joining the queue and receiving the order?**

The first scene should make the prospect curious enough to enter the location.

Recommended primary CTA:

> **Enter the drive-thru**

Alternative:

> **Follow the vehicle journey**

---

# 5. QSR capability model

The agent must understand the proposition as **capabilities first**, products second.

## Capability A — Vehicle journey detection

Purpose:
- detect that a vehicle has arrived;
- measure the vehicle at meaningful journey points;
- build a timeline from entry through service and exit;
- create the basis for queue, wait-time and throughput analysis.

Possible detection methods include inductive/magnetic loops and other compatible vehicle detection methods. HME explicitly describes magnetic loops as a common vehicle-detection method and recommends detection at lane entry, the order post and windows to improve speed-of-service visibility.

**Do not imply that one fixed detection technology is mandatory for every site.** Site design and HME/PFM engineering determine the implementation.

---

## Capability B — Real-time drive-thru timing

Purpose:
- show service times while the operation is happening;
- expose bottlenecks before they become a full shift problem;
- track car counts and throughput;
- compare current performance with goals;
- support lane, tandem and multi-point operating models;
- include mobile pickup and pull-forward waiting areas when configured.

HME’s current ZOOM Nitro Timer is positioned as an in-store diagnostic and optimization tool rather than “just a timer.” It supports real-time metrics, bottleneck visibility, additional detection points, POS/geofence integrations where available, tandem drive-thru logic and HME CLOUD reporting.

---

## Capability C — Drive-thru and crew communication

Purpose:
- create clear guest-to-crew communication at the order point;
- reduce repeated conversation caused by poor audio;
- connect employees without disturbing the drive-thru conversation;
- route alerts to specific people or groups;
- enable hands-free communication and operational response.

HME’s current NEXEO | HDX platform is offered in three tiers:

- **NEXEO Core** — core digital drive-thru communication;
- **NEXEO** — broader crew communication and ZOOM Nitro integration;
- **NEXEO Pro** — advanced third-party integration, including voice AI ordering.

The experience must not force a tier selection before the prospect’s requirement is understood.

---

## Capability D — Audio clarity

Purpose:
- improve communication quality between guest and crew;
- reduce unnecessary repetition;
- support order accuracy and faster ordering;
- reduce noise and echo interference in the drive-thru environment.

Current HME development includes **ClearSoundX**, introduced in 2026 as advanced noise and echo cancellation for the NEXEO | HDX platform, currently described by HME as available for NEXEO and NEXEO Pro tiers.

Treat this as an **enhancement capability**, not the opening proposition.

Regional/product availability must be verified before presenting it as orderable in a PFM market.

---

## Capability E — POS and order-context integration

Purpose:
- connect service time with order context where supported;
- show POS transaction number alongside vehicle wait time;
- optionally expose order value to help the operation anticipate a large order;
- support better pull-forward decisions and order handoff.

HME states that ZOOM Nitro supports multiple POS integrations, but **availability varies by brand**.

Therefore the UI must say:

> **POS integration — subject to brand / platform compatibility**

Never state that POS integration is universally available.

---

## Capability F — Alerts into the workflow

Purpose:
- avoid creating another screen that nobody watches;
- deliver operational events to the people who can act;
- use thresholds such as excessive lane wait time;
- support targeted messages, reminders and groups.

A key HME capability is the integration of ZOOM Nitro with NEXEO, allowing timer alerts to be delivered through the headset.

This is strategically important to the PFM story:

> **Insight is only valuable when it reaches the person who can change the outcome.**

---

## Capability G — Enterprise performance intelligence

Purpose:
- compare restaurants;
- compare districts / regions;
- identify high- and low-performing locations;
- assess goal attainment;
- analyse dayparts and historical patterns;
- help operators distinguish a one-off bad shift from a structural issue.

HME’s ZOOM Nitro Data / HME CLOUD environment supports real-time and historical multi-store reporting, car counts, average service times, goal percentages, hierarchy / role-based organization and remote management.

This is the appropriate capability layer for Operations Directors, franchise groups and multi-site QSR operators.

---

## Capability H — Team engagement / gamification

Purpose:
- make speed-of-service targets visible and engaging;
- support competitions and leaderboards;
- reinforce operational goals;
- celebrate performance.

HME offers ZOOM Nitro Gamification and Leaderboard functionality.

**Design rule:** This should be a secondary reveal. Do not let gamification make the primary PFM experience feel childish or arcade-like.

---

## Capability I — Voice AI readiness

Purpose:
- support automated order taking while retaining crew takeover / escalation;
- connect AI ordering to a drive-thru communication platform;
- free employees for other service tasks;
- maintain operational telemetry and audio quality.

HME positions **NEXEO Pro** as purpose-built for third-party voice AI ordering integration.

This should appear as a **future-ready / automation lens**, not be shown as the default configuration for every customer.

The agent must not invent a voice AI provider or claim that PFM supplies one unless separately confirmed.

---

## Capability J — Vision AI / expanded journey visibility

HME currently markets **Nitro Vision AI** as an add-on to ZOOM Nitro that combines computer vision with existing loop infrastructure to increase visibility across the drive-thru journey.

Important commercial availability rule:

> **As of the research baseline, HME states that Nitro Vision AI is only available in the United States.**

Therefore:
- it may be shown in a “technology horizon / HME roadmap” layer;
- it must not be positioned as currently available through PFM in Europe without explicit confirmation;
- avoid any visual that implies cameras are part of the standard European solution.

---

# 6. Proposed QSR Commercial Experience — scene architecture

The QSR story should be experienced as a sequence of spatial scenes. Each scene is anchored in a physical restaurant or drive-thru environment.

## Scene 0 — QSR landing / context

### Commercial question
> **Where does your drive-thru lose time?**

### Visual
A premium, photorealistic QSR restaurant at a busy but controlled daypart. Camera angle high enough to understand the complete lane but low enough to feel real, not like a GIS map.

Visible elements:
- restaurant building;
- drive-thru lane;
- 4–7 vehicles;
- menu / order point;
- payment and pickup windows;
- optional pull-forward bays;
- optional mobile pickup area.

No HME hardware close-ups yet.

### Motion treatment
A restrained PFM-purple light trail enters the drive-thru and follows one selected vehicle.

### Narrative metric strip
Example only — never present as benchmark data:

**126 vehicles** → **03:08 avg. lane time** → **87% within goal**

Label demo/sample data clearly in prototype mode.

### CTA
**Follow the vehicle journey →**

---

# 7. Measure scenes

## Scene 1 — Arrival / lane entry

### Eyebrow
**Measure · Arrival**

### Question
> **When does the drive-thru journey really begin?**

### Story
The timer should not only tell the team what happened at the pickup window. The journey begins when the vehicle enters the measurable service flow.

### Visual treatment
Highlight a vehicle entering the lane. A subtle circular detection ripple appears underneath the vehicle. The purple path begins.

### Suggested narrative numbers

**Vehicle detected** → **queue position 5** → **journey timer starts**

Do not overload this scene with aggregate KPIs.

### “How we measure this” drawer
Reveal:
- vehicle detection capability;
- typical detection points;
- site engineering requirement;
- possible HME timer implementation;
- no product recommendation yet.

---

## Scene 2 — Queue formation

### Eyebrow
**Measure · Queue**

### Question
> **How long are guests waiting before they can even order?**

### Story
Total service time hides where friction actually starts. Queue time before the order point can reveal capacity pressure that may otherwise remain invisible.

### Visual
Show multiple vehicles between lane entry and order point. Each car can carry a minimal floating time marker, for example:

- 00:42
- 01:04
- 01:31

Purple intensity increases near the bottleneck.

### Main metrics
Narrative progression:

**6 cars in queue** → **01:24 pre-order wait** → **+00:31 vs target**

### Insight reveal
A single sentence:

> **The delay is building before order taking begins.**

No chart is needed in the main scene.

---

## Scene 3 — Order point / guest communication

### Eyebrow
**Measure · Order**

### Question
> **How much time is lost when guest and crew cannot hear each other clearly?**

### Story
Ordering is an operational moment and a communication moment. Good audio helps employees capture the order without avoidable repetition.

### Visual
Camera moves closer to the order point. Show the vehicle, order post and a subtle audio-wave bridge between guest and crew.

### Data lenses that become relevant
- **Vehicle flow**
- **Communication**
- **Order / POS**
- **Insight**

### Progressive disclosure
“How we enable this” can reveal:
- digital drive-thru audio;
- NEXEO | HDX platform;
- NEXEO Core / NEXEO / Pro as possible implementation tiers;
- ClearSoundX as an optional current audio enhancement where available;
- voice AI integration only under a separate automation lens.

### Important copy rule
Do not make unsupported causal claims such as “NEXEO will increase order accuracy by X%.” Any performance statistic needs an approved proof source and should be contextualized.

---

## Scene 4 — Payment / production synchronization

### Eyebrow
**Measure · Payment**

### Question
> **Is the queue slow — or is one order slowing the queue?**

### Story
Averages are useful, but live operations require context. When compatible POS data is available, the restaurant can associate vehicle wait time with transaction context, helping the team understand whether a large order requires a different flow.

### Visual
The selected vehicle arrives at payment. Behind it, the purple trail shows a queue. A small optional order-context label can appear only when the Business / POS lens is enabled.

### Lens-on examples
- transaction #2417;
- order value (only if integration supports it);
- current wait;
- pull-forward suggestion as an operational scenario, not an automated decision unless implemented.

### Compatibility label
Always include in detail drawer:

> **POS capabilities depend on brand and platform integration.**

---

## Scene 5 — Pickup / handoff

### Eyebrow
**Measure · Handoff**

### Question
> **How fast does an order become a completed guest journey?**

### Story
The pickup point is not the only KPI. It is the conclusion of all upstream decisions.

### Visual
Selected vehicle at pickup window. Journey path shows entry → order → payment → pickup as one connected purple route.

### Metric progression

**01:05 to order** → **00:46 order-to-pay** → **01:11 pay-to-handoff** → **03:02 total**

The message is not the exact numbers. The message is that **the total can be decomposed into actionable stages**.

---

## Scene 6 — Pull-forward / mobile / curbside

### Eyebrow
**Measure · Beyond the lane**

### Question
> **Does moving a vehicle out of the lane really remove the wait?**

### Story
Pull-forward protects main-lane flow, but the guest is still waiting. Mobile and curbside customers also form part of the service operation.

### Visual
Split the scene spatially rather than through cards:
- main drive-thru lane continues;
- one vehicle is shown at pull-forward;
- one vehicle can be shown in mobile pickup.

Each can have its own understated elapsed-time indicator.

### HME capability grounding
ZOOM Nitro can be configured to display additional independent spaces such as mobile pickup and pull-forward areas; HME currently states up to 16 such independent spaces can be shown on the dashboard.

### UI rule
Do not make “16 spaces” a hero message. It belongs in the technical/capability drawer.

---

# 8. Understand scenes

## Scene 7 — Bottleneck diagnosis

### Eyebrow
**Understand · Bottleneck**

### Question
> **Where is today’s lost time actually coming from?**

### Visual
Use the physical drive-thru as the visualization.

Do not immediately replace the scene with a chart.

Example:
- Arrival zone: neutral
- Order zone: purple
- Payment zone: purple
- Pickup zone: PFM red accent indicating current bottleneck

### Insight strip

> **Pickup is adding 34 seconds above goal during the lunch peak.**

### Secondary details
A small drawer may show:
- car count;
- average service time;
- goal attainment;
- bottleneck stage;
- trend vs prior comparable daypart.

---

## Scene 8 — Real-time action / headset alert

### Eyebrow
**Understand · Respond**

### Question
> **Can the right person know before the queue becomes the problem?**

### Story
The strongest product story is not “there is a dashboard.” It is the closed operational loop:

**detect → understand → alert → act**

### Visual
Keep the physical restaurant visible. Highlight a crew member in the kitchen / handoff area with a headset. Use a small audio cue bubble:

> **Lane total above target**

or

> **Vehicle waiting beyond threshold**

### Technology reveal
Only after interaction:
- ZOOM Nitro Timer event;
- NEXEO headset alert;
- targeted team / group;
- configurable thresholds.

This scene should be central to the sales story because it turns measurement into operational action.

---

## Scene 9 — Daypart pattern

### Eyebrow
**Understand · Daypart**

### Question
> **Is this a bad moment — or a repeatable operating pattern?**

### Visual
Start with the same restaurant transitioning through breakfast → lunch → afternoon → evening using lighting and traffic density, not four separate dashboard cards.

### Supporting analytics
A single compact timeline may appear:

Breakfast | Lunch | Afternoon | Dinner

Show where:
- traffic peaks;
- service time rises;
- goal attainment drops.

### Business implication
Use insight language such as:

> **Volume peaks at lunch, but service time deteriorates before car count reaches its maximum.**

This invites a discussion about staffing, process, menu mix or preparation capacity.

Do not make the system claim the root cause without evidence.

---

# 9. Prove scenes

## Scene 10 — Multi-store comparison

### Eyebrow
**Prove · Estate**

### Question
> **Which restaurants are converting the same demand into faster service?**

### Audience
- QSR Operations Director;
- franchise owner;
- area / regional manager;
- COO;
- performance improvement team.

### Visual
Maintain the premium editorial style.

Recommended approach:
- one dominant restaurant scene remains selected;
- behind / beside it, 3–5 location silhouettes or mini location strips;
- one simple performance ranking or scatter is allowed as secondary information.

Do not turn the page into a BI dashboard.

### Metrics to expose
- vehicles / car count;
- average service time;
- goal percentage;
- lane / stage timing;
- comparable daypart;
- trend over time.

HME CLOUD / ZOOM Nitro Data can support multi-store and hierarchical views.

---

## Scene 11 — Improvement proof

### Eyebrow
**Prove · Change**

### Question
> **Did the operational change actually improve the drive-thru?**

### Compare
A/B style period comparison:

**Before** → **Change** → **After**

Potential operational changes:
- staffing pattern;
- pull-forward procedure;
- order point process;
- crew coaching;
- lane configuration;
- service target;
- equipment / communication upgrade.

### Outcome structure

**Service time** ↓  
**Cars served** ↑  
**Goal attainment** ↑

If revenue is shown, it must be calculated from approved business data rather than automatically inferred from timer data.

---

# 10. Configure scenes

## Scene 12 — “How we enable this” technology layer

### Design objective
The technology view must remain **capability-first**.

The prospect should not suddenly enter a product catalogue.

### Recommended structure

**Scene** → **Required capability** → **Possible HME implementation** → **Requirements / dependencies**

Example:

**Order point**  
→ Clear guest / crew audio  
→ NEXEO | HDX communication platform  
→ Core / NEXEO / Pro depending on desired capability

**Vehicle journey**  
→ Detect vehicle stages and service time  
→ ZOOM Nitro + compatible detection infrastructure

**Operational response**  
→ Timer event reaches employee  
→ ZOOM Nitro + NEXEO integration

**Enterprise visibility**  
→ Multi-store comparison and reporting  
→ HME CLOUD / ZOOM Nitro Data

**Voice automation**  
→ Voice AI-ready communication layer  
→ NEXEO Pro + separate compatible voice AI provider

### Product cards are permitted only inside this detail layer.

They should be clean and editorial, not e-commerce cards.

---

# 11. Act scenes

## Scene 13 — Operational playbook

### Eyebrow
**Act · Improve**

### Question
> **What should the team change next shift?**

This page translates performance data into a commercial/operational conversation.

Recommended actions should be framed as **hypotheses to validate**, for example:

- Review lunch staffing against vehicle arrival pattern.
- Check whether pickup, rather than order taking, is the main constraint.
- Validate whether pull-forward is reducing lane time while keeping guest wait acceptable.
- Compare the best-performing restaurant’s lunch process with the selected store.
- Review communication clarity where repeat-order time appears elevated.

Never present an automated recommendation as fact unless the underlying data supports it.

### Closing CTA

> **Build your drive-thru performance view**

or

> **Explore your QSR configuration**

---

# 12. Right-side Data Lenses for QSR

The right-side lens system should remain a consistent interaction pattern across PFM Commercial Experience segments.

Recommended QSR lenses:

## 1. Physical / Vehicle Flow
Icon: vehicle / lane / detection symbol  
Shows:
- vehicles;
- detection points;
- queue;
- stage transitions;
- path through drive-thru;
- pull-forward / mobile spaces.

## 2. Communication
Icon: headset / audio wave  
Shows:
- order point audio;
- crew communication;
- alert routing;
- timer → headset event flow;
- optional ClearSoundX capability.

## 3. Business / Order
Icon: receipt / POS / bag  
Shows only when integrated / demo enabled:
- transaction reference;
- order value;
- order state;
- brand-specific POS context.

If not available, show this lens disabled, exactly like a disabled Business lens in the Retail experience.

## 4. Insight
Icon: lightbulb  
Shows:
- bottleneck interpretation;
- goal variance;
- daypart pattern;
- comparison;
- suggested next question.

## 5. Automation — optional advanced lens
Icon: spark / AI waveform  
Default state: hidden or disabled unless context requires it.

Could expose:
- Voice AI readiness via NEXEO Pro;
- Nitro Vision AI only in geographies where commercially available.

Do not make “AI” a permanent hero lens just because it is fashionable.

---

# 13. Visual DNA

The QSR experience must inherit the visual DNA of the approved PFM Commercial Experience.

## 13.1 Dominant physical scene

The physical QSR location is the main storytelling canvas.

Preferred scene styles:
- modern McDonald’s / Burger King-like drive-thru archetype without copying trademarks;
- late afternoon / evening or bright daytime depending on story;
- photorealistic architecture;
- clearly legible lane geometry;
- enough vehicles to show flow, but no chaotic traffic jam unless intentionally illustrating failure.

Never use recognizable customer brand marks unless PFM has permission.

Use a fictional neutral QSR brand for prototype scenes, for example:
- NORTHSTAR QSR;
- ROUTE 24;
- FIELDHOUSE;
- URBAN GRILL.

---

## 13.2 Purple movement language

PFM purple should represent **movement, detection, data and connected operational flow**.

Use it as:
- a glowing vehicle path;
- lane trajectory;
- detection ripple;
- connection from timer signal to headset;
- subtle route between service stages;
- active focus state.

Do not flood the scene with purple.

The physical environment must remain believable.

---

## 13.3 PFM red

PFM red should be reserved for:
- exception;
- delay;
- bottleneck;
- missed goal;
- critical action point.

It should not be used as a second decorative brand colour.

---

## 13.4 Typography and hierarchy

Preferred hierarchy:

1. small purple eyebrow — `Measure · Queue`
2. large commercial question — 1–2 lines
3. physical hero scene
4. narrative metric progression
5. one clear CTA
6. quiet technical / proof / source layer

Avoid headings such as:
- “Features”
- “Our Solutions”
- “Benefits of HME”
- “HME Timer Product Overview”

Those headings pull the experience back into brochure mode.

---

## 13.5 Metrics should tell a story

Prefer:

**126 cars** → **03:08 average journey** → **87% within target**

or

**01:24 queue** → **00:42 order** → **00:36 payment** → **00:58 handoff**

Avoid:
- four floating KPI cards with equal importance;
- multi-colour dashboard widgets;
- dense tables on the hero scene.

The user should understand the commercial meaning before reading labels.

---

# 14. Interaction model

## 14.1 Primary navigation

The presenter can move through the canonical journey using the left rail.

## 14.2 Spatial click points

The user can select:
- lane entry;
- order point;
- payment window;
- pickup window;
- pull-forward bay;
- mobile pickup;
- crew member / headset;
- timer / operations screen only if relevant.

A click should change the story context rather than open a generic modal.

## 14.3 “How we measure this”

This is the technical progressive-disclosure control.

It should reveal:

1. **Capability** — what needs to be measured / enabled.
2. **Implementation possibilities** — HME technology that can support it.
3. **Dependencies** — detection infrastructure, network, compatibility, subscription, POS integration etc.
4. **Data created** — e.g. vehicle stage timestamps, lane total, car count.
5. **Operational use** — what the restaurant can do differently.
6. **Availability / readiness** — live, optional, brand-dependent, geography-dependent.

This drawer should never automatically say “you need product X” unless a configuration process has established the requirements.

---

# 15. Product / capability truth table

Use this table as a grounding layer for agents.

| Capability | HME family / feature | Agent treatment |
|---|---|---|
| Real-time speed-of-service timing | ZOOM Nitro Timer | Current core capability. |
| Bottleneck visibility | ZOOM Nitro Timer | Current core capability. |
| Car count / throughput | ZOOM Nitro Timer | Current core capability. |
| Tandem drive-thru visibility | ZOOM Nitro Timer | Supported; only show on applicable sites. |
| Additional spaces such as pull-forward/mobile | ZOOM Nitro Timer | Supported; up to 16 dashboard spaces stated by HME. |
| POS context | ZOOM Nitro integrations | Brand/platform dependent; never universalize. |
| Geofence/mobile flow | ZOOM Nitro integrations | Brand/platform dependent. |
| Timer alerts to headset | ZOOM Nitro + NEXEO | Strong closed-loop capability. |
| Digital drive-thru audio | NEXEO Core / NEXEO / Pro | Current. |
| 1:1 and group crew communication | NEXEO / Pro | Do not attribute to Core unless verified in current tier matrix. |
| Voice commands | NEXEO / Pro | Use only where tier supports it. |
| Text-to-speech from cloud | Text & Connect / NEXEO | Advanced capability; present as optional. |
| Voice AI integration | NEXEO Pro | Requires compatible third-party AI provider / service. |
| Advanced noise & echo cancellation | ClearSoundX | 2026 capability; verify regional availability. |
| Multi-store reporting | ZOOM Nitro Data / HME CLOUD | Current enterprise capability. |
| Remote timer settings / support | HME CLOUD | Current capability. |
| Gamification / contests | ZOOM Nitro Gamification | Secondary reveal. |
| Multi-store competition | ZOOM Nitro Leaderboard | Secondary reveal. |
| Vision AI journey enhancement | Nitro Vision AI | HME states US-only at research baseline. Do not sell as European standard. |

---

# 16. KPI and data vocabulary

Agents should use consistent QSR language.

## Primary operational metrics

- **Car count / vehicle count** — number of vehicles served / detected, depending on configured metric.
- **Lane total time** — total measured time through the defined drive-thru journey.
- **Service time** — use only with a clearly defined start and end point.
- **Stage time** — elapsed time between configured detection points.
- **Queue time** — time spent before a defined service stage.
- **Throughput** — vehicles served in a defined period.
- **Goal attainment / within goal** — share or status relative to a configured target.
- **Pull-forward wait time** — time a guest remains in a designated pull-forward location.
- **Mobile pickup wait time** — when configured and measurable.
- **Drive-off** — only use when the detection setup / AI capability can actually determine it.

## Business metrics — require external or integrated data

- revenue;
- average order value;
- order count;
- order accuracy;
- labor cost;
- transactions;
- profitability.

**Never derive these automatically from timer data unless the required source data is present.**

---

# 17. Example narrative data for prototype mode

All prototype data must be explicitly labeled **Illustrative** or **Demo data**.

Example single vehicle journey:

| Stage | Time |
|---|---:|
| Arrival → order point | 01:12 |
| Order point dwell | 00:44 |
| Order → payment | 00:38 |
| Payment → pickup | 00:57 |
| Total measured journey | 03:31 |

Example lunch daypart:

| Metric | Demo value |
|---|---:|
| Vehicles | 126 |
| Average lane total | 03:08 |
| Goal | 03:00 |
| Within goal | 87% |
| Peak queue | 8 vehicles |
| Main bottleneck | Pickup |

Example estate view:

| Restaurant | Avg lane total | Cars | Within goal |
|---|---:|---:|---:|
| Utrecht | 02:48 | 141 | 94% |
| Rotterdam | 03:06 | 154 | 88% |
| Breda | 03:31 | 137 | 76% |
| Eindhoven | 02:56 | 149 | 91% |

These values are **fictional interface examples**, not HME or industry benchmarks.

---

# 18. Persona adaptation

The same scene should tell a different story depending on the prospect persona.

## Restaurant Manager
Care about:
- what is happening now;
- where the bottleneck is;
- who needs to act;
- today’s goal;
- current queue;
- coaching the crew.

Preferred language:
> **“Pickup is running 27 seconds above goal. Can the team recover before the lunch peak ends?”**

---

## Area / Regional Manager
Care about:
- restaurant comparison;
- repeatable underperformance;
- daypart consistency;
- coaching priorities;
- staffing / process differences;
- site-by-site opportunity.

Preferred language:
> **“Three restaurants handle the same lunch volume with materially lower lane time. What are they doing differently?”**

---

## Operations Director / COO
Care about:
- estate throughput;
- scalable operating standards;
- technology consistency;
- performance variation;
- guest experience;
- labor productivity;
- investment case.

Preferred language:
> **“Where is service capacity being lost across the estate — and which intervention scales?”**

---

## IT / Technology
Care about:
- architecture;
- integration;
- network;
- remote management;
- security;
- compatibility;
- maintenance;
- deployment model.

Do not force IT-level detail into the core commercial journey. Provide it under Configure / technical readiness.

---

# 19. Commercial positioning for PFM

PFM should not sound like a reseller who happens to ship headsets.

The experience should position PFM as the party that can connect:

**site design + drive-thru measurement + communication + operational data + multi-site visibility + implementation + service**

Suggested positioning line:

> **PFM makes the drive-thru journey measurable and actionable — from the first vehicle detection to the crew response.**

Alternative:

> **From seconds to service improvement: one operational view of the drive-thru journey.**

HME can be introduced as the proven technology platform behind key capabilities.

Avoid implying that PFM owns or developed HME technology.

---

# 20. Proof layer

Proof should be quiet and contextual.

Potential HME proof points that can be used after source validation / marketing approval:

- HME states its QSR systems are deployed in more than 140 countries.
- HME states approximately 30 million orders are taken daily using its systems.
- HME positions itself as a long-standing QSR communication and timer-system provider.

These are vendor claims and should be treated as such.

For a live customer-facing PFM experience:
- do not present external statistics without source attribution;
- do not invent PFM customer performance improvements;
- keep unapproved cases hidden from prospect mode;
- allow internal presenter mode to show proof status / source readiness.

---

# 21. Availability and confidence states

Every technology capability should support a status field.

Recommended states:

- `available`
- `available_if_compatible`
- `optional_add_on`
- `future_ready`
- `region_limited`
- `requires_validation`
- `not_in_prospect_mode`

Examples:

```yaml
capability: POS integration
status: available_if_compatible
note: Brand / POS platform compatibility must be confirmed.
```

```yaml
capability: Nitro Vision AI
status: region_limited
region: United States
note: Do not present as a current PFM Europe solution without explicit confirmation.
```

```yaml
capability: Voice AI ordering
status: available_if_compatible
implementation: NEXEO Pro + third-party voice AI provider
note: Do not invent or auto-select a provider.
```

---

# 22. Suggested content model for implementation agents

Use content-driven scene definitions so the QSR experience can reuse the Commercial Experience shell.

```yaml
segment: qsr
experience_name: Drive-Thru Performance
canonical_stages:
  - context
  - measure
  - understand
  - prove
  - configure
  - act

scenes:
  - id: arrival
    stage: measure
    eyebrow: "Measure · Arrival"
    question: "When does the drive-thru journey really begin?"
    visual_type: photoreal_qsr_drive_thru
    focus_zone: lane_entry
    primary_cta: "Follow the vehicle journey"
    lenses:
      physical: active
      communication: inactive
      business: disabled
      insight: active
    narrative_metrics:
      - label: vehicle
        value: detected
      - label: queue_position
        value: 5
      - label: timer
        value: started
    technical_reveal:
      capability: vehicle_journey_detection
      implementations:
        - hme_zoom_nitro
        - compatible_vehicle_detection

  - id: order_point
    stage: measure
    eyebrow: "Measure · Order"
    question: "How much time is lost when guest and crew cannot hear each other clearly?"
    focus_zone: order_point
    lenses:
      physical: active
      communication: active
      business: optional
      insight: active
    technical_reveal:
      capability: drive_thru_communication
      implementations:
        - nexeo_core
        - nexeo
        - nexeo_pro
        - clearsoundx_optional
```

---

# 23. Agent decision rules

An implementation agent must follow these rules.

## Rule 1 — Start with the question, not the product
Wrong:
> ZOOM Nitro is HME’s advanced drive-thru timer.

Right:
> Where is the queue losing time — before order, at payment or at handoff?

Then reveal ZOOM Nitro as an enabling technology.

---

## Rule 2 — Keep the physical scene dominant
At least half of the main content area should feel spatial / photographic.

Data overlays support the scene; they do not replace it.

---

## Rule 3 — One scene, one idea
Do not explain car count, audio, POS, staffing, AI and gamification on one screen.

Each scene should answer one operational question.

---

## Rule 4 — Use data as narrative
Prefer 2–4 connected metrics.

Avoid dashboard-card grids.

---

## Rule 5 — Progressive disclosure for technology
Main page: commercial story.  
“How we measure this”: capability.  
Technology details: product / integration / requirements.  
Configure: final implementation alternatives.

---

## Rule 6 — Do not fabricate integration
If POS, geofencing, mobile ordering, voice AI or third-party systems are shown, the interface must allow a compatibility state.

---

## Rule 7 — Do not over-promise causality
A faster timer does not itself make food production faster.

The technology creates visibility and enables intervention; operational process changes create the outcome.

Use wording such as:
- “helps identify”;
- “enables teams to respond”;
- “provides visibility”;
- “supports comparison”;
- “can help reduce avoidable delay.”

Avoid unconditional:
- “will increase revenue”;
- “guarantees faster service”;
- “eliminates queues.”

---

## Rule 8 — Separate current PFM offer from HME innovation
Some HME capabilities may exist globally but not be distributable or deployable in the current PFM territory.

Use availability metadata.

Nitro Vision AI is a specific example: HME states US-only at the research baseline.

---

## Rule 9 — Preserve PFM visual ownership
HME is the technology layer. The web experience remains a PFM Commercial Experience.

Do not reskin HME’s website.

Do not adopt HME’s product-page visual style.

Do not make the HME logo larger than PFM’s experience identity.

---

# 24. Suggested “How we measure this” component

Example content for the **Queue** scene:

### Capability
**Vehicle stage timing**

Detect vehicles at selected points in the drive-thru and measure elapsed time between those points.

### What it creates
- vehicle arrival timestamp;
- queue / stage time;
- lane total time;
- car count;
- goal variance;
- daypart history.

### Possible implementation
**HME ZOOM Nitro** with compatible vehicle detection infrastructure.

### Why it matters
The operator can see *where* time accumulates rather than only seeing a final average.

### Dependencies
- site / lane survey;
- detection-point design;
- power / connectivity as required;
- configuration of time goals;
- optional cloud / integration services.

### Operational action
Use the bottleneck to decide whether the next question is staffing, production, order taking, lane procedure or pull-forward.

---

# 25. Suggested opening flow for a live sales presentation

A presenter should be able to run the first five minutes without touching technical product content.

### 1. Context
“Every car joining this lane is a sales and service opportunity.”

### 2. Follow one vehicle
Show entry, queue and order progression.

### 3. Reveal time
Show that 3:20 total service time can be decomposed.

### 4. Expose bottleneck
Show that 40 seconds of the delay is concentrated at pickup.

### 5. Close the loop
Show alert reaching a crew member via headset.

### 6. Scale it
Show how an area manager compares 20 restaurants and dayparts.

### 7. Only then explain technology
Reveal ZOOM Nitro, NEXEO and HME CLOUD as the enabling stack.

This sequence makes the commercial value understandable before procurement questions begin.

---

# 26. Recommended QSR top-level pages / routes

Possible route model:

```text
/qsr
/qsr/context
/qsr/measure/arrival
/qsr/measure/queue
/qsr/measure/order
/qsr/measure/payment
/qsr/measure/handoff
/qsr/measure/beyond-lane
/qsr/understand/bottleneck
/qsr/understand/respond
/qsr/understand/dayparts
/qsr/prove/estate
/qsr/prove/change
/qsr/configure
/qsr/act
```

If the existing Commercial Experience already has a scene routing model, reuse that model rather than introducing a QSR-specific router.

---

# 27. Optional presentation mode

In presentation mode:

Hide:
- technical IDs;
- product status warnings unless relevant;
- source management;
- implementation metadata;
- internal proof state.

Show:
- large commercial question;
- physical scene;
- narrative metrics;
- simple data lenses;
- CTA / next story step.

Presenter rail may expose:
- scenario selector;
- persona;
- data mode: demo / customer;
- lens state;
- proof status;
- “show technology” toggle.

---

# 28. Scenarios the experience should support

At minimum:

## Scenario A — Single-lane drive-thru
Classic entry → order → payment → pickup.

## Scenario B — Dual / tandem lane
Show lane merging, separate order points and shared downstream service.

## Scenario C — Pull-forward
Show main lane performance and post-lane guest wait.

## Scenario D — Mobile / curbside
Show service spaces outside the normal lane journey.

## Scenario E — Multi-store operator
Show location hierarchy and comparison.

Do not design five entirely different applications. These are variations of one QSR experience model.

---

# 29. What not to show by default

Do not put these on the first screen:

- wiring diagrams;
- NEXEO tier comparison table;
- HME subscription information;
- sensor / loop part numbers;
- device close-ups;
- installation technical specification;
- network architecture;
- gamification leaderboard;
- Voice AI vendor logos;
- Nitro Vision AI cameras;
- detailed HME Cloud screenshots.

Those are useful later, after the prospect understands the business reason.

---

# 30. Technical-readiness layer

When the user enters Configure, the system may expose a structured readiness view.

Example:

| Layer | Question | Example status |
|---|---|---|
| Lane | How many lanes / order points? | Dual lane |
| Detection | Which journey points need timing? | Entry, order, payment, pickup |
| Communication | Basic drive-thru or full crew communication? | Full crew |
| Alerts | Timer alerts to headset? | Required |
| POS | Compatible integration available? | Validate |
| Cloud | Multi-store reporting required? | Yes |
| AI | Voice AI requirement? | Future |
| Region | Are advanced HME options locally available? | Validate |

This is more useful commercially than a generic hardware configurator.

---

# 31. Minimum acceptance criteria for a QSR prototype

A design / coding agent should not call the QSR experience complete unless the prototype demonstrates all of the following:

- [ ] QSR appears as a segment in the existing PFM Commercial Experience shell.
- [ ] The opening screen is a photorealistic drive-thru scene, not a dashboard.
- [ ] A large commercial question drives the screen.
- [ ] The canonical left-side journey remains visible.
- [ ] A vehicle journey is visually traceable through the lane.
- [ ] PFM purple is used as a restrained movement / data overlay.
- [ ] At least four drive-thru stages are spatially understandable.
- [ ] Metrics are shown as a connected narrative, not a card grid.
- [ ] Right-side QSR data lenses are available.
- [ ] “How we measure this” opens a capability-first technical layer.
- [ ] ZOOM Nitro appears only after the capability is explained.
- [ ] NEXEO appears only in communication / response context.
- [ ] POS is clearly compatibility-dependent.
- [ ] Voice AI is optional / advanced, not default.
- [ ] Nitro Vision AI is not presented as currently available in Europe without explicit confirmation.
- [ ] A bottleneck scene exists.
- [ ] A timer-to-headset closed-loop response scene exists.
- [ ] A multi-store proof scene exists.
- [ ] A configuration/readiness view exists.
- [ ] Demo numbers are labeled as illustrative.
- [ ] Prospect mode hides unapproved proof and technical noise.
- [ ] The result looks like the same premium product family as the Retail Commercial Experience.

---

# 32. Recommended first prototype scope

For the first high-fidelity version, do **not** build every scene.

Build these six exceptionally well:

1. **QSR Context / Landing** — full drive-thru scene.
2. **Measure / Queue** — vehicle detection and queue-time narrative.
3. **Measure / Order** — communication / NEXEO lens.
4. **Understand / Bottleneck** — stage-level delay.
5. **Understand / Respond** — ZOOM Nitro alert → NEXEO headset.
6. **Prove / Estate** — multi-store service performance.

Then build:

7. **Configure** — capability → HME implementation mapping.

If these seven scenes feel coherent and premium, roll the visual system out to payment, handoff, pull-forward, mobile, dayparts, gamification and AI-readiness.

---

# 33. Preferred prototype hero copy

Use this as the default opening concept unless commercial stakeholders choose another direction:

**Eyebrow**  
`Measure · Drive-Thru`

**Headline**  
> **Where does your drive-thru lose time?**

**Supporting line**  
Follow every measurable stage from arrival to handoff — and turn service-time data into actions your crew can use.

**Narrative metrics**  
`126 vehicles` → `03:08 avg. journey` → `87% within goal`

**CTA**  
`Follow the vehicle journey →`

**Right lenses**  
- Vehicle flow ✓
- Communication ✓
- Order / POS ○
- Insight ✓

**Bottom technical trigger**  
`How we measure this →`

---

# 34. Final design instruction to any agent

When implementing this experience, remember:

> **We are not visualizing HME products. We are visualizing the QSR operation HME technology helps make measurable and actionable.**

The drive-thru is the hero.  
The vehicle journey is the narrative.  
Time is the invisible problem made visible.  
The crew response is the action.  
Business performance is the reason.  
HME is the enabling technology layer.  
PFM owns the commercial experience and customer relationship.

If a screen could be mistaken for an HME catalogue page, redesign it.

If a screen could be mistaken for a generic BI dashboard, redesign it.

If the prospect can understand the business question in three seconds and wants to click to discover what causes the problem, the experience is heading in the right direction.

---

# 35. Official HME research sources used for this specification

These sources were checked against current HME material at the research baseline. Use them as factual grounding, but revalidate availability and specifications before production release.

1. **HME — ZOOM Nitro Drive-Thru Timer**  
   https://www.hme.com/qsr/zoom-nitro-drive-thru-timers/

2. **HME — NEXEO | HDX Drive-Thru Headsets / Communication Platform**  
   https://www.hme.com/qsr/drive-thru-headsets-NEXEO/

3. **HME — ZOOM Nitro Data / Enterprise Management**  
   https://qsr.hme.com/zoom/data

4. **HME — NEXEO Pro / Voice AI Ordering**  
   https://www.hme.com/qsr/drive-thru-voice-ai-ordering/

5. **HME — Add a Drive-Thru / vehicle detection and drive-thru design context**  
   https://www.hme.com/qsr/add-a-drive-thru/

6. **HME — ClearSoundX**  
   https://qsr.hme.com/clearsoundx

7. **HME — Nitro Vision AI**  
   https://qsr.hme.com/zoom/visionai

8. **HME — QSR Overview**  
   https://www.hme.com/qsr/overview/

---

## Appendix A — short one-paragraph agent brief

Create a QSR / drive-thru segment inside the existing PFM Commercial Experience. Match the approved Retail visual DNA: dominant photorealistic location hero, large commercial question, generous negative space, PFM purple movement overlays, slim canonical left navigation, right-side data lenses, narrative metrics and progressive disclosure through “How we measure this.” Tell the story from the physical drive-thru journey rather than from HME product pages. Show vehicle arrival, queue, order, payment, pickup, pull-forward/mobile, bottleneck, timer-to-headset response, daypart patterns and multi-store proof. Reveal capabilities first, then map them to HME technology such as ZOOM Nitro, NEXEO | HDX and HME CLOUD. Treat POS/geofencing/voice AI as compatibility-dependent, keep gamification secondary, and do not present Nitro Vision AI as a current European PFM capability because HME states it is US-only at the 2026 research baseline. The result must feel like a premium PFM commercial storytelling environment, not a dashboard and not an HME catalogue.
