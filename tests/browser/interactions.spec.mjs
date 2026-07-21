import { test, expect } from '@playwright/test';

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
  await expect(locator, `${control.id} should be visible`).toBeVisible();

  if (control.type === 'button') {
    await locator.click();
    return;
  }

  if (control.type === 'slider') {
    const midpoint = (control.min + control.max) / 2;
    const target = control.value <= midpoint ? control.max : control.min;
    await locator.focus();
    await locator.press(target === control.max ? 'End' : 'Home');
    await expect(locator).toHaveValue(String(target));
    return;
  }

  if (control.type === 'switch') {
    const expected = !control.checked;
    await locator.click();
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
  expect(chapters).toHaveLength(16);

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
      await expect(section).not.toHaveClass(/viz-error/);
    }

    if (controls.length > 0) {
      const screenshot = await section.screenshot({ animations: 'allow' });
      await testInfo.attach(`${chapter.id}-after-interactions`, {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  }

  expect(operatedControls).toBeGreaterThanOrEqual(20);
  expect(await page.locator('.viz-error').count()).toBe(0);
  expect(errors).toEqual([]);
});

test('the open-network canvas accepts a real pointer drag without errors or blanking', async ({ page }, testInfo) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');

  const section = page.locator('#section-whats-next');
  const canvas = page.locator('#canvas-whats-next');
  await section.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'auto' }));
  await expect(canvas).toBeVisible();
  await assertCanvasHealthy(canvas, 'whats-next');

  const target = await canvas.evaluate((element) => {
    const context = element.getContext('2d');
    const rect = element.getBoundingClientRect();
    if (!context || rect.width === 0 || rect.height === 0) return null;

    const image = context.getImageData(0, 0, element.width, element.height);
    const dprX = element.width / rect.width;
    const dprY = element.height / rect.height;
    let best = null;
    let bestScore = -1;

    for (let y = 0; y < element.height; y += 3) {
      for (let x = 0; x < element.width; x += 3) {
        const index = ((y * element.width) + x) * 4;
        const red = image.data[index];
        const green = image.data[index + 1];
        const blue = image.data[index + 2];
        const alpha = image.data[index + 3];
        const score = alpha + blue + green - (red * 0.25);
        if (alpha > 40 && score > bestScore) {
          bestScore = score;
          best = { x: x / dprX, y: y / dprY };
        }
      }
    }

    return best ?? { x: rect.width / 2, y: rect.height / 2 };
  });

  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(target).not.toBeNull();

  const startX = box.x + target.x;
  const startY = box.y + target.y;
  const before = await canvasDigest(canvas);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 64, startY + 36, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(350);
  const after = await canvasDigest(canvas);

  expect(after.activePixels).toBeGreaterThan(0);
  expect(after.hash).not.toBe(before.hash);
  expect(await page.locator('.viz-error').count()).toBe(0);
  expect(errors).toEqual([]);

  const screenshot = await section.screenshot({ animations: 'allow' });
  await testInfo.attach('whats-next-after-pointer-drag', {
    body: screenshot,
    contentType: 'image/png',
  });
});
