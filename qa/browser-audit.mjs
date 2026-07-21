import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const artifactDir = path.join(root, 'qa-artifacts');
await mkdir(artifactDir, { recursive: true });

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.json': 'application/json; charset=utf-8'
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    assert.ok(target.startsWith(root), 'Request must stay inside the campaign root');
    const body = await readFile(target);
    response.writeHead(200, { 'content-type': mime[path.extname(target)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const origin = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'narrow', width: 320, height: 800 }
];
const routes = [
  'index.html',
  'resume.html',
  'cover-letter.html',
  'interview-brief.html',
  '120-day-plan.html',
  'mission-window-review.html'
];

async function auditRoute(route, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  const response = await page.goto(`${origin}/${route}`, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, `${route} must return 200 at ${viewport.name}`);
  assert.deepEqual(errors, [], `${route} must not emit browser errors at ${viewport.name}`);

  const geometry = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth
  }));
  assert.ok(geometry.documentWidth <= geometry.viewport + 1, `${route} document must not overflow at ${viewport.name}`);
  assert.ok(geometry.bodyWidth <= geometry.viewport + 1, `${route} body must not overflow at ${viewport.name}`);

  if (route === 'index.html') {
    const headerResume = page.locator('.site-header a[href="resume.html"]');
    assert.equal(await headerResume.count(), 1, `Header must contain one Resume destination at ${viewport.name}`);
    assert.equal((await headerResume.first().innerText()).trim(), 'Resume', `Header action must read Resume at ${viewport.name}`);
    assert.equal(await page.locator('.site-header a[href="cover-letter.html"]').count(), 0, `Cover letter must not appear in primary navigation at ${viewport.name}`);

    if (viewport.width <= 980) {
      const toggle = page.locator('.nav-toggle');
      assert.ok(await toggle.isVisible(), `Mobile navigation toggle must be visible at ${viewport.name}`);
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true', `Mobile navigation must report open at ${viewport.name}`);
      assert.ok(await headerResume.first().isVisible(), `Resume must be visible inside open mobile navigation at ${viewport.name}`);
      assert.equal(await page.locator('.site-header a[href="cover-letter.html"]').count(), 0, `Mobile navigation must not restore Cover letter at ${viewport.name}`);
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `Escape must close mobile navigation at ${viewport.name}`);
    }

    const transfer = page.locator('.transfer-section');
    assert.equal(await transfer.count(), 1, `Transfer section must exist at ${viewport.name}`);
    assert.equal(await page.locator('.transfer-lane').count(), 4, `Transfer section must expose four operating lanes at ${viewport.name}`);
    assert.equal(await page.locator('.transfer-value span').allInnerTexts().then((items) => items.filter((item) => item.trim() === 'Day-one contribution').length), 4, `Each transfer lane must expose a day-one contribution at ${viewport.name}`);
    assert.equal(await page.locator('a[href="docs/Russell-Dudek-Two-Six-Candidate-Campaign.pdf"]').count(), 0, `Aggregate campaign PDF action must be absent at ${viewport.name}`);

    const transferStyles = await page.evaluate(() => [...document.styleSheets].map((sheet) => sheet.href ?? '').filter(Boolean));
    assert.ok(transferStyles.some((href) => href.includes('transfer-2026.css')), `Transfer composition stylesheet must load at ${viewport.name}`);

    const transferGeometry = await page.evaluate(() => {
      const intro = document.querySelector('.transfer-intro').getBoundingClientRect();
      const lanes = document.querySelector('.transfer-lanes').getBoundingClientRect();
      const rows = [...document.querySelectorAll('.transfer-lane')].map((node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
      });
      return {
        intro: { left: intro.left, right: intro.right, top: intro.top, bottom: intro.bottom },
        lanes: { left: lanes.left, right: lanes.right, top: lanes.top, bottom: lanes.bottom },
        rows
      };
    });
    assert.ok(transferGeometry.rows.every((row) => row.width >= Math.min(280, viewport.width - 48)), `Transfer lanes must remain readable at ${viewport.name}`);
    assert.ok(transferGeometry.rows.every((row) => row.height >= 88), `Transfer lanes must retain deliberate vertical rhythm at ${viewport.name}`);
    if (viewport.width > 980) {
      assert.ok(transferGeometry.intro.right < transferGeometry.lanes.left, `Transfer intro and lanes must form distinct desktop columns at ${viewport.name}`);
      assert.ok(Math.abs(transferGeometry.intro.top - transferGeometry.lanes.top) <= 4, `Transfer columns must align at the top at ${viewport.name}`);
    } else {
      assert.ok(transferGeometry.intro.bottom < transferGeometry.lanes.top, `Transfer lanes must follow the introduction at ${viewport.name}`);
    }

    if (viewport.name === 'desktop' || viewport.name === 'mobile') {
      await transfer.screenshot({ path: path.join(artifactDir, `transfer-${viewport.name}.png`) });
    }

    const helix = page.locator('[data-scenario="helix"]');
    const sentr = page.locator('[data-scenario="sentr"]');
    const sigma = page.locator('[data-scenario="sigma"]');
    assert.equal(await helix.getAttribute('aria-selected'), 'true', `Helix must initialize as baseline at ${viewport.name}`);
    assert.equal((await page.locator('#decision-name').innerText()).trim(), 'ACCELERATE');

    await sigma.click();
    await page.waitForTimeout(120);
    assert.ok(await page.locator('.sync-board').evaluate((node) => node.classList.contains('is-running')), `Scenario motion must enter an observable intermediate state at ${viewport.name}`);
    assert.equal((await page.locator('#decision-name').innerText()).trim(), 'PRODUCTIZE');
    assert.deepEqual(await page.locator('.gate-state').allInnerTexts(), ['Field evidence', 'Aligned', 'Repeatability proof', 'Aligned']);
    await page.waitForTimeout(1250);
    assert.equal(await page.locator('.sync-board').evaluate((node) => node.classList.contains('is-running')), false, `Scenario motion must settle at ${viewport.name}`);

    await page.evaluate(() => {
      document.querySelector('[data-scenario="helix"]').click();
      document.querySelector('[data-scenario="sigma"]').click();
      document.querySelector('[data-scenario="sentr"]').click();
    });
    await page.waitForTimeout(1250);
    assert.equal((await page.locator('#decision-name').innerText()).trim(), 'SCALE', `Rapid selection must settle on final request at ${viewport.name}`);
    assert.equal(await sentr.getAttribute('aria-selected'), 'true', `Final selected tab must remain authoritative at ${viewport.name}`);

    await helix.focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await sentr.getAttribute('aria-selected'), 'true', `ArrowRight must select next scenario at ${viewport.name}`);
    assert.equal(await sentr.getAttribute('tabindex'), '0', `Selected tab must own the tab stop at ${viewport.name}`);

    if (viewport.width === 390 || viewport.width === 320) {
      const positions = await page.locator('.gate').evaluateAll((nodes) => nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width) };
      }));
      const columns = new Set(positions.map((item) => item.x)).size;
      assert.equal(columns, viewport.width === 390 ? 2 : 1, `Handheld gate composition must be deliberate at ${viewport.name}`);
      assert.ok(positions.every((item) => item.width >= 120), `Handheld gates must remain readable at ${viewport.name}`);
    }
  } else {
    const download = page.locator('.doc-actions a[download]');
    assert.equal(await download.count(), 1, `${route} must expose one native PDF download at ${viewport.name}`);
    assert.ok(await download.isVisible(), `${route} download must be visible at ${viewport.name}`);
    assert.match(await page.locator('body').innerText(), /https:\/\/russelldudek\.github\.io\/TwoSix\//, `${route} must display the complete candidate-vision URL at ${viewport.name}`);

    if (route === 'resume.html') assert.equal(await page.locator('.doc-actions a[href="cover-letter.html"]').count(), 1);
    if (route === 'cover-letter.html') assert.equal(await page.locator('.doc-actions a[href="resume.html"]').count(), 1);

    const overlaps = await page.locator('.sheet').evaluateAll((sheets) => sheets.map((sheet) => {
      const footer = sheet.querySelector('.page-footer');
      if (!footer || getComputedStyle(footer).position !== 'absolute') return 0;
      const footerTop = footer.getBoundingClientRect().top;
      const visibleDescendants = [...sheet.querySelectorAll('*')].filter((node) => {
        if (node === footer || footer.contains(node) || node.closest('.screen-only')) return false;
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
      });
      const contentBottom = visibleDescendants.reduce((max, node) => Math.max(max, node.getBoundingClientRect().bottom), sheet.getBoundingClientRect().top);
      return Math.max(0, Math.ceil(contentBottom - footerTop));
    }));
    assert.ok(overlaps.every((amount) => amount <= 1), `${route} nested content must not collide with absolute footers at ${viewport.name}: ${overlaps}`);
  }

  await page.close();
}

for (const viewport of viewports) {
  for (const route of routes) await auditRoute(route, viewport);
}

const reduced = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
await reduced.goto(`${origin}/index.html`, { waitUntil: 'networkidle' });
await reduced.locator('[data-scenario="sigma"]').click();
assert.equal((await reduced.locator('#decision-name').innerText()).trim(), 'PRODUCTIZE');
assert.equal(await reduced.locator('.sync-board').evaluate((node) => node.classList.contains('is-running')), false, 'Reduced motion must resolve immediately');
assert.deepEqual(await reduced.locator('.gate-state').allInnerTexts(), ['Field evidence', 'Aligned', 'Repeatability proof', 'Aligned']);
await reduced.close();

for (const route of routes.filter((route) => route !== 'index.html')) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(`${origin}/${route}`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  const pageUse = await page.locator('.sheet:not(.dark-cover)').evaluateAll((sheets) => sheets.map((sheet) => {
    const footer = sheet.querySelector('.page-footer');
    if (!footer) return { gap: 0, overlap: 0 };
    const footerTop = footer.getBoundingClientRect().top;
    const visibleDescendants = [...sheet.querySelectorAll('*')].filter((node) => {
      if (node === footer || footer.contains(node) || node.closest('.screen-only')) return false;
      const style = getComputedStyle(node);
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
    });
    const contentBottom = visibleDescendants.reduce((max, node) => Math.max(max, node.getBoundingClientRect().bottom), sheet.getBoundingClientRect().top);
    return {
      gap: Math.max(0, Math.round(footerTop - contentBottom)),
      overlap: Math.max(0, Math.round(contentBottom - footerTop))
    };
  }));
  assert.ok(pageUse.every(({ overlap }) => overlap <= 1), `${route} print descendants must not overlap the footer: ${JSON.stringify(pageUse)}`);
  assert.ok(pageUse.every(({ gap }) => gap <= 264), `${route} ordinary print pages must not leave more than roughly 25% unused height: ${JSON.stringify(pageUse)}`);
  await page.close();
}

await browser.close();
await new Promise((resolve) => server.close(resolve));
console.log('Two Six rendered browser audit passed');
