import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
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
    // Galleries of six or fewer show every screenshot without a disclosure.
    await expect(gallery.locator('figure:visible')).toHaveCount(count);
    await expect(gallery.locator('summary')).toHaveCount(0);
    for (const image of await gallery.locator('figure img').all()) {
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
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
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
  await expect(page.locator('#screenshots figure:visible')).toHaveCount(3);
  const imageLink = page.locator('#screenshots a').last();
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

test('viewer supports keyboard, focus return, captions and accessible themes', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit' && process.platform === 'win32',
    'Windows WebKit does not expose document focus; covered on Linux CI.',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects/boulderlog/');
  const opener = page.locator('#screenshots a').first();
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.getByRole('status')).toHaveText('6 of 6');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('status')).toHaveText('1 of 6');
  await dialog.getByRole('button', { name: 'Next screenshot' }).click();
  await expect(dialog.getByRole('status')).toHaveText('2 of 6');
  await expect(dialog.locator('img')).toHaveAttribute(
    'alt',
    (await page.locator('#screenshots a').nth(1).getAttribute('data-alt')) ||
      '',
  );
  await expect(dialog.locator('#viewer-caption')).toHaveText(
    (await page
      .locator('#screenshots a')
      .nth(1)
      .getAttribute('data-caption')) || '',
  );
  await page.keyboard.press('Tab');
  expect(
    await page.evaluate(() => !!document.activeElement?.closest('dialog')),
  ).toBe(true);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page).toHaveURL(/projects\/boulderlog\/$/);
  const order = await page
    .locator('#overview,#features,#screenshots,#development')
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(order).toEqual(['overview', 'features', 'screenshots', 'development']);
});
