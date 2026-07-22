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

test('mobile chapter navigation behaves as a viewport-sized touch sheet', async ({ page }, testInfo) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.mobileLayout === 'active');

  const header = page.locator('.site-header');
  const headerBox = await header.boundingBox();
  expect(headerBox.width).toBeLessThanOrEqual(390);
  expect(headerBox.height).toBeLessThanOrEqual(72);

  const menu = page.locator('.chapter-menu');
  await menu.locator('summary').tap();
  await expect(menu).toHaveAttribute('open', '');

  const nav = menu.locator('nav');
  await expect(nav).toBeVisible();
  const navBox = await nav.boundingBox();
  expect(navBox.x).toBeGreaterThanOrEqual(0);
  expect(navBox.y).toBeGreaterThanOrEqual(0);
  expect(navBox.x + navBox.width).toBeLessThanOrEqual(390);
  expect(navBox.y + navBox.height).toBeLessThanOrEqual(844);

  await menu.locator('[data-section-link="cohesion"]').tap();
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('#section-cohesion')).toBeInViewport();

  await testInfo.attach('mobile-chapter-sheet', {
    body: await page.screenshot({ type: 'jpeg', quality: 82 }),
    contentType: 'image/jpeg',
  });
  expect(errors).toEqual([]);
});

test('mobile controls sit below the canvas with large touch targets', async ({ page }, testInfo) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => window.__EMERGENT_MOBILE_DEBUG__?.getState().active === true);

  const state = await page.evaluate(() => window.__EMERGENT_MOBILE_DEBUG__.getState());
  expect(state.headings).toBe(16);
  expect(state.dockedControls).toBeGreaterThan(10);

  const section = page.locator('#section-node-limits');
  await section.scrollIntoViewIfNeeded();
  const canvasBox = await section.locator('canvas').boundingBox();
  const dock = section.locator(':scope > .viz-controls');
  const dockBox = await dock.boundingBox();

  expect(dockBox.y).toBeGreaterThanOrEqual(canvasBox.y + canvasBox.height - 2);
  expect(dockBox.x).toBeGreaterThanOrEqual(0);
  expect(dockBox.x + dockBox.width).toBeLessThanOrEqual(390);

  for (const button of await dock.locator('button').all()) {
    const box = await button.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }

  const sliderSection = page.locator('#section-node-quantity');
  await sliderSection.scrollIntoViewIfNeeded();
  const slider = sliderSection.locator('input[type="range"]');
  const sliderBox = await slider.boundingBox();
  expect(sliderBox.height).toBeGreaterThanOrEqual(40);
  const before = await slider.inputValue();
  await slider.tap({ position: { x: sliderBox.width * 0.82, y: sliderBox.height / 2 } });
  await expect(slider).not.toHaveValue(before);

  await testInfo.attach('mobile-control-dock', {
    body: await page.screenshot({ type: 'jpeg', quality: 82 }),
    contentType: 'image/jpeg',
  });
  expect(errors).toEqual([]);
});

test('mobile audio volume is a popover and node dragging has an explicit mode', async ({ page }, testInfo) => {
  const errors = collectRuntimeErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.mobileLayout === 'active');

  await page.locator('#toggle-soundscape').tap();
  const volume = page.locator('#ambient-volume-control');
  await expect(volume).toBeVisible();
  const volumeBox = await volume.boundingBox();
  expect(volumeBox.x).toBeGreaterThanOrEqual(0);
  expect(volumeBox.x + volumeBox.width).toBeLessThanOrEqual(390);

  const finalSection = page.locator('#section-whats-next');
  await finalSection.scrollIntoViewIfNeeded();
  const toggle = finalSection.locator('.canvas-touch-toggle');
  await expect(toggle).toBeVisible();
  await toggle.tap();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(finalSection.locator('.viz-pane')).toHaveClass(/touch-interaction-active/);

  const touchAction = await finalSection.locator('canvas').evaluate(
    (canvas) => getComputedStyle(canvas).touchAction
  );
  expect(touchAction).toBe('none');

  await toggle.tap();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await testInfo.attach('mobile-node-mode', {
    body: await page.screenshot({ type: 'jpeg', quality: 82 }),
    contentType: 'image/jpeg',
  });
  expect(errors).toEqual([]);
});
