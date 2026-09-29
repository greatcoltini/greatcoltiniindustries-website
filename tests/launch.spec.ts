import { test, expect } from '@playwright/test';

test('Kingdom TD shows its road to launch and ends with its Steam action', async ({
  page,
}) => {
  await page.goto('/');
  const next = page.getByRole('link', { name: /^Next up: Public demo/ });
  await expect(next).toHaveAttribute('href', '/projects/kingdom-td/#launch');
  await next.click();
  await expect(page).toHaveURL(/\/projects\/kingdom-td\/#launch$/);
  const band = page.locator('#launch');
  await expect(band).toBeInViewport();
  await expect(band.getByRole('heading', { level: 2 })).toHaveText(
    'Kingdom TD',
  );
  await expect(band.locator('.roadmap-step')).toHaveCount(5);
  await expect(band.locator('.roadmap-next')).toHaveCount(1);
  await expect(band.locator('.roadmap-next')).toContainText('Public demo');
  // Completed steps link to their public sources.
  for (const step of await band.locator('.roadmap-done').all())
    await expect(step.getByRole('link')).toHaveAttribute('href', /^https:\/\//);
  await expect(
    band.getByRole('link', { name: /Wishlist on Steam/ }),
  ).toHaveAttribute('href', /store\.steampowered\.com\/app\/4990780\//);
  await expect(
    page
      .getByRole('navigation', { name: 'On this project page' })
      .getByRole('link', { name: 'Road to launch' }),
  ).toHaveAttribute('href', '#launch');
});

test('released games end with their store action and no road to launch', async ({
  page,
}) => {
  await page.goto('/projects/lone-survivors/');
  const band = page.locator('.closing-cta');
  await expect(band).toBeVisible();
  await expect(
    band.getByRole('link', { name: /View on Steam/ }),
  ).toHaveAttribute('href', /store\.steampowered\.com\/app\/3629280\//);
  await expect(page.locator('#launch, .roadmap')).toHaveCount(0);
  await page.goto('/projects/deconstructor/');
  await expect(page.locator('.closing-cta')).toHaveCount(0);
});

test('pixel-art artwork keeps hard edges and replaces the placeholder', async ({
  page,
}) => {
  await page.goto('/projects/minecraft-enderman/');
  await expect(page.locator('.mod-placeholder')).toHaveCount(0);
  const art = page.locator('.detail-media .project-art img');
  await expect(art).toHaveAttribute('alt', /Enderman/);
  expect(
    await art.evaluate((img) => getComputedStyle(img).imageRendering),
  ).toBe('pixelated');
  await page.goto('/#mods');
  const tile = page.locator('a[href="/projects/minecraft-enderman/"] img');
  expect(
    await tile.evaluate((img) => getComputedStyle(img).imageRendering),
  ).toBe('pixelated');
});
