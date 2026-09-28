import { test, expect } from '@playwright/test';
const galleries = [
  ['kingdom-td', 4],
  ['lone-survivors', 4],
  ['boulderlog', 6],
  ['shelf-and-score', 3],
  ['deconstructor', 3],
  ['forge-upgrades', 3],
  ['mine-it-all', 2],
  ['necesse-power', 4],
  ['meccha-mcjannek-station', 3],
  ['meccha-swiftbroom', 4],
] as const;

test('authentic galleries load without cropping or broken full-size links', async ({
  page,
  request,
}) => {
  for (const [slug, count] of galleries) {
    await page.goto(`/projects/${slug}/`);
    const gallery = page.locator('#screenshots');
    await expect(gallery.locator('figure')).toHaveCount(count);
    for (const image of await gallery.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await expect(image).toHaveCSS('object-fit', 'contain');
      await expect(image).toHaveAttribute('alt', /.+/);
    }
    for (const link of await gallery.locator('a').all()) {
      const response = await request.get((await link.getAttribute('href'))!);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/');
    }
  }
  await page.locator('#screenshots a').first().click();
  await expect(page).toHaveURL(/\/_astro\/.+\.webp$/);
  await page.goBack();
  await expect(page.locator('#screenshots')).toBeVisible();
});

test('screenshot navigation and browser Back work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/projects/shelf-and-score/');
  await page.getByRole('link', { name: 'Screenshots', exact: true }).click();
  await expect(page).toHaveURL(/#screenshots$/);
  const imageLink = page.locator('#screenshots a').first();
  const imageUrl = await imageLink.getAttribute('href');
  await imageLink.click();
  expect(new URL(page.url()).pathname).toBe(imageUrl);
  await page.goBack();
  await expect(page.locator('#screenshots')).toBeVisible();
  await expect(page.locator('#screenshots figcaption').first()).toContainText(
    'sample data',
  );
  await page.goto('http://127.0.0.1:4321/projects/minecraft-enderman/');
  await expect(page.locator('#screenshots')).toHaveCount(0);
  await context.close();
});
