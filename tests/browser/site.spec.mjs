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

async function attachViewportScreenshot(page, testInfo, name) {
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: false }),
    contentType: 'image/png',
  });
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

test('soundscape is controlled from a dismissible menu', async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');

  const audioMenu = page.locator('#audio-menu');
  const trigger = audioMenu.locator('summary');
  const soundscape = page.locator('#toggle-soundscape');
  const volume = page.locator('#ambient-volume-control');

  await expect(audioMenu).not.toHaveAttribute('open', '');
  await expect(soundscape).toBeHidden();
  await trigger.click();
  await expect(audioMenu).toHaveAttribute('open', '');
  await expect(soundscape).toBeVisible();
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

  await page.mouse.click(20, 180);
  await expect(audioMenu).not.toHaveAttribute('open', '');
  await expect(volume).toBeHidden();
  expect(errors).toEqual([]);
});

test('browser-agent API exposes chapters and safely operates controls', async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.agentReady === 'true');

  const chapterCount = await page.evaluate(() => window.emergentHumanity.getChapters().length);
  expect(chapterCount).toBe(16);

  const controls = await page.evaluate(() => window.emergentHumanity.getControls('node-quantity'));
  expect(controls).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: 'population-slider', type: 'slider' }),
  ]));

  const result = await page.evaluate(() => window.emergentHumanity.operateControl('population-slider', 0.8));
  expect(result.value).toBe(0.8);
  await expect(page.locator('#ctrl-population-slider')).toHaveValue('0.8');
  await expect(page.locator('#ctrl-population-slider')).toHaveAttribute('aria-valuetext', '80%');

  expect(errors).toEqual([]);
});

test('reported mobile viewport keeps one compact header and one chapter title', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 367, height: 643 });
  const errors = collectRuntimeErrors(page);
  await page.goto('/');

  const header = page.locator('.site-header');
  const audioMenu = page.locator('#audio-menu');
  const audioTrigger = audioMenu.locator('summary');
  const audioPanel = page.locator('.audio-menu-panel');
  const chapterStatus = page.locator('.chapter-status');

  await expect(header).toBeVisible();
  await expect(chapterStatus).toBeHidden();

  const initialHeaderBox = await header.boundingBox();
  expect(initialHeaderBox).not.toBeNull();
  expect(initialHeaderBox.height).toBeLessThanOrEqual(62);

  await audioTrigger.click();
  await expect(audioPanel).toBeVisible();
  const openHeaderBox = await header.boundingBox();
  const panelBox = await audioPanel.boundingBox();
  expect(openHeaderBox.height).toBe(initialHeaderBox.height);
  expect(panelBox.x).toBeGreaterThanOrEqual(0);
  expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(367);
  expect(panelBox.y).toBeGreaterThanOrEqual(initialHeaderBox.y + initialHeaderBox.height);
  await attachViewportScreenshot(page, testInfo, 'reported-viewport-audio-menu-open');

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const target = document.getElementById('section-intro');
    if (!target) throw new Error('Missing Great Organism chapter');
    window.scrollTo(0, target.offsetTop);
  });
  await expect.poll(
    () => page.evaluate(() => window.emergentHumanity?.getCurrentChapter()),
    { timeout: 5_000 }
  ).toBe('intro');
  await expect(audioMenu).not.toHaveAttribute('open', '');
  await expect(page.locator('#section-intro .section-title')).toHaveCount(1);
  await expect(page.locator('#section-intro .section-title')).toBeVisible();
  await expect(page.locator('#section-intro .section-title')).toHaveText('The Great Organism');
  await expect(chapterStatus).toBeHidden();

  const visibleExactTitleCount = await page.evaluate(() => [...document.querySelectorAll('body *')]
    .filter((element) => element.children.length === 0)
    .filter((element) => element.textContent?.trim() === 'The Great Organism')
    .filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
    }).length);
  expect(visibleExactTitleCount).toBe(1);

  await attachViewportScreenshot(page, testInfo, 'reported-viewport-great-organism');

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
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

test('reduced-motion preference keeps the hero visually stable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);

  const heroCanvas = page.locator('#hero-canvas');
  await expect(heroCanvas).toBeVisible();
  await page.waitForTimeout(900);
  const first = await canvasDigest(heroCanvas);
  await page.waitForTimeout(600);
  const second = await canvasDigest(heroCanvas);

  expect(first.activePixels).toBeGreaterThan(10);
  expect(second.width).toBe(first.width);
  expect(second.height).toBe(first.height);
  expect(second.hash).toBe(first.hash);
});
