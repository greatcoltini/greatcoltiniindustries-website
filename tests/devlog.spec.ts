import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const saved = JSON.parse(readFileSync('src/data/updates.json', 'utf8'));

test('dev log opens as a sidebar from any page and remembers it was read', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit' && process.platform === 'win32',
    'Windows WebKit does not expose document focus; covered on Linux CI.',
  );
  await page.goto('/projects/kingdom-td/');
  const toggle = page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: /Dev log/ });
  await expect(toggle).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(toggle.locator('.devlog-dot')).toBeVisible();
  await toggle.click();
  const panel = page.getByRole('dialog', { name: /working on/i });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Close' })).toBeFocused();
  await expect(panel.locator('.devlog-entry').first()).toBeVisible();
  await panel.evaluate((dialog) =>
    Promise.all(dialog.getAnimations().map((animation) => animation.finished)),
  );
  // axe spots a modal dialog by probing 10px above its top-left corner, which is
  // off-screen for this full-height panel. Its fallback differs between engines,
  // and on Linux WebKit it can scan the inert page behind the backdrop, so check
  // the panel itself. The route tests check every page with the panel closed.
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    const result = await new AxeBuilder({ page })
      .include('#devlog-panel')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const found = result.violations.map(
      (violation) =>
        `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
    );
    expect(found, colorScheme).toEqual([]);
  }
  await panel.getByRole('button', { name: 'Mods' }).click();
  await expect(panel.getByRole('button', { name: 'Mods' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const categories = await panel
    .locator('.devlog-entry:visible')
    .evaluateAll((entries) =>
      entries.map((entry) => (entry as HTMLElement).dataset.category),
    );
  expect(categories.length).toBeGreaterThan(0);
  expect(new Set(categories)).toEqual(new Set(['mods']));
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(toggle.locator('.devlog-dot')).toBeHidden();
  await page.reload();
  await expect(toggle.locator('.devlog-dot')).toBeHidden();
});

test('home Latest strip opens the dev log', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Open dev log' }).click();
  await expect(page.getByRole('dialog', { name: /working on/i })).toBeVisible();
  // Entry titles lead to the project page's changelog entry.
  const href = await page
    .locator('#devlog-panel .devlog-title a')
    .first()
    .getAttribute('href');
  expect(href).toMatch(/^\/projects\/[a-z0-9-]+\/(#update-[a-z0-9-]+)?$/);
});

test('dev log works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await page.getByRole('link', { name: 'Open dev log' }).click();
  await expect(page).toHaveURL(/\/devlog\/$/);
  await page.goto('http://127.0.0.1:4321/projects/lone-survivors/');
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: /Dev log/ })
    .click();
  await expect(page).toHaveURL(/\/devlog\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /working on/i,
  );
  await expect(page.locator('.devlog-month').first()).toBeVisible();
  expect(await page.locator('.devlog-entry').count()).toBeGreaterThan(0);
  await context.close();
});

test('saved Bluesky posts appear in the full dev log', async ({ page }) => {
  const posts: { url: string }[] = saved.bluesky?.posts ?? [];
  test.skip(posts.length === 0, 'No Bluesky posts have been saved yet.');
  await page.goto('/devlog/');
  const hrefs = await page
    .locator('.devlog-entry a[href^="https://bsky.app/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  // Only posts the poller kept (never reposts or replies) are linked.
  for (const href of hrefs)
    expect(posts.map((post) => post.url)).toContain(href);
});
