import { test, expect } from '@playwright/test';

/** Measure painted serif glyphs, not just the paragraph's CSS rectangle. */
function headingGeometry() {
  const heading = document.querySelector<HTMLElement>('.hero-greeting')!;
  const portrait = document.querySelector<HTMLElement>('.hero-portrait-media')!;
  const reveal = document.querySelector<HTMLElement>('.portrait-reveal-layer')!;
  const media = portrait.getBoundingClientRect();
  const context = document.createElement('canvas').getContext('2d')!;
  const words = [...heading.querySelectorAll<HTMLElement>('.greeting-word')].map((word) => {
    const range = document.createRange();
    range.selectNodeContents(word);
    const text = range.getBoundingClientRect();
    const style = getComputedStyle(word);
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics = context.measureText(word.textContent!.trim());
    const baseline = text.top + metrics.fontBoundingBoxAscent;
    const top = baseline - metrics.actualBoundingBoxAscent;
    const bottom = baseline + metrics.actualBoundingBoxDescent;
    return {
      text: word.textContent,
      opacity: Number(style.opacity),
      filter: style.filter,
      top,
      bottom,
      left: text.left,
      right: text.right,
      clearance: media.top - bottom,
      overlapsHorizontally: text.right > media.left && text.left < media.right,
    };
  });
  return {
    words,
    text: heading.textContent!.replace(/\s+/g, ' ').trim(),
    portraitOpacity: Number(getComputedStyle(reveal).opacity),
    active: portrait.dataset.active,
    overflow: document.documentElement.scrollWidth > innerWidth,
    width: innerWidth,
    navBottom: document.querySelector('.navbar')!.getBoundingClientRect().bottom,
    navZ: Number(getComputedStyle(document.querySelector('.navbar')!).zIndex),
    portraitTop: media.top,
    portraitBottom: media.bottom,
    nextSectionTop: document.querySelector('#projects')!.getBoundingClientRect().top,
    headingZ: Number(getComputedStyle(heading).zIndex),
    portraitZ: Number(getComputedStyle(document.querySelector('.hero-portrait')!).zIndex),
    layers: [
      heading,
      heading.firstElementChild!,
      ...heading.querySelectorAll('.greeting-word'),
    ].map((element) => {
      const style = getComputedStyle(element);
      return { mask: style.maskImage, clip: style.clipPath, overflow: style.overflow };
    }),
  };
}

function expectClearHeading(geometry: ReturnType<typeof headingGeometry>) {
  expect(geometry.text).toBe('Hey, there.');
  expect(geometry.overflow).toBe(false);
  expect(geometry.headingZ).toBeGreaterThan(geometry.portraitZ);
  expect(geometry.headingZ).toBeLessThan(geometry.navZ);
  expect(geometry.portraitBottom).toBeLessThanOrEqual(geometry.nextSectionTop + 1);
  for (const layer of geometry.layers) {
    expect(layer.mask).toBe('none');
    expect(layer.clip).toBe('none');
    expect(layer.overflow).toBe('visible');
  }
  for (const word of geometry.words) {
    expect(word.left).toBeGreaterThanOrEqual(0);
    expect(word.right).toBeLessThanOrEqual(geometry.width);
    if (word.opacity > 0.02) {
      expect(
        word.top,
        `${word.text}: ascenders must clear the sticky navigation`,
      ).toBeGreaterThanOrEqual(geometry.navBottom);
    }
  }
}

test('complete serif heading clears navigation and retains its ink over the portrait at every viewport', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(headingGeometry);
    expectClearHeading(geometry);
    for (const word of geometry.words) expect(word.opacity).toBe(1);
    // Compare the actual black letter pixels; the intentionally overlapping backdrop may change.
    const withPortrait = await page.locator('.hero-greeting').screenshot();
    await page.locator('.hero-portrait').evaluate((element: HTMLElement) => {
      element.style.visibility = 'hidden';
    });
    const withoutPortrait = await page.locator('.hero-greeting').screenshot();
    await page.locator('.hero-portrait').evaluate((element: HTMLElement) => {
      element.style.removeProperty('visibility');
    });
    const contrast = await page.evaluate(
      async ({ visible, hidden }) => {
        const decode = async (png: string) => {
          const image = new Image();
          image.src = `data:image/png;base64,${png}`;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext('2d')!;
          context.drawImage(image, 0, 0);
          return context.getImageData(0, 0, image.width, image.height).data;
        };
        const [withImage, withoutImage] = await Promise.all([decode(visible), decode(hidden)]);
        let ink = 0;
        let obscured = 0;
        for (let i = 0; i < withoutImage.length; i += 4) {
          if (withoutImage[i] < 30 && withoutImage[i + 1] < 30 && withoutImage[i + 2] < 30) {
            ink++;
            if (withImage[i] > 40 || withImage[i + 1] > 40 || withImage[i + 2] > 40) obscured++;
          }
        }
        return { ink, obscured };
      },
      { visible: withPortrait.toString('base64'), hidden: withoutPortrait.toString('base64') },
    );
    expect(contrast.ink).toBeGreaterThan(500);
    expect(contrast.obscured, `${width}: portrait obscures heading ink`).toBe(0);
  }
});

test('heading stays clear through entrance, pointer motion, both video cuts and resizing', async ({
  page,
  isMobile,
}) => {
  test.setTimeout(45000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('.hero-greeting').waitFor();
  await page.evaluate(() => document.fonts.ready);
  // Sample the actual entrance while both independently animated layers become visible.
  for (let i = 0; i < 38; i++) {
    expectClearHeading(await page.evaluate(headingGeometry));
    await page.waitForTimeout(100);
  }
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.mouse.move(width - 40, Math.min(height - 40, 700));
    await page.waitForTimeout(250);
    const geometry = await page.evaluate(headingGeometry);
    expectClearHeading(geometry);
    for (const word of geometry.words) {
      expect(word.opacity).toBe(1);
      expect(word.filter).toBe('none');
    }
  }
  await page.locator('.portrait-video-0').evaluate((video: HTMLVideoElement) => {
    video.currentTime = 5;
  });
  const seen = new Set<string>();
  for (let i = 0; i < 25; i++) {
    const geometry = await page.evaluate(headingGeometry);
    expectClearHeading(geometry);
    seen.add(geometry.active!);
    await page.waitForTimeout(100);
  }
  expect(seen.has('1')).toBe(true);
  await page.locator('.portrait-video-1').evaluate((video: HTMLVideoElement) => {
    video.currentTime = 9;
  });
  for (let i = 0; i < 20; i++) {
    expectClearHeading(await page.evaluate(headingGeometry));
    await page.waitForTimeout(100);
  }
  await expect(page.locator('.hero-portrait-media')).toHaveAttribute('data-active', '0');
  // Exercise Lenis on desktop and native scrolling on mobile, then return to scroll zero.
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.mouse.move(40, 40);
    await page.waitForTimeout(1100);
    const before = await page.evaluate(headingGeometry);
    if (isMobile) await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
    else await page.mouse.wheel(0, 700);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400);
    if (isMobile) await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    else await page.mouse.wheel(0, -3000);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(1);
    await page.waitForTimeout(1200);
    const after = await page.evaluate(headingGeometry);
    expectClearHeading(after);
    expect(Math.abs(after.portraitTop - before.portraitTop)).toBeLessThan(1);
    expect(Math.abs(after.words[0].top - before.words[0].top)).toBeLessThan(1);
  }
});
