import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('contact scene loads near the section, draws, pauses, and recovers its CSS fallback', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.addInitScript(() => {
    const prototype = WebGL2RenderingContext.prototype;
    const original = prototype.drawElements;
    prototype.drawElements = function (...args) {
      const canvas = this.canvas as HTMLCanvasElement;
      if (canvas.closest('.contact-webgl'))
        canvas.dataset.draws = String(Number(canvas.dataset.draws ?? 0) + 1);
      return original.apply(this, args);
    };
  });
  await page.goto('/');
  await expect(page.locator('.preloader')).toBeHidden();
  expect(requests.some((url) => url.includes('ContactScene'))).toBe(false);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  const canvas = page.locator('.contact-webgl canvas');
  await expect(canvas).toHaveAttribute('data-rendered', 'true');
  const draws = async () => Number(await canvas.getAttribute('data-draws'));
  const first = await draws();
  await expect.poll(draws).toBeGreaterThan(first);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.contact-webgl')).toHaveAttribute('data-active', 'false');
  await page.waitForTimeout(200);
  const paused = await draws();
  await page.waitForTimeout(200);
  expect(await draws()).toBe(paused);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect.poll(draws).toBeGreaterThan(paused);
  await canvas.evaluate((element: HTMLCanvasElement) =>
    element.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext(),
  );
  await expect(page.locator('.contact-webgl')).toHaveAttribute('data-state', 'fallback');
  await expect(canvas).toHaveCount(0);
  await expect(page.locator('.contact-scene-fallback')).toHaveCSS('opacity', '1');
  await page.locator('.contact-form-details summary').click();
  await expect(page.getByLabel('Your name')).toBeVisible();
  expect(errors).toEqual([]);
});

test('message bar supports keyboard, clear validation, and an honest email draft', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const summary = page.locator('.contact-form-details summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  const name = page.getByLabel('Your name'),
    email = page.getByLabel('Email address'),
    message = page.getByLabel('What’s on your mind?');
  await page.getByRole('button', { name: 'Open email draft' }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
  await expect(page.getByText('Please write a message.')).toBeVisible();
  await name.fill('Alex & Sam');
  await email.fill('invalid');
  await message.fill('A portfolio inquiry.');
  await page.getByRole('button', { name: 'Open email draft' }).click();
  await expect(email).toBeFocused();
  await email.fill('alex+portfolio@example.com');
  const accessibility = await new AxeBuilder({ page })
    .include('#contact')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.getByRole('button', { name: 'Open email draft' }).click();
  await expect(page.locator('.form-status')).toContainText('Please send it from there.');
  await expect(page.getByText('No message is sent automatically.')).toBeVisible();
  await expect(name).toHaveAttribute('aria-invalid', 'false');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(name).toBeHidden();
});

test('reduced motion keeps the architecture and controls without downloading a contact renderer', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.contact-environment canvas')).toHaveCount(0);
  await expect(page.locator('.contact-scene-fallback')).toHaveCSS('opacity', '1');
  expect(requests.some((url) => url.includes('ContactScene'))).toBe(false);
  await expect(page.locator('.contact-cta')).toHaveAttribute(
    'href',
    'mailto:mayankthapliyal500@gmail.com',
  );
  await page.locator('footer a[href="#home"]').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
  await expect(page.locator('.navbar')).toHaveAttribute('data-theme', 'light');
});

test('contact layouts remain readable through resizing and message expansion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('.contact-webgl canvas')).toHaveAttribute('data-rendered', 'true');
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    const bounds = await page.locator('#contact-title').boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
  }
  await page.locator('.contact-form-details summary').click();
  await expect(page.getByLabel('Your name')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.locator('footer a[href="#home"]').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
});

test('unavailable WebGL leaves the contact links and form usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (name: string, ...args: unknown[]) {
      if (name.includes('webgl')) return null;
      return Reflect.apply(original, this, [name, ...args]);
    } as typeof original;
  });
  await page.goto('/');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.contact-scene-fallback')).toHaveCSS('opacity', '1');
  await expect(page.locator('#contact-title')).toBeVisible();
  await page.locator('.contact-form-details summary').click();
  await expect(page.getByRole('button', { name: 'Open email draft' })).toBeVisible();
});
