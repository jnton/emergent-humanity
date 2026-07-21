import { test, expect } from '@playwright/test';

test('maximum tonal soundtrack volume produces a strong measurable signal without noise', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');
  const soundtrack = page.locator('#toggle-soundscape');
  const volume = page.locator('#ambient-volume');

  await soundtrack.click();
  await expect(soundtrack).toHaveAttribute('aria-pressed', 'true');
  await expect(soundtrack.locator('.audio-label')).toHaveText('Soundtrack on');
  await volume.focus();
  await volume.press('End');
  await expect(volume).toHaveValue('100');

  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getState().targetGain ?? 0),
    { timeout: 5_000 }
  ).toBeGreaterThanOrEqual(0.33);

  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getState().scoreVersion),
    { timeout: 5_000 }
  ).toBe('tonal-score-v2');

  expect(await page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getState().noiseLayer)).toBe(false);

  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getState().activeSources ?? 0),
    { timeout: 5_000 }
  ).toBeGreaterThan(0);

  await expect.poll(
    () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getLevel() ?? 0),
    { timeout: 7_000 }
  ).toBeGreaterThan(2);

  expect(errors).toEqual([]);
});
