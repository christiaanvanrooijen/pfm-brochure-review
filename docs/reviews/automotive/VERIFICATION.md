# Automotive reviewcontrole

## Commerciële feedback van 5 november 2026

De actuele PDF-versies hebben elk 16 pagina's: tien scènes, What do we get-output, actie/evaluatie, geo-context, reviewvragen en twee galeriepagina's. De eerdere 14-paginaversies hieronder beschrijven de eerste oplevering.

De vijf locale-JSON-bestanden, HTML-bestanden, PDF-generator en productvoorstel zijn bijgewerkt. Nieuw zijn fixtures.json (versiecontract voor uitsluitend fictieve reviewwaarden), de interne dashboardreferentie met bronmanifest en de contact/marketing/actie-output. De oorspronkelijke screenshot wordt niet als klantbewijs of live productinterface gepubliceerd. Nieuwe fixtures zijn onafhankelijk van de screenshotwaarden gemaakt: 96 bezoeken, 68 geldig, 40 met contactsignaal, 22 vertrokken zonder signaal en 6 nog aanwezig zonder signaal; 59% na afronding. CRM toont zeven offertes/drie orders als aparte dagregistraties. De 1m42s is een gemiddelde onder uitsluitend de 40 bezoeken met contactsignaal.

PDF-layoutasserties en tekstextractie controleren volledige scènetekst, definities, rekenverhouding, CRM-afbakening en actievoorwaarden. Alle 80 pagina's zijn met Poppler gerenderd en visueel beoordeeld. De nieuwe output-/actiepagina's zijn ook afzonderlijk bekeken. De link naar de output, taalkeuze, afbeeldingen, toetsenbordbediening en paginaoverflow zijn op 1440×900 en 1024×768 voor alle vijf talen gecontroleerd. Screenshots: commercial-output-{locale}-{width}.png. De actuele PDF-voorbeeldafbeelding staat in pdf-preview-en.png.

Projectchecks: lint slaagt met 27 bestaande waarschuwingen; typecheck en productiebuild slagen. Van 885 tests slagen er 884. De ene fout is tests/content.test.mjs:246, dat twee goedgekeurde visuals verwacht terwijl de reeds aanwezige Retail Park-wijziging in app/content/visual-assets.ts er drie oplevert. Deze bestanden zijn niet door de Automotive-feedbacktaak gewijzigd. De fout is gerapporteerd zonder de andere wijziging of de test te herschrijven.

Resterend voor implementatie: exacte meldingsadapter en kanaalcompatibiliteit, regel-/zonevalidatie, personeelsonderscheid, actie-eigenaarschap, cohortkoppeling en definitieve taal-/assetgoedkeuring. De lokale review verstuurt geen notificaties en voert geen CRM-acties uit.


## PDF en taalversies

Op gebruikersverzoek zijn vijf PDF-versies toegevoegd in `output/pdf/PFM-Automotive-Review-{EN,NL,DE,FR,ES}.pdf`, elk 14 pagina's. Dezelfde copy staat in `locales/{en,nl,de,fr,es}.json` en in vijf HTML-versies met taalkeuze. Engels is de standaard in `index.html`; NL/DE/FR/ES openen via `index-{nl,de,fr,es}.html`. De canonieke fasen blijven in hun vaste Engelse vorm.

Alle 70 PDF-pagina's zijn met Poppler gerenderd en visueel beoordeeld. De tien scènes per taal zijn met geëxtraheerde PDF-tekst op volledigheid gecontroleerd, inclusief bronvoorwaarden. Geometrische checks onderdrukken tekstoverloop bij PDF-generatie. De fonts zijn ingebed; beelden zitten in de PDF zodat collega's de lokale assets niet nodig hebben. Reproduceerbaar via `build_review_package.py` met de gebundelde Python-runtime en ReportLab.

Alle vijf HTML-versies zijn op 1440×900 en 1024×768 gecontroleerd: afbeeldingen laden, geen horizontale paginaoverflow, toetsenbordnavigatie en uitklapbare meetvoorwaarden werken. Taalwissel is gecontroleerd; resultaten staan in `multilingual-browser-checks.json`. Screenshots staan in `pdf-review-{locale}-{width}.png`; een PDF-voorbeeld staat in `pdf-preview-en.png`.

Lint, typecheck, 885 tests en productiebuild opnieuw geslaagd; dezelfde 27 bestaande lintwaarschuwingen en buildmeldingen blijven aanwezig. Geen runtimecode gewijzigd. Vertalingen zijn conceptcopy voor collegiale beoordeling, geen nieuwe onderbouwing van productclaims.

Gecontroleerd op 3 november 2026. Dit pakket is een lokaal reviewdocument; de bestaande brochure-runtime is niet aangepast.

## Bestanden

- `docs/product/AUTOMOTIVE-SEGMENT-REVIEW.md`: scope, bronafweging, scènes, KPI-definities en implementatievoorwaarden.
- `docs/reviews/automotive/index.html`: doorbladerbaar visueel voorstel, geo-verdieping, reviewpunten en galerie.
- `docs/reviews/automotive/asset-manifest.json`: zestien kandidaatassets met herkomst, afmetingen en checksum.
- `docs/reviews/automotive/browser-checks.json`: geautomatiseerde browsercontrole.
- `docs/reviews/automotive/review-{context,routes,contact,prove}-{1440,1024}.png`: acht gecontroleerde screenshots.
- `public/assets/content-candidates/automotive/`: zestien ongewijzigde beeldbestanden met nieuwe namen.
- `docs/decisions/DECISION-LOG.md`: scope- en bronconflicten.

## Verificatie

| Controle | Resultaat |
| --- | --- |
| npm run lint | Geslaagd, 0 fouten en 27 waarschuwingen in bestaande bestanden |
| npm run typecheck | Geslaagd |
| npm test | 885 geslaagd, 0 mislukt |
| npm run build | Geslaagd; bestaande waarschuwing over chunks boven 500 kB en vinext-routeclassificatie |
| Browser 1440×900 en 1024×768 | Alle 13 secties en hun afbeeldingen geladen, geen horizontale paginaoverflow |
| Toetsenbord | Navigatielinks bereikbaar; Enter activeert anker en opent meetvoorwaarden |
| Reduced motion | Scrollgedrag wordt auto; geen animatie in document |
| Visuele inspectie | Context, modelroutes, contact en Prove op beide formaten beoordeeld; geen overlap of tekstafsnijding |
| Assetintegriteit | Alle 16 SHA-256-waarden gelijk aan aangeleverde originelen |

De bestaande tests verifiëren de app en vormen geen validatie van Automotive-sensormogelijkheden of KPI-berekeningen. Het reviewdocument bevat geen functionele KPI-berekeningen of bronlaagknoppen.

## Resterende punten

Definitieve hero-keuze, grotere portretoriginelen, contact- en groepsdefinities, personeelsonderscheid, site survey, CRM/DMS-cohorten en geo-bron blijven onderdeel van productreview en latere implementatie. Het genoemde `docs/design/DESIGN-SYSTEM.md` ontbreekt in deze checkout; de expliciete merkregels en bestaande scenestijl zijn gevolgd. Niet publiceren als gevalideerde product- of klantresultaten.
