import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = [
  '/',
  '/games/',
  '/apps/',
  '/mods/',
  '/about/',
  '/projects/kingdom-td/',
  '/projects/boulderlog/',
  '/projects/shelf-and-score/',
  '/projects/deconstructor/',
  '/projects/meccha-swiftbroom/',
];
for (const width of [320, 390, 768, 1024, 1440]) {
  test(`responsive pages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      await expect(
        page.getByRole('navigation', { name: 'Main navigation' }),
      ).toBeVisible();
      for (const name of ['Games', 'Apps', 'Mods', 'About'])
        await expect(
          page
            .getByRole('navigation', { name: 'Main navigation' })
            .getByRole('link', { name, exact: true }),
        ).toBeVisible();
      const broken = await page
        .locator('img')
        .evaluateAll(
          (images) =>
            images.filter(
              (i) =>
                i instanceof HTMLImageElement &&
                i.complete &&
                i.naturalWidth === 0,
            ).length,
        );
      expect(broken, route).toBe(0);
    }
  });
}
test('automated accessibility', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, route).toEqual([]);
  }
});
test('keyboard navigation and browser history', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit' && process.platform === 'win32',
    'Windows headless WebKit reports document.hasFocus() false; validate keyboard traversal on Linux CI.',
  );
  await page.goto('/');
  await page.bringToFront();
  await page.keyboard.press('Tab');
  await expect(
    page.getByText('Skip to content', { exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Apps', exact: true })
    .click();
  await expect(page).toHaveURL(/\/#apps$/);
  await expect(page.locator('[aria-current="location"]')).toHaveText('Apps');
  await page.goBack();
  await expect(page).toHaveURL(/\/#main$/);
});
test('works without JavaScript and with reduced motion', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  const projectLinks = await page
    .locator('a[href^="/projects/"]')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => link.getAttribute('href'))),
    ]);
  expect(projectLinks).toHaveLength(13);
  expect(projectLinks).toEqual(
    expect.arrayContaining([
      '/projects/meccha-mcjannek-station/',
      '/projects/meccha-swiftbroom/',
    ]),
  );
  for (const name of ['Games', 'Apps', 'Mods', 'About']) {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp('#' + name.toLowerCase() + '$'));
    await expect(page.locator('#' + name.toLowerCase())).toBeVisible();
  }
  await page
    .getByRole('link', { name: 'Explore Kingdom TD', exact: true })
    .click();
  await expect(page.getByRole('link', { name: 'View on Steam' })).toBeVisible();
  await page.getByRole('link', { name: 'Development', exact: true }).click();
  await expect(page).toHaveURL(/#development$/);
  await page.getByText('Watch gameplay trailer', { exact: true }).click();
  await expect(
    page.getByRole('link', { name: 'Open the gameplay trailer' }),
  ).toHaveAttribute('href', '/media/kingdom-td-gameplay.mp4');
  await page.goto('http://127.0.0.1:4321/about/');
  await expect(
    page.getByRole('link', { name: 'coltonmdonk@gmail.com' }),
  ).toHaveAttribute('href', 'mailto:coltonmdonk@gmail.com');
  await context.close();
});
test('200% text and landscape do not overflow', async ({ page }) => {
  for (const width of [390, 844, 1440]) {
    await page.setViewportSize({ width, height: 390 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => {
        const sizes = [...document.querySelectorAll<HTMLElement>('body *')].map(
          (el) => ({ el, size: parseFloat(getComputedStyle(el).fontSize) }),
        );
        sizes.forEach(({ el, size }) => (el.style.fontSize = `${size * 2}px`));
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} ${width}: ${await page.locator('body *').evaluateAll((els) =>
          els
            .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
            .map((el) => el.tagName + '.' + el.className)
            .join(', '),
        )}`,
      ).toBe(true);
    }
  }
});
test('trailer loads only on request', async ({ page }) => {
  const media: string[] = [];
  page.on('request', (r) => {
    if (r.url().endsWith('.mp4')) media.push(r.url());
  });
  await page.goto('/projects/kingdom-td/');
  await expect(page.locator('video')).toBeHidden();
  expect(media).toEqual([]);
  await page.getByText('Watch gameplay trailer', { exact: true }).click();
  await expect(page.locator('video')).toBeVisible();
  await expect(page.locator('video')).toHaveAttribute(
    'src',
    '/media/kingdom-td-gameplay.mp4',
  );
  await expect(page.locator('video')).not.toHaveAttribute('autoplay');
});

test('mod groups use the requested popularity order on both pages', async ({
  page,
}) => {
  for (const route of ['/', '/mods/']) {
    await page.goto(route);
    expect(
      await page
        .locator('.game-heading')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute('aria-label')),
        ),
    ).toEqual(['Meccha Chameleon', 'R.E.P.O.', 'Valheim', 'Necesse']);
  }
});
