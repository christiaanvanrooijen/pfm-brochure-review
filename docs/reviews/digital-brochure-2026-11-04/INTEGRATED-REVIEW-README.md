# Integrated v4 review

This review route combines the approved v4 navigation and PFM content with the existing interactive brochure. Existing segment journeys remain in the embedded demo so their scene content, report examples, images and behavior stay in use.

## Open locally

Double-click `OPEN-INTEGRATED-REVIEW.command` on macOS. It starts the local development server if needed and opens [`http://localhost:3000/preview/integrated`](http://localhost:3000/preview/integrated). Keep the Terminal window open during review.

The review supports English, German and French. Use **Locations** to choose a segment, **Choose a topic** to jump into its available scenes, and **Resume journey** to return to the existing demo. The duplicate legacy header is hidden on the segment selection page. In journey scenes, the duplicate PFM masthead and language buttons are hidden while the scene breadcrumb and restart control remain available. The other main navigation items keep general PFM information, platforms and the package comparison in fixed places.

This is a local review build. It does not publish or replace the current live brochure. Review approval is still needed before applying accepted changes to the production experience.

## Scope and known review detail

- PFM, ARC, Data Services, platforms, privacy and the service packages are available through the v4 navigation.
- The three Pulse App screens are illustrative supplied images; package access is not inferred.
- The Advantage portal link opens `https://advantage.pfm-intelligence.com/` in a new tab, where a sales presenter can sign in.
- Retail dwell time uses a schematic explanation because the existing demo does not provide a supported dwell-time scene.
- The existing scene view remains embedded in its own frame, preserving its established scene UI as well as the v4 navigation around it.
- Visual browser checks at 1440×900 and 1024×768 have not yet been completed in this environment. The desktop launcher lets the reviewer inspect the running local route directly.
