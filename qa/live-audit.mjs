import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const [pageUrl, sourceCommit] = process.argv.slice(2);
assert.ok(pageUrl, 'Pages URL is required');
assert.ok(sourceCommit, 'Source commit is required');

const root = process.cwd();
const base = pageUrl.endsWith('/') ? pageUrl : `${pageUrl}/`;
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(relativePath, attempts = 24) {
  const target = new URL(relativePath, base);
  target.searchParams.set('source', sourceCommit);

  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(target, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
      if (!response.ok) throw new Error(`${relativePath} returned ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(5000);
    }
  }
  throw lastError;
}

const textFiles = [
  'index.html',
  'app.js',
  'styles.css',
  'site-2026.css',
  'transfer-2026.css',
  'entry-plan-2026.css',
  'brand-tokens.css',
  'resume.html',
  'cover-letter.html',
  'interview-brief.html',
  '120-day-plan.html',
  'mission-window-review.html',
  'brand-intelligence.md',
  'campaign-audit.md'
];
const binaryFiles = [
  'assets/brand/two-six-logo-white.png',
  'docs/Russell-Dudek-Two-Six-Technologies-Resume.pdf',
  'docs/Russell-Dudek-Two-Six-Technologies-Cover-Letter.pdf',
  'docs/Russell-Dudek-Two-Six-Interview-Thesis-Brief.pdf',
  'docs/Russell-Dudek-Two-Six-120-Day-Entry-Plan.pdf',
  'docs/Russell-Dudek-Two-Six-Mission-Window-Review.pdf'
];

for (const relativePath of [...textFiles, ...binaryFiles]) {
  const [local, live] = await Promise.all([
    readFile(path.join(root, relativePath)),
    fetchWithRetry(relativePath)
  ]);
  assert.equal(live.equals(local), true, `${relativePath} must match the deployed source byte-for-byte`);
}

const removedAggregate = await fetch(new URL(`docs/Russell-Dudek-Two-Six-Candidate-Campaign.pdf?source=${sourceCommit}`, base), {
  cache: 'no-store',
  headers: { 'cache-control': 'no-cache' }
});
assert.equal(removedAggregate.status, 404, 'Removed aggregate campaign PDF must not remain deployed');

const browser = await chromium.launch({ headless: true });
const errors = [];

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
desktop.on('pageerror', (error) => errors.push(error.message));
desktop.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
await desktop.goto(`${base}index.html?source=${sourceCommit}`, { waitUntil: 'networkidle' });
assert.equal(await desktop.locator('.site-header a[href="resume.html"]').count(), 1, 'Live header must contain one Resume destination');
assert.equal((await desktop.locator('.site-header a[href="resume.html"]').innerText()).trim(), 'Resume', 'Live header action must read Resume');
assert.equal(await desktop.locator('.site-header a[href="cover-letter.html"]').count(), 0, 'Live primary navigation must not contain Cover letter');
assert.equal(await desktop.locator('.transfer-lane').count(), 4, 'Live transfer section must contain four operating lanes');
assert.equal(await desktop.locator('.transfer-value span').allInnerTexts().then((items) => items.filter((item) => item.trim() === 'Day-one contribution').length), 4, 'Live transfer section must connect every lane to a day-one contribution');
assert.equal(await desktop.locator('a[href="docs/Russell-Dudek-Two-Six-Candidate-Campaign.pdf"]').count(), 0, 'Live site must not expose an aggregate campaign PDF action');
const desktopStyles = await desktop.evaluate(() => [...document.styleSheets].map((sheet) => sheet.href ?? '').filter(Boolean));
assert.ok(desktopStyles.some((href) => href.includes('transfer-2026.css')), 'Live site must load the transfer composition stylesheet');
assert.equal(await desktop.locator('.site-header').getAttribute('data-source-commit'), null, 'Source-control metadata must not appear in the live header');
assert.equal(await desktop.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, 'Live desktop must not overflow');

const desktopTransfer = await desktop.evaluate(() => {
  const intro = document.querySelector('.transfer-intro').getBoundingClientRect();
  const lanes = document.querySelector('.transfer-lanes').getBoundingClientRect();
  return { introRight: intro.right, lanesLeft: lanes.left, topDelta: Math.abs(intro.top - lanes.top) };
});
assert.ok(desktopTransfer.introRight < desktopTransfer.lanesLeft, 'Live desktop transfer section must retain two distinct columns');
assert.ok(desktopTransfer.topDelta <= 4, 'Live desktop transfer columns must align');

await desktop.locator('[data-scenario="sigma"]').click();
assert.equal((await desktop.locator('#decision-name').innerText()).trim(), 'PRODUCTIZE');
assert.deepEqual(await desktop.locator('.gate-state').allInnerTexts(), ['Field evidence', 'Aligned', 'Repeatability proof', 'Aligned']);
await desktop.evaluate(() => {
  document.querySelector('[data-scenario="helix"]').click();
  document.querySelector('[data-scenario="sigma"]').click();
  document.querySelector('[data-scenario="sentr"]').click();
});
await desktop.waitForTimeout(1300);
assert.equal((await desktop.locator('#decision-name').innerText()).trim(), 'SCALE', 'Live rapid selection must settle on final request');
assert.equal(await desktop.locator('[data-scenario="sentr"]').getAttribute('aria-selected'), 'true');
assert.deepEqual(errors, [], 'Live desktop must not emit browser errors');
await desktop.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}index.html?source=${sourceCommit}`, { waitUntil: 'networkidle' });
const toggle = mobile.locator('.nav-toggle');
assert.equal(await toggle.isVisible(), true, 'Live mobile navigation toggle must be visible');
await toggle.click();
assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
assert.equal(await mobile.locator('.site-header a[href="resume.html"]').isVisible(), true, 'Live mobile Resume destination must be visible when menu opens');
assert.equal(await mobile.locator('.site-header a[href="cover-letter.html"]').count(), 0, 'Live mobile navigation must not contain Cover letter');
assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, 'Live mobile must not overflow');
const mobileColumns = await mobile.locator('.gate').evaluateAll((nodes) => new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().x))).size);
assert.equal(mobileColumns, 2, 'Live 390-pixel artifact must use the two-column semantic composition');
const mobileTransfer = await mobile.evaluate(() => {
  const intro = document.querySelector('.transfer-intro').getBoundingClientRect();
  const lanes = document.querySelector('.transfer-lanes').getBoundingClientRect();
  return { introBottom: intro.bottom, lanesTop: lanes.top };
});
assert.ok(mobileTransfer.introBottom < mobileTransfer.lanesTop, 'Live mobile transfer lanes must follow the introduction');
await mobile.close();

const reduced = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
await reduced.goto(`${base}index.html?source=${sourceCommit}`, { waitUntil: 'networkidle' });
await reduced.locator('[data-scenario="sigma"]').click();
assert.equal((await reduced.locator('#decision-name').innerText()).trim(), 'PRODUCTIZE');
assert.equal(await reduced.locator('.sync-board').evaluate((node) => node.classList.contains('is-running')), false, 'Live reduced-motion state must resolve immediately');
await reduced.close();

const resume = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await resume.goto(`${base}resume.html?source=${sourceCommit}`, { waitUntil: 'networkidle' });
assert.equal(await resume.locator('.doc-actions a[href="cover-letter.html"]').count(), 1, 'Live resume must link to cover letter');
assert.match(await resume.locator('body').innerText(), /https:\/\/russelldudek\.github\.io\/TwoSix\//);
await resume.close();

const cover = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await cover.goto(`${base}cover-letter.html?source=${sourceCommit}`, { waitUntil: 'networkidle' });
assert.equal(await cover.locator('.doc-actions a[href="resume.html"]').count(), 1, 'Live cover letter must link to resume');
assert.match(await cover.locator('.letter-body').innerText(), /https:\/\/russelldudek\.github\.io\/TwoSix\//);
await cover.close();

const entryPlan = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const entryPlanErrors = [];
entryPlan.on('pageerror', (error) => entryPlanErrors.push(error.message));
entryPlan.on('console', (message) => {
  if (message.type() === 'error') entryPlanErrors.push(message.text());
});
await entryPlan.goto(`${base}120-day-plan.html?source=${sourceCommit}`, { waitUntil: 'networkidle' });
assert.equal(await entryPlan.locator('section.sheet').count(), 5, 'Live entry plan must contain five composed sheets');
assert.equal(await entryPlan.locator('section.sheet.brief.plan-sheet').count(), 4, 'Live entry plan must contain four phase sheets');
assert.equal(await entryPlan.locator('.doc-actions a[download][href="docs/Russell-Dudek-Two-Six-120-Day-Entry-Plan.pdf"]').count(), 1, 'Live entry plan must expose its native PDF download');
assert.match(await entryPlan.locator('body').innerText(), /Days 1-30[\s\S]*Days 31-60[\s\S]*Days 61-90[\s\S]*Days 91-120/);
assert.match(await entryPlan.locator('body').innerText(), /Next-quarter decisions/i);
assert.match(await entryPlan.locator('body').innerText(), /https:\/\/russelldudek\.github\.io\/TwoSix\//);
assert.equal(await entryPlan.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, 'Live entry-plan screen route must not overflow');
const entryPlanStyles = await entryPlan.evaluate(() => [...document.styleSheets].map((sheet) => sheet.href ?? '').filter(Boolean));
assert.ok(entryPlanStyles.some((href) => href.includes('entry-plan-2026.css')), 'Live entry plan must load the focused composition stylesheet');
assert.deepEqual(entryPlanErrors, [], 'Live entry plan must not emit browser errors');
await entryPlan.close();

await browser.close();
console.log(`Two Six live deployment audit passed for ${sourceCommit}`);
