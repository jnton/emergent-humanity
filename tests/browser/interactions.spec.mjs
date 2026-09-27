import { test, expect } from '@playwright/test';

const SCREENSHOT_CHAPTERS = new Set([
  'node-limits',
  'cohesion',
  'external-storage',
  'productivity',
]);

async function canvasDigest(locator) {
  return locator.evaluate((canvas) => {
    const context = canvas.getContext('2d');
    if (!context || canvas.width === 0 || canvas.height === 0) {
      return { hash: 0, activePixels: 0, width: canvas.width, height: canvas.height };
    }

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const stride = Math.max(4, Math.floor(pixels.length / 12_000 / 4) * 4);
    let hash = 2166136261;
    let activePixels = 0;

    for (let index = 0; index < pixels.length; index += stride) {
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

async function assertCanvasHealthy(canvas, sectionId) {
  await expect.poll(
    async () => (await canvasDigest(canvas)).activePixels,
    { timeout: 5_000, message: `${sectionId} should remain painted after interaction` }
  ).toBeGreaterThan(0);
}

async function operateVisibleControl(page, control) {
  const locator = page.locator(`#ctrl-${control.id}`);
  await expect(locator, `${control.id} should exist`).toBeAttached();
  await expect(locator).toBeEnabled();

  if (control.type === 'button') {
    await expect(locator, `${control.id} button should be visible`).toBeVisible();
    await locator.click();
    return;
  }

  if (control.type === 'slider') {
    await expect(locator, `${control.id} slider should be visible`).toBeVisible();
    const midpoint = (control.min + control.max) / 2;
    const target = control.value <= midpoint ? control.max : control.min;
    await locator.focus();
    await locator.press(target === control.max ? 'End' : 'Home');
    await expect(locator).toHaveValue(String(target));
    return;
  }

  if (control.type === 'switch') {
    const expected = !control.checked;
    const visibleSurface = locator.locator('..');
    await expect(visibleSurface, `${control.id} switch surface should be visible`).toBeVisible();
    await visibleSurface.click();
    if (expected) await expect(locator).toBeChecked();
    else await expect(locator).not.toBeChecked();
    return;
  }

  throw new Error(`Unsupported test control type: ${control.type}`);
}

test('every visible visualization control can be operated without breaking its animation', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const errors = collectRuntimeErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.agentReady === 'true');
  await page.waitForFunction(() => typeof window.d3 !== 'undefined');

  const chapters = await page.evaluate(() => window.emergentHumanity.getChapters());
  expect(chapters.length).toBeGreaterThan(0);

  let operatedControls = 0;

  for (const chapter of chapters) {
    const section = page.locator(`#section-${chapter.id}`);
    const canvas = section.locator('canvas');
    await section.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'auto' }));
    await expect(canvas).toBeVisible();
    await assertCanvasHealthy(canvas, chapter.id);

    const controls = await page.evaluate(
      (sectionId) => window.emergentHumanity.getControls(sectionId),
      chapter.id
    );

    for (const control of controls) {
      await operateVisibleControl(page, control);
      operatedControls += 1;
      await page.waitForTimeout(control.type === 'button' ? 350 : 220);
      await assertCanvasHealthy(canvas, chapter.id);
      await expect(section.locator('.viz-pane')).not.toHaveClass(/viz-error/);
    }

    if (SCREENSHOT_CHAPTERS.has(chapter.id)) {
      const screenshot = await section.screenshot({
        animations: 'allow',
        type: 'jpeg',
        quality: 58,
      });
      await testInfo.attach(`${chapter.id}-after-interactions`, {
        body: screenshot,
        contentType: 'image/jpeg',
      });
    }
  }

  expect(operatedControls).toBeGreaterThanOrEqual(20);
  expect(await page.locator('.viz-error').count()).toBe(0);
  expect(errors).toEqual([]);
});

test('the final multi-objective dashboard responds to a real control change', async ({ page }, testInfo) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');

  const section = page.locator('#section-whats-next');
  const canvas = page.locator('#canvas-whats-next');
  await section.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'auto' }));
  await expect(canvas).toBeVisible();
  await assertCanvasHealthy(canvas, 'whats-next');

  const stats = page.locator('#stats-whats-next');
  const alignment = page.locator('#ctrl-thrive-alignment');

  const beforeCanvas = await canvasDigest(canvas);
  const beforeStats = await stats.textContent();
  await alignment.focus();
  await alignment.press('End');
  await expect(alignment).toHaveValue('1');
  await page.waitForTimeout(350);

  const afterCanvas = await canvasDigest(canvas);
  const afterStats = await stats.textContent();

  expect(afterCanvas.activePixels).toBeGreaterThan(0);
  expect(afterCanvas.hash).not.toBe(beforeCanvas.hash);
  expect(afterStats).not.toBe(beforeStats);
  expect(afterStats).toContain('no scalar humanity score');
  expect(await page.locator('.viz-error').count()).toBe(0);
  expect(errors).toEqual([]);

  const screenshot = await section.screenshot({
    animations: 'allow',
    type: 'jpeg',
    quality: 58,
  });
  await testInfo.attach('whats-next-after-objective-change', {
    body: screenshot,
    contentType: 'image/jpeg',
  });
});
