# Five-Page 120-Day Entry Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Two Six 120-Day Entry Plan from three to five deliberate printed pages with materially deeper operating content and slightly more breathing room.

**Architecture:** Keep the existing HTML-to-PDF pipeline and shared document system. Replace the entry-plan route with one cover plus four phase sheets, add a focused entry-plan stylesheet, strengthen source and PDF regression contracts, regenerate the document, and re-run the complete campaign release gates.

**Tech Stack:** Static HTML, CSS, Node.js, Playwright, PDF.js, GitHub Actions, GitHub Pages.

## Global Constraints

- The entry-plan PDF must contain exactly five US Letter pages.
- Page 1 is the cover; pages 2-5 each contain one 30-day phase.
- The complete live candidate-vision URL remains visible in the HTML and PDF.
- Every content page must satisfy footer-clearance and page-use thresholds.
- No invented metrics, internal Two Six facts, clearance claims, product ownership, or classified-work claims.
- Native `Download PDF` behavior remains intact.
- This material document correction invalidates prior rendered, PDF, and live proof until reverified.

---

### Task 1: Strengthen regression contracts

**Files:**
- Modify: `qa/correction-regression.mjs`
- Modify: `qa/pdf-audit.mjs`

**Interfaces:**
- Consumes: `120-day-plan.html` phase-sheet markup and generated entry-plan PDF.
- Produces: source and PDF assertions that block three-page regressions or superficial page padding.

- [ ] Assert five entry-plan sheets, four phase sheets, all four day ranges, and page labels `2 / 5` through `5 / 5`.
- [ ] Assert the entry-plan includes decision rights, portfolio hypotheses, evidence standards, coaching cadence, product economics, and next-quarter decisions.
- [ ] Change the expected entry-plan PDF count from three to five.
- [ ] Commit the failing regression changes before document implementation.

### Task 2: Rebuild the entry-plan content architecture

**Files:**
- Modify: `120-day-plan.html`
- Create: `entry-plan-2026.css`

**Interfaces:**
- Consumes: the existing shared document classes and brand assets.
- Produces: one cover plus four phase-specific sheets with compact continuation headers and role-specific operating content.

- [ ] Preserve the cover thesis and independent-candidate framing.
- [ ] Build a Days 1-30 page covering stakeholder discovery, decision architecture, access constraints, signal inventory, coaching baseline, and outputs.
- [ ] Build a Days 31-60 page covering the Mission Window Contract, bounded hypotheses, baseline scorecard, AI-assisted tradecraft pilots, decision rights, cadence, guardrails, and outputs.
- [ ] Build a Days 61-90 page covering three live reviews, evidence standards, conflict resolution, cross-functional commitments, coaching-by-doing, and proof outputs.
- [ ] Build a Days 91-120 page covering institutional cadence, learning return, roadmap narrative, product economics, team craft, AI experiments, success evidence, and next-quarter decisions.
- [ ] Add focused CSS for modestly larger line-height, spacing, table padding, and deliberate page composition without modifying other document routes.

### Task 3: Update public records and completion state

**Files:**
- Modify: `campaign-audit.md`
- Modify: `campaign-completion-checklist.md`
- Modify: `artifact-manifest.md`
- Modify: `release-notes.md`
- Modify: `change-summary.md`

**Interfaces:**
- Consumes: the revised document contract and invalidated prior proof.
- Produces: accurate public records that classify the campaign as building until reverified and then complete after release.

- [ ] Record the user-directed depth/page-use correction and why the three-page plan was insufficient.
- [ ] Update the expected entry-plan pagination to five pages.
- [ ] Record the affected surfaces and durable regression assertions.

### Task 4: Run quality and publish

**Files:**
- Generated: `docs/Russell-Dudek-Two-Six-120-Day-Entry-Plan.pdf`
- Generated: `deployment-status.json`

**Interfaces:**
- Consumes: branch source and GitHub Actions quality/deploy workflows.
- Produces: quality-passed branch, merged `main`, regenerated five-page PDF, and exact live-verification receipt.

- [ ] Open a pull request and run source, rendered-browser, PDF, confidentiality, responsive, reduced-motion, and print-page-use gates.
- [ ] Repair every failed gate before merge.
- [ ] Merge the verified branch to `main`.
- [ ] Trigger the Pages workflow, regenerate PDFs, and verify the deployed source and five-page PDF.
- [ ] Update private Two Six case memory and portfolio records with the material correction, five-page contract, new audit evidence, and anti-clone learning.
