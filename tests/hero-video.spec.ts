import { test, expect } from '@playwright/test';

const firstSource = '**/videos/mayank-portrait-01.mp4';
const secondSource = '**/videos/mayank-portrait-02.mp4';
const firstVideo = '.portrait-video-0';
const secondVideo = '.portrait-video-1';
const surface = '.hero-portrait-media';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test('silent inline portrait plays both clips in order and returns to the first without layout shift', async ({
  page,
}) => {
  test.setTimeout(35000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await expect(page.locator(surface)).toHaveAttribute('data-active', '0');
  expect(
    await page
      .locator(firstVideo)
      .evaluate(
        (v: HTMLVideoElement) =>
          v.muted && v.volume === 0 && v.playsInline && v.loop && !v.controls && !v.paused,
      ),
  ).toBeTruthy();
  await expect(page.locator(secondVideo)).not.toHaveAttribute('src');
  const before = await page.locator('.hero-portrait').boundingBox();
  await expect(page.locator(surface)).toHaveAttribute('data-active', '1', { timeout: 14000 });
  expect(
    await page
      .locator(secondVideo)
      .evaluate((v: HTMLVideoElement) => v.readyState >= 2 && !v.paused && v.muted && v.loop),
  ).toBeTruthy();
  await expect(page.locator(surface)).toHaveAttribute('data-active', '0', { timeout: 13000 });
  await expect
    .poll(() => page.locator(firstVideo).evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.1);
  const after = await page.locator('.hero-portrait').boundingBox();
  expect(Math.abs(before!.width - after!.width)).toBeLessThan(1);
  expect(Math.abs(before!.height - after!.height)).toBeLessThan(1);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test('slow loading keeps the portrait poster; the second clip is deferred', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let secondRequested = false;
  page.on('request', (request) => {
    if (request.url().includes('portrait-02.mp4')) secondRequested = true;
  });
  await page.route(firstSource, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'poster');
  await expect(page.locator('.hero-portrait-poster')).toHaveCSS('opacity', '1');
  expect(secondRequested).toBe(false);
  const initialSize = await page.locator('.hero-portrait').boundingBox();
  release();
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  expect((await page.locator('.hero-portrait').boundingBox())!.width).toBe(initialSize!.width);
});

test('blocked autoplay and unavailable files leave an accessible static portrait', async ({
  page,
}) => {
  await page.addInitScript(() => {
    // A play() rejection alone does not block Chrome's native autoplay attribute.
    // Disable both playback entry points to simulate a real browser policy denial.
    const nativeLoad = HTMLMediaElement.prototype.load;
    HTMLMediaElement.prototype.load = function () {
      this.autoplay = false;
      nativeLoad.call(this);
    };
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException('Autoplay blocked for test', 'NotAllowedError'));
  });
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'poster');
  await expect(page.getByAltText('Mayank Thapliyal in a navy blazer')).toBeVisible();
  await page.route('**/videos/*.mp4', (route) => route.abort());
  await page.reload();
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'poster');
  await expect(page.locator('.hero-portrait-poster')).toHaveCSS('opacity', '1');
});

test('a missing continuation keeps the first healthy clip looping', async ({ page }) => {
  await page.route(secondSource, (route) => route.abort());
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  // Seek near the boundary to exercise failure handling without a ten-second test delay.
  await page.locator(firstVideo).evaluate((v: HTMLVideoElement) => {
    v.currentTime = 9.2;
  });
  await expect
    .poll(() => page.locator(secondVideo).evaluate((v: HTMLVideoElement) => !!v.error))
    .toBeTruthy();
  await expect
    .poll(() => page.locator(firstVideo).evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeLessThan(3);
  await expect(page.locator(surface)).toHaveAttribute('data-active', '0');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
});

test('reduced motion avoids all video requests and responds to preference changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('.mp4')) requests.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('video')).toHaveCount(0);
  expect(requests).toEqual([]);
  await expect(page.locator('.hero-portrait-poster')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('.hero-portrait-poster')).toHaveCSS('opacity', '1');
});

test('offscreen and hidden-tab playback pauses and resumes safely', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect
    .poll(() => page.locator(firstVideo).evaluate((v: HTMLVideoElement) => v.paused))
    .toBeTruthy();
  await page.locator('#home').scrollIntoViewIfNeeded();
  await expect
    .poll(() => page.locator(firstVideo).evaluate((v: HTMLVideoElement) => !v.paused))
    .toBeTruthy();
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect
    .poll(() =>
      page
        .locator('video')
        .evaluateAll((videos) => videos.every((v) => (v as HTMLVideoElement).paused)),
    )
    .toBeTruthy();
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect
    .poll(() => page.locator(firstVideo).evaluate((v: HTMLVideoElement) => !v.paused))
    .toBeTruthy();
});

test('a failed first clip recovers to the continuation, while two failures keep the poster', async ({
  page,
}) => {
  await page.route(firstSource, (route) => route.abort());
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-active', '1');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await page.route(secondSource, (route) => route.abort());
  await page.reload();
  await expect
    .poll(() =>
      page
        .locator('video')
        .evaluateAll((videos) => videos.every((v) => !!(v as HTMLVideoElement).error)),
    )
    .toBeTruthy();
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'poster');
  await expect(page.locator('.hero-portrait-poster')).toHaveCSS('opacity', '1');
});

test('resizing preserves playback, layout and a restrained portrait cursor', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chrome');
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
    const bounds = await page.locator('.hero-portrait').boundingBox();
    expect(bounds!.width / bounds!.height).toBeCloseTo(1, 1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(4200);
  await page.locator(surface).hover();
  await expect(page.locator('.custom-cursor')).not.toHaveAttribute('data-mode', 'view');
});

test('moving silhouette follows decoded frames while the face remains opaque', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(firstVideo)).toHaveAttribute('data-masked', 'true');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await page.waitForTimeout(4500);
  await expect(page.locator('.portrait-video-surface')).toHaveCSS('opacity', '1');
  await expect(page.locator('.portrait-video-surface')).toHaveCSS('mask-image', 'none');
  await expect(page.locator(firstVideo)).toHaveCSS('opacity', '1');
  const outline = await page.locator(firstVideo).evaluate((v) => v.style.clipPath);
  expect(outline.startsWith('polygon(')).toBeTruthy();
  await page.locator(firstVideo).evaluate((v: HTMLVideoElement) => {
    v.currentTime = 7;
  });
  await expect
    .poll(() => page.locator(firstVideo).evaluate((v) => v.style.clipPath))
    .not.toBe(outline);
});

test('unavailable outline tracks retain native playback and a perimeter mask', async ({ page }) => {
  await page.route('**/videos/*.mask.json', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await expect(page.locator(firstVideo)).not.toHaveAttribute('data-masked');
  expect(await page.locator(firstVideo).evaluate((v) => getComputedStyle(v).maskImage)).toContain(
    'radial-gradient',
  );
});
