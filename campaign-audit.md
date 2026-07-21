# Two Six Technologies Campaign Audit

Audit date: 2026-07-21

Campaign state: building after a material user-directed correction. The campaign returns to complete only when `deployment-status.json` identifies the corrected publication source and records `live_audit: passed`.

## User-directed correction record

### Header navigation correction

- Observed defect: the primary navigation exposed the cover letter as a top-level site destination, increasing document-oriented decision load in a header that should guide the recruiter through the candidate argument.
- Why prior QA missed it: the regression asserted one unique Resume destination but did not test whether every remaining header item earned primary-navigation status.
- Rejected execution: `Vision / Cover letter / Interview brief / 120-day plan / Resume` in the primary header.
- Approved correction: `Vision / Interview brief / 120-day plan / Resume`. The cover letter remains available from the closing application set and through reciprocal resume/cover-letter navigation.
- Regression assertion: the primary header must contain zero `cover-letter.html` destinations at every viewport while the resume and cover-letter document routes retain reciprocal navigation.

### Evidence-transfer composition correction

- Observed defect: the prior section placed an oversized multi-line slogan in the left half and four plain paragraphs in the right half, creating a visually lopsided, document-like pane with weak evidence-to-contribution causality.
- Correction taxonomy: full-page visual pacing; rendered geometry; candidate positioning; visual economy.
- Why prior QA missed it: prior checks covered page overflow and textual continuity, but not section-level balance, operating-range hierarchy, or whether evidence visibly connected to immediate contribution.
- Rejected execution: a giant `Product leadership built in the work...` headline beside a generic `Working posture` prose list.
- Approved correction: a role-specific operating-range composition with one concise thesis, a `Portfolio strategy` to `Mission work` axis, and four horizontal lanes—Build, Coach, Strategize, and Partner. Each lane connects verified evidence to an explicit day-one contribution.
- Affected surfaces: `index.html`, `transfer-2026.css`, desktop/mobile visual-review artifacts, source and rendered-browser regression, live deployment, and private portfolio learning.
- Durable regression: one transfer section, four lanes, four day-one contributions, deliberate two-column desktop composition, deliberate stacked tablet/mobile composition, minimum lane width and rhythm, and no horizontal overflow at 1440, 1280, 768, 390, or 320 pixels.

### Aggregate campaign PDF correction

- Observed defect: the closing band exposed a large, isolated `Download full campaign PDF` control even though each useful document already has its own native download. The aggregate PDF duplicated the site and added release complexity without a distinct recruiter benefit.
- Why prior QA missed it: the previous release contract treated artifact presence as inherently useful and did not test whether the aggregate download advanced the visitor journey.
- Rejected execution: aggregate campaign PDF generation, auditing, deployment, manifest listing, and CTA exposure.
- Approved correction: remove the aggregate button and file completely. Preserve only the five purpose-built downloadable documents.
- Durable regression: the aggregate filename must be absent from the page, PDF builder, PDF audit, live audit, manifest, deployment, and repository.

### 120-day entry-plan depth and page-use correction

- Observed defect: the three-page entry plan compressed two 30-day phases onto each ordinary content page, limiting operating depth and making the document feel tighter than the intended executive planning artifact.
- Correction taxonomy: screen and print documents; evidence and full-role continuity; execution depth.
- Why prior QA missed it: the prior suite verified exact three-page pagination and maximum unused height, but it did not assert that each 30-day phase earned its own page or that the plan covered decision rights, portfolio hypotheses, evidence standards, coaching cadence, product economics, and next-quarter decisions.
- Rejected execution: one cover plus two dense phase pages that summarized Days 1-60 and Days 61-120.
- Approved correction: one cover plus four phase-specific pages, with substantive operating detail and modestly increased spacing, line-height, and table padding.
- Durable regression: five HTML sheets, four phase sheets, all four day ranges, page labels `2 / 5` through `5 / 5`, required operating-depth topics, and an exact five-page PDF.

## Existing campaign safeguards retained

- Official locally committed Two Six identity and independent-candidate distinction.
- Current actual-work terminology and zero public internal-process attribution.
- Complete candidate-vision URLs across application documents.
- One unique Resume destination, responsive navigation, keyboard tabs, reduced motion, and atomic scenario settlement.
- Distinct Helix, Sentr, and SIGMA states plus deliberate 390-pixel and 320-pixel artifact compositions.
- Reciprocal resume/cover-letter navigation and native PDF downloads.
- Exact document contracts: resume 2, cover letter 1, interview brief 4, entry plan 5, Mission Window Review 2.

## Completion rule

The release workflow must regenerate the five retained PDFs, deploy the corrected source, verify that the removed aggregate PDF returns 404, compare the deployed routes, styles, script, logo, and retained PDFs byte-for-byte, exercise the public desktop/mobile/reduced-motion/scenario/document/transfer flows, and produce a fresh receipt. Prior live evidence is expired for the affected navigation, transfer, closing CTA, and document-manifest surfaces.
