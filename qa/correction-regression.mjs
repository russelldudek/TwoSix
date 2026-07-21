import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8');

const index = read('index.html');
const app = read('app.js');
const siteCss = read('site-2026.css');
const entryPlan = read('120-day-plan.html');
const buildPdfs = read('scripts/build-pdfs.mjs');
const pdfAudit = read('qa/pdf-audit.mjs');
const liveAudit = read('qa/live-audit.mjs');
const manifest = read('artifact-manifest.md');
const header = index.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] ?? '';
const campaignUrl = 'https://russelldudek.github.io/TwoSix/';
const aggregatePdfName = 'Russell-Dudek-Two-Six-Candidate-Campaign.pdf';
const internalName = ['role', 'forge'].join('');
const retiredTerm = ['man', 'date'].join('');

assert.equal((header.match(/href="resume\.html"/g) ?? []).length, 1, 'Header must expose one Resume destination');
assert.match(header, /class="nav-cta" href="resume\.html">Resume<\/a>/, 'Header CTA must read Resume');
assert.doesNotMatch(header, /View my resume/i, 'Superseded CTA label must not return');
assert.doesNotMatch(header, /href="cover-letter\.html"/i, 'Cover letter must not appear in primary navigation');
assert.match(header, /class="nav-toggle"[\s\S]*aria-controls="primary-links"/, 'Responsive navigation toggle must be present');

assert.match(index, /class="transfer-grid"/, 'Transfer section must use the redesigned operating-range composition');
assert.equal((index.match(/class="transfer-lane"/g) ?? []).length, 4, 'Transfer section must contain four distinct operating lanes');
assert.match(index, /Lead at the altitude the decision requires\./, 'Transfer section must use the approved concise thesis');
assert.match(index, /Portfolio strategy[\s\S]*Mission work/, 'Transfer section must show the complete operating range');
assert.equal((index.match(/Day-one contribution/g) ?? []).length, 4, 'Each operating lane must connect evidence to a day-one contribution');

for (const content of [index, buildPdfs, pdfAudit, liveAudit, manifest]) {
  assert.doesNotMatch(content, new RegExp(aggregatePdfName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'Aggregate campaign PDF must be removed from public and release surfaces');
}
assert.equal(existsSync(path.join(root, 'docs', aggregatePdfName)), false, 'Aggregate campaign PDF file must be deleted');

const helixStates = app.match(/helix:\s*\{[\s\S]*?states:\s*\[(.*?)\]/)?.[1];
const sigmaStates = app.match(/sigma:\s*\{[\s\S]*?states:\s*\[(.*?)\]/)?.[1];
assert.ok(helixStates && sigmaStates, 'Helix and SIGMA state vectors must be present');
assert.notEqual(helixStates, sigmaStates, 'Helix and SIGMA must produce distinct gate geometry');
assert.match(index, /Helix<small>Illustrative baseline<\/small>/, 'Helix must be clearly labeled as the baseline action');
assert.doesNotMatch(app, /reset-model/);
assert.doesNotMatch(index, /id="reset-model"/);
assert.match(app, /clearTimeout\(animationTimer\)/, 'Rapid scenario selection must cancel stale animation timers');
assert.match(app, /ArrowRight|ArrowLeft/, 'Tab controls must implement arrow-key navigation');
assert.match(app, /nav-toggle/, 'Responsive navigation must have a runtime controller');

assert.match(index, /href="#evidence">See the evidence behind the fit<\/a>/);
assert.match(index, /<section class="section dark" id="evidence">/);
assert.match(siteCss, /@media\s*\(max-width:\s*980px\)[\s\S]*\.nav-toggle/, 'Responsive menu styling must exist');
assert.match(siteCss, /@media\s*\(max-width:\s*650px\)[\s\S]*\.sync-gates[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/, 'Handheld artifact must use a deliberate 2x2 semantic composition');

assert.equal((entryPlan.match(/<section class="sheet/g) ?? []).length, 5, 'Entry plan must contain one cover and four phase sheets');
assert.equal((entryPlan.match(/<section class="sheet brief plan-sheet"/g) ?? []).length, 4, 'Entry plan must dedicate one sheet to each 30-day phase');
for (const range of ['Days 1-30', 'Days 31-60', 'Days 61-90', 'Days 91-120']) {
  assert.match(entryPlan, new RegExp(range.replace('-', '\\-')), `Entry plan must include ${range}`);
}
for (const pageLabel of ['2 / 5', '3 / 5', '4 / 5', '5 / 5']) {
  assert.match(entryPlan, new RegExp(pageLabel.replace('/', '\\/')), `Entry plan must include page label ${pageLabel}`);
}
for (const requiredDepth of [
  /decision rights/i,
  /portfolio hypotheses/i,
  /evidence standards/i,
  /coaching cadence/i,
  /product economics/i,
  /next-quarter decisions/i
]) {
  assert.match(entryPlan, requiredDepth, `Entry plan must retain substantive operating depth: ${requiredDepth}`);
}
assert.match(entryPlan, /entry-plan-2026\.css/, 'Entry plan must load its focused composition stylesheet');

const documents = [
  'resume.html',
  'cover-letter.html',
  'interview-brief.html',
  '120-day-plan.html',
  'mission-window-review.html'
];
for (const file of documents) {
  const content = read(file);
  assert.match(content, new RegExp(campaignUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${file} must display the live candidate-vision URL`);
  assert.match(content, /download>Download PDF<\/a>/, `${file} must provide native PDF download`);
  assert.doesNotMatch(content, /window\.print|>Print</i, `${file} must not add redundant print controls`);
}
assert.match(read('cover-letter.html'), /https:\/\/russelldudek\.github\.io\/TwoSix\//, 'Cover letter body must print the complete campaign URL');
assert.ok(existsSync(path.join(root, 'brand-intelligence.md')), 'Brand intelligence record must exist');
assert.ok(existsSync(path.join(root, 'campaign-audit.md')), 'Current campaign audit must exist');
assert.ok(existsSync(path.join(root, 'artifact-manifest.md')), 'Artifact manifest must exist');

const textExtensions = new Set(['.html', '.css', '.js', '.mjs', '.ts', '.svg', '.json', '.jsonld', '.md', '.txt', '.xml', '.yml', '.yaml']);
const ignoredDirectories = new Set(['.git', 'node_modules', '_site']);
const publicTextFiles = [];

function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(absolute);
    if (entry.isFile() && textExtensions.has(path.extname(entry.name).toLowerCase())) {
      publicTextFiles.push(path.relative(root, absolute));
    }
  }
}
collect(root);

for (const file of publicTextFiles) {
  const content = read(file);
  assert.doesNotMatch(content, new RegExp(internalName, 'i'), `${file} must not expose internal process attribution`);
  assert.doesNotMatch(content, new RegExp(`\\b${retiredTerm}\\b`, 'i'), `${file} must use actual-work terminology`);
}

console.log(`Two Six full campaign correction contract passed across ${publicTextFiles.length} public text files`);
