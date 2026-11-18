# Retail | Passanten tellen — concept ter review

**Doel:** uitleggen hoe we passerende mensen vóór de winkel meten en welke alternatieven beschikbaar zijn zolang de Milesight VS361 niet leverbaar is.
**Status:** inhoudsdraft op basis van aangeleverde datasheets en illustraties; geen productspecificatie, offerte of klantresultaat.

## Voorstel voor de demo

### Passanten tellen bij de winkel

De Milesight VS361 is momenteel niet leverbaar. Daarom bekijken we twee alternatieve meetprincipes voor de passerende stroom buiten de winkel: radar van SensMax en objectdetectie met een Bosch IP-camera. De VS361 blijft als bestaand referentiepunt in beeld; beschikbaarheid van een opvolger is nog niet bevestigd.

**Passanten zijn geen winkelbezoeken.** Een passantenteller meet beweging langs een gekozen gevelzone. Een aparte meting bij de entree telt winkelbezoeken. Alleen als gebied, richting, periode en definitie aansluiten, kunnen we die cijfers vergelijken.

### Optie 1 — Radar: SensMax TAC-B

De radar zendt mmWave-signalen uit en verwerkt de reflecties van bewegende objecten. In de aangeleverde TAC-B-datasheet staat dat de sensor objecten in 4D volgt (X, Y, Z en snelheid) en tellingen kan maken op ingestelde lijnen en zones. Het diagram laat schematisch een radarveld langs de gevel zien.

![Schematische uitleg van radar bij een winkelgevel](assets/explain-radar-sensor-passersby.png)

*Illustratie van een meetconcept; de getekende zone is geen gevalideerd bereik of installatieplan.*

### Optie 2 — IP-detectie: Bosch FLEXIDOME micro 3100i outdoor

De camera analyseert het ingestelde beeld met IVA Pro Buildings. De aangeleverde datasheet noemt detectie en tracking van personen en voertuigen, met onder meer telregels en lijnoverschrijding. In de demo tonen we dit als een ingestelde buitenzone waarin objecten worden gedetecteerd en over een meetlijn kunnen worden geteld.

![Schematische uitleg van IP-objectdetectie bij een winkelgevel](assets/explain-ip-detection-passersby.png)

*Illustratie van een meetconcept; de getekende zone is geen gevalideerd camerabeeld, detectieprestatie of installatieplan.*

### Bestaand referentiepunt — Milesight VS361

De VS361 gebruikt een actieve, diffuse infraroodreflectieschakelaar: de zender stuurt IR-licht uit en registreert reflectie van een passerend object. De datasheet beschrijft één digitale schakeluitgang. De sensor levert daarmee geen richting, objectclassificatie of unieke bezoeker.

**Status:** volgens productinput momenteel niet leverbaar; mogelijke opvolger pas richting eind 2027. Dit is een commerciële status, geen bevestiging van de fabrikant.

## In één oogopslag

| Optie | Wat registreert het principe? | Geschikt om uit te leggen | Bronbegrenzing |
|---|---|---|---|
| SensMax TAC-B radar | Reflecties van bewegende objecten; ingestelde lijnen en zones | Passantenstroom langs een gevel | Aangeleverde datasheet heet TAC-B-serie en noemt TAC-B 3D-WP. Bevestig dat dit exact de bedoelde **TAC-3D EWP**-variant is voordat modelclaims worden gepubliceerd. |
| Bosch FLEXIDOME micro 3100i outdoor | Objectdetectie en tracking in ingestelde camerabeelden | Objecten in een afgebakende buitenzone tellen | De aangeleverde fiche betreft de **outdoor**-variant. Geen technische fiche voor een indoor-variant aangeleverd. |
| Milesight VS361 | Reflectie van actieve 940 nm infrarood; één schakelsignaal | Bestaande eenvoudige passerendetectie | Momenteel niet leverbaar volgens productinput; geen richting of classificatie uit één schakelsignaal. |

## Voorgestelde presentatietekst

> “Voor passanten meten we de beweging buiten de winkel, los van de bezoeken die bij de entree worden geteld. De VS361 is nu niet leverbaar. We kunnen daarom ook radar gebruiken, die reflecties van bewegende objecten volgt, of IP-detectie, die objecten in een ingestelde camerazone herkent en telt. Welke oplossing past, hangt af van de locatie en de gewenste meetzone. Dit zijn illustratieve voorbeelden; de beelden tonen het principe, geen gegarandeerd bereik of meetresultaat.”

## Nog te bevestigen vóór opname in de demo

1. Is **TAC-3D EWP** dezelfde variant als TAC-B 3D-WP in de aangeleverde TAC-B-familiedatasheet? Zo niet, lever de exacte modelfiche aan.
2. Gaat het voor Bosch om FLEXIDOME micro 3100i **outdoor** (de aangeleverde fiche) of ook een specifieke indoor-variant?
3. Is de commerciële beschikbaarheidsstatus en verwachte timing van de VS361-opvolger nog actueel?
4. Welke teldefinitie, richting, montagepositie en analysezone gelden per locatie? De tekeningen zijn conceptueel en leggen dit niet vast.

## Bronnen

- [Bosch FLEXIDOME micro 3100i outdoor datasheet (NL)](../../reference/technology/bosch/flexidome-micro-3100i/technical/bosch-flexidome-micro-3100i-outdoor-datasheet-nl.pdf)
- [SensMax TAC-B family datasheet (EN)](../../reference/technology/sensmax/tac-b-series/technical/sensmax-tac-b-series-datasheet-en.pdf)
- Bestaande VS361-bron: `docs/reference/technology/milesight/vs361/technical/vs361-datasheet-ENG.pdf`
