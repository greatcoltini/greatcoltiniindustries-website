import { mkdir, writeFile } from 'node:fs/promises';
const folder = 'src/assets/screenshots';
await mkdir(folder, { recursive: true });
const collected = [];
const games = [
  ['kingdom-td', '4990780'],
  ['lone-survivors', '3629280'],
];
for (const [slug, id] of games) {
  const json = await (
    await fetch(`https://store.steampowered.com/api/appdetails?appids=${id}`)
  ).json();
  for (const [i, shot] of json[id].data.screenshots.slice(0, 4).entries()) {
    const url = shot.path_full;
    const filename = `${slug}-${i + 1}.jpg`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    await writeFile(
      `${folder}/${filename}`,
      Buffer.from(await response.arrayBuffer()),
    );
    collected.push({
      slug,
      filename,
      url,
      source: `https://store.steampowered.com/app/${id}/`,
    });
  }
}
const mods = [
  ['deconstructor', '3730900523'],
  ['forge-upgrades', '3731042527'],
  ['mine-it-all', '3730263197'],
  ['necesse-power', '3732508344'],
  ['meccha-mcjannek-station', '3759385002'],
  ['meccha-swiftbroom', '3755237299'],
];
for (const [slug, id] of mods) {
  const source = `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`;
  const html = await (await fetch(source)).text();
  const block =
    html.match(/var rgFullScreenshotURLs = (\[[\s\S]*?\]);/)?.[1] || '';
  const urls = [...block.matchAll(/'url':\s*'([^']+)'/g)].map((m) => m[1]);
  console.log(`${slug}: ${urls.length} gallery images`);
  for (const [i, url] of urls.slice(0, 4).entries()) {
    const filename = `${slug}-${i + 1}.jpg`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    await writeFile(
      `${folder}/${filename}`,
      Buffer.from(await response.arrayBuffer()),
    );
    collected.push({ slug, filename, url, source });
  }
}
await writeFile(
  'docs/screenshot-sources.json',
  JSON.stringify(collected, null, 2) + '\n',
);
console.log(`Saved ${collected.length} original listing images for review.`);
