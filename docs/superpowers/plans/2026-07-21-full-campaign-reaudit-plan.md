# Full Campaign Re-audit Implementation Plan

> **For agentic workers:** Execute each task with source, rendered, PDF, and live verification before completion.

**Goal:** Correct the navigation defect, align every public artifact with the current campaign contracts, and publish the verified campaign to `main`.

**Architecture:** Retain the static HTML/CSS/JavaScript campaign and add a focused responsive layer, atomic interaction controller, source regression, rendered Playwright audit, and generated-PDF audit. GitHub Actions is the release boundary.

**Tech Stack:** HTML, CSS, JavaScript, Node.js, Playwright, PDF.js, GitHub Actions, GitHub Pages.

## Global constraints

- One header destination for `resume.html`, labeled `Resume`.
- No internal process attribution in public files or generated PDFs.
- Use current actual-work terminology.
- Preserve verified candidate evidence and claim strength.
- Preserve exact PDF counts: 2 / 1 / 4 / 3 / 2.
- Verify 1440, 1280, 768, 390, and 320-pixel compositions plus reduced motion.
- Commit the complete corrected campaign to `main` and verify the deployed source commit.

---

### Task 1: Define regression contracts

- [x] Replace the narrow CTA assertion with one unique Resume-destination assertion.
- [x] Add source checks for terminology, confidentiality, live URLs, baseline labeling, and rapid-selection cancellation.
- [x] Add rendered browser and generated-PDF audits.

### Task 2: Correct candidate-vision navigation and interaction

- [x] Remove the duplicate standard Resume link.
- [x] Rename the highlighted action to `Resume`.
- [x] Add responsive navigation disclosure behavior.
- [x] Add arrow-key tabs and atomic final-state authority.
- [x] Re-compose the handheld artifact.

### Task 3: Align content, documents, and brand record

- [x] Replace retired terminology.
- [x] Strengthen affirmative evidence transfer.
- [x] Print the complete candidate-vision URL in every document.
- [x] Explain the linked work in the cover letter.
- [x] Add brand provenance and neutral public documentation.

### Task 4: Validate and publish

- [ ] Run the pull-request quality workflow.
- [ ] Repair every failed source, browser, print, or PDF assertion.
- [ ] Merge the verified branch to `main`.
- [ ] Verify the Pages deployment receipt and corrected live experience.
- [ ] Update the final campaign audit and portfolio learning record.
