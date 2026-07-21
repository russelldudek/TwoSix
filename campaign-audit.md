# Two Six Technologies Campaign Audit

Audit date: 2026-07-21

Campaign state: release candidate. The campaign is complete only when `deployment-status.json` identifies the final publication source and records `live_audit: passed`; otherwise it remains building.

## User-directed correction record

### Header navigation correction

- Observed defect: the primary navigation exposed both a standard Resume link and a second highlighted `View my resume` link.
- Why prior QA missed it: the prior regression asserted the highlighted label without asserting one unique header destination.
- Rejected execution: duplicate resume destinations with inconsistent labels.
- Approved correction: one highlighted header action labeled `Resume`; the duplicate standard link is removed.
- Regression assertion: the header must contain exactly one `resume.html` destination and its visible label must be `Resume`.

### 120-day entry-plan depth and page-use correction

- Observed defect: the three-page entry plan compressed two 30-day phases onto each ordinary content page, limiting operating depth and making the document feel tighter than the intended executive planning artifact.
- Correction taxonomy: screen and print documents; evidence and full-role continuity; execution depth.
- Why prior QA missed it: the prior suite verified exact three-page pagination and maximum unused height, but it did not assert that each 30-day phase earned its own page or that the plan covered decision rights, portfolio hypotheses, evidence standards, coaching cadence, product economics, and next-quarter decisions.
- Rejected execution: one cover plus two dense phase pages that summarized Days 1-60 and Days 61-120.
- Approved correction: one cover plus four phase-specific pages, with substantive operating detail and modestly increased spacing, line-height, and table padding.
- Affected surfaces: `120-day-plan.html`, `entry-plan-2026.css`, generated entry-plan PDF, source/PDF/page-use regression, public records, exact live deployment, and private portfolio learning.
- Durable regression: five HTML sheets, four phase sheets, all four day ranges, page labels `2 / 5` through `5 / 5`, required operating-depth topics, and an exact five-page PDF.

## Five-page entry-plan evidence

- Quality runs `29837523440` and `29837760040` passed.
- Source regression passed, including phase architecture, depth topics, the complete candidate-vision URL, native download semantics, and zero prohibited terminology matches.
- Rendered browser audit passed at 1440, 1280, 768, 390, and 320 pixels with no horizontal overflow, no footer collision, and no ordinary print page exceeding the page-use threshold.
- Generated PDF audit passed with exact pagination `2 / 1 / 4 / 5 / 2`, complete candidate-vision URLs, current terminology, and clean metadata boundaries.
- The plan remains future-facing and treats performance targets as baselines to establish rather than invented internal measures.

## Full campaign safeguards retained

- Official locally committed Two Six identity and independent-candidate distinction.
- Current actual-work terminology and zero public internal-process attribution.
- Complete candidate-vision URLs across application documents.
- One unique Resume destination, responsive navigation, keyboard tabs, reduced motion, and atomic scenario settlement.
- Distinct Helix, Sentr, and SIGMA states plus deliberate 390-pixel and 320-pixel artifact compositions.
- Reciprocal resume/cover-letter navigation and native PDF downloads.
- Exact document contracts: resume 2, cover letter 1, interview brief 4, entry plan 5, Mission Window Review 2.

## Completion rule

The release workflow must regenerate all PDFs, deploy the final source, compare the deployed routes, styles, script, logo, and PDFs byte-for-byte, exercise the public desktop/mobile/reduced-motion/scenario/document flows, and produce a receipt. The private portfolio-learning pass begins only after that receipt is verified.
