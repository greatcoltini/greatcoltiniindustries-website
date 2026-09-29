import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = 'dist';
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const html = walk(root).filter((f) => f.endsWith('.html'));
// Former section URLs (see astro.config.mjs) are meta-refresh redirects to the home page.
const redirects = ['games', 'apps', 'mods', 'about'];
const failures = [];
for (const section of redirects) {
  const file = join(root, section, 'index.html');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (!text.includes(`url=/#${section}`))
    failures.push(`${file}: missing redirect to /#${section}`);
}
for (const file of html) {
  const text = readFileSync(file, 'utf8');
  if (text.includes('http-equiv="refresh"')) continue;
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
  const socialImage = text.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (!socialImage || !existsSync(join(root, new URL(socialImage).pathname)))
    failures.push(`${file}: missing social preview image`);
  if (!text.includes('rel="canonical"') || !text.includes('name="description"'))
    failures.push(`${file}: missing metadata`);
}
// Projects, plus Home, Dev log, 404, and the redirect pages.
const expectedPages =
  walk('src/content/projects').filter((file) => file.endsWith('.md')).length +
  3 +
  redirects.length;
if (html.length !== expectedPages)
  failures.push(`Expected ${expectedPages} HTML pages, found ${html.length}`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Checked ${html.length} static pages: internal links, local assets, anchors, and metadata OK.`,
);
