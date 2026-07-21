# Campaign quality gates

- `correction-regression.mjs` checks source-level navigation, terminology, confidentiality, live URLs, and interaction requirements across the complete public text tree.
- `browser-audit.mjs` renders all public routes across desktop, laptop, tablet, 390-pixel mobile, 320-pixel mobile, and reduced motion; it checks interaction state, responsive navigation, overflow, footer geometry, and print page use.
- `pdf-audit.mjs` verifies exact document page counts, complete candidate-vision URLs, current terminology, and metadata boundaries.
- `live-audit.mjs` compares deployed routes, styles, scripts, brand assets, and PDFs byte-for-byte against the release source, then exercises the public desktop, mobile, reduced-motion, scenario, and reciprocal-document flows.

The pull-request workflow runs source, rendered, and PDF checks before merge. The Pages workflow repeats them, deploys the release, runs the exact live audit, and writes the deployment receipt only after every gate passes.
