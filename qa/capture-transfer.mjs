import assert from 'node:assert/strict';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = process.cwd();
const output = path.join(root, 'qa-artifacts');
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const targets = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } }
];

for (const target of targets) {
  const page = await browser.newPage({ viewport: target.viewport });
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'load' });
  await page.addStyleTag({ content: '.site-header { display: none !important; }' });
  const transfer = page.locator('.transfer-section');
  assert.equal(await transfer.count(), 1, `${target.name} transfer section must exist`);
  const destination = path.join(output, `transfer-${target.name}.png`);
  await transfer.screenshot({ path: destination });
  const details = await stat(destination);
  assert.ok(details.size > 10_000, `${target.name} transfer screenshot must be substantive`);
  console.log(`${target.name}: ${destination} (${details.size} bytes)`);
  await page.close();
}

await browser.close();
console.log('Two Six transfer visual-review screenshots captured');
