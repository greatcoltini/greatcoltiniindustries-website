import { readdirSync, readFileSync } from 'node:fs';
const dir = 'src/content/projects';
const urls = [
  ...new Set(
    readdirSync(dir).flatMap((f) =>
      [
        ...readFileSync(`${dir}/${f}`, 'utf8').matchAll(
          /url: (https:\/\/\S+)/g,
        ),
      ].map((m) => m[1]),
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
