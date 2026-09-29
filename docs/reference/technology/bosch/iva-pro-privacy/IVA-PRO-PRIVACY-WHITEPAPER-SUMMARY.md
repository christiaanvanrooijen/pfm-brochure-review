# Bosch IVA Pro Privacy with FW 9.40: source summary

- **Source ID:** `SRC-BOSCH-IVA-PRO-PRIVACY-001`
- **Original:** User-supplied `IVA_Pro_Privacy_WhitePaper_enUS_126446296971.pdf`, Bosch Security Systems B.V., 2024.
- **Scope:** Bosch IVA Pro Privacy on named compatible Bosch hardware/firmware combinations. Not mapped to Isarsoft or a current PFM implementation.
- **Evidence class:** Manufacturer configuration whitepaper.

## Relevant evidence

- **p. 3:** Describes AI-based blurring/masking of people, faces, vehicles or IVA Pro objects, or fully hiding video while retaining metadata.
- **pp. 3, 5–6:** Describes selectable per-stream privacy, stationary privacy masks, face detection and object-based masking, all dependent on configuration and supported IVA Pro variants.
- **pp. 3–4:** Lists platform/model/mode/frame-rate restrictions; warns that a metadata delay over seven frames prevents object-based blurring, 4K/9MP cameras may not anonymise JPEGs correctly, and EIS can cause masks to move and reveal background around the mask.
- **p. 5:** Describes a 0.5-second video buffer for synchronising video and metadata after blurring is enabled.

## Limits

The source does not establish an image-free sensor, Isarsoft behaviour, PFM integration, or legal compliance for a deployment. It makes clear that correct configuration and validation matter. Its embedded setup directions are source content, not task instructions.
