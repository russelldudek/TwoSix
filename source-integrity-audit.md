# Source Integrity Audit

- Readable HTML, CSS, JavaScript, Markdown, brand assets, document routes, generated PDFs, and workflow source are required on `main`.
- Temporary encoded payloads and bootstrap archives are not part of the publication model.
- The artifact manifest identifies every required public path.
- The quality workflow scans the complete public text tree before merge.
- The release workflow regenerates PDFs from the committed HTML sources before deployment.
- The deployment receipt records the exact source commit served by GitHub Pages.
