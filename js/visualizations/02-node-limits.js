export function initNodeLimits(canvas, controls) {
  const ctx = canvas.getContext('2d');
  const stats = document.getElementById('stats-node-limits');
  let active = false;
  let frameId = null;
  let width = 0;
  let height = 0;
  let optimizing = false;
  let environment = 0;

  const traits = [
    { name: 'attention', baseline: 0.33, cap0: 0.72, envShift: 0.10, value: 0.33 },
    { name: 'memory', baseline: 0.28, cap0: 0.80, envShift: 0.05, value: 0.28 },
    { name: 'endurance', baseline: 0.42, cap0: 0.68, envShift: 0.16, value: 0.42 },
    { name: 'skill', baseline: 0.24, cap0: 0.88, envShift: 0.07, value: 0.24 }
  ];

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

  function cap(trait) {
    return Math.min(1, trait.cap0 + trait.envShift * environment);
  }

  function update() {
    environment += optimizing ? 0.008 : -0.004;
    environment = Math.max(0, Math.min(1, environment));

    for (const trait of traits) {
      const target = optimizing ? cap(trait) : trait.baseline;
      trait.value += (target - trait.value) * 0.035;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const left = Math.max(72, width * 0.18);
    const right = width - Math.max(28, width * 0.08);
    const barW = Math.max(80, right - left);
    const startY = height * 0.27;
    const gap = Math.min(66, height * 0.14);

    ctx.fillStyle = 'rgba(226,232,240,0.72)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MULTIDIMENSIONAL PERFORMANCE ENVELOPE', width / 2, 28);
    ctx.fillText('environment can move some boundaries; no single universal maximum exists', width / 2, 46);

    traits.forEach((trait, i) => {
      const y = startY + i * gap;
      const c = cap(trait);

      ctx.fillStyle = 'rgba(148,163,184,0.13)';
      ctx.fillRect(left, y, barW, 10);

      ctx.fillStyle = 'rgba(56,189,248,0.72)';
      ctx.fillRect(left, y, barW * trait.value, 10);

      ctx.beginPath();
      ctx.moveTo(left + barW * c, y - 7);
      ctx.lineTo(left + barW * c, y + 17);
      ctx.strokeStyle = 'rgba(239,68,68,0.82)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(226,232,240,0.78)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(trait.name, left - 10, y + 9);

      ctx.textAlign = 'left';
      ctx.fillText(`current ${Math.round(trait.value * 100)} · envelope ${Math.round(c * 100)}`, left + 6, y - 8);
    });

    if (stats) {
      stats.textContent = `environment optimization ${Math.round(environment * 100)}% · four different trait envelopes · no scalar “maximum potential”`;
    }
  }

  function loop() {
    frameId = null;
    if (!active) return;
    update();
    draw();
    frameId = requestAnimationFrame(loop);
  }

  controls['optimize-nodes']?.addEventListener('mousedown', () => { optimizing = true; });
  controls['optimize-nodes']?.addEventListener('mouseup', () => { optimizing = false; });
  controls['optimize-nodes']?.addEventListener('mouseleave', () => { optimizing = false; });
  controls['optimize-nodes']?.addEventListener('touchstart', (e) => { e.preventDefault(); optimizing = true; }, { passive: false });
  controls['optimize-nodes']?.addEventListener('touchend', (e) => { e.preventDefault(); optimizing = false; }, { passive: false });
  if (controls['optimize-nodes']) controls['optimize-nodes'].textContent = 'Hold to Improve Environment';

  controls['reset-limits']?.addEventListener('click', () => {
    optimizing = false;
    environment = 0;
    for (const trait of traits) trait.value = trait.baseline;
    draw();
  });

  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  resize();

  return {
    activate() {
      active = true;
      if (frameId === null) frameId = requestAnimationFrame(loop);
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
