import { readdirSync, readFileSync } from 'node:fs';
const dir = 'src/content/projects';
const sources = [
  ...readdirSync(dir).map((f) => `${dir}/${f}`),
  'src/lib/profiles.ts',
];
const urls = [
  ...new Set(
    sources.flatMap((file) =>
      [
        ...readFileSync(file, 'utf8').matchAll(
          /url: ['"]?(https:\/\/[^\s'"]+)/g,
        ),
      ].map((m) => m[1].split('#')[0]),
    ),
  ),
];
let failed = false;
for (const url of urls) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    console.log(`${r.status} ${url}`);
    if (!r.ok) failed = true;
  } catch (e) {
    console.error(`${url}: ${e.message}`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
