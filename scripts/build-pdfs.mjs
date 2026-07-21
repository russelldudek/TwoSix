import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const output = path.join(root, 'docs');
await mkdir(output, { recursive: true });

const jobs = [
  ['resume.html', 'Russell-Dudek-Two-Six-Technologies-Resume.pdf'],
  ['cover-letter.html', 'Russell-Dudek-Two-Six-Technologies-Cover-Letter.pdf'],
  ['interview-brief.html', 'Russell-Dudek-Two-Six-Interview-Thesis-Brief.pdf'],
  ['120-day-plan.html', 'Russell-Dudek-Two-Six-120-Day-Entry-Plan.pdf'],
  ['mission-window-review.html', 'Russell-Dudek-Two-Six-Mission-Window-Review.pdf'],
  ['index.html', 'Russell-Dudek-Two-Six-Candidate-Campaign.pdf']
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();

for (const [source, target] of jobs) {
  const page = await context.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(pathToFileURL(path.join(root, source)).href, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: path.join(output, target),
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await page.close();
}

await browser.close();
