# Full Campaign Re-audit Design

## Goal

Publish one coherent, contemporary candidate campaign in which the header has one Resume destination, the operating artifact remains role-specific and meaningful, every public surface follows the current campaign contracts, and the live deployment is verified against the corrected source.

## Approved interaction and navigation design

- Primary navigation: Vision, Cover letter, Interview brief, 120-day plan, and one highlighted action labeled `Resume`.
- No duplicate standard Resume link and no `View my resume` label.
- Handheld navigation uses an accessible disclosure control rather than hiding the site structure.
- Helix remains the clearly labeled illustrative baseline; selecting Helix restores that state without an overlapping reset button.
- Helix, Sentr, and SIGMA update gates, labels, disposition, explanation, focus state, and animation together.
- Rapid selection cancels stale animation timers so the last requested product remains authoritative.

## Visual and responsive design

- Preserve the official Two Six identity and black-and-white recognition layer.
- Use the Mission Window accents only as decision signals.
- Keep the desktop operating artifact precise and quiet.
- Re-compose the handheld artifact into two-by-two semantic gate cards at 390 pixels and one-column cards at 320 pixels.
- Use one-shot motion with a stable end state and a complete reduced-motion result.

## Content and document design

- Use `actual work` and `role objective` terminology.
- Lead with verified integrated value rather than missing-title framing.
- Print the complete live candidate-vision URL in every application document.
- Explain the linked candidate vision inside the cover-letter body.
- Preserve the existing exact document page contracts and regenerate PDFs from the HTML sources.

## Verification design

- Source regression for navigation uniqueness, terminology, confidentiality, URLs, and interaction state.
- Rendered browser audit across desktop, laptop, tablet, 390-pixel mobile, 320-pixel mobile, and reduced motion.
- Screen-footer and print-page-use geometry checks.
- Generated PDF page-count, URL, terminology, and metadata checks.
- Pull-request quality workflow before merge and full Pages release workflow on `main`.
