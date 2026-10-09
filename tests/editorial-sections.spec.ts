import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('skill categories reveal useful context with keyboard and pointer input', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const categories = page.locator('.skill-row');
  await expect(categories).toHaveCount(6);
  for (const row of await categories.all()) {
    const summary = row.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(row).toHaveAttribute('open');
    await expect(row.locator('.skill-detail')).toBeVisible();
    expect(await row.locator('dt').count()).toBeGreaterThan(2);
    await page.keyboard.press('Space');
    await expect(row).not.toHaveAttribute('open');
    await expect(row.locator('.skill-detail')).toBeHidden();
  }
  await categories.nth(4).locator('summary').click();
  await expect(categories.nth(4).locator('.skill-detail')).toContainText(
    'Exploring AI-powered applications',
  );
  const result = await new AxeBuilder({ page })
    .include('#skills')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact-title')).toBeVisible();
});

test('building timeline and gallery use real content and remain available without motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#process').scrollIntoViewIfNeeded();
  await expect(page.locator('.process-step h3')).toHaveText([
    'Discover',
    'Design',
    'Develop',
    'Refine',
  ]);
  for (const step of await page.locator('.process-step').all()) await expect(step).toBeVisible();
  const gallery = page.locator('.workspace-track');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator('figure')).toHaveCount(2);
  await expect(gallery.locator('img').first()).toHaveAttribute(
    'src',
    '/images/projects/resumeiq/preview.png',
  );
  await expect(gallery.locator('img').last()).toHaveAttribute(
    'src',
    '/images/projects/oceanxplore/preview.png',
  );
  await page.getByRole('button', { name: 'Next project screenshot' }).click();
  await expect.poll(() => gallery.evaluate((e) => e.scrollLeft)).toBeGreaterThan(10);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test('motion initializes against mounted elements and reveals the building timeline', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('console', (message) => {
    if (['warning', 'error'].includes(message.type())) errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.preloader')).toBeHidden({ timeout: 5000 });
  await expect(page.locator('.name-line-inner').first()).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 0, 0)',
  );
  await page.locator('#process').scrollIntoViewIfNeeded();
  for (const step of await page.locator('.process-step').all())
    await expect(step).toHaveCSS('opacity', '1');
  await expect
    .poll(() =>
      page
        .locator('.process-timeline')
        .evaluate((e) => Number(getComputedStyle(e).getPropertyValue('--timeline-progress'))),
    )
    .toBe(1);
  expect(errors).toEqual([]);
});
