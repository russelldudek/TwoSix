import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

const helixStates = app.match(/helix:\s*\{[\s\S]*?states:\s*\[(.*?)\]/)?.[1];
const sigmaStates = app.match(/sigma:\s*\{[\s\S]*?states:\s*\[(.*?)\]/)?.[1];

assert.ok(helixStates && sigmaStates, 'Helix and SIGMA state vectors must be present');
assert.notEqual(helixStates, sigmaStates, 'Helix and SIGMA must produce distinct gate geometry');
assert.match(app, /Guardrail proof/);
assert.match(app, /Repeatability proof/);
assert.doesNotMatch(app, /reset-model/);
assert.doesNotMatch(index, /id="reset-model"/);
assert.match(index, /href="resume\.html">View my resume<\/a>/);
assert.match(index, /href="#evidence">See the evidence behind the fit<\/a>/);
assert.match(index, /<section class="section dark" id="evidence">/);

console.log('Two Six correction regression checks passed');
