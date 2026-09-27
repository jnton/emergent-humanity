import { chromium, firefox, webkit } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const dir = new URL("../docs/implementation-evidence/", import.meta.url)
  .pathname;
await mkdir(dir, { recursive: true });
const results = [];
for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await engine.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173/lab.html");
  await page.waitForSelector("[data-model-state]");
  if (name === "chromium")
    await page.screenshot({ path: dir + "/phone-home.png" });
  for (const section of await page.locator(".section").all()) {
    await section.scrollIntoViewIfNeeded();
    const button = section.locator("button[id^=ctrl-]").first();
    if (await button.count()) await button.click();
    await page.waitForTimeout(230);
    if (name === "chromium") {
      const id = await section.getAttribute("data-section-id");
      await section
        .locator(".viz-pane")
        .screenshot({
          path: dir + "/phone-" + id + ".png",
          style: ".site-header,.skip-link{visibility:hidden}",
        });
    }
  }
  const counts = await page.evaluate(() => ({
    chapters: document.querySelectorAll(".section").length,
    models: document.querySelectorAll("[data-model-state]").length,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    noise: document.querySelector("#ctrl-alignment-noise").value,
  }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  if (name === "chromium")
    await page
      .locator("#section-alignment .viz-pane")
      .screenshot({ path: dir + "/desktop-alignment.png" });
  await page.addStyleTag({ content: "html {font-size:200%}" });
  const zoomOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  );
  results.push({ engine: name, ...counts, zoomOverflow, errors });
  await browser.close();
}
await writeFile(
  dir + "/browser-matrix.json",
  JSON.stringify(results, null, 2) + "\n",
);
console.log(results);

if (
  results.some(
    (r) =>
      r.errors.length ||
      r.overflow ||
      r.zoomOverflow ||
      r.models !== 17 ||
      r.noise !== "0.12",
  )
)
  throw new Error("Cross-engine smoke failed");
