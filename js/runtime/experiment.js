import { drawScene } from "../renderers/scenes.js";
const clients = new Set();
let frame = null,
  last = null,
  globalPaused = false;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
// Fixed logical steps. No stochastic model reads RAF timestamps.
export const STEP_MS = 300;
function schedule() {
  if (
    frame === null &&
    !document.hidden &&
    !globalPaused &&
    [...clients].some((c) => c.isRunning())
  )
    frame = requestAnimationFrame(tick);
}
function tick(now) {
  frame = null;
  const dt = last === null ? 0 : Math.min(100, now - last);
  last = now;
  for (const client of clients) client.advance(dt);
  if (
    [...clients].some((c) => c.isRunning()) &&
    !document.hidden &&
    !globalPaused
  )
    schedule();
  else last = null;
}
function suspend() {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  last = null;
}
export function pauseAll(paused) {
  globalPaused = paused;
  suspend();
  if (!paused) schedule();
  document.dispatchEvent(
    new CustomEvent("experiment-motion", { detail: { paused } }),
  );
}
document.addEventListener("visibilitychange", () => {
  suspend();
  if (!document.hidden) schedule();
});
reduced.addEventListener("change", () => {
  for (const client of clients) client.pause();
  suspend();
});
window.addEventListener("pagehide", suspend);
window.addEventListener("pageshow", schedule);
export function mountExperiment(canvas, model, describe) {
  const section = canvas.closest(".section"),
    stats = section.querySelector(".viz-stats"),
    announcement = section.querySelector(".experiment-announcement");
  let active = false,
    visible = false,
    running = false,
    accumulator = 0,
    destroyed = false,
    width = 1,
    height = 1;
  let previous = null,
    target = null,
    transition = 1;
  const run = section.querySelector("[data-run]");
  function render(announce = false, animate = announce) {
    const state = model.snapshot();
    previous = target;
    target = state;
    transition = animate && !reduced.matches && !globalPaused ? 0 : 1;
    drawScene(canvas, state, width, height, { previous, progress: transition });
    schedule();
    const text = describe(state);
    stats.textContent = text;
    canvas.setAttribute("aria-label", text);
    if (announce) announcement.textContent = text;
    canvas.dataset.modelState = JSON.stringify(state);
  }
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    render();
  }
  function sync() {
    const canRun = model.snapshot().canRun;
    if (run) run.hidden = !canRun;
    section.querySelector("[data-step]").hidden = !canRun;
    if (run) {
      run.textContent = running ? "Pause" : "Run";
      run.setAttribute("aria-pressed", String(running));
    }
  }
  const client = {
    isRunning: () =>
      active && visible && (running || transition < 1) && !destroyed,
    pause() {
      running = false;
      transition = 1;
      if (target) drawScene(canvas, target, width, height);
      accumulator = 0;
      sync();
    },
    advance(dt) {
      if (!client.isRunning()) return;
      if (transition < 1) {
        transition = Math.min(1, transition + dt / 220);
        drawScene(canvas, target, width, height, {
          previous,
          progress: transition,
        });
      }
      if (!running) return;
      accumulator += dt;
      if (accumulator >= STEP_MS) {
        accumulator -= STEP_MS;
        model.step();
        if (model.snapshot().done) client.pause();
        render(!running, true);
      }
    },
  };
  clients.add(client);
  const abort = new AbortController(),
    options = { signal: abort.signal };
  section.querySelectorAll('[id^="ctrl-"]').forEach((el) =>
    el.addEventListener(
      el.type === "range"
        ? "input"
        : el.type === "checkbox"
          ? "change"
          : "click",
      () => {
        model.act(
          el.id.slice(5),
          el.type === "checkbox" ? el.checked : Number(el.value),
        );
        render(true);
      },
      options,
    ),
  );
  run?.addEventListener(
    "click",
    () => {
      running = !running;
      accumulator = 0;
      sync();
      schedule();
    },
    options,
  );
  section.querySelector("[data-step]")?.addEventListener(
    "click",
    () => {
      client.pause();
      model.step();
      render(true);
    },
    options,
  );
  section.querySelector("[data-reset]")?.addEventListener(
    "click",
    () => {
      client.pause();
      model.reset();
      section.querySelectorAll("input").forEach((el) => {
        if (el.type === "checkbox") el.checked = el.defaultChecked;
        else el.value = el.defaultValue;
        el.dispatchEvent(new Event("control-reset"));
      });
      render(true);
    },
    options,
  );
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    accumulator = 0;
    schedule();
  });
  visibility.observe(canvas);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  sync();
  resize();
  return {
    activate() {
      active = true;
      schedule();
    },
    deactivate() {
      active = false;
      accumulator = 0;
    },
    resize,
    destroy() {
      destroyed = true;
      client.pause();
      clients.delete(client);
      observer.disconnect();
      visibility.disconnect();
      abort.abort();
    },
    getSnapshot: () => model.snapshot(),
    renderStatic: () => render(),
    pause: client.pause,
  };
}
