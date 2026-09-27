import { test, expect } from "@playwright/test";
for (const reducedMotion of ["no-preference", "reduce"])
  test(`opening plays without buttons, ${reducedMotion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      const proto = CanvasRenderingContext2D.prototype;
      const clear = proto.clearRect,
        arc = proto.arc,
        fill = proto.fill,
        label = proto.fillText;
      proto.clearRect = function (...args) {
        if (this.canvas.id === "canvas-intro")
          window.organismFrame = { nodes: [], labels: [], fills: [] };
        return clear.apply(this, args);
      };
      proto.arc = function (x, y, radius, ...args) {
        if (this.canvas.id === "canvas-intro")
          window.organismFrame?.nodes.push({ x, y, radius });
        return arc.call(this, x, y, radius, ...args);
      };
      proto.fill = function (...args) {
        if (this.canvas.id === "canvas-intro")
          window.organismFrame?.fills.push(String(this.fillStyle));
        return fill.apply(this, args);
      };
      proto.fillText = function (text, ...args) {
        if (this.canvas.id === "canvas-intro")
          window.organismFrame?.labels.push(text);
        return label.call(this, text, ...args);
      };
    });
    await page.goto("/");
    expect(
      await page
        .locator(".section")
        .evaluateAll((es) => es.slice(0, 3).map((e) => e.dataset.sectionId)),
    ).toEqual(["node-capacity", "intro", "node-limits"]);
    await expect(
      page.locator(
        "#section-node-capacity .viz-controls, #section-intro .viz-controls",
      ),
    ).toHaveCount(0);
    await page
      .locator("#section-node-capacity .animation-stage")
      .scrollIntoViewIfNeeded();
    const person = page.locator("#canvas-node-capacity");
    await expect.poll(() => person.evaluate((c) => c.width)).toBeGreaterThan(0);
    if (reducedMotion === "no-preference") {
      const frame = await person.evaluate((c) => c.toDataURL());
      await expect
        .poll(() => person.evaluate((c) => c.toDataURL()))
        .not.toBe(frame);
    }
    const network = page.locator("#canvas-intro");
    await page
      .locator("#section-intro .animation-stage")
      .scrollIntoViewIfNeeded();
    if (reducedMotion === "no-preference") {
      await expect(network).toHaveAttribute("data-story-stage", "node");
      await expect(network).toHaveAttribute("data-story-stage", "network", {
        timeout: 12000,
      });
    }
    await expect(network).toHaveAttribute("data-story-stage", "whole", {
      timeout: 10000,
    });
    await expect(network).toHaveAttribute("data-story-members", "54");
    const drawing = await page.evaluate(() => ({
      ...window.organismFrame,
      centre: document.getElementById("canvas-intro").clientWidth / 2,
    }));
    expect(drawing.nodes).toHaveLength(54);
    expect(drawing.nodes.every((node) => node.radius === 2.6)).toBe(true);
    expect(Math.abs(drawing.nodes[0].x - drawing.centre)).toBeGreaterThan(20);
    expect(drawing.labels).not.toContain("You");
    await expect(page.locator("#section-intro .viz-feedback")).toContainText(
      "whole becomes visible",
    );
    if (reducedMotion === "no-preference") {
      await expect
        .poll(
          async () =>
            page.evaluate(() => {
              const fills = window.organismFrame?.fills.slice(-54) ?? [];
              return (
                fills.length === 54 &&
                fills.every(
                  (color) => Number(color.match(/, ([\d.]+)\)$/)?.[1]) < 0.1,
                )
              );
            }),
          { timeout: 10000 },
        )
        .toBe(true);
    }
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(network).toHaveAttribute("data-story-stage", "whole");
    await page
      .locator("#section-alignment .animation-stage")
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const stopped = await network.evaluate((c) => c.toDataURL());
    await page.waitForTimeout(400);
    expect(await network.evaluate((c) => c.toDataURL())).toBe(stopped);
    if (reducedMotion === "no-preference") {
      await page
        .locator("#section-intro .animation-stage")
        .scrollIntoViewIfNeeded();
      await expect(network).toHaveAttribute("data-story-stage", "node");
      await expect(page.locator("#section-intro .viz-feedback")).toHaveText(
        "One person.",
      );
    }
  });
test("technical detail is opt-in, sources remain available, coupling is isolated", async ({
  page,
}) => {
  await page.goto("/#section-alignment");
  await page.locator("#ctrl-align-goals").click();
  await expect(page.locator("#stats-alignment")).toBeHidden();
  await expect(page.locator("#stats-alignment")).toContainText("noise 0.28");
  await expect(
    page.locator("#section-alignment .viz-feedback"),
  ).not.toBeEmpty();
  await expect(
    page.locator("summary", { hasText: "Explore the model and its limits" }),
  ).toHaveCount(0);
  await page.locator("#audio-menu summary").click();
  await page.locator("#toggle-measurements").click();
  await expect(page.locator("#stats-alignment")).toBeVisible();
  await page.locator("#toggle-measurements").click();
  await expect(page.locator("#stats-alignment")).toBeHidden();
  await expect(
    page.locator("#section-alignment .chapter-sources"),
  ).toHaveAttribute("href", "methods.html#alignment");
});
test("tap/keyboard interactions work without holding or canvas targeting", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#section-node-limits");
  await page.locator("#ctrl-optimize-nodes").focus();
  await page.locator("#ctrl-optimize-nodes").press("Enter");
  await expect(
    page.locator("#section-node-limits .viz-feedback"),
  ).toContainText("Better conditions helped");
  await page.locator("#ctrl-reset-limits").click();
  await expect(page.locator("#ctrl-optimize-nodes")).toBeEnabled();
  await page
    .locator("#section-collective-memory .animation-stage")
    .scrollIntoViewIfNeeded();
  await page.locator("#ctrl-spawn-idea").click();
  await page.locator("#ctrl-remove-origin").focus();
  await page.locator("#ctrl-remove-origin").press("Enter");
  await expect(
    page.locator("#section-collective-memory .viz-feedback"),
  ).toContainText("lost");
  await page.locator("#ctrl-reset-memory").click();
  await expect(page.locator("#ctrl-remove-origin")).toBeDisabled();
  await page
    .locator("#section-external-storage .animation-stage")
    .scrollIntoViewIfNeeded();
  await page.locator("#ctrl-invent").click();
  await expect(page.locator("#ctrl-invent")).toHaveText("Make more copies");
  await page.locator("#ctrl-reset-storage").click();
  await expect(page.locator("#ctrl-invent")).toHaveText("Give memory a home");
});

test("shortcuts make bounded changes and reset remains usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#section-connection-quantity");
  const stats = page.locator("#stats-connection-quantity");
  await expect(stats).toContainText("reachable pairs 100%");
  const edgeCount = async () =>
    Number((await stats.textContent()).match(/^(\d+) edges/)[1]);
  const before = await edgeCount();
  for (let i = 0; i < 3; i += 1)
    await page.locator("#ctrl-deploy-internet").click();
  expect(await edgeCount()).toBe(before + 72);
  await page.locator("#ctrl-reset-connections").click();
  expect(await edgeCount()).toBeLessThanOrEqual(276);
  await expect(page.locator("#ctrl-deploy-internet")).toBeEnabled();
  await expect(stats).toContainText("reachable pairs 100%");
});
