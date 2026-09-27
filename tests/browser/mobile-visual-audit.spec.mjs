import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

function collectRuntimeErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

async function activateControls(section) {
  const ranges = section.locator('input[type="range"]');
  for (let index = 0; index < await ranges.count(); index += 1) {
    await ranges.nth(index).evaluate((input) => {
      input.value = input.max;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  const switches = section.locator('input[type="checkbox"]');
  for (let index = 0; index < await switches.count(); index += 1) {
    const input = switches.nth(index);
    if (!(await input.isChecked())) await input.check({ force: true });
  }

  const buttons = section.locator('.viz-controls button');
  for (let index = 0; index < await buttons.count(); index += 1) {
    const button = buttons.nth(index);
    const text = (await button.textContent())?.trim() ?? '';
    if (/reset|scramble/i.test(text)) continue;
    await button.click({ force: true });
  }
}

async function canvasInkBounds(canvas) {
  return canvas.evaluate((element) => {
    const context = element.getContext('2d');
    if (!context || element.width === 0 || element.height === 0) return null;
    const data = context.getImageData(0, 0, element.width, element.height).data;
    let minX = element.width;
    let minY = element.height;
    let maxX = -1;
    let maxY = -1;
    let activePixels = 0;

    for (let y = 0; y < element.height; y += 2) {
      for (let x = 0; x < element.width; x += 2) {
        const alpha = data[((y * element.width) + x) * 4 + 3] ?? 0;
        if (alpha <= 3) continue;
        activePixels += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (activePixels === 0) return { activePixels: 0 };
    return {
      activePixels,
      minX,
      minY,
      maxX,
      maxY,
      width: element.width,
      height: element.height,
    };
  });
}

async function assertNetworkContained(canvas, sectionId) {
  const hasGuard = await canvas.evaluate((element) => Boolean(element.__EMERGENT_NETWORK_VIEWPORT__));
  if (!hasGuard) return false;

  await expect.poll(
    () => canvas.evaluate((element) => element.__EMERGENT_NETWORK_VIEWPORT__.getStatus().clippedCount),
    { timeout: 5_000, message: `${sectionId} should keep every node inside its safe drawing area` }
  ).toBe(0);
  return true;
}

test('all mobile graphs remain visible before and after their interactions', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const errors = collectRuntimeErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.mobileLayout === 'active');

  const sections = page.locator('.section');
  await expect(sections).toHaveCount(16);
  let guardedGraphs = 0;
  const audit = [];

  for (let index = 0; index < await sections.count(); index += 1) {
    const section = sections.nth(index);
    const sectionId = await section.getAttribute('data-section-id');
    const pane = section.locator('.viz-pane');
    const canvas = pane.locator('canvas');

    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    if (await assertNetworkContained(canvas, sectionId)) guardedGraphs += 1;

    audit.push({
      sectionId,
      state: 'initial',
      ink: await canvasInkBounds(canvas),
    });
    await testInfo.attach(`${String(index + 1).padStart(2, '0')}-${sectionId}-initial`, {
      body: await pane.screenshot({ type: 'png' }),
      contentType: 'image/png',
    });

    await activateControls(section);
    await page.waitForTimeout(800);
    await assertNetworkContained(canvas, sectionId);

    audit.push({
      sectionId,
      state: 'interacted',
      ink: await canvasInkBounds(canvas),
    });
    await testInfo.attach(`${String(index + 1).padStart(2, '0')}-${sectionId}-interacted`, {
      body: await pane.screenshot({ type: 'png' }),
      contentType: 'image/png',
    });
  }

  expect(guardedGraphs).toBeGreaterThanOrEqual(12);
  await testInfo.attach('mobile-visual-audit.json', {
    body: Buffer.from(JSON.stringify(audit, null, 2)),
    contentType: 'application/json',
  });
  expect(errors).toEqual([]);
});
