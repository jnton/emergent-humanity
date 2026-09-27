import { test, expect } from "@playwright/test";
test("all chapters expose faithful experiments and evidence", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/lab.html");
  await expect(page.locator(".section")).toHaveCount(17);
  for (const section of await page.locator(".section").all()) {
    await expect(section.locator("canvas")).toHaveAttribute(
      "data-model-state",
      /.+/,
    );
    await expect(section.locator(".viz-stats")).not.toBeEmpty();
    await expect(section.locator(".evidence")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
  await expect(page.locator(".viz-error")).toHaveCount(0);
});
test("text and methods remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/essay.html");
  await expect(page.locator("article")).toHaveCount(17);
  await page.goto("/methods.html");
  await expect(page.locator("article")).toHaveCount(17);
  await expect(page.locator("#entropy")).toContainText("pₕ");
  await context.close();
});
test("agent API exposes current controls and operates semantic actions", async ({
  page,
}) => {
  await page.goto("/lab.html");
  await page.waitForFunction(() => window.emergentHumanity);
  const list = await page.evaluate(() => window.emergentHumanity.getChapters());
  expect(list).toHaveLength(17);
  await page.evaluate(() =>
    window.emergentHumanity.operateControl("wrong-goals"),
  );
  await expect(page.locator("#stats-alignment")).toContainText("Q = -1.00");
});
test("sound remains opt-in and can be muted", async ({ page }) => {
  await page.goto("/lab.html");
  expect(
    await page.evaluate(
      () => window.__EMERGENT_AUDIO_DEBUG__.getState().contextState,
    ),
  ).toBe("not-created");
  await page.locator("#audio-menu summary").click();
  await page.locator("#toggle-soundscape").click();
  await expect(page.locator("#toggle-soundscape")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#ambient-volume").fill("0");
  await expect
    .poll(() =>
      page.evaluate(
        () => window.__EMERGENT_AUDIO_DEBUG__.getState().targetGain,
      ),
    )
    .toBe(0);
  await page.locator("#toggle-soundscape").click();
  await expect(page.locator("#toggle-soundscape")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
test("deep links and history retain a functional page", async ({ page }) => {
  await page.goto("/lab.html#section-entropy");
  await expect(page.locator("#section-entropy")).toBeInViewport();
  await page.goto("/methods.html");
  await page.goBack();
  await page.locator("#ctrl-send-message").click();
  await expect(page.locator("#stats-entropy")).toContainText("Run 1");
});
