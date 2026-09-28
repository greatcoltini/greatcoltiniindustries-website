import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('theme follows the browser and remembers explicit overrides', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const theme = page.getByRole('combobox', { name: 'Color theme' });
  const scheme = () =>
    page.locator('html').evaluate((root) => getComputedStyle(root).colorScheme);
  await expect(theme).toHaveValue('system');
  expect(await scheme()).toBe('dark');
  await page.emulateMedia({ colorScheme: 'light' });
  expect(await scheme()).toBe('light');
  await theme.selectOption('dark');
  expect(await scheme()).toBe('dark');
  await page.goto('/projects/kingdom-td/');
  await expect(theme).toHaveValue('dark');
  expect(await scheme()).toBe('dark');
  await theme.selectOption('light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  expect(await scheme()).toBe('light');
  await expect(theme).toHaveValue('light');
  await theme.selectOption('system');
  expect(await scheme()).toBe('dark');
  expect(
    await page.evaluate(() => localStorage.getItem('gci-theme')),
  ).toBeNull();
});

test('dark theme remains accessible across pages and small screens', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/games/',
      '/apps/',
      '/mods/',
      '/about/',
      '/projects/kingdom-td/',
      '/projects/boulderlog/',
      '/projects/deconstructor/',
    ]) {
      await page.goto(route);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(result.violations, `${route} at ${width}`).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
    }
  }
});

test('system dark mode works without JavaScript or available storage', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  expect(
    await page
      .locator('html')
      .evaluate((root) => getComputedStyle(root).colorScheme),
  ).toBe('dark');
  await expect(
    page.getByRole('combobox', { name: 'Color theme' }),
  ).toBeHidden();
  await context.close();
  const blocked = await browser.newContext({ colorScheme: 'light' });
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage unavailable');
      },
    });
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto('http://127.0.0.1:4321/');
  await blockedPage
    .getByRole('combobox', { name: 'Color theme' })
    .selectOption('dark');
  expect(
    await blockedPage
      .locator('html')
      .evaluate((root) => getComputedStyle(root).colorScheme),
  ).toBe('dark');
  await blocked.close();
});
