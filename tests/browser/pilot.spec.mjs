import { test, expect } from "@playwright/test";
test("pilot experiments: phone layout, parameter isolation, rotation and pause", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lab.html?pilot");
  await expect(page.locator(".section")).toHaveCount(3);
  for (const s of await page.locator(".section").all()) {
    await s.scrollIntoViewIfNeeded();
    const overlap = await s.evaluate((e) => {
      const a = e.querySelector(".viz-hint").getBoundingClientRect(),
        b = e.querySelector(".viz-stats").getBoundingClientRect();
      return a.bottom > b.top;
    });
    expect(overlap).toBe(false);
  }
  await page.locator("#ctrl-channel-noise").fill("0");
  await page.locator("#ctrl-send-message").click();
  await page.locator("#ctrl-toggle-redundancy").check();
  for (let i = 0; i < 3; i++)
    await page.locator("#section-entropy [data-step]").click();
  await expect(page.locator("#stats-entropy")).toContainText(
    "Decoded errors 0/12",
  );
  await expect(page.locator("#stats-entropy")).toContainText("1 copy");
  await page.setViewportSize({ width: 844, height: 390 });
  await expect
    .poll(() =>
      page
        .locator("#canvas-entropy")
        .evaluate((c) => Math.abs(c.clientWidth - c.parentElement.clientWidth)),
    )
    .toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const before = await page
    .locator("#canvas-alignment")
    .getAttribute("data-model-state");
  await page.waitForTimeout(700);
  expect(
    await page.locator("#canvas-alignment").getAttribute("data-model-state"),
  ).toBe(before);
  expect(errors).toEqual([]);
});
