import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = process.cwd();
const internalName = ['role', 'forge'].join('');
const retiredTerm = ['man', 'date'].join('');
const campaignUrl = 'russelldudek.github.io/TwoSix/';

const jobs = [
  ['Russell-Dudek-Two-Six-Technologies-Resume.pdf', 2],
  ['Russell-Dudek-Two-Six-Technologies-Cover-Letter.pdf', 1],
  ['Russell-Dudek-Two-Six-Interview-Thesis-Brief.pdf', 4],
  ['Russell-Dudek-Two-Six-120-Day-Entry-Plan.pdf', 3],
  ['Russell-Dudek-Two-Six-Mission-Window-Review.pdf', 2],
  ['Russell-Dudek-Two-Six-Candidate-Campaign.pdf', null]
];

for (const [filename, expectedPages] of jobs) {
  const bytes = await readFile(path.join(root, 'docs', filename));
  assert.ok(bytes.byteLength > 10_000, `${filename} must be a substantive PDF`);

  const document = await getDocument({ data: new Uint8Array(bytes), disableWorker: true }).promise;
  if (expectedPages !== null) assert.equal(document.numPages, expectedPages, `${filename} page count`);

  const pageText = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pageText.push(content.items.map((item) => item.str).join(' '));
  }
  const text = pageText.join('\n');
  assert.match(text, new RegExp(campaignUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `${filename} must print the complete candidate-vision URL`);
  assert.doesNotMatch(text, new RegExp(internalName, 'i'), `${filename} must not expose internal process attribution`);
  assert.doesNotMatch(text, new RegExp(`\\b${retiredTerm}\\b`, 'i'), `${filename} must use current actual-work terminology`);

  const metadata = await document.getMetadata().catch(() => ({ info: {}, metadata: null }));
  const metadataText = JSON.stringify(metadata.info ?? {});
  assert.doesNotMatch(metadataText, new RegExp(internalName, 'i'), `${filename} metadata must not expose internal process attribution`);

  await document.destroy();
}

console.log('Two Six generated PDF audit passed');
