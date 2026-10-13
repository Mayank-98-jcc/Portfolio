import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Count real WebGL draws, not a React state flag that could mask a live renderer.
async function countDraws(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const target = window as typeof window & { sceneDraws: number };
    target.sceneDraws = 0;
    const prototype = WebGL2RenderingContext.prototype;
    const original = prototype.drawElements;
    prototype.drawElements = function (...args) {
      target.sceneDraws++;
      return original.apply(this, args);
    };
  });
}
const draws = () => (window as typeof window & { sceneDraws: number }).sceneDraws;

test('pointer depth moves only the camera on desktop and ignores touch input', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  // The particle field's world transform is static; its model-view matrix isolates
  // camera motion while the particles themselves drift through vertex positions.
  await page.addInitScript(() => {
    const prototype = WebGL2RenderingContext.prototype;
    const draw = prototype.drawArrays;
    prototype.drawArrays = function (mode, first, count) {
      if (mode === this.POINTS) {
        const program = this.getParameter(this.CURRENT_PROGRAM);
        const location = this.getUniformLocation(program, 'modelViewMatrix');
        if (location) {
          (window as typeof window & { sceneView: number[] }).sceneView = Array.from(
            this.getUniform(program, location),
          );
        }
      }
      return draw.call(this, mode, first, count);
    };
  });
  await page.goto('/');
  await expect(page.locator('.hero-webgl canvas')).toHaveAttribute('data-rendered', 'true');
  await page.waitForTimeout(2500);
  const view = () =>
    page.evaluate(() => (window as typeof window & { sceneView: number[] }).sceneView);
  await expect.poll(view).toHaveLength(16);
  const initial = await view();
  const portrait = await page.locator('.hero-portrait-media').boundingBox();
  const hero = page.locator('#home');
  await hero.dispatchEvent('pointermove', { pointerType: 'touch', clientX: 20, clientY: 200 });
  await page.waitForTimeout(250);
  expect(await view()).toEqual(initial);
  await hero.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 20, clientY: 200 });
  const fine = await page.evaluate(
    () => matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)').matches,
  );
  if (fine) {
    await expect.poll(view).not.toEqual(initial);
    await hero.dispatchEvent('pointerleave');
    await expect
      .poll(async () => {
        const current = await view();
        return Math.max(...current.map((value, index) => Math.abs(value - initial[index])));
      })
      .toBeLessThan(0.001);
  } else {
    await page.waitForTimeout(250);
    expect(await view()).toEqual(initial);
  }
  expect(await page.locator('.hero-portrait-media').boundingBox()).toEqual(portrait);
});

test('real 3D scene draws, resizes, pauses offscreen and releases rendering on reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await countDraws(page);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.hero-webgl canvas')).toHaveAttribute('data-rendered', 'true');
  const initial = await page.evaluate(draws);
  await expect.poll(() => page.evaluate(draws)).toBeGreaterThan(initial);
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await expect
      .poll(() =>
        page
          .locator('.hero-webgl canvas')
          .evaluate((el) =>
            Math.abs(el.getBoundingClientRect().width - el.parentElement!.clientWidth),
          ),
      )
      .toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.hero-webgl')).toHaveAttribute('data-active', 'false');
  await page.waitForTimeout(200);
  const paused = await page.evaluate(draws);
  await page.waitForTimeout(350);
  expect(await page.evaluate(draws)).toBe(paused);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.hero-webgl')).toHaveAttribute('data-active', 'true');
  await expect.poll(() => page.evaluate(draws)).toBeGreaterThan(paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-environment canvas')).toHaveCount(0);
  await expect(page.locator('.hero-scene-fallback')).toHaveCSS('opacity', '1');
  await page.waitForTimeout(650);
  const stopped = await page.evaluate(draws);
  await page.waitForTimeout(300);
  expect(await page.evaluate(draws)).toBe(stopped);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.hero-environment canvas')).toHaveCount(1);
  await expect.poll(() => page.evaluate(draws)).toBeGreaterThan(stopped);
  expect(errors).toEqual([]);
});

test('hidden tab pauses actual WebGL rendering and resumes without a second canvas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await countDraws(page);
  await page.goto('/');
  await expect(page.locator('canvas[data-engine]')).toHaveAttribute('data-rendered', 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('.hero-webgl')).toHaveAttribute('data-active', 'false');
  await page.waitForTimeout(150);
  const paused = await page.evaluate(draws);
  await page.waitForTimeout(300);
  expect(await page.evaluate(draws)).toBe(paused);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => page.evaluate(draws)).toBeGreaterThan(paused);
  await expect(page.locator('.hero-environment canvas')).toHaveCount(1);
});

test('context loss restores the static composition and leaves the intro and work controls usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('canvas[data-engine]')).toHaveAttribute('data-rendered', 'true');
  await page.locator('canvas[data-engine]').evaluate((canvas: HTMLCanvasElement) => {
    canvas.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext();
  });
  await expect(page.locator('.hero-webgl')).toHaveAttribute('data-state', 'fallback');
  await expect(page.locator('.hero-scene-fallback')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-environment canvas')).toHaveCount(0);
  await expect(page.locator('.hero-portrait-media')).toBeVisible();
  await page.getByRole('button', { name: 'Quick Intro' }).click();
  const dialog = page.getByRole('dialog', { name: 'Curious mind. Builder at heart.' });
  await expect(dialog).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .include('.intro-dialog')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await expect(dialog.getByRole('button', { name: 'Close introduction' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Quick Intro' })).toBeFocused();
  await page.getByRole('link', { name: 'View My Work', exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('#projects')).toBeInViewport();
});

test('unavailable WebGL keeps an attractive fallback and functional HTML', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (name: string, ...args: unknown[]) {
      if (name.includes('webgl')) return null;
      return Reflect.apply(original, this, [name, ...args]);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.locator('.preloader')).toBeHidden();
  await expect(page.locator('.hero-scene-fallback')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-greeting')).toHaveText('Hey, there.');
  await expect(page.locator('.hero-portrait-media')).toBeVisible();
  await page.getByRole('button', { name: 'Quick Intro' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('reduced-motion entry never downloads the optional scene module or starts WebGL', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('.hero-greeting')).toBeVisible();
  await page.waitForTimeout(400);
  await expect(page.locator('.hero-environment canvas')).toHaveCount(0);
  expect(requests.some((url) => url.includes('HeroScene'))).toBe(false);
  await expect(page.locator('.hero-scene-fallback')).toHaveCSS('opacity', '1');
});
