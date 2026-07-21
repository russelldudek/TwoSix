import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8');

const index = read('index.html');
const app = read('app.js');
const siteCss = read('site-2026.css');
const header = index.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] ?? '';
const campaignUrl = 'https://russelldudek.github.io/TwoSix/';
const internalName = ['role', 'forge'].join('');
const retiredTerm = ['man', 'date'].join('');

assert.equal((header.match(/href="resume\.html"/g) ?? []).length, 1, 'Header must expose one Resume destination');
assert.match(header, /class="nav-cta" href="resume\.html">Resume<\/a>/, 'Header CTA must read Resume');
assert.doesNotMatch(header, /View my resume/i, 'Superseded CTA label must not return');
assert.match(header, /class="nav-toggle"[\s\S]*aria-controls="primary-links"/, 'Responsive navigation toggle must be present');

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

const publicTextFiles = [
  'index.html', 'resume.html', 'cover-letter.html', 'interview-brief.html',
  '120-day-plan.html', 'mission-window-review.html', 'app.js', 'styles.css',
  'site-2026.css', 'brand-tokens.css', 'brand-intelligence.md', 'README.md',
  'campaign-audit.md'
];
for (const file of publicTextFiles) {
  const content = read(file);
  assert.doesNotMatch(content, new RegExp(internalName, 'i'), `${file} must not expose internal process attribution`);
  assert.doesNotMatch(content, new RegExp(`\\b${retiredTerm}\\b`, 'i'), `${file} must use actual-work terminology`);
}

console.log('Two Six full campaign correction contract passed');
