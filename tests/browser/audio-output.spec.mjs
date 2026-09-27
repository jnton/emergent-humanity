import { test, expect } from "@playwright/test";

test("opt-in tonal soundtrack produces a measurable signal and zero volume mutes output", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  await page.locator("#audio-menu > summary").click();
  const soundtrack = page.locator("#toggle-soundscape");
  const volume = page.locator("#ambient-volume");

  await soundtrack.click();
  await expect(soundtrack).toHaveAttribute("aria-pressed", "true");
  await expect(soundtrack.locator(".audio-label")).toHaveText("Soundtrack on");
  await volume.focus();
  await volume.press("End");
  await expect(volume).toHaveValue("100");

  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__EMERGENT_AUDIO_DEBUG__?.getState().targetGain ?? 0,
        ),
      { timeout: 5_000 },
    )
    .toBeGreaterThanOrEqual(0.33);

  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__EMERGENT_AUDIO_DEBUG__?.getState().scoreVersion,
        ),
      { timeout: 5_000 },
    )
    .toBe("tonal-score-v2");

  expect(
    await page.evaluate(
      () => window.__EMERGENT_AUDIO_DEBUG__?.getState().noiseLayer,
    ),
  ).toBe(false);

  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__EMERGENT_AUDIO_DEBUG__?.getState().activeSources ?? 0,
        ),
      { timeout: 5_000 },
    )
    .toBeGreaterThan(0);

  await expect
    .poll(
      () => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__?.getRms() ?? 0),
      { timeout: 7_000 },
    )
    .toBeGreaterThan(0.00001);

  await volume.focus();
  await volume.press("Home");
  await expect(volume).toHaveValue("0");
  await expect
    .poll(() => page.evaluate(() => window.__EMERGENT_AUDIO_DEBUG__.getRms()), {
      timeout: 5000,
    })
    .toBeLessThan(0.000001);
  expect(errors).toEqual([]);
});
