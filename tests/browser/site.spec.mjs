import { test, expect } from '@playwright/test';

async function canvasDigest(locator) {
  return locator.evaluate((canvas) => {
    const context = canvas.getContext('2d');
    if (!context || canvas.width === 0 || canvas.height === 0) {
      return { hash: 0, activePixels: 0, width: canvas.width, height: canvas.height };
    }

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const sampleStride = Math.max(4, Math.floor(pixels.length / 16_000 / 4) * 4);
    let hash = 2166136261;
    let activePixels = 0;

    for (let index = 0; index < pixels.length; index += sampleStride) {
      const alpha = pixels[index + 3] ?? 0;
      if (alpha > 2) activePixels += 1;
      hash ^= pixels[index] ?? 0;
      hash = Math.imul(hash, 16777619);
      hash ^= pixels[index + 1] ?? 0;
      hash = Math.imul(hash, 16777619);
      hash ^= pixels[index + 2] ?? 0;
      hash = Math.imul(hash, 16777619);
      hash ^= alpha;
      hash = Math.imul(hash, 16777619);
    }

    return { hash: hash >>> 0, activePixels, width: canvas.width, height: canvas.height };
  });
}

function collectRuntimeErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test('hero canvas renders and animates without runtime errors', async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');

  const heroCanvas = page.locator('#hero-canvas');
  await expect(heroCanvas).toBeVisible();
  await page.waitForTimeout(500);

  const first = await canvasDigest(heroCanvas);
  await page.waitForTimeout(650);
  const second = await canvasDigest(heroCanvas);

  expect(first.width).toBeGreaterThan(0);
  expect(first.height).toBeGreaterThan(0);
  expect(first.activePixels).toBeGreaterThan(10);
  expect(second.hash).not.toBe(first.hash);
  expect(errors).toEqual([]);
});

test('all chapter visualizations initialize and paint a frame', async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => typeof window.d3 !== 'undefined');

  const sections = page.locator('.section');
  await expect(sections).toHaveCount(16);

  for (let index = 0; index < await sections.count(); index += 1) {
    const section = sections.nth(index);
    const sectionId = await section.getAttribute('id');
    await section.evaluate((element) => element.scrollIntoView({ block: 'center' }));

    const canvas = section.locator('canvas');
    await expect(canvas, `${sectionId} canvas should be visible`).toBeVisible();
    await expect.poll(
      async () => (await canvasDigest(canvas)).activePixels,
      { timeout: 4_000, message: `${sectionId} should draw non-transparent pixels` }
    ).toBeGreaterThan(0);
  }

  expect(errors).toEqual([]);
});

test('soundscape creates a running audible signal after explicit activation', async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');

  const soundscape = page.locator('#toggle-soundscape');
  const volume = page.locator('#ambient-volume-control');
  await expect(soundscape).toHaveAttribute('aria-pressed', 'false');
  await soundscape.click();

  await expect(soundscape).toHaveAttribute('aria-pressed', 'true');
  await expect(volume).toBeVisible();
  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getState().contextState),
    { timeout: 5_000 }
  ).toBe('running');
  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getLevel() ?? 0),
    { timeout: 5_000 }
  ).toBeGreaterThan(0);

  expect(errors).toEqual([]);
});

test('mobile layout does not create horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = collectRuntimeErrors(page);
  await page.goto('/');

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewport + 1);

  await page.locator('.section').last().evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(250);
  const finalDimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(finalDimensions.documentWidth).toBeLessThanOrEqual(finalDimensions.viewport + 1);
  expect(errors).toEqual([]);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('hero remains visually stable', async ({ page }) => {
    await page.goto('/');
    const heroCanvas = page.locator('#hero-canvas');
    await expect(heroCanvas).toBeVisible();
    await page.waitForTimeout(900);
    const first = await canvasDigest(heroCanvas);
    await page.waitForTimeout(600);
    const second = await canvasDigest(heroCanvas);

    expect(first.activePixels).toBeGreaterThan(10);
    expect(second.hash).toBe(first.hash);
  });
});
