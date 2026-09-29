# Technology source registry

Every record below describes a document that actually exists in this directory.
Every technical and privacy statement in it was read from that document, not
inferred from a product name, a vendor reputation or an earlier draft of this
registry.

## How to read this

- **Source ID** is stable and is referenced from `app/content/technology.ts`.
- **File** is relative to `docs/reference/technology/`.
- **Supports** lists what the document genuinely establishes.
- **Does not support** lists what a reader might assume it establishes but which
  it does not say. This section is the point of the registry.

## Rules this registry enforces

1. **Internal only.** Source IDs and document paths are Sales-Mode detail. They
   are never rendered to a prospect. `tests/technology-sources.test.mjs` holds
   this for Presentation Mode.
2. **A vendor document is not automatic evidence for a vendor's catalogue.** It
   covers the products its own scope names, and nothing else. The Xovis ePrivacy
   certificate is the one case here where a shared document legitimately covers
   two implementations — because its Annex 1 names both products explicitly.
3. **Evidence classes are not interchangeable.** An independently issued
   certificate, a manufacturer's own compliance sentence in a sales datasheet,
   and approved product input with no document behind it are three different
   things. They are never presented as one.
4. **A missing source is recorded, not filled in.**

---

## Xovis

Vendor of the PC2SE (entrance) and PF-L (in-store spatial) implementations.

**PC2SE-O — own datasheet mapped; certification not mapped (2026-09-28).** `impl-xovis-3d-entrance-outdoor` is the PC2SE-O, a member of the PC2SE product family (product lead, 2026-09-28). Its technical claims now rest on its own datasheet, `SRC-XOVIS-PC2SE-O-TECH-001`; nothing is carried across from the indoor PC2SE datasheet, and the two differ in operating temperature, illumination and ingress protection. The ePrivacyseal certificate (`SRC-XOVIS-PRIVACY-001`) names the PC2SE in its product list, not the PC2SE-O, so no certification is claimed for the outdoor version; its privacy status is `partially_source_backed` on the datasheet's own description of the privacy modes. *Open source question:* whether the certificate's scope extends to the PC2SE-O — the datasheet lists an ePrivacy seal, but the certificate does not name the variant.

### SRC-XOVIS-PC2SE-TECH-001

**File:** `xovis/pc2se/technical/Xovis-TechnicalDatasheet-PC2SE-EN-V6.0.pdf`
**Type:** Manufacturer technical datasheet
**Supports:** `impl-xovis-3d-entrance`
**External-use readiness:** Ready. Manufacturer-published specification.

Supports:

- 3D stereo vision with embedded AI processing on the device; indoor use
- Mounting height 2.20 m – 6.00 m for the base model; PC2SE-UL 1.95 m – 3.50 m
- Power over Ethernet (IEEE 802.3af), maximum 7.5 W
- Gigabit Ethernet over Cat-5e shielded or better, up to 100 m
- Operating range 0 °C – 45 °C, minimum 2 lux, IP40
- Four privacy modes; data transmitted in text format only, without personally
  identifiable information
- Tilt tolerance ±15° in x, ±5° in y

Does not support:

- Any counting accuracy or capture-rate figure — the datasheet states none
- Coverage area per unit; the datasheet defers this to a separate selection guide
- Classification behaviour or attribute lists
- Retention or deletion behaviour of any system the sensor feeds

**Limitation:** the filename says V6.0; the document's own header and footer say
V7. The document content is what this registry describes.

### SRC-XOVIS-PC2SE-O-TECH-001

**File:** `xovis/pc2se-o/technical/Xovis-TechnicalDatasheet-PC2SE-O-EN-V4.0.pdf`
**Public source:** https://api.xovis.com/fileadmin/user_upload/Xovis-TechnicalDatasheet-PC2SE-O-EN-V4.0.pdf (linked from xovis.com/technology/sensor/pc2se-outdoor; checked 2026-09-28)
**Type:** Manufacturer technical datasheet
**Supports:** `impl-xovis-3d-entrance-outdoor`
**External-use readiness:** Ready. Manufacturer-published specification.

Supports:

- 3D stereo vision with embedded AI processing on the device; outdoor use (p. 1)
- Mounting height 2.20 m – 6.00 m for the base model (PC2SE-O) and PC2SE-L-O;
  PC2SE-UL-O 1.95 m – 3.50 m (pp. 2–3)
- Power over Ethernet, Class 0 (IEEE 802.3af), maximum 7.5 W (p. 1)
- Gigabit Ethernet over Cat-5e shielded or better, up to 100 m; RJ45 with water
  protection caps (p. 2)
- Operating range -33 °C to +40 °C, minimum 9 lux, 0–95 % relative humidity
  non-condensing, "ingress protection against water and dust" — no IP code is
  stated (p. 1)
- Four privacy modes; data transmitted in text format only, without personally
  identifiable information (p. 1)
- Tilt tolerance ±15° in x, ±5° in y (p. 2)

Does not support:

- Any counting accuracy, capture-rate or coverage figure — the datasheet states
  none, and defers coverage to a separate selection guide
- An IP rating number: the datasheet states protection against water and dust
  without a code
- Certification. The datasheet lists "ePrivacy seal, 4 privacy levels for
  GDPR-compliant operation" under its standards. That is the manufacturer's
  statement, not the certificate; the certificate itself (`SRC-XOVIS-PRIVACY-001`)
  does not name the PC2SE-O. No certification and no GDPR compliance is claimed.
- Any figure from the indoor PC2SE datasheet, which this document supersedes for
  the outdoor version

**Limitation:** the filename says V4.0; the document's own footer says V5. The
document content is what this registry describes. Added to the repository on
2026-09-28 from the file supplied by the product lead.

### SRC-XOVIS-PFL-TECH-001

**File:** `xovis/pf-l/technical/Xovis-TechnicalDatasheet-PF-L-EN-V1.5.pdf`
**Type:** Manufacturer technical datasheet
**Supports:** `impl-xovis-3d-spatial`
**External-use readiness:** Ready. Manufacturer-published specification.

Supports:

- 3D stereo vision with embedded AI computing; indoor use
- Mounting height 2.00 m – 6.00 m
- Power over Ethernet (IEEE 802.3af), maximum 12.95 W; USB-C 5 V as an
  alternative supply
- Gigabit Ethernet over Cat-6 shielded or better, up to 100 m
- Operating range 0 °C – 45 °C, minimum 2 lux, IP30 (IP40 with the USB-C plug
  fitted)
- Four privacy modes; all processing on-device, only text data transmitted
- Data storage up to 3 years, depending on the number of counters

Does not support:

- PC2SE figures. These are different products: different power draw, different
  cable class, different mounting range, different ingress rating.
- Any coverage, resolution, tracking-continuity or accuracy figure
- How many units a given floor area requires
- Equivalence with LiDAR on any axis

### SRC-XOVIS-PRIVACY-001

**File:** `xovis/shared/privacy/20260209 ePrivacy Zertifikat EPS XOVIS AG.pdf`
**Type:** Independent privacy certificate (ePrivacyseal GmbH, no. 527/26)
**Supports:** `impl-xovis-3d-entrance`, `impl-xovis-3d-spatial`
**External-use readiness:** Ready, within the scope stated below.

Supports:

- Certified products, named in the certificate itself: PC2, PC3, PC4, PCT1,
  **PC2SE**, PC3SE, **PF-L**, PF-H, PC2R, PC2RE
- Certification decision 09 February 2026; validity 30 January 2025 – 29 January
  2027; criteria catalogue "ePrivacyseal EU" v3.0
- Annex 1 records that Xovis neither owns nor operates the devices once sold,
  and that the surrounding system is under the customer's control

Does not cover — by omission: the **PC2SE-O** is not in the certificate's
product list. Its datasheet mentions an ePrivacy seal, but that is not evidence
the certificate covers it; certification for the outdoor version stays unmapped.

Does not support — the certificate excludes these itself, in Annex 2:

- **Privacy level settings below 2.** Levels 0 and 1 are outside the certified
  scope. Any claim resting on this certificate is void at those levels.
- **All processing carried out by the customer as controller.** The certificate
  says nothing about what happens to data after it leaves the sensor.
- The Xovis Product Improvement Program and device diagnostics

**Limitation to state plainly:** the certificate's own footnote records that
ePrivacyseal GmbH is not an accredited certification body within the meaning of
GDPR art. 42(5). This is a credible independent seal; it is not a regulatory
certification, and it must not be described as one.

**Never applies to:** Milesight, RoboSense, Isarsoft, Tattile, or any camera
infrastructure.

### SRC-XOVIS-PRIVACY-002

**File:** `xovis/shared/privacy/declaration-of-product-data-privacy.pdf`
**Type:** Manufacturer declaration, signed, dated 14 December 2021
**Supports:** `impl-xovis-3d-entrance`, `impl-xovis-3d-spatial`
**External-use readiness:** Usable, with the age of the document noted.

Supports:

- Two image sensors capture an overhead view; images are processed internally on
  the sensor in a closed hardware environment
- After processing, no image is needed or further processed; only the configured
  data points are transferred. No image is stored. Processing is real-time.
- A deep neural network classifies objects on a trained configuration
- For Wi-Fi analytics, MAC addresses are hashed with a customised key before
  leaving the device

Does not support:

- Any claim about a specific product model — the declaration speaks of "our
  products" generally
- The vendor's own conclusion that it therefore "fully complies with GDPR",
  which is the vendor's assertion and is repeated here as such, not adopted
- Anything about the customer-side system

**Limitation:** dated 2021. It predates the current certificate and the current
firmware document, and should be read alongside them rather than alone.

### SRC-XOVIS-PRIVACY-003

**File:** `xovis/shared/privacy/fw5-security-privacy.pdf`
**Type:** Manufacturer security and privacy documentation, firmware 5
**Supports:** `impl-xovis-3d-entrance`, `impl-xovis-3d-spatial`
**External-use readiness:** Usable. The most operationally specific of the four.

Supports:

- Stereo images are compiled in real time on the device, are not stored, and do
  not leave the sensor. Only metadata such as count metrics and timestamps is
  pushed.
- Four privacy levels, defined: 0 live video and tracking; 1 still image and
  tracking; 2 no image, tracking shown; 3 counting values only
- Lowering the privacy level requires the per-sensor Sensor Master Key
- Password protection, configurable ports, HTTP disable, custom SSL
  certificates, TLS-only remote connections, secure boot, encrypted diagnostic
  and backup files, authenticated API

Does not support — and this document is unusually clear about it:

- That the sensor delivers compliance. Its own words: the overall system needs
  to be compliant, not only the sensor, and the system provider is responsible
  for the technical and organisational measures.
- Lawful operation of Wi-Fi/BLE monitoring, which the document states depends on
  country regulation and is the user's responsibility

### SRC-XOVIS-PRIVACY-004

**File:** `xovis/shared/privacy/ISO 27001 Certificate_SQS_EN_2026.pdf`
**Type:** ISO/IEC 27001:2022 certificate (SQS, reg. H61346)
**Supports:** `impl-xovis-3d-entrance`, `impl-xovis-3d-spatial` — as
organisational context only
**External-use readiness:** Usable as organisational context.

Supports:

- Xovis AG and Xovis Germany GmbH operate a certified information security
  management system
- Certified scope: development, production and distribution of 3D sensors and
  software solutions for people-flow counting
- Validity 24 October 2025 – 23 October 2028

Does not support:

- Any product behaviour whatsoever. ISO 27001 certifies a management system, not
  a sensor, and it is not a data-protection certification.

---

## Milesight

Vendor of the VS125-P (entrance) and VS361 (passer-by) implementations. Milesight
supplies no independent privacy certification in this registry; its
data-protection statements are its own, inside its sales datasheets.

### SRC-MILESIGHT-VS125-TECH-001

**File:** `milesight/vs125-p/technical/vs125-datasheet-ENG.pdf`
**Type:** Manufacturer datasheet (sales-oriented)
**Supports:** `impl-milesight-vs125p-entrance`
**External-use readiness:** Technical detail ready; privacy claims are the
manufacturer's own and are not independently certified.

Supports:

- Binocular stereo vision with deep-learning AI, two 4 MP sensors
- Installation height 2.2 – 6 m; FoV 101° horizontal, 70° vertical
- Operates at 0 lux with IR illuminators on
- Up to four bi-directional counting lines; U-turn filtering; up to four
  regional counting and dwell areas
- Configurable attribute recognition (children/adult, staff, gender), which the
  datasheet limits to a 2.2 – 4 m installation height; group counting; heat map;
  view-direction detection
- Multi-device stitching, up to 16 devices
- 802.3af PoE or 12 V DC; average 5.9 W, maximum 11.1 W
- -20 °C – 50 °C, IP40; a separate cellular variant (VS125-L0BEU) exists
- Local storage of up to one million records, with CSV export

Does not support:

- Equivalence with Xovis PC2SE on any axis. Different method implementation,
  different evidence class for privacy, different documented behaviour.
- The stated "up to 99.8% people counting accuracy". This is a manufacturer
  marketing figure. PFM does not restate accuracy figures, per AGENTS.md.
- Independent privacy certification. The datasheet asserts GDPR compliance and
  "no data with personal information is transmitted"; no third-party assessment
  is supplied.
- Retention, deletion or storage-location behaviour of the local data store the
  datasheet describes — which is a notable gap given that a local store exists.

### SRC-MILESIGHT-VS125-PRIVACY-001

**File:** `milesight/vs125-p/privacy/VS125-GDPR-GUIDELINE-SUMMARY.md`
**Original:** https://resource.milesight.com/milesight/iot/document/whitepapers/vs125-gdpr-guideline.pdf
**Type:** Manufacturer privacy/GDPR guideline
**Supports:** `impl-milesight-vs125p-entrance` (VS125 family; confirm exact firmware and configuration before deployment)
**External-use readiness:** Usable only as a description of vendor statements and configurable device behaviour; not independent legal validation.

Supports:

- The VS125 uses binocular imaging to create depth maps and RGB-derived human contours; it is therefore an imaging device, even when a non-image preview mode is selected.
- The vendor documents three preview modes: depth video stream, black-and-white single frame, and no-image trajectory display.
- On-device processing and storage are described; the customer can manually delete locally stored data.
- The vendor describes HTTPS/digest-authenticated management and encrypted communication.
- The vendor states that no data are shared with third parties absent consent or legal requirement, and calls the device GDPR compliant.

Does not support:

- Independent certification or a legal conclusion that a particular deployment complies with GDPR.
- A claim that image capture never occurs, or that stored data are automatically deleted after a defined retention period.
- Any specific PFM deployment, configuration, signage, lawful basis, DPIA, access-control or retention policy.
- Accuracy or customer results.

**Limitation:** this guideline is manufacturer-authored. The no-image preview is an available mode, not proof that every installation uses it.

### SRC-MILESIGHT-VS361-TECH-001

**File:** `milesight/vs361/technical/vs361-datasheet-ENG.pdf`
**Type:** Manufacturer datasheet
**Supports:** `impl-milesight-vs361-passerby`
**External-use readiness:** Technical detail ready.

Supports:

- Diffuse-reflective photoelectric detection: an infrared beam at 940 nm, with
  the sensor registering the reflection off a passing object
- Installation height 0.7 – 1.2 m; wall mounting
- Adjustable detection distance 1 – 9 m, set by a knob on the device
- One NPN open-collector digital output — the device's only output is a
  switching signal
- 802.3af PoE or 12 – 60 V DC; maximum 0.9 W
- IP65, -20 °C – 50 °C, polycarbonate housing, 122 g

Does not support:

- **"Passive infrared."** Earlier product input described the method that way.
  The datasheet describes an *active* method: the device emits the beam. The
  datasheet is authoritative and the content model has been corrected.
- Any accuracy figure. The datasheet says "accurate people counting" as prose
  and gives no number.
- Direction, classification, attribute or unique-visitor output. A single
  switching signal cannot carry any of these.
- Any privacy, GDPR, retention or legal-basis statement. The datasheet makes
  none. What *is* source-backed is the measurement method — non-imaging, no
  camera, no image sensor — from which the privacy position follows, and that
  distinction is preserved in the content model as
  `privacyStatus: partially_source_backed`.

---

## RoboSense

### SRC-ROBOSENSE-AIRY-TECH-001

**File:** `robosense/airy/technical/robosense_airy_datasheet-ENG.pdf`
**Type:** Manufacturer datasheet
**Supports:** `impl-lidar-spatial`
**External-use readiness:** Sensor specification ready. Retail application and
privacy are **not** covered — see below.

Supports:

- 192-beam hemispherical digital LiDAR; 360° × 90° field of view
- 30 m range at 10% reflectivity; 60 m maximum; range precision 1 cm at 1σ
- Angular resolution ~0.4° × 0.47°; 10 Hz frame rate; blind spot < 0.1 m
- Up to ~1.72 M points/s single-return; Class 1 eye safety
- 100Base-TX Ethernet; output is UDP packets of spatial coordinates, intensity
  and timestamp
- 9 – 32 V, under 8 W; -40 °C – +60 °C; IP67 / IP6K9K; under 240 g
- Integrated IMU

Does not support — this is the important part of this record:

- **Retail people-movement measurement.** This is a robotics datasheet. Every
  application it names is a robot: delivery, cleaning, quadruped, courtyard,
  humanoid, forklift, AGV/AMR, service. It documents obstacle avoidance,
  mapping and navigation. It says nothing about measuring people in a store.
- **The analytics layer.** Turning a point cloud into anonymous trajectories,
  zones and dwell is a separate software problem. No mapped source covers it.
- Any data-protection, retention or identity-handling behaviour. The datasheet
  contains no privacy section at all.
- Equivalence with 3D stereo vision on coverage, resolution, tracking
  continuity, classification, installation topology or output format.

**Limitation:** the specification table itself carries the note that
specifications may vary by version. Any figure quoted from it is version-bound.

---

## Isarsoft

### SRC-ISARSOFT-PRIVACY-001

**File:** `isarsoft/privacy/ISARSOFT-DATA-PRIVACY-AND-SECURITY-SUMMARY.md`
**Original:** https://cdn.prod.website-files.com/628905bae461d33b617ea326/69e89ed04bd7cdf9f3cd00f0_ENG_Data%20Privacy_and_Security.pdf
**Type:** Isarsoft Perception privacy and information-security whitepaper, 19 pages, supplied 2026 edition
**Supports:** `impl-isarsoft-camera-analytics` for vendor-described privacy controls only
**External-use readiness:** Partial. Attribute statements to Isarsoft; do not present them as independently verified product guarantees or legal advice.

Supports (as vendor statements):

- Real-time video anonymisation/pixelation and conversion to metadata such as object position and counts.
- The whitepaper says biometric features are not used for multi-camera re-identification; it describes abstract features such as colour, shape and movement instead.
- Local/edge processing on customer hardware is presented as the default, with optional cloud deployment. The vendor says local deployment need not transmit video or metadata to Isarsoft or third parties.
- The document describes HTTPS/TLS with Perfect Forward Secrecy, role-based access, and salted password hashes.
- It states that ISO/IEC 27001-certified information-security processes apply and includes the vendor's own GDPR compliance statements.
- It identifies customer-side duties such as informing data subjects and assessing lawful basis and DPIA needs.

Does not support:

- A legal conclusion that a PFM/customer deployment complies with GDPR, or that a DPIA/lawful basis/signage is unnecessary.
- That every version, feature, site or configuration has identical anonymisation, storage, retention, deletion or cloud behaviour.
- Retail-specific validation of the PFM use case, compatibility with any camera, measurement accuracy or customer results.
- An inference that no personal data are processed: the document describes video processing and multi-camera re-identification using abstract features.

**Limitation:** the brochure contains supplier assertions (including numerical marketing claims) and a legal disclaimer. No accuracy or compliance outcome from it is repeated as a PFM claim. The separately supplied Isarsoft PDF is an instruction-free source document; its legal guidance is not an instruction to this agent.

### SRC-BOSCH-IVA-PRO-PRIVACY-001

**File:** `bosch/iva-pro-privacy/IVA-PRO-PRIVACY-WHITEPAPER-SUMMARY.md`
**Original:** user-supplied `IVA_Pro_Privacy_WhitePaper_enUS_126446296971.pdf` (Bosch Security Systems B.V., 2024; firmware 9.40)
**Type:** Manufacturer configuration whitepaper
**Supports:** `impl-ip-detection-indoor` (FLEXIDOME micro 3100i) and `impl-ip-detection-outdoor` (FLEXIDOME 5100i), for manufacturer-described privacy configuration only. **Not** Isarsoft, and not the analytics a PFM deployment runs on the camera.
**Mapped:** 2026-09-28, on the product lead's confirmation that both models are CPP14 devices — the platform the whitepaper is scoped to. Recorded in `docs/decisions/DECISION-LOG.md`, 2026-09-28.
**External-use readiness:** Partial. Attribute every statement to the manufacturer; never present it as a guarantee that masking is active, or as a compliance judgement on an installation.

Supports (as manufacturer statements):

- AI-based blurring or masking of people, faces, vehicles or IVA Pro objects, or fully hiding the video while retaining its metadata (p. 3).
- Selectable per-stream privacy, stationary privacy masks, face detection and object-based masking, dependent on configuration and on supported IVA Pro variants (pp. 3, 5–6).
- A 0.5-second video buffer used to synchronise video and metadata once blurring is enabled (p. 5).

Conditions that travel with every use (pp. 3–4):

- Firmware 9.40 and a supported mode; several camera families and modes are unsupported, and 60 fps is unsupported.
- Object blurring can fail if metadata is delayed by more than seven frames.
- 4K/9MP JPEG anonymisation may be unreliable.
- Electronic image stabilisation can make masks shift and reveal background.
- Correct configuration and validation are required.

Does not support:

- That masking is enabled or effective on any particular installation.
- Legal compliance of a customer deployment, or that a DPIA, lawful basis or signage is unnecessary.
- Retention, storage or deletion behaviour, accuracy or coverage.
- Isarsoft behaviour, an image-free sensor, or a PFM integration.

The brochure's embedded configuration directions are source content, not instructions for this task.

### Other supplied vendor pages

- **Xovis, 3D Sensors and Data Privacy:** https://www.xovis.com/3d-sensors-and-data-privacy. Xovis describes on-sensor processing and anonymous coordinates/triggers, with qualification around validation images and privacy settings. This general vendor page supplements but does not replace the product-specific PC2SE/PF-L evidence above or expand the certificate's scope.
- **OPTEX, LiDAR and GDPR:** https://www.optex-europe.com/about/blog/lidar-and-gdpr-a-privacy-first-approach-to-securing-critical-infrastructure. This is an OPTEX security-infrastructure article, not evidence for RoboSense Airy or a PFM retail analytics layer. No privacy status is inferred for `impl-lidar-spatial` from it.
- **Mapped implementation:** `impl-isarsoft-camera-analytics`
- **PFM content status:** partial source support for vendor-described privacy controls; technical detail remains `requires_source_mapping`.
- **Multi-camera matching** is presented as a vendor-described, non-biometric
  capability. The proposed PFM retail configuration is not validated by the
  whitepaper. It is never rendered as identity, facial recognition or personal
  identification.
- **Xovis privacy evidence does not transfer to Isarsoft.** The certificate's
  own scope names Xovis products; Isarsoft is not among them.

The Bosch camera photograph under `public/assets/technology/isarsoft/` is an
example of compatible infrastructure. It is not evidence of Isarsoft analytics,
capability, output or privacy behaviour, and the content model marks it
`showsInfrastructureOnly: true` so the UI cannot let it read as one.

The folder is named after the analytics family rather than after a measurement
position because Isarsoft is a multi-capability family: which measurement
question a deployment answers is decided per site by configuration and by which
sources are supported. A position-named folder such as `entrance/` would state,
by filesystem location alone, a single-capability membership that no source
here establishes. The folder name is an organisational fact and carries no
claim about capability, accuracy or data handling.

---

## Tattile

Vehicle and registration-plate intelligence. **Architecture and source mapping
only** — not exposed in the Retail experience, because no Retail scene declares
the vehicle capability.

**Note on the name:** the manufacturer spells itself **Tattile**
(www.tattile.com). The directory here is spelled `tatille/`. The directory is
left as delivered so existing paths resolve; the vendor name in the content
model follows the source document.

### SRC-TATTILE-MK2-TECH-001

**File:** `tatille/mk2/technical/Basic-MK2-Varifocal-datasheet-2025.pdf`
**Type:** Manufacturer datasheet, positioned by the vendor under "Parking Access
Control"
**Supports:** `impl-tattile-anpr-vehicle`
**External-use readiness:** Technical detail ready. Privacy and legal detail are
**not** covered — see below.

Supports:

- ANPR/ALPR camera with the OCR engine running on board; 2 MP grayscale (a
  colour variant exists)
- One lane detected per camera; working distance 3 – 15 m
- Varifocal 10–20 mm lens with continuous autofocus calibration; 8 high-power
  infrared LEDs
- IP67; PoE+ or 24 V DC; 25 W; -40 °C – +60 °C
- Linux OS; STARK software platform carrying an IEC-62443 cybersecurity
  certification
- AES256 and SHA2; JPG image compression; uSD storage up to 128 GB
- REST and binary integration; HTTP(S), FTP, SFTP, TCP RAW, serial, local
  storage; JSON/XML/custom message formats
- Onboard access-control-list management; Wiegand and relay outputs

Does not support:

- **People counting.** This detects vehicles. One vehicle is not one visitor,
  and property footfall cannot be derived from a vehicle count without a
  separate, stated occupancy methodology and its own source.
- **Anonymity.** A licence plate identifies a vehicle. No people-counting
  privacy language may be carried across to this implementation.
- **Data protection.** IEC-62443 is a cybersecurity standard for industrial
  automation. It is not GDPR, not a privacy certification, and not a lawful
  basis. The datasheet has no data-protection, retention, deletion or
  plate-hashing section at all — and it documents on-device JPG image storage,
  which makes the absence more significant, not less.
- **Vehicle registration origin.** The datasheet documents plate reading. It
  documents **no** country-code or region output. Origin context is therefore
  product input awaiting validation, not a source-backed capability — and even
  once validated, a registration country is where a vehicle is registered, never
  where a person lives.
- The stated detection (>99%) and reading (up to 98%) percentages, which are
  manufacturer figures and are not restated as PFM claims.

**Evidence semantics** for any future property segment are held in
`app/content/vehicle-semantics.ts`: vehicle count (direct measurement), vehicle
visit (matched events), vehicle dwell (derived duration) and registration origin
(classified context). None of the four becomes people visits or property
footfall.

---

### SRC-TATTILE-ENFORCEMENT-CAT-2026

**File:** `tatille/catalogue/tattile-enforcement-catalogue-2026.pdf`
**Type:** Manufacturer product catalogue, positioned by the vendor under
"Enforcement" — speed, red light, LEZ/LTZ, bus lane and free-flow tolling
**Supports:** `impl-tattile-anpr-vehicle`
**External-use readiness:** Capability detail ready. Privacy, lawful basis and
retail-parking deployment are **not** covered — see below.

Added 2026-09-04. It supersedes one statement in
`SRC-TATTILE-MK2-TECH-001`, which recorded that the MK2 datasheet documents no
country or region output. That remains true of the MK2 datasheet; it is no longer
true of the vendor's documentation as a whole.

Supports:

- **Country and region recognition.** Stark OCR is described as a "World OCR
  algorithm covering more than 75 countries", with "Plate metadata recognition
  (region, country, plate type & color)".
- **Vehicle classification.** "Embedded vehicle classification: AI Laser
  technology"; elsewhere "classification based on vehicle/shape" and
  "classification based on image".
- **Vehicle make, model, class and colour.** Stark BCCM is "the application to
  detect additional vehicle features", with an "on-edge & on-cloud vehicle Make,
  Model, Class, and Color recognition algorithm", offered as an "optional add-on
  for Tattile and third-party cameras".
- Every product spec table in the catalogue lists vehicle classification, make,
  model and colour as **optional**, never as standard.

Does not support:

- **Standard availability.** The four vehicle attributes are optional add-ons on
  every model listed. A deployment has them only where they were specified.
- **Retail parking.** This is an enforcement catalogue: speed, red light, LEZ,
  bus lane, tolling. The capability is documented; a retail-park car park is not
  the deployment it documents.
- **Privacy, lawful basis or GDPR.** The word "privacy" appears once, about audit
  compliance in a security dashboard. There is no data-protection, retention,
  deletion or lawful-basis section. PFM's own lawful-basis position is not in this
  document and needs its own source.
- **Anonymity.** Unchanged and now more load-bearing: a plate identifies a
  vehicle, and Stark BCCM's own words for the combined attributes are a "digital
  fingerprint".
- **Origin as a person's home.** A registration country is where a vehicle is
  registered. It is not where a person lives, and it is not catchment.
- The stated 97.1% plate and 99.1% country recognition figures, which are
  manufacturer performance claims and are not restated as PFM claims.

---

## Sources that do not exist

Recorded so that a future reader does not go looking, or worse, assume.

| Wanted | Status |
| --- | --- |
| Isarsoft technical documentation | Not supplied |
| Isarsoft privacy documentation | Not supplied |
| Milesight independent privacy certification | Not supplied; manufacturer statement only |
| RoboSense privacy or retail-application documentation | Not supplied |
| RoboSense / LiDAR analytics-layer documentation | Not supplied |
| Tattile privacy, retention or legal-basis documentation | Not supplied |
| Tattile registration-origin capability documentation | Not supplied |

### Superseded

An earlier version of this registry cited
`xovis/shared/privacy/xovis-data-privacy-statement-2023.pdf`,
`xovis/shared/privacy/xovis-3d-sensor-privacy-levels-2024.pdf` and
`xovis/pc2se/technical/pfm-3d-sensor.pdf`, and mapped an implementation id
`impl-xovis-premium-3d`. None of those files or that id exist. It was written
before the real documents arrived. Every record above has been re-derived from a
document that is present on disk.
