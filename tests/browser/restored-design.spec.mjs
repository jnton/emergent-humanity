import { test, expect } from "@playwright/test";
import { SECTIONS } from "../../content/sections.js";
for (const width of [320, 390, 1440])
  test(`original animated presentation and correct titles at ${width}px`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#hero-canvas")).toBeVisible();
    await expect(page.locator(".hero-title")).toHaveText("Emergent Humanity");
    for (const s of SECTIONS) {
      const section = page.locator("#section-" + s.id);
      await expect(section.locator(".section-title")).toHaveText(s.title);
      await section.locator(".animation-stage").scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          section.locator("canvas").evaluate(
            (c) =>
              c.width > 0 &&
              c
                .getContext("2d")
                .getImageData(0, 0, c.width, c.height)
                .data.some((v, i) => i % 4 === 3 && v > 0),
          ),
        )
        .toBe(true);
      const g = await section.evaluate((e) => {
        const c = e.querySelector("canvas").getBoundingClientRect(),
          h = e.querySelector(".viz-hint").getBoundingClientRect(),
          s = e.querySelector(".viz-stats").getBoundingClientRect();
        return {
          hint: h.bottom <= c.top + 1,
          stats: s.height === 0 || s.top >= c.bottom - 1,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      expect(g).toEqual({ hint: true, stats: true, overflow: false });
      await expect(section.locator(".chapter-sources")).toHaveAttribute(
        "href",
        `methods.html#${s.id}`,
      );
    }
    expect(errors).toEqual([]);
    await expect(page.locator(".viz-error")).toHaveCount(0);
  });
test("restored channel freezes in-flight parameters", async ({ page }) => {
  await page.goto("/#section-entropy");
  await page.locator("#ctrl-channel-noise").fill("0");
  await page.locator("#ctrl-send-message").click();
  await page.locator("#ctrl-toggle-redundancy").focus();
  await page.locator("#ctrl-toggle-redundancy").press("Space");
  await expect(page.locator("#stats-entropy")).toContainText("single copy");
  await expect(page.locator("#stats-entropy")).toContainText(
    "decoded errors 0/15",
    { timeout: 20000 },
  );
});
test("restored animation honours reduced motion and rotation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#section-illusion-of-significance");
  await expect(page.locator("#stats-illusion-of-significance")).toContainText(
    "step 0",
  );
  await page.waitForTimeout(300);
  await expect(page.locator("#stats-illusion-of-significance")).toContainText(
    "step 0",
  );
  await page.setViewportSize({ width: 844, height: 390 });
  await expect
    .poll(() =>
      page
        .locator("#canvas-illusion-of-significance")
        .evaluate((c) => Math.abs(c.clientWidth - c.parentElement.clientWidth)),
    )
    .toBeLessThan(2);
});

test('hero and original network illustration visibly animate',async({page})=>{
 await page.goto('/');const hero=page.locator('#hero-canvas');await expect.poll(()=>hero.evaluate(c=>c.width)).toBeGreaterThan(0);const h=await hero.evaluate(c=>c.toDataURL());await expect.poll(()=>hero.evaluate(c=>c.toDataURL())).not.toBe(h);
 await page.locator('#section-alignment .animation-stage').scrollIntoViewIfNeeded();const canvas=page.locator('#canvas-alignment');await expect.poll(()=>canvas.evaluate(c=>c.width)).toBeGreaterThan(0);const frame=await canvas.evaluate(c=>c.toDataURL());await expect.poll(()=>canvas.evaluate(c=>c.toDataURL())).not.toBe(frame);
});
