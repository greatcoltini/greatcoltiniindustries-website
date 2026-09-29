import { readdir, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
const folder = 'src/content/projects';
const output = 'public/social';
await mkdir(output, { recursive: true });
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const field = (text, key) => {
  const value = text.match(new RegExp(`^${key}: (.+)$`, 'm'))?.[1]?.trim();
  if (!value) return undefined;
  if (value.startsWith('"')) return JSON.parse(value);
  return value.startsWith("'")
    ? value.slice(1, -1).replaceAll("''", "'")
    : value;
};
const wrap = (title, max = 19) => {
  const lines = [''];
  for (const word of title.split(' ')) {
    const last = lines.length - 1;
    if (lines[last] && `${lines[last]} ${word}`.length > max) lines.push(word);
    else lines[last] += (lines[last] ? ' ' : '') + word;
  }
  return lines;
};
async function create(slug, title, category, artwork, pixelArt = false) {
  const lines = wrap(title);
  const fontSize = lines.some((line) => line.length > 21) ? 40 : 48;
  const svg =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#fafaf7"/><rect x="650" width="550" height="630" fill="#1748ee"/>
    <text x="58" y="70" font-family="Arial,sans-serif" font-weight="bold" font-size="21" fill="#1748ee">GREATCOLTINI INDUSTRIES</text>
    <text x="58" y="169" font-family="Arial,sans-serif" font-size="19" fill="#545654">${escape(category.toUpperCase())}</text>
    ${lines.map((line, index) => `<text x="58" y="${242 + index * 62}" font-family="Arial,sans-serif" font-weight="bold" font-size="${fontSize}" fill="#171817">${escape(line)}</text>`).join('')}
    <text x="58" y="554" font-family="Arial,sans-serif" font-size="20" fill="#545654">BY COLTON DONKERSGOED</text>
    ${!artwork ? '<text x="706" y="335" font-family="Arial,sans-serif" font-size="66" font-weight="bold" fill="white">PLAY. MAKE.</text><text x="706" y="415" font-family="Arial,sans-serif" font-size="66" font-weight="bold" fill="white">REPEAT.</text>' : ''}
  </svg>`);
  const overlays = artwork
    ? [
        {
          input: await sharp(artwork)
            .resize(486, 510, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
              // Pixel art keeps its hard edges when enlarged.
              ...(pixelArt && { kernel: 'nearest' }),
            })
            .png()
            .toBuffer(),
          left: 682,
          top: 60,
        },
      ]
    : [];
  await sharp(svg)
    .composite(overlays)
    .jpeg({ quality: 88 })
    .toFile(`${output}/${slug}.jpg`);
}
await create('portfolio', 'Games, Apps & Mods', 'Personal projects');
for (const file of await readdir(folder)) {
  if (!file.endsWith('.md')) continue;
  const path = `${folder}/${file}`;
  const text = (await readFile(path, 'utf8')).split(/^---\s*$/m)[1];
  const art = field(text, 'artwork');
  await create(
    file.slice(0, -3),
    field(text, 'title'),
    field(text, 'category'),
    art ? resolve(dirname(path), art) : undefined,
    field(text, 'pixelArt') === 'true',
  );
}
console.log('Generated social cards for the portfolio and every project.');
