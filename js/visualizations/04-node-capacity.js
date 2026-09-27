export function initNodeCapacity(canvas) {
  const ctx = canvas.getContext('2d');
  const stats = document.getElementById('stats-node-capacity');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let active = false;
  let frameId = null;
  let width = 0;
  let height = 0;
  let start = performance.now();

  const dimensions = [
    ['memory', true], ['skills', true], ['goals', true], ['state', true],
    ['history', false], ['mood', false], ['relationships', false], ['beliefs', false],
    ['health', false], ['habits', false], ['context', false], ['language', false],
    ['attention', false], ['preferences', false], ['experience', false], ['body', false]
  ].map(([label, kept], i) => ({
    label, kept,
    angle: (i / 16) * Math.PI * 2,
    radius: 72 + (i % 3) * 16
  }));

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function phaseState() {
    if (reduceMotion.matches) return { phase: 2, t: 1 };
    const cycle = ((performance.now() - start) % 11000) / 11000;
    if (cycle < 0.32) return { phase: 0, t: cycle / 0.32 };
    if (cycle < 0.68) return { phase: 1, t: (cycle - 0.32) / 0.36 };
    return { phase: 2, t: (cycle - 0.68) / 0.32 };
  }

  function ease(t) {
    return t * t * (3 - 2 * t);
  }

  function drawHuman(cx, cy, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = 'rgba(226,232,240,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - 48, 16, 0, Math.PI * 2);
    ctx.moveTo(cx, cy - 32);
    ctx.lineTo(cx, cy + 28);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx - 30, cy + 10);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx + 30, cy + 10);
    ctx.moveTo(cx, cy + 28);
    ctx.lineTo(cx - 22, cy + 66);
    ctx.moveTo(cx, cy + 28);
    ctx.lineTo(cx + 22, cy + 66);
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const { phase, t } = phaseState();
    const p = ease(t);
    const cx = width * 0.38;
    const cy = height * 0.5;
    const nodeX = width * 0.72;
    const nodeY = height * 0.5;

    const humanAlpha = phase === 0 ? 1 : phase === 1 ? 1 - p * 0.7 : 0.3;
    drawHuman(cx, cy, humanAlpha);

    dimensions.forEach((d, i) => {
      const ox = cx + Math.cos(d.angle) * d.radius;
      const oy = cy + Math.sin(d.angle) * d.radius * 0.72;
      let x = ox;
      let y = oy;
      let alpha = 0.85;

      if (phase === 1) {
        if (d.kept) {
          x = ox + (nodeX - ox) * p;
          y = oy + (nodeY - oy) * p;
        } else {
          alpha = 0.85 * (1 - p);
        }
      } else if (phase === 2) {
        if (d.kept) {
          x = nodeX + Math.cos((i / 4) * Math.PI * 2) * 24;
          y = nodeY + Math.sin((i / 4) * Math.PI * 2) * 24;
        } else {
          alpha = 0;
        }
      }

      if (alpha <= 0.01) return;
      ctx.beginPath();
      ctx.arc(x, y, d.kept ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = d.kept
        ? `rgba(56,189,248,${alpha})`
        : `rgba(148,163,184,${alpha * 0.75})`;
      ctx.fill();

      if (width > 620 && (phase === 0 || d.kept)) {
        ctx.fillStyle = `rgba(226,232,240,${alpha * 0.75})`;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.label, x, y - 9);
      }
    });

    const nodeAlpha = phase === 0 ? 0.08 : phase === 1 ? p : 1;
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, 28, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(79,156,247,${0.12 * nodeAlpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(79,156,247,${0.9 * nodeAlpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = `rgba(255,255,255,${nodeAlpha})`;
    ctx.font = '600 14px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('xᵢ ∈ ℝᵈ', nodeX, nodeY + 5);

    ctx.fillStyle = 'rgba(226,232,240,0.72)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    const label = phase === 0
      ? 'PERSON: MANY RELEVANT AND IRRELEVANT DIMENSIONS'
      : phase === 1
        ? 'COARSE-GRAINING: KEEP WHAT THE QUESTION NEEDS'
        : 'STYLIZED NODE: INFORMATION HAS BEEN DISCARDED';
    ctx.fillText(label, width / 2, 26);

    if (stats) {
      stats.textContent = phase === 0
        ? 'illustration: 16 visible dimensions · model has not compressed them yet'
        : phase === 1
          ? '4 illustrative dimensions retained · 12 discarded for this question'
          : 'xᵢ is a lower-dimensional model state, not a complete person';
    }
  }

  function loop() {
    frameId = null;
    draw();
    if (active && !reduceMotion.matches) frameId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (frameId === null) frameId = requestAnimationFrame(loop);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  resize();

  return {
    activate() {
      active = true;
      start = performance.now();
      startLoop();
    },
    deactivate() {
      active = false;
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    },
    resize,
    destroy() {
      this.deactivate();
      observer.disconnect();
    }
  };
}
