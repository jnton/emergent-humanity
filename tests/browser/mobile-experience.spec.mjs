import { test, expect } from "@playwright/test";
for (const size of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
])
  test(`layout and controls at ${size.width}×${size.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(size);
    await page.goto("/lab.html");
    for (const section of await page.locator(".section").all()) {
      await section.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const geometry = await section.evaluate((e) => {
        const hint = e.querySelector(".viz-hint").getBoundingClientRect(),
          stage = e.querySelector(".viz-stage").getBoundingClientRect(),
          controls = e.querySelector(".viz-controls").getBoundingClientRect(),
          stats = e.querySelector(".viz-stats").getBoundingClientRect();
        return {
          hintBefore: hint.bottom <= stage.top,
          stageBefore: stage.bottom <= controls.top + 1,
          controlsBefore: controls.bottom < stats.top,
        };
      });
      expect(geometry).toEqual({
        hintBefore: true,
        stageBefore: true,
        controlsBefore: true,
      });
    }
    await page.locator("#chapter-menu summary").click();
    await expect(page.locator("#chapter-nav")).toBeVisible();
  });
test("reduced motion does not advance any model automatically", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lab.html#section-connection-quality");
  const before = await page
    .locator("#canvas-connection-quality")
    .getAttribute("data-model-state");
  await page.waitForTimeout(800);
  expect(
    await page
      .locator("#canvas-connection-quality")
      .getAttribute("data-model-state"),
  ).toBe(before);
  await page.locator("#section-connection-quality [data-step]").click();
  expect(
    await page
      .locator("#canvas-connection-quality")
      .getAttribute("data-model-state"),
  ).not.toBe(before);
});
test("rotation preserves state and resizes every canvas", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lab.html#section-illusion-of-significance");
  await page.locator("#ctrl-shift-node").click();
  const before = await page
    .locator("#canvas-illusion-of-significance")
    .getAttribute("data-model-state");
  await page.setViewportSize({ width: 844, height: 390 });
  await expect
    .poll(() =>
      page
        .locator("#canvas-illusion-of-significance")
        .evaluate((c) => Math.abs(c.clientWidth - c.parentElement.clientWidth)),
    )
    .toBeLessThan(2);
  expect(
    await page
      .locator("#canvas-illusion-of-significance")
      .getAttribute("data-model-state"),
  ).toBe(before);
});

test("slider defaults represent their declared values exactly", async ({
  page,
}) => {
  await page.goto("/lab.html");
  for (const input of await page.locator(".section input[type=range]").all()) {
    expect(Number(await input.inputValue())).toBe(
      Number(await input.getAttribute("value")),
    );
  }
});
