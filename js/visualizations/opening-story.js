// An illustrative change of scale, not a simulation of collective consciousness.
// The Human Node animation is deliberately independent and remains untouched.
export function createOpeningStory(canvas) {
  const ctx = canvas.getContext("2d");
  const stats = canvas.closest(".section").querySelector(".viz-stats");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let active = false,
    frame = null,
    last = null,
    time = 0;
  let width = 1,
    height = 1;
  let phase = "";

  // Irregular, reproducible geometry; no radial rings or privileged central node.
  let seed = 7319;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const nodes = [{ x: -0.43, y: 0.24 }];
  while (nodes.length < 54) {
    const x = random() * 1.8 - 0.9,
      y = random() * 1.8 - 0.9;
    const angle = Math.atan2(y, x);
    const boundary =
      0.8 + 0.11 * Math.sin(3 * angle + 0.6) + 0.07 * Math.cos(5 * angle);
    if (
      Math.hypot(x, y) > boundary ||
      nodes.some((p) => Math.hypot(p.x - x, p.y - y) < 0.105)
    )
      continue;
    nodes.push({ x, y });
  }
  const edges = [],
    edgeKeys = new Set();
  const connect = (a, b) => {
    const key = [Math.min(a, b), Math.max(a, b)].join(":");
    if (!edgeKeys.has(key)) {
      edgeKeys.add(key);
      edges.push([a, b]);
    }
  };
  // A minimum spanning tree ensures one connected whole without favouring the origin.
  const connected = new Set([0]);
  while (connected.size < nodes.length) {
    let shortest = Infinity,
      pair;
    for (const a of connected)
      for (let b = 0; b < nodes.length; b++) {
        if (connected.has(b)) continue;
        const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
        if (d < shortest) {
          shortest = d;
          pair = [a, b];
        }
      }
    connect(...pair);
    connected.add(pair[1]);
  }
  nodes.forEach((p, i) => {
    const near = nodes
      .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
      .filter((q) => q.j !== i)
      .sort((a, b) => a.d - b.d);
    near.slice(0, 2 + (i % 3 === 0 ? 1 : 0)).forEach((q) => connect(i, q.j));
  });
  // A softly rounded envelope follows the actual population instead of drawing a circle.
  const sorted = [...nodes].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (a, b, c) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const halfHull = (points) => {
    const hull = [];
    for (const p of points) {
      while (hull.length > 1 && cross(hull.at(-2), hull.at(-1), p) <= 0)
        hull.pop();
      hull.push(p);
    }
    return hull.slice(0, -1);
  };
  const hull = [...halfHull(sorted), ...halfHull([...sorted].reverse())].map(
    (p) => ({ x: p.x * 1.2, y: p.y * 1.2 }),
  );
  const smooth = (a, b, t) => {
    const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return u * u * (3 - 2 * u);
  };
  function sceneTime() {
    return reduced.matches ? 20000 : time % 32000;
  }
  function sync(t) {
    const next =
      t < 8300 || t >= 31300 ? "node" : t < 13500 ? "network" : "whole";
    if (next === phase) return;
    phase = next;
    canvas.dataset.storyStage = phase;
    canvas.dataset.storyMembers = String(phase === "node" ? 1 : nodes.length);
    const copy =
      phase === "node"
        ? "One person."
        : phase === "network"
          ? "A network comes into view."
          : "The individual points recede. The whole becomes visible.";
    stats.textContent = copy;
    canvas.setAttribute(
      "aria-label",
      copy +
        (phase === "whole"
          ? " An irregular network forms one gently breathing shape; no individual is highlighted."
          : ""),
    );
  }
  function dot(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  function draw() {
    const raw = sceneTime();
    sync(raw);
    const t = raw >= 31300 ? 0 : raw;
    const equal = smooth(5500, 7200, t);
    const label = 1 - smooth(7200, 8200, t);
    const pullback = smooth(8300, 12800, t);
    const reveal = smooth(8300, 11800, t);
    const whole = smooth(13500, 18000, t);
    const fade =
      raw >= 31300 ? smooth(31300, 31900, raw) : 1 - smooth(30000, 31300, raw);
    const detail = 1 - 0.95 * smooth(13500, 18500, t);
    const cx = width / 2,
      cy = height * 0.46;
    const radius = Math.min(width * 0.43, height * 0.38, 270);
    // The camera starts on the original person, then finds the whole's centre.
    // That same person remains at their actual, off-centre position throughout.
    const zoom = (1.55 - 0.55 * pullback) * (1 - 0.12 * whole);
    const breath = 1 + Math.sin(t * 0.00105) * 0.025 * whole;
    const project = (p) => ({
      x: cx + (p.x - nodes[0].x * (1 - pullback)) * radius * zoom * breath,
      y: cy + (p.y - nodes[0].y * (1 - pullback)) * radius * zoom * breath,
    });
    const positions = nodes.map(project);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = fade;
    if (whole > 0) {
      const envelope = hull.map(project);
      ctx.beginPath();
      const start = envelope[0],
        end = envelope.at(-1);
      ctx.moveTo((start.x + end.x) / 2, (start.y + end.y) / 2);
      for (let i = 0; i < envelope.length; i++) {
        const p = envelope[i],
          q = envelope[(i + 1) % envelope.length];
        ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
      }
      ctx.closePath();
      const glow = ctx.createRadialGradient(
        cx - radius * 0.1,
        cy,
        0,
        cx,
        cy,
        radius,
      );
      glow.addColorStop(0, `rgba(74,148,242,${0.48 * whole})`);
      glow.addColorStop(0.7, `rgba(56,126,218,${0.35 * whole})`);
      glow.addColorStop(1, `rgba(48,108,194,${0.13 * whole})`);
      ctx.fillStyle = glow;
      ctx.shadowColor = `rgba(79,156,247,${0.5 * whole})`;
      ctx.shadowBlur = 30 * whole;
      ctx.fill();
      ctx.strokeStyle = `rgba(145,195,249,${0.55 * whole})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    // Relationships are structural lines only: no travelling particles or message pulses.
    ctx.lineWidth = 0.8;
    for (const [a, b] of edges) {
      ctx.strokeStyle = `rgba(96,161,235,${reveal * 0.22 * detail})`;
      ctx.beginPath();
      ctx.moveTo(positions[a].x, positions[a].y);
      ctx.lineTo(positions[b].x, positions[b].y);
      ctx.stroke();
    }
    positions.forEach((p, i) => {
      const opacity = i === 0 ? 1 : reveal;
      const prominence = i === 0 ? 1 - equal : 0;
      const red = Math.round(110 + 115 * prominence),
        green = Math.round(170 + 68 * prominence),
        blue = Math.round(241 + 14 * prominence);
      dot(
        p.x,
        p.y,
        2.6 + 2.9 * prominence,
        `rgba(${red},${green},${blue},${opacity * 0.9 * detail})`,
      );
    });
    if (label > 0) {
      ctx.font = "500 15px system-ui";
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(232,236,244,${label})`;
      ctx.fillText("You", positions[0].x, positions[0].y - 20);
    }
    ctx.restore();
  }
  function schedule() {
    if (
      active &&
      frame === null &&
      !document.hidden &&
      !reduced.matches &&
      document.documentElement.dataset.motionPaused !== "true"
    )
      frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = null;
    const dt = last === null ? 0 : Math.min(50, now - last);
    last = now;
    time += dt;
    draw();
    schedule();
  }
  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    last = null;
  }
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  resize();
  return {
    activate() {
      if (!active) {
        time = 0;
        phase = "";
        draw();
      }
      active = true;
      schedule();
    },
    deactivate() {
      active = false;
      stop();
    },
    resize,
    renderStatic() {
      draw();
    },
    destroy() {
      active = false;
      stop();
    },
  };
}
