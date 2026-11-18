# Geïntegreerde brochure-review op basis van v4

Status: reviewbuild beschikbaar via `/preview/integrated`; wacht op beoordeling door de gebruiker. Gebruikersinstructie: integreer de goedgekeurde v4-opzet met de huidige brochure en gebruik voor deze versie de bestaande talen EN, DE en FR. Op 5 november 2026 heeft de gebruiker het eerdere verzoek om NL en ES voor deze stap ingetrokken. De gebruiker heeft verduidelijkt dat de goedgekeurde v4-opzet van toepassing is op **alle segmenten**; Retail blijft de enige volledig uitgewerkte go-demovertical volgens `AGENTS.md`.

De geïntegreerde review bevat daarnaast een aparte, Nederlandstalige Automotive-reviewroute. Deze route is previewmateriaal voor beoordeling en is geen gelanceerde brochurevertical.

## Doel

Bouw een afzonderlijke reviewroute op de bestaande segmentoverzichten, journeys, scenecomponenten, verdieping en rapportages. Gebruik de goedgekeurde v4-navigatie en voeg ARC, Data Services, platforms en pakketvergelijking toe. Behoud bestaande beelden, report specimens, interacties, deeplinks en de zes canonieke fasen. De schematische grafiek uit v4 vervangt geen bestaand rapport.

## Bronnen

- `AGENTS.md`
- `docs/reviews/digital-brochure-2026-11-04/CURRENT-REVIEW.md`
- `docs/reviews/digital-brochure-2026-11-04/INTEGRATIE-VERGELIJKING.md`
- `docs/reviews/digital-brochure-2026-11-04/FEEDBACK-REGISTER-2026-11-04.md`
- `docs/content/PFM-ARC-POSITIONING-2026-11-05.md`
- `app/preview/demo/`, `app/components/SegmentOverview.tsx`, `app/components/redesign/` en `app/i18n/`

## Acceptatie

- EN, DE en FR werken voor de nieuwe en bestaande inhoud, zonder onverwacht terug te vallen naar een andere taal.
- De vijf huidige segmentingangen blijven bereikbaar en behouden hun huidige scenecontent, beelden en rapportvoorbeelden.
- De v4-hoofdnavigatie en relevante algemene PFM-, platform- en service-inhoud zijn bereikbaar vanuit ieder bestaand segment, zonder de segmentinhoud te vervangen door Retail of v4-placeholders.
- Retail biedt directe onderwerpingangen en de bestaande volledige journey; URL's, terugkeer en browsergeschiedenis blijven bruikbaar.
- De v4-onderdelen blijven bereikbaar tijdens een gesprek en terugkeer naar de laatst bekeken Retail-scène werkt.
- ARC noemt 98% als objectdetectiedoelstelling, zonder behaald resultaat of universele garantie te claimen.
- Pakketten onderscheiden reporting en service; Pulse-entitlement en ontbrekende voorwaarden worden niet verzonnen.
- Bestaande contentrechten en simulatielabels blijven gelden. Geen live externe systemen of nieuwe prijslogica.
- Controleer laptop- en tabletweergave, toetsenbord, gereduceerde beweging, talen, bestaande rapportages en technische checks. Registreer bestaande testafwijkingen afzonderlijk.

De geïsoleerde reviewroute is gebouwd. De productie-/livebrochure is niet gewijzigd. Raadpleeg `docs/reviews/digital-brochure-2026-11-04/INTEGRATED-REVIEW-README.md` om de review lokaal te openen en de zichtbare beperkingen te zien. De reviewstatus betekent niet dat inhoud of UI al is goedgekeurd voor productie.

## Verificatie reviewbuild

- `npm run typecheck`: geslaagd.
- `npm run build`: geslaagd; `/preview/integrated` is opgenomen.
- `npx eslint app/preview/integrated`: geen fouten; twee waarschuwingen over de bestaande `<img>`-elementen voor het PFM-logo en de reviewafbeelding.
- `node --test tests/*.test.mjs`: 884/885 geslaagd. De ene afwijking is `tests/content.test.mjs` (visual registry readiness count: verwacht 2, huidige aangepaste registry bevat 3). De bronregistratie is buiten deze reviewbuild gelaten.
- De browservisuele controle op 1440×900 en 1024×768 is niet uitgevoerd in deze omgeving. Gebruik de meegeleverde macOS launcher om de route lokaal te bekijken.

## Reviewfeedback 5 november 2026

- Op de segmentkeuzepagina wordt de dubbele legacyheader verborgen. In scenes verdwijnen alleen het dubbele merkblok en de taalknoppen; breadcrumb en herstartbediening blijven staan.
- Pulse App toont de aangeleverde Pulse-, Timeline- en Building-schermen; de inhoud blijft als illustratief gelabeld.
- De Advantage-CTA opent `https://advantage.pfm-intelligence.com/` veilig in een nieuw tabblad.
