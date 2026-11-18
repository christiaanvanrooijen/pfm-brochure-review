"""Create the English master copy for the Automotive review package."""
from pathlib import Path
import json

folder = Path(__file__).parent / 'locales'
d = json.loads((folder / 'nl.json').read_text())
d.update(locale='en', language='English', title='PFM Automotive review proposal', status='Draft for review', date='3 November 2026', questionLabel='Question for the dealer', detailLabel='Sources and measurement conditions', illustration='Illustrative visual - not a measurement result', truth='Draft for review - no customer data or live integrations')
copy = [
('What happens before a lead is registered?', 'From a showroom visit to an informed next step.',
 'CRM and DMS show registered follow-up. PFM helps explain the physical showroom journey: arrival, model exploration, staff contact and progression to the sales desk.',
 'Which part of the showroom journey would you like to understand better?',
 'Start with the dealer’s question. Then select the measurement design and the dealer data needed.',
 'Context for the discussion', 'Illustrative showroom with vehicle zones, visitors, a sales desk and service reception.'),
('How many people enter?', 'A reliable baseline starts at the entrance.',
 'Count entries and exits at each selected entrance and time window. Distinguish people, repeat crossings and derived visits. Group detection is a separate analysis that requires validation.',
 'Which entrances and opening hours should be included?',
 'Proposed entrance options: Xovis or Milesight. Product selection, coverage and staff exclusion require a site assessment.',
 'Physically measured', 'Illustrative arrival of individual visitors and groups in a car showroom.'),
('Which destinations do visitors reach?', 'Showroom, service and reception each have a distinct role.',
 'Show which defined zones are reached and how journeys continue. Reaching a service zone identifies a destination; it does not establish why someone entered.',
 'Can we define zones and visit purposes separately?',
 'A confirmed service purpose requires additional appointment or registration data. Keep mixed-purpose and unknown visits visible.',
 'Physical routes + dealer floor plan → derived insight', 'Illustrative showroom routes towards service, reception and the sales area.'),
('How do visitors move from model to model?', 'Explore the route through the showroom.',
 'Follow transitions between model zones within validated measurement coverage. Show which combinations occur, without presenting a route as personal preference or purchase intent.',
 'Which model zones and transitions matter to the dealer?',
 'Proposed deeper analysis: LiDAR or a suitable Xovis 3D configuration. Sensor handover, obstructions and sight lines require validation.',
 'Physical trajectories + model zones → derived insight', 'Illustrative overhead view of a route between vehicle zones in a showroom.'),
('Which models do visitors spend time near?', 'Make zone reach and dwell time visible.',
 'Time in a model zone provides context for the visit. A longer stay may prompt investigation, but does not prove attention, gaze direction or an intention to buy.',
 'Which layout or model presentation would you like to investigate?',
 'Define zone boundaries, minimum dwell time, return visits and passing trajectories before showing model comparisons.',
 'Physical zone events + model layout → derived insight', 'Illustrative visitors in defined zones around showroom vehicles.'),
('Where does contact with sales staff occur?', 'Examine contact coverage and time to the first contact signal.',
 'A validated proximity and duration rule can provide a contact indicator. Staff must be reliably distinguished from visitors. The indicator does not prove a substantive sales conversation.',
 'Which contact rule would be useful for your sales team?',
 'Compare time windows only after validating the contact rule. A staffing schedule describes capacity, but does not identify a trajectory as a member of staff.',
 'Physical trajectories + staff distinction → derived insight', 'Illustration of visitors and a salesperson beside a showroom vehicle, with purple markers.'),
('Does the visit reach the sales desk?', 'From the showroom floor to the next observable step.',
 'Measure presence in the agreed desk zone and examine progression after contact signals. Sitting at a desk does not prove a quotation, lead or sale.',
 'Which desk zones and follow-up actions should we track separately?',
 'A contact-to-desk rate requires the same valid trajectories and observation period. A quotation requires a separate CRM or DMS record.',
 'Physical desk zone + zone definitions → derived insight', 'Illustrative showroom with model exploration on the left and visitors at a sales desk on the right.'),
('How do visits relate to registered follow-up?', 'Compare showroom patterns with dealer records.',
 'Compare visits, contact indicators and desk visits with supplied leads, quotations and orders. Without valid cohort linkage, these remain separate series shown side by side.',
 'Which definitions and registration periods allow a meaningful comparison?',
 'This is not a customer case or a proven result. The supplied dashboard is a content reference; its targets and projected additional deals are not carried over.',
 'Physical measurement + business data → comparison', 'Conceptual illustration of showroom contact and commercial records; not a measured funnel.'),
('Which measurement design fits your question?', 'Start small, with clear dependencies.',
 'Select entrances for volumes; showroom coverage for routes and zones; validated staff distinction for contact; and dealer data for commercial follow-up. Geo context remains an optional addition.',
 'Discuss the floor plan, coverage, data sources and support required.',
 'The existing Digital Quote Builder remains a separate module. This review proposal contains no prices and initiates no integration or quotation action.',
 'Proposed scope for a site assessment', 'Illustrative showroom with different measurement areas for a proposed measurement design.'),
('Turn insight into a testable action.', 'Agree one research question and one evaluation.',
 'PFM and the dealer agree measurement definitions, a baseline, an action owner and an evaluation date. For example: investigate whether contact coverage differs between busy and quiet time windows.',
 'Next step: a site and data workshop.',
 'Results require validated measurement. In any later demo, Odoo, Quote Builder and Client Room actions must be explicitly labelled as simulated.',
 'Proposed next step', 'Illustrative meeting between showroom visitors and a member of staff.')
]
for scene, values in zip(d['scenes'], copy):
    for key, value in zip(['title','intro','body','question','detail','source','alt'], values):
        scene[key] = value
d['geo'] = dict(title='Where does showroom demand come from?', intro='Add origin areas, brand-related visitation patterns and aggregate visits to other showrooms when a suitable source supports the analysis. These describe a panel or modelled population, not every visitor counted at the entrance.', articles=[dict(title='Origins and reach',body='Use aggregate origin areas with the source population, period and area definition visible. Do not link an individual origin to a sensor trajectory.'),dict(title='Affinity and other showrooms',body='Visits to brand-related locations are a contextual signal. The term brand affinity requires an explicit provider definition; it does not establish preference, ownership or purchase intent.')],note='Availability, representativeness, minimum counts and location attribution must be confirmed with the data provider. This proposal therefore contains no map or fictional percentages for this analysis.')
d['review'] = dict(title='Review before implementation',items=['Does the sequence entrance → destinations → models → contact → desk → registered follow-up fit the story?', 'Which visuals should be final? The portrait images need larger originals for use at a larger size.', 'Should geo context remain an optional deeper exploration, as proposed here?', 'Which contact, group and desk definitions can be validated in a pilot?', 'Which CRM/DMS sources and cohort links are available?'],note='The existing brochure has not been changed. No customer results, prices, uplift, benchmarks or live system actions have been added to this proposal.')
d['gallery'] = dict(title='Supplied Automotive visuals',intro='The scenes show a proposed selection for review. All images below remain candidates. Purple markers are conceptual and do not prove sensor coverage, identity or measurement performance.',note='The supplied street image with pedestrians outside a shop is excluded from Automotive: it depicts Retail and does not support this showroom story.',captions=['Overview of showroom, sales and service','Welcome for a visitor group','Arrival and movement','Reference only: undefined scores and eye symbols','Illustration of contact with staff','Showroom and sales desk','Routes to showroom, service and reception','Entrance and visitor groups','Entrance portrait candidate; low source resolution','Occupancy portrait candidate; low source resolution','Destinations portrait candidate; low source resolution','Model routes portrait candidate; low source resolution','Model dwell portrait candidate; low source resolution','Staff contact portrait candidate; low source resolution','Desk progression portrait candidate; low source resolution','Business context portrait candidate; low source resolution'])
d['labels'] = dict(geo='Geo exploration',review='Review points',visuals='Visuals',language='Language',optional='Optional exploration',gallery='Asset selection',page='Page')
(folder / 'en.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
