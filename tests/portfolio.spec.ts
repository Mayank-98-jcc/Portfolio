import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('responsive page loads without runtime errors, broken images or overflowing text', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mayank', {
    ignoreCase: true,
  });
  await page.evaluate(() => document.fonts.ready);
  for (const id of ['about', 'skills', 'projects', 'education', 'learning', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll((elements) =>
          elements.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBeTruthy();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test('project modal traps focus, preserves truthful status and restores focus and scrolling', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'View CodeMentor AI project details' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('In Progress', { exact: true })).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Planned capabilities' })).toBeVisible();
  await expect(dialog.getByText('Currently in development', { exact: true })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'View Live Project' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Close project details' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBeTruthy();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).overflowY)).not.toBe(
    'hidden',
  );
});

test('unprovided credentials and resume are not presented as real', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/resume.pdf"]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /download resume/i })).toHaveCount(0);
  await expect(page.locator('#achievements')).toHaveCount(0);
});

test('mobile navigation traps focus, closes, restores scrolling and reaches Work', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const dialog = page.locator('#mobile-menu');
  await expect(dialog).toBeVisible();
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).overflowY)).toBe(
    'hidden',
  );
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBeTruthy();
  await dialog.getByRole('link', { name: /Work/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#projects$/);
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).overflowY)).not.toBe(
    'hidden',
  );
  await expect(page.locator('#projects')).toBeInViewport();
});

test('reduced motion skips the preloader and keeps all content available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.preloader')).toBeHidden();
  await expect(page.locator('.custom-cursor')).toBeHidden();
  await expect(page.locator('.hero-portrait img')).toBeVisible();
  await expect(page.locator('.hero-name')).toBeVisible();
  expect(
    await page
      .locator('.status-dot')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
});

test('preloader completes and gallery controls reveal the next project screenshot', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.preloader')).toBeHidden({ timeout: 5000 });
  const track = page.locator('.workspace-track');
  await track.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Next project screenshot' }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(10);
  await page.getByRole('button', { name: 'Previous project screenshot' }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(5);
});

test('page and project dialog meet automated WCAG A and AA checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole('button', { name: 'View ResumeIQ project details' }).click();
  const modalResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(modalResults.violations).toEqual([]);
});

test('tablet and intermediate widths keep hero text within the viewport', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chrome');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const width of [320, 360, 390, 600, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(() => {
        const heading = document.querySelector('.hero-name')!.getBoundingClientRect();
        return (
          document.documentElement.scrollWidth <= innerWidth &&
          heading.right <= innerWidth &&
          heading.left >= 0
        );
      }),
      `Overflow at ${width}px`,
    ).toBeTruthy();
  }
});
