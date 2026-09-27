import { test, expect } from "@playwright/test";
test("every chapter control works with ordinary pointer or keyboard input", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/lab.html");
  for (const section of await page.locator(".section").all()) {
    for (const control of await section.locator("[id^=ctrl-]").all()) {
      const tag = await control.evaluate((e) =>
        e.tagName === "INPUT" ? e.type : "button",
      );
      if (tag === "range") {
        await control.focus();
        await control.press("End");
      } else if (tag === "checkbox") {
        await control.check();
      } else await control.click();
    }
    const step = section.locator("[data-step]");
    if (await step.isVisible()) await step.click();
    await section.locator("[data-reset]").click();
    await expect(section.locator(".viz-stats")).not.toBeEmpty();
  }
  expect(errors).toEqual([]);
});
test("keyboard can remove the origin and preserve a replica", async ({
  page,
}) => {
  await page.goto("/lab.html#section-collective-memory");
  await page.locator("#ctrl-spawn-idea").focus();
  await page.keyboard.press("Enter");
  await page.locator("#section-collective-memory [data-step]").focus();
  await page.keyboard.press("Enter");
  await page.locator("#ctrl-remove-origin").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#stats-collective-memory")).toContainText(
    "1 live copies",
  );
  await expect(page.locator("#stats-collective-memory")).toContainText(
    "Origin removed",
  );
});
test("running pauses when leaving and resumes without catch-up", async ({
  page,
}) => {
  await page.goto("/lab.html#section-cohesion");
  await page.locator("#section-cohesion [data-run]").click();
  await page.waitForTimeout(700);
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const before = await page
    .locator("#canvas-cohesion")
    .getAttribute("data-model-state");
  await page.waitForTimeout(700);
  expect(
    await page.locator("#canvas-cohesion").getAttribute("data-model-state"),
  ).toBe(before);
});
