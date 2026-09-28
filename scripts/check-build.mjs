import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = 'dist';
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const html = walk(root).filter((f) => f.endsWith('.html'));
const failures = [];
for (const file of html) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    const [path, hash] = url.split('#');
    const target = path
      ? join(root, path.endsWith('/') ? `${path}index.html` : path)
      : file;
    if (!existsSync(target)) failures.push(`${file}: missing ${url}`);
    else if (
      hash &&
      target.endsWith('.html') &&
      !readFileSync(target, 'utf8').includes(`id="${hash}"`)
    )
      failures.push(`${file}: missing anchor ${url}`);
  }
  if (!text.includes('rel="canonical"') || !text.includes('name="description"'))
    failures.push(`${file}: missing metadata`);
}
const expectedPages =
  walk('src/content/projects').filter((file) => file.endsWith('.md')).length +
  6;
if (html.length !== expectedPages)
  failures.push(`Expected ${expectedPages} HTML pages, found ${html.length}`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Checked ${html.length} static pages: internal links, local assets, anchors, and metadata OK.`,
);
