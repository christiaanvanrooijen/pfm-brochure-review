# Automotive segmentvoorstel ter review

Bijgewerkt: 5 november 2026. Status: inhoud en visuele richting ter beoordeling; geen goedgekeurde productievertical.

**Update 18 november 2026:** er is nu een Nederlandstalige Automotive-reviewroute opgenomen in `/preview/integrated`. Deze route is bedoeld voor lokale beoordeling en verandert Automotive niet in een gelanceerde brochurevertical of de volledige go-demo. Retail blijft de enige complete demovertical.

Automotive helpt de dealer contactkansen herkennen, tijdig reageren en verbeteringen evalueren. De showroomreis blijft entree → bestemmingen → modelroutes → verblijf → contactindicator → salesdesk → geregistreerde opvolging. De commerciële rode draad is **From insight to action to evaluated results**. Aantoonbaar resultaat is het doel van een onderbouwde evaluatie, geen beloofde verkoopstijging. De review volgt de bestaande zes fasen, met één dominant locatiebeeld per scène, en staat in [het doorbladerbare voorstel](../reviews/automotive/index.html).

## Opdracht en afbakening

De gebruikersopdracht is om Automotive voor te bereiden ter review, en aangeleverde visuals herkenbaar in het project op te slaan. Implementatie in de brochure volgt pas na inhoudelijke beoordeling. Deze opdracht is de taakspecificatie voor dit pakket; er is geen afzonderlijk genummerde Automotive-taak aangeleverd.

Opgeleverd: tien voorgestelde scènes, een gelokaliseerde **What do we get?**-outputverdieping, een actie- en evaluatieverdieping, geo-context, KPI- en bronvoorwaarden, assetselectie en reviewpunten. Het reviewpakket heeft EN/NL/DE/FR/ES-copy; de bestaande brochure-runtime, segmentpicker, localecontracten, prijslogica en integraties zijn niet aangepast. De HTML is een lokaal reviewdocument met ankerlinks en uitklapbare meetvoorwaarden; meldingen zijn gesimuleerd.

De bestaande scope noemt Retail als enige volledige go-demovertical. Automotive blijft daarom voorbereiding. De bronconflicten en ontbrekende ontwerpbron zijn vastgelegd in [het beslislog](../decisions/DECISION-LOG.md).

## Bronnen en gezag

- `AGENTS.md`: leidend voor waarheid, scope, journey en ontwerp.
- `docs/product/RETAIL-GO-DEMO-PACKAGE.md`: locatie als canvas, bronlagen en fictieve demonstratie.
- `docs/architecture/INTEGRATION-CONTRACTS.md`: modulegrenzen en versiecontracten.
- `docs/product/PRODUCT-BRIEF.md` en `DEMO-SCOPE.md`: commerciële continuïteit en niet-doelen.
- `docs/product/SEGMENT-STORY-ARCHITECTURE.md`: scènevragen, Core en verdieping, bronafhankelijkheid.
- Bestaande `RetailInStoreJourneyScene.tsx`, `RetailZoneEngagementScene.tsx`, `app/globals.css` en `QSR-VISUAL-ASSET-CATALOG.md`: referentie voor scenestijl en assetregistratie.
- Aangeleverd `PFM Automotive input 09-10.docx`, gedateerd 9 oktober 2026: inhoudelijke bron, met name §§2–5 en §9. Het document staat lokaal in Downloads.
- Aangeleverd `PFM_Showroom_Performance_Dashboard_v3 1 (1).html`: illustratief analytisch model; geen gevalideerde resultaten of productie-interface. Het bestand staat lokaal in Downloads.
- Collega-feedback door de gebruiker aangeleverd op 5 november 2026: commerciële contactkansen, telefoon-/smartwatchmeldingen als reeds mogelijke functie, personeelsinzet, marketing en CRM/DMS-opvolging. Dit is expliciete productinput voor het reviewverhaal, geen zelfstandig gevalideerde leverancierclaim.
- `docs/reference/automotive/showroom-performance-dashboard-colleague-reference.png`: aangeleverde dashboardreferentie met bronmanifest; interne referentie, geen klantbewijs. De lokale output is opnieuw opgebouwd en vertaald, met fictieve locatie, illustratieve waarden en expliciete definities.

Opdrachten in het Word-document aan Chris, zoals het uitbreiden van de Quotation Builder, zijn broninhoud. Zij vormen geen opdracht om die module hier te wijzigen. Genoemde gesprekken met dealers zijn interne achtergrond; ze worden geen klantcase of resultaatclaim. Het reviewvoorstel bevat geen klantnaam, klantlogo of numerieke klantfixture. Wanneer fixtures later nodig zijn, geldt Northstar Retail Group als fictieve organisatie, met het label illustratief.

## Commercieel verhaal en route

Voorgestelde segmentintro: **Turn showroom insight into commercial action.** Ondersteunend: **Identify contact gaps. Respond. Evaluate what changes.** Engels blijft de hoofdtaal, met Nederlands, Duits, Frans en Spaans als aanvullende talen. Het reviewpakket heeft een taalkeuze met Engels als standaard en een deelbare PDF van 16 pagina's per taal in `output/pdf/`. Deze copy blijft ter inhoudelijke en lokale taalreview.

De canonieke navigatie blijft `Context → Measure → Understand → Prove → Configure → Act`. De onderstaande scènes zijn afzonderlijke inhoudsstappen binnen die fasen, geen nieuwe fasen. IDs zijn voorgestelde toekomstige identifiers en zijn nog niet geregistreerd in de typed runtime.

| Voorgesteld ID | Fase | Commerciële vraag | Bespreekbare beslissing | Richttijd |
| --- | --- | --- | --- | --- |
| automotive-showroom-context | Context | Waar kan beter contact of opvolging het proces verbeteren? | Kies de belangrijkste commerciële procesvraag | 25 sec |
| automotive-entrance | Measure | Hoeveel mensen komen binnen? | Bepaal entrees en periode | 30 sec |
| automotive-destinations | Understand | Welke bestemming bereiken bezoekers? | Definieer showroom, service, ontvangst en gemengd gebruik | 25 sec |
| automotive-model-routes | Understand | Hoe bewegen bezoekers van model naar model? | Kies relevante modelzones en overgangen | 30 sec |
| automotive-model-dwell | Understand | Bij welke modellen blijven bezoekers staan? | Formuleer een vraag over modelopstelling | 25 sec |
| automotive-staff-contact | Understand | Wie vertrekt zonder contactsignaal? | Scheid contact, nog aanwezig en vertrokken zonder signaal; kies een reactie | 40 sec |
| automotive-desk-progression | Understand | Komt het bezoek bij de salesdesk? | Definieer de fysieke vervolgstap | 25 sec |
| automotive-business-context | Prove | Wat verandert na een campagne of procesaanpassing? | Kies vergelijkbare perioden, kanalen en eventueel gekoppelde cohorten | 40 sec |
| automotive-configure | Configure | Welke meetopzet past bij uw vraag? | Kies bronnen, meldingskanaal en operationeel proces | 35 sec |
| automotive-act | Act | Welke verandering gaan we toetsen? | Verbeterexperiment, nulmeting, eigenaar en evaluatie afspreken | 25 sec |

Totaal: circa vijf minuten zonder verdieping. Dit is een presentatierichtlijn, geen automatische timer. Contact en desk zijn onderdeel van het hoofdverhaal op verzoek van de gebruiker; geo is een optionele verdieping vanuit Context of Configure.

Een showroom krijgt in dit verhaal geen passanten, buitenkans of capture rate. Entreevolumes vormen de fysieke basis. De kop “wie komt binnen” mag niet impliceren dat identiteit, koopintentie of bezoekdoel uit de teller volgt.

## Bronnen en afhankelijkheden

| Bronlaag | Beoogde input | Betekenis en grens |
| --- | --- | --- |
| Physical | Entree-events via Xovis of Milesight | Direct gemeten in/uitpassages per geconfigureerde lijn; bezoeken en unieke bezoekers vragen aparte definities |
| Physical | Showroomtrajecten via LiDAR of geschikte Xovis 3D-opstelling | Alleen binnen gevalideerde dekking; geen garantie dat elk product elke traject- of groepsfunctie ondersteunt |
| Business | Plattegrond, modelposities, desk- en servicezones, openingstijden | Nodig om trajecten ruimtelijk te interpreteren; een gewijzigde opstelling krijgt een nieuwe zoneversie |
| Business | Gevalideerd personeelsonderscheid en eventueel roosters | Roosters geven capaciteit; zij labelen geen anoniem traject als medewerker |
| Business | CRM/DMS-leads, offertes, orders, afspraken en kanalen | Commerciële feiten komen uit registratie; niet uit sensorwaarneming |
| Mobile & geo | Aggregaten voor herkomst en showroombezoekpatronen | Afzonderlijke populatie en brondekking, geen vervanging voor entreeaantallen |
| Insight | Routes, zonebereik, verblijf, contactdekking en geldige vergelijkingen | Afgeleid uit expliciet genoemde inputs; uitzetten van een vereiste bron onderdrukt het resultaat |

Xovis, Milesight en LiDAR zijn hier door de gebruiker voorgestelde oplossingsrichtingen. Het voorstel voegt geen leverancierclaim over nauwkeurigheid, bereik, groepsherkenning of gespreksdetectie toe. Definitieve hardware- en topologiekeuze volgt uit productvalidatie en site survey.

## KPI definities voor implementatie

De tien hoofdscènes blijven zonder numerieke fixtures. De outputverdieping toont een afgebakend illustratief voorbeeld met locatie, periode, eenheid en definities zichtbaar. Een ontbrekende bron toont bij latere implementatie een uitleg; nooit een nulwaarde die als meting kan worden gelezen. Een nulnoemer geeft geen berekenbaar percentage.

| Indicator | Definitie en noemer | Vereiste bronnen en presentatievoorwaarde |
| --- | --- | --- |
| Entreevolume | Aantal geldige inpassages per gekozen entree/tijdvak | Entree-events, lijnconfiguratie en openingstijden; uitsluitingen en herhaalpassages benoemen |
| Gelijktijdige bezetting | Geldige aanwezige trajecten in gedekte zone op een tijdstip | Gevalideerde gebiedsdekking en in/uit- of trajectlogica; optionele verdieping, portretasset beschikbaar |
| Groepsbezoek | Gevalideerde samenloopregel, apart van personen | Groepsmodel en observatiedekking; nooit automatisch “buying groups” noemen |
| Bestemmingsbereik | Trajecten die een zone bereiken / alle daarvoor geldige trajecten | Trajecten en versie van zonering; servicezone ≠ bevestigd servicedoel; meervoudige bestemmingen niet als exclusieve aandelen optellen |
| Modelovergangen | Geobserveerde A→B-overgangen volgens vastgelegde volgorde- en terugkeerregel | Trajecten en modelzones; ontbrekende dekking niet als geen interesse lezen |
| Modelverblijf | Tijd in gedefinieerde modelzone, met regel voor terugkeer en minimale duur | Zone-events en modelindeling; geen blikrichting of bewezen aandacht |
| Contactdekking | Geldige bezoeken met minstens één gevalideerde contactindicator / alle geldige bezoeken in de gekozen doelgroep | Trajecten, betrouwbaar personeelsonderscheid, nabijheids-/duurregel en uitsluitingen; Insight-label |
| Tijd tot contact | Eerste geldige contactindicator minus gedefinieerd startmoment | Alleen bezoeken met een contactindicator; toon bezoeken zonder indicator apart, niet als nul wachttijd |
| Vertrokken zonder contactindicator | Afgeronde geldige bezoeken met een waargenomen vertrek en zonder contactindicator | Dezelfde observatiedekking en geldige verblijfsregel; scheid nog aanwezige bezoeken. Noem dit mogelijke contactkansen, geen gemiste kopers of bewezen verloren omzet |
| Deskbereik | Geldige bezoeken met aanwezigheid volgens deskregel / alle daarvoor geldige bezoeken | Deskzone, verblijfsregel en trajecten; geen gesprek of offerteclaim |
| Contact naar desk | Bezoeken met deskvervolg ná contactindicator / geldige bezoeken met contactindicator | Dezelfde trajecten, cohort en dekkingsregels; tijdvolgorde vereist |
| Offerte of order | Unieke, gededupliceerde registraties volgens dealerdefinitie | CRM/DMS-records, status en datum; aantal documenten ≠ aantal groepen |
| Gekoppelde conversie | Cohortbezoeken met geregistreerde uitkomst binnen afgesproken horizon / eligible cohortbezoeken | Geldige aanvullende koppeling, kanaalregels en gelijke cohortleeftijd; zonder koppeling alleen aparte reeksen naast elkaar |

Geen gewogen mediaan van deelmedianen als “mediane wachttijd” presenteren: bereken de mediaan uit geldige individuele observaties. Bij een groepsmaat blijft de eenheid groep; personenpercentages blijven afzonderlijk.

## Geo verdieping

Herkomstgebieden, merkgerelateerde locatiebezoeken en bezoek aan andere showrooms zijn mogelijke geaggregeerde contextvragen. Toon provider, periode, bronpopulatie, gebied, minimumaantallen en dekkingsbeperkingen bij de uitkomst. Gebruik “merkaffiniteit” alleen als de leverancier die variabele expliciet definieert en kan onderbouwen. Nabijheid van showrooms en gedeelde locaties maken locatietoewijzing een validatievraag.

Geen geo-records koppelen aan individuele anonieme sensortrajecten in dit voorstel. Geen providerselectie, kaart, beschikbaarheidsclaim of procentuele fixture toevoegen voordat de juiste bron is bevestigd. De aangeleverde visuals bevatten geen passende geo-hero; dat is een open assetbehoefte voor een eventuele latere zelfstandige scène.

## Dashboard als inhoudelijke referentie

Overnemen als onderzoeksvragen: tijdvakdrukte versus contactdekking, tijd tot eerste contact, personeelscapaciteit, deskbereik en geregistreerde opvolging. Vanuit Contact, Prove en Act opent **What do we get?** een zelfstandig outputvoorbeeld, onder de hoofdroute. Het dashboard is geen vervanging van de locatiebeelden op de hoofdscènes.

Niet overnemen: “genuine buying opportunities”, gemiste kopers, targets als norm, verwachte extra deals, orderwaardeprojecties, prijzen, ROI of terugverdientijd. Het dashboardmodel gebruikt onder meer 95% contacttarget en 100% recovery; dat zijn modelinstellingen, geen benchmarks.

Technische aandachtspunten uit de bron:

- `renderFunnel` noemt groepen “genuine buying opportunities”; het Word-document §3 sluit automatische koopintentie expliciet uit.
- `opp` en `potentialSteps` vermenigvuldigen een contactgat met downstreampercentages. Dat is geen bewijs van effect of omzetkans en wordt niet in dit voorstel uitgevoerd.
- `aggPhysical` berekent wachttijd over groepen mét contact; groepen zonder indicator moeten afzonderlijk zichtbaar blijven. Een gewogen mediaan van deelmedianen levert geen eventmediaan.
- De bron bevat aankomstweek 3–9 augustus 2026 en peildatum 6 september naast een horizon van 28 dagen. Eén peildatum geeft aankomsten uit die week verschillende leeftijden. Gebruik een per-bezoekhorizon of een expliciet even oud cohort.
- Weektotalen uit handmatige CRM/DMS-invoer zijn niet aan tijdvakken toegeschreven. Een monotoon dalende funnel bewijst geen gedeeld cohort; leads, herhaalde offertes, online, lease en service moeten correct worden ontdubbeld.

Prove toont daarom hoe bewijs zou worden opgebouwd. Het is geen Automotive-klantcase. Het Word-document §§6–8 bevat ook voorgestelde servicetermijnen, benchmarks, prijsindicaties en businesscase-aannames; die worden geen brochuretoezegging.

## Contactkansen en operationele meldingen

Commerciële waarde: maak de stap van lang modelverblijf naar tijdige ontvangst bestuurbaar. Toon afzonderlijk bezoeken mét contactindicator, nog aanwezige bezoeken zonder indicator en afgeronde bezoeken zonder indicator. “Geïnteresseerd” is hoogstens de naam van een expliciet geconfigureerde gedragsregel; het is geen bewezen interesse of koopintentie.

Volgens de aangeleverde productinput zijn meldingen op telefoon of smartwatch al mogelijk. Configure bepaalt de geschikte integratie, de verantwoordelijke ontvanger, beschikbaarheid, drempel, zones en escalatie. Het reviewpakket demonstreert uitsluitend de betekenis van zo'n melding en verstuurt niets. De implementatie moet personeelsonderscheid, meetdekking, vertraging, dubbele meldingen en ontbrekende data valideren.

Beoogde operationele lus: detectieregel → toewijzen → ontvangst bevestigen → reactie uitvoeren → evalueren. Een bevestigde ontvangst is geen bewijs van een uitgevoerd gesprek. Leg per stap de feitelijke bron en status vast. Een latere eventpayload krijgt een typed, versioned contract, bijvoorbeeld `automotive.contact-opportunity.v1`, met locatie/zone, anonieme bezoekreferentie binnen de toegestane bewaartermijn, waarnemingstijd, regelversie, drempel, bronbeschikbaarheid en routeringsrol. Geen klantidentiteit uit een sensor afleiden; nog geen nieuw runtimecontract of notificatieadapter in deze taak.

## Marketing en aantoonbare verbetering

Verbind een campagnekalender en kanaallabels aan vergelijkbare bezoekperioden, modelzones, contactdekking en dealerregistraties. CRM/DMS levert leads, offertes, orders en statussen; fysieke sensoren leveren deze commerciële feiten niet. Individuele koppeling vraagt een toegestane en aantoonbare registratierelatie, ontdubbeling en een vaste uitkomsthorizon. Zonder die relatie blijven de reeksen geaggregeerd naast elkaar.

Gebruik drukte, roosters, contacttijd en modelverblijf om een concreet experiment te kiezen: piekdekking aanpassen, ontvangstmelding inschakelen, modelpresentatie wijzigen of campagneopvolging bespreken. PFM en dealer leggen nulmeting, actie-eigenaar, actielog en evaluatiedatum vast. Vergelijk definities, kanaalmix, seizoen en cohortleeftijd vóór een resultaatclaim. Een waargenomen verandering is niet automatisch het gevolg van de campagne of actie.

## Outputvoorbeeld voor review

De nieuwe screenshot bevat termen als live, geïnteresseerd en verkoopgesprek, naast groepen én bezoekers en een vertreklijst met tijden na de zichtbare datapeildatum. De review neemt die bronclaims niet letterlijk over. De screenshot blijft ongewijzigd als interne referentie; de herbouwde output gebruikt Northstar Retail Group, Showroom A, 5 november 2026, 09:00–14:05 CET, met zichtbaar “illustratief”.

De voorbeeldwaarden zijn onafhankelijk fictief aangemaakt en centraal vastgelegd in `docs/reviews/automotive/fixtures.json`. De eenheid is ontdubbeld persoonsbezoek: 96 showroombezoeken, waarvan 68 met minimaal 60 seconden modelverblijf. Van die 68 hebben 40 een contactindicator, 22 zijn vertrokken zonder indicator en 6 zijn nog aanwezig zonder indicator. Contactsignaaldekking is 40/68 = 58,8%, afgerond 59%. De gemiddelde contacttijd van 1m42s geldt alleen voor de 40 bezoeken mét contact. Drempels 60s en 90s zijn voorbeeldinstellingen, geen norm. De gesimuleerde melding noemt zone 4 en 2m05s verblijf zonder contactsignaal.

Zeven offertes en drie orders staan apart als illustratieve CRM-dagregistraties, met CRM-peiltijd 14:00 CET tegenover fysiek peiltijd 14:05 CET. Er wordt geen percentage of persoonskoppeling naar het bezoekcohort gesuggereerd. De output is een vertaald bespreekvoorbeeld gebaseerd op de screenshot, geen gegarandeerde exacte productinterface of klantresultaat.

## Visuele selectie

Alle zestien Automotive-beelden zijn ongewijzigd gekopieerd naar `public/assets/content-candidates/automotive/`. Ze zijn hernoemd naar hun zichtbare functie. Het [assetmanifest](../reviews/automotive/asset-manifest.json) bewaart origineel pad, doelpad, afmetingen, SHA-256 en kandidaatstatus. Geen bestand is als goedgekeurde productiehero geregistreerd.

| Scène | Voorkeurskandidaat | Opmerking |
| --- | --- | --- |
| Context en Configure | automotive-showroom-overview-wide.png | Overzicht met sales/service; voor Configure opnieuw gebruikt als locatiecontext |
| Measure | automotive-entrance-wide.png | Breed entreebeeld; ontvangst- en arrivalvarianten blijven alternatieven |
| Bestemmingen | automotive-destinations-wide.png | Service, ontvangst en routes zichtbaar |
| Modelroutes | automotive-model-routes-portrait.png | Niet opblazen tot breed heroformaat; groter origineel gewenst |
| Modelverblijf | automotive-model-dwell-portrait.png | Portret met behoud van hele afbeelding |
| Contact en Act | automotive-staff-contact-wide.png | Conceptuele contactillustratie, geen detectiebewijs |
| Salesdesk | automotive-sales-desk-wide.png | Deskzone én showroom zichtbaar |
| Prove | automotive-business-context-portrait.png | Conceptuele opvolging; geen letterlijke gemeten funnel |

De brede beelden zijn 1672×941; de acht portretten ongeveer 402–429×459–471. Portretbeelden hebben deels witte randen en illustratieve auto-emblemen. Geen retouche uitgevoerd. Controleer merk- en beeldrechten voor extern gebruik; het aanleveren van visuals autoriseert opslag en review, niet de claim dat afgebeelde automerken klantbewijs zijn. Het beeld `automotive-undefined-scores-reference.png` blijft referentie vanwege de niet-gedefinieerde oog-/scorelabels.

Het aangeleverde winkelstraatbeeld hoort inhoudelijk bij Retail en is niet als Automotive opgeslagen. De galerie laat alle Automotive-alternatieven zien, zodat ambiguïteit in de hero-keuze expliciet beoordeeld kan worden. Na goedkeuring: verplaats gekozen beelden naar `public/assets/location-visuals/automotive/`; registreer visual-ID, approval en scènebereik volgens de bestaande registry, en pin het componentpad in tests.

## Voorwaarden voor latere implementatie

1. Productlead keurt scènevolgorde, copy, hoofdroute en geo-verdieping goed. De zes canonieke fasen blijven gelijk.
2. Voeg Automotive toe aan bestaande typed segment-, scène-, evidence-, technology- en localecontracten. Leg nieuwe integratieobjecten vast met een discriminant en expliciete schemaversie; geen losse browserpayloads.
3. Maak afhankelijkheden per KPI toetsbaar. Zonder zonering geen routebetekenis; zonder personeelsonderscheid geen contactdekking; zonder CRM/DMS geen offerte/order; zonder geldige cohortkoppeling geen funnelconversie.
4. De browser spreekt uitsluitend met de goedgekeurde applicatielaag. Odoo en SharePoint nooit direct. De aparte Quote Builder ontvangt pas een versiecontract nadat de mapping is overeengekomen; geen nieuwe prijslogica.
5. Latere demoacties krijgen het expliciete label gesimuleerd. Een knop of lokale preview mag niet suggereren dat een offerte of klantomgeving werkelijk is aangemaakt.
6. Gebruik één dominant beeld, PFM Red/Purple/Black en Instrument Sans met bestaande fallback. Valideer 1440×900, 1024×768, toetsenbord en reduced motion. De review gebruikt de fallback als Instrument Sans lokaal ontbreekt en doet geen externe fontaanvraag.
7. Test bronuitschakeling, ontbrekende inputs, nulnoemers, kanaaldubbeltelling, cohortleeftijd en fixturelabels zodra functionele berekeningen worden gebouwd. Run lint, typecheck, tests en productiebuild voor integratie.

## Reviewbesluit

Gevraagd inhoudelijk besluit: is dit het juiste Automotive-verhaal en welke visuals zijn definitief? Open validatie: groepsregel, personeelsonderscheid, contactregel, zone-/modelindeling, CRM/DMS-cohorten, geo-bron en grotere portretoriginelen. Dit zijn implementatie-inputs; zij blokkeren de huidige reviewvoorbereiding niet.
