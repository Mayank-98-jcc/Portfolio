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
    v.currentTime = 5.2;
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
    expect(bounds!.width / bounds!.height).toBeCloseTo(4 / 3, 1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(4200);
  await page.locator(surface).hover();
  await expect(page.locator('.custom-cursor')).not.toHaveAttribute('data-mode', 'view');
});

test('natural footage stays opaque without silhouette outlines or outline downloads', async ({
  page,
}) => {
  const outlines: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('.mask.json')) outlines.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await page.waitForTimeout(4500);
  await expect(page.locator('.portrait-video-surface')).toHaveCSS('opacity', '1');
  await expect(page.locator(firstVideo)).toHaveCSS('opacity', '1');
  await expect(page.locator(firstVideo)).toHaveCSS('clip-path', 'none');
  await expect(page.locator('.hero-portrait-poster')).toHaveCSS('clip-path', 'none');
  await page.locator(firstVideo).evaluate((v: HTMLVideoElement) => {
    v.currentTime = 5;
  });
  await expect(page.locator(firstVideo)).toHaveCSS('clip-path', 'none');
  expect(outlines).toEqual([]);
});

test('clip handoff never blends two faces or changes the scene dimensions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  const before = await page.locator('.hero-portrait').boundingBox();
  await page.locator(firstVideo).evaluate((v: HTMLVideoElement) => {
    v.currentTime = 5;
  });
  await expect(page.locator(secondVideo)).toHaveAttribute('src');
  const samples = await page.evaluate(async () => {
    const values: number[][] = [];
    const until = performance.now() + 3000;
    while (performance.now() < until) {
      values.push(
        Array.from(document.querySelectorAll('.portrait-video'), (v) =>
          Number(getComputedStyle(v).opacity),
        ),
      );
      await new Promise(requestAnimationFrame);
    }
    return values;
  });
  await expect(page.locator(surface)).toHaveAttribute('data-active', '1');
  expect(
    samples.every((pair) => pair.every((opacity) => opacity === 0 || opacity === 1)),
  ).toBeTruthy();
  const after = await page.locator('.hero-portrait').boundingBox();
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);
});

test('hero typography fits at all requested viewports with compact mobile name lines', async ({
  page,
}, testInfo) => {
  test.skip(!['desktop-chrome', 'desktop-webkit'].includes(testInfo.project.name));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [390, 844],
    [320, 740],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const greeting = document.querySelector('.hero-greeting')!.getBoundingClientRect();
      const lines = [...document.querySelectorAll('.name-line-inner')].map((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const text = range.getBoundingClientRect();
        const clip = el.parentElement!.getBoundingClientRect();
        // Range bounds include Anton's generous unused ascender/descender space.
        // Compare actual painted glyph bounds, not that invisible font padding.
        const style = getComputedStyle(el);
        const context = document.createElement('canvas').getContext('2d')!;
        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = context.measureText(el.textContent!.trim());
        const baseline = text.top + metrics.fontBoundingBoxAscent;
        const top = baseline - metrics.actualBoundingBoxAscent;
        const bottom = baseline + metrics.actualBoundingBoxDescent;
        return {
          left: text.left,
          right: text.right,
          top,
          bottom,
          clipped:
            text.left < clip.left - 1 ||
            text.right > clip.right + 1 ||
            top < clip.top - 1 ||
            bottom > clip.bottom + 1,
        };
      });
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        greeting: { left: greeting.left, right: greeting.right },
        lines,
      };
    });
    expect(geometry.overflow, `${width}: page overflow`).toBe(false);
    expect(geometry.greeting.left).toBeGreaterThanOrEqual(0);
    expect(geometry.greeting.right).toBeLessThanOrEqual(width);
    for (const line of geometry.lines) {
      expect(line.left).toBeGreaterThanOrEqual(0);
      expect(line.right).toBeLessThanOrEqual(width);
      expect(line.clipped, `${width}: clipped name`).toBe(false);
    }
    if (width <= 760) {
      expect(geometry.lines[1].top - geometry.lines[0].bottom).toBeLessThan(30);
      expect(geometry.lines[2].top - geometry.lines[1].bottom).toBeLessThan(20);
    }
    await expect(page.locator('.hero-study')).toBeVisible();
  }
});

test('the whole head clears the masks throughout entrance and the first ten seconds', async ({
  page,
}) => {
  test.setTimeout(20000);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const samples = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 140;
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    const samples: { clip: string; headroom: number; sourceTop: number; active: string }[] = [];
    const until = performance.now() + 10800;
    while (performance.now() < until) {
      const scene = document.querySelector<HTMLElement>('.hero-portrait-media')!;
      const video = scene.querySelector<HTMLVideoElement>(
        `.portrait-video-${scene.dataset.active}`,
      )!;
      if (video.readyState >= 2 && scene.dataset.state === 'playing') {
        // Inspect the actual decoded asset: dark hair against its light studio backdrop.
        // This catches source cropping as well as a CSS crop; outer box sizes alone cannot.
        context.drawImage(video, 300, 0, 650, 140, 0, 0, 650, 140);
        const pixels = context.getImageData(0, 0, 650, 140).data;
        let top = 140;
        for (let y = 0; y < 140; y++) {
          let hairPixels = 0;
          for (let x = 0; x < 650; x++) {
            const i = (y * 650 + x) * 4;
            if (pixels[i] < 150 && pixels[i + 1] < 150 && pixels[i + 2] < 150) hairPixels++;
          }
          if (hairPixels > 2) {
            top = y;
            break;
          }
        }
        const bounds = scene.getBoundingClientRect();
        const media = video.getBoundingClientRect();
        const reveal = scene.closest('.portrait-reveal-layer')!;
        samples.push({
          clip: getComputedStyle(reveal).clipPath,
          // Both source and CSS use the same vertical extent (cover crops only the sides).
          headroom:
            (media.top + (top / video.videoHeight) * media.height - bounds.top) / bounds.height,
          sourceTop: top,
          active: scene.dataset.active!,
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return samples;
  });
  expect(samples.length).toBeGreaterThan(70);
  for (const sample of samples) {
    expect(sample.clip, 'entrance must never wipe a hard edge across the head').toBe('none');
    expect(sample.sourceTop, 'source hair must not touch the encoded frame edge').toBeGreaterThan(
      10,
    );
    expect(sample.headroom, 'hair must clear the outer mask’s top 4% fade').toBeGreaterThan(0.04);
  }
  await expect(page.locator(surface)).toHaveAttribute('data-active', '1');
});

test('a delayed incoming decoder holds a safely framed outgoing portrait', async ({ page }) => {
  await page.addInitScript(() => {
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.src.includes('portrait-02.mp4')) return new Promise<void>(() => {});
      return nativePlay.call(this);
    };
  });
  await page.goto('/');
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await page.locator(firstVideo).evaluate((v: HTMLVideoElement) => {
    v.currentTime = 5;
  });
  await expect
    .poll(() => page.locator(firstVideo).evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  const held = await page.locator(firstVideo).evaluate((v: HTMLVideoElement) => v.currentTime);
  expect(held).toBeGreaterThan(5.8);
  expect(held).toBeLessThan(6.1);
  await page.waitForTimeout(1200);
  expect(await page.locator(firstVideo).evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(
    held,
  );
  await expect(page.locator(surface)).toHaveAttribute('data-state', 'playing');
  await expect(page.locator(firstVideo)).toHaveCSS('opacity', '1');
});
