import { test, expect } from '@playwright/test';

test('maximum soundscape volume produces a strong measurable signal', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');
  const soundscape = page.locator('#toggle-soundscape');
  const volume = page.locator('#ambient-volume');

  await soundscape.click();
  await expect(soundscape).toHaveAttribute('aria-pressed', 'true');
  await volume.focus();
  await volume.press('End');
  await expect(volume).toHaveValue('100');

  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getState().targetGain ?? 0),
    { timeout: 5_000 }
  ).toBeGreaterThanOrEqual(0.33);

  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getLevel() ?? 0),
    { timeout: 5_000 }
  ).toBeGreaterThan(2);

  expect(errors).toEqual([]);
});
