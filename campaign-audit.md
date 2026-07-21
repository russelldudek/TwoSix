# Two Six Technologies Campaign Audit

Audit date: 2026-07-21

Campaign state: building pending corrected live-deployment verification.

## User-directed correction record

- Observed defect: the primary navigation exposed both a standard Resume link and a second highlighted `View my resume` link.
- Why prior QA missed it: the prior regression asserted the new highlighted label without asserting one unique header destination.
- Rejected execution: duplicate resume destinations with inconsistent labels.
- Approved correction: one highlighted header action labeled `Resume`; the duplicate standard link is removed.
- Affected surfaces: candidate-vision header, responsive navigation, source regression, and live deployment.
- Regression assertion: the header must contain exactly one `resume.html` destination and its visible label must be `Resume`.

## Full re-audit corrections

- Replaced retired authority-command terminology with `actual work` language.
- Removed internal process attribution from public documentation.
- Added the missing brand-intelligence record and documented asset provenance.
- Replaced generic portfolio links with the complete live candidate-vision URL across all application documents.
- Printed the complete live URL in the cover-letter body and explained the linked work.
- Added rapid-selection cancellation so the final product scenario remains authoritative.
- Added arrow-key tab behavior and a responsive navigation controller.
- Re-composed the handheld decision model into a deliberate two-by-two semantic layout.
- Preserved a labeled Helix starting state without reintroducing the overlapping reset control.

## Release gates

- Manifest: source-complete on the correction branch.
- Brand fidelity: source audit passed; rendered and live verification required after publication.
- UX psychology: source audit passed; rendered and live verification required after publication.
- Responsive composition: automated browser matrix required before publication.
- Reduced motion: automated browser verification required before publication.
- Scenario-state synchronization: source regression passed; runtime verification required before publication.
- Resume pagination: must remain exactly two pages after regeneration.
- Cover-letter pagination: must remain exactly one page after regeneration.
- Other PDFs: page-use and full-page geometry must be reviewed after regeneration.
- Candidate-facing confidentiality: source scan must return zero prohibited matches; PDF scan required after regeneration.
- Exact live deployment: required before campaign state can return to complete.
