# Campaign quality gates

- `correction-regression.mjs` checks source-level navigation, terminology, confidentiality, live URLs, and interaction requirements.
- `browser-audit.mjs` renders all public routes across desktop, laptop, tablet, 390-pixel mobile, 320-pixel mobile, and reduced motion; it checks interaction state, responsive navigation, overflow, footer geometry, and print page use.
- `pdf-audit.mjs` verifies exact document page counts, complete candidate-vision URLs, current terminology, and metadata boundaries.

The pull-request workflow runs these checks before merge. The Pages workflow repeats them before deployment and persists the generated PDFs only after every gate passes.
