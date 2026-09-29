import { test, expect } from '@playwright/test';
for (const width of [390, 1200, 1440]) {
  test(`version history is usable without JavaScript at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/projects/lone-survivors/');
    const updates = page.getByRole('complementary', {
      name: 'Version updates',
    });
    await expect(updates).toBeVisible();
    await expect(updates.locator('details[open]')).toHaveCount(1);
    await expect(updates.locator('details').first()).toHaveAttribute('open');
    // The curated history stays last and in order; polled releases newer than
    // it may appear above it, so this must not assume a fixed total.
    const dates = await updates.locator('time').allTextContents();
    expect(dates.slice(-4)).toEqual([
      '10 Aug 2026',
      '12 Jul 2026',
      '29 Jun 2026',
      '27 Jun 2026',
    ]);
    // A release that is both curated and polled is listed once.
    const sources = await updates
      .locator('.update-source')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')!.match(/\d{10,}/)?.[0]),
      );
    expect(new Set(sources).size).toBe(sources.length);
    const main = await page.locator('.project-main-content').boundingBox();
    const side = await updates.boundingBox();
    if (width >= 1200) expect(side!.x).toBeGreaterThan(main!.x + main!.width);
    else expect(side!.y).toBeGreaterThanOrEqual(main!.y + main!.height);
    await page.getByRole('link', { name: 'Updates', exact: true }).click();
    await expect(page).toHaveURL(/#updates$/);
    const older = updates.locator('#update-v1-2-9');
    await older.locator('summary').click();
    await expect(older.locator('.update-content')).toBeVisible();
    await older.getByRole('link', { name: /Link to update/ }).click();
    await expect(page).toHaveURL(/#update-v1-2-9$/);
    await page.reload();
    await expect(older.locator('summary')).toBeInViewport();
    await page.goto('http://127.0.0.1:4321/projects/shelf-and-score/');
    await expect(page.locator('#updates')).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Updates', exact: true }),
    ).toHaveCount(0);
    await context.close();
  });
}
