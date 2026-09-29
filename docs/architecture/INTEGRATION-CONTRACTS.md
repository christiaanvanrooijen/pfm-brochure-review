# Integration contracts

These contracts define boundaries for the demo and future implementation. Field names are provisional until mapped against the actual Odoo 18 and Quote Builder schemas.

## Experience session context

```json
{
  "mode": "sales",
  "company_id": 4281,
  "contact_id": 9302,
  "opportunity_id": 9174,
  "vertical": "retail",
  "country": "NL",
  "language": "en-GB",
  "location_count": 42,
  "selected_challenges": [
    "compare-location-performance",
    "understand-capture"
  ],
  "selected_layers": [
    "mobile-geo",
    "physical-measurement",
    "business-data"
  ],
  "selected_capabilities": [
    "entrance-intelligence",
    "capture-rate",
    "portfolio-comparison"
  ]
}
```

## Quote Builder handoff

```json
{
  "schema_version": "demo-v1",
  "company_id": 4281,
  "opportunity_id": 9174,
  "vertical": "retail",
  "location_count": 42,
  "country": "NL",
  "currency": "EUR",
  "selected_capabilities": [
    "entrance-intelligence",
    "capture-rate",
    "mobile-catchment",
    "portfolio-comparison"
  ],
  "source": "pfm-commercial-experience"
}
```

## Quote Builder result

```json
{
  "schema_version": "demo-v1",
  "configuration_id": "cfg_demo_001",
  "quotation_draft_id": null,
  "status": "saved",
  "review_required": true
}
```

## Odoo completion intent

```json
{
  "company_action": "match_or_create",
  "contact_action": "match_or_create",
  "opportunity_action": "create_or_update",
  "opportunity_title": "Retail location intelligence exploration",
  "source": "PFM Commercial Experience",
  "next_activity": {
    "type": "meeting",
    "summary": "Location and data workshop"
  },
  "client_room_requested": true
}
```

## Rules

- Real schemas must use stable IDs rather than display labels.
- Every contract needs a schema version.
- Every write requires server-side validation and an audit record.
- Duplicate-company and duplicate-contact matching must be explicit.
- The demo may simulate results but must not imply a live integration.
