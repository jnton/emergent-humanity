import { test, expect } from "@playwright/test";
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
test("all phone diagrams paint initial states and provide visual-review captures", async ({
  page,
}, info) => {
  await page.goto("/lab.html");
  for (const section of await page.locator(".section").all()) {
    await section.scrollIntoViewIfNeeded();
    const canvas = section.locator("canvas");
    const ink = await canvas.evaluate((c) => {
      const a = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      return a.some((v, i) => i % 4 === 3 && v > 0);
    });
    expect(ink).toBe(true);
    await info.attach(
      `${await section.getAttribute("data-section-id")}-phone`,
      { body: await section.screenshot(), contentType: "image/png" },
    );
  }
  expect(await page.locator(".viz-error").count()).toBe(0);
});
