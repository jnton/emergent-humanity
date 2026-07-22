import { createNetworkEngine as createCoreNetworkEngine } from './network-engine.js?core=1';

const MOBILE_BREAKPOINT = 900;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nodeVisualRadius(node) {
  const body = (node.radius ?? 5) * (0.8 + (node.quality ?? 0.5) * 0.4);
  const glow = node.signal > 0.1 ? 8 : (node.isBroker ? 5 : 3);
  return body + glow;
}

function getSafeBounds(canvas) {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  const mobile = width <= MOBILE_BREAKPOINT;
  const side = mobile ? 18 : 28;
  const top = mobile ? 104 : 58;
  const bottom = mobile ? 22 : 76;

  return {
    width,
    height,
    left: side,
    right: Math.max(side + 1, width - side),
    top,
    bottom: Math.max(top + 1, height - bottom),
  };
}

function containNodes(engine, canvas) {
  const bounds = getSafeBounds(canvas);

  for (const node of engine.getNodes()) {
    if (node.state === 0 || !Number.isFinite(node.x) || !Number.isFinite(node.y)) continue;
    const radius = nodeVisualRadius(node);
    const minX = bounds.left + radius;
    const maxX = bounds.right - radius;
    const minY = bounds.top + radius;
    const maxY = bounds.bottom - radius;

    if (minX <= maxX) {
      const nextX = clamp(node.x, minX, maxX);
      if (nextX !== node.x) node.vx = (node.vx ?? 0) * 0.2;
      node.x = nextX;
      if (node.fx != null) node.fx = clamp(node.fx, minX, maxX);
    }
    if (minY <= maxY) {
      const nextY = clamp(node.y, minY, maxY);
      if (nextY !== node.y) node.vy = (node.vy ?? 0) * 0.2;
      node.y = nextY;
      if (node.fy != null) node.fy = clamp(node.fy, minY, maxY);
    }
  }
}

function createViewportForce(engine, canvas) {
  let nodes = [];

  function force(alpha) {
    const bounds = getSafeBounds(canvas);

    for (const node of nodes) {
      if (node.state === 0 || !Number.isFinite(node.x) || !Number.isFinite(node.y)) continue;

      const radius = nodeVisualRadius(node);
      const minX = bounds.left + radius;
      const maxX = bounds.right - radius;
      const minY = bounds.top + radius;
      const maxY = bounds.bottom - radius;
      const strength = 0.34 * Math.max(alpha, 0.12);

      if (node.x < minX) node.vx = (node.vx ?? 0) + (minX - node.x) * strength;
      if (node.x > maxX) node.vx = (node.vx ?? 0) - (node.x - maxX) * strength;
      if (node.y < minY) node.vy = (node.vy ?? 0) + (minY - node.y) * strength;
      if (node.y > maxY) node.vy = (node.vy ?? 0) - (node.y - maxY) * strength;
    }
  }

  force.initialize = (nextNodes) => {
    nodes = nextNodes ?? engine.getNodes();
  };

  return force;
}

function installViewportGuard(engine, canvas) {
  if (engine.__viewportGuardInstalled) return engine;
  engine.__viewportGuardInstalled = true;

  const viewportForce = createViewportForce(engine, canvas);
  const pendingFits = new Set();

  function cancelPendingFits() {
    pendingFits.forEach((timer) => window.clearTimeout(timer));
    pendingFits.clear();
  }

  function fitNow() {
    const nodes = engine.getNodes().filter((node) => (
      node.state !== 0 && Number.isFinite(node.x) && Number.isFinite(node.y)
    ));
    if (nodes.length === 0) return;

    const bounds = getSafeBounds(canvas);
    const left = Math.min(...nodes.map((node) => node.x - nodeVisualRadius(node)));
    const right = Math.max(...nodes.map((node) => node.x + nodeVisualRadius(node)));
    const top = Math.min(...nodes.map((node) => node.y - nodeVisualRadius(node)));
    const bottom = Math.max(...nodes.map((node) => node.y + nodeVisualRadius(node)));
    const spanX = Math.max(1, right - left);
    const spanY = Math.max(1, bottom - top);
    const availableX = Math.max(1, bounds.right - bounds.left);
    const availableY = Math.max(1, bounds.bottom - bounds.top);
    const scale = Math.min(1, availableX / spanX, availableY / spanY);
    const sourceCenterX = (left + right) / 2;
    const sourceCenterY = (top + bottom) / 2;
    const targetCenterX = (bounds.left + bounds.right) / 2;
    const targetCenterY = (bounds.top + bounds.bottom) / 2;

    for (const node of nodes) {
      node.x = targetCenterX + (node.x - sourceCenterX) * scale;
      node.y = targetCenterY + (node.y - sourceCenterY) * scale;
    }
    containNodes(engine, canvas);
  }

  function scheduleFits() {
    cancelPendingFits();
    [0, 180, 520, 1000, 1800, 3000].forEach((delay) => {
      const timer = window.setTimeout(() => {
        pendingFits.delete(timer);
        fitNow();
      }, delay);
      pendingFits.add(timer);
    });
  }

  function applyGuard() {
    const simulation = engine.getSimulation?.();
    if (!simulation) return;
    simulation.force('viewport-bounds', viewportForce);
    // D3 forces added later by individual visualizations can run after our force.
    // A namespaced tick listener therefore performs the final hard containment.
    simulation.on('tick.viewport-guard', () => containNodes(engine, canvas));
    fitNow();
    simulation.alpha(Math.max(simulation.alpha(), 0.25)).restart();
    scheduleFits();
  }

  function wrapLifecycle(name) {
    const original = engine[name];
    if (typeof original !== 'function') return;
    engine[name] = function guardedLifecycle(...args) {
      const result = original.apply(this, args);
      applyGuard();
      return result;
    };
  }

  ['init', 'rebuildSimulation', 'reset', 'resize'].forEach(wrapLifecycle);

  const originalDestroy = engine.destroy;
  engine.destroy = function guardedDestroy(...args) {
    cancelPendingFits();
    engine.getSimulation?.()?.on('tick.viewport-guard', null);
    resizeObserver.disconnect();
    delete canvas.__EMERGENT_NETWORK_VIEWPORT__;
    return originalDestroy?.apply(this, args);
  };

  const resizeObserver = new ResizeObserver(() => applyGuard());
  resizeObserver.observe(canvas.parentElement ?? canvas);

  canvas.__EMERGENT_NETWORK_VIEWPORT__ = {
    fitNow,
    refresh: applyGuard,
    getStatus() {
      const bounds = getSafeBounds(canvas);
      const activeNodes = engine.getNodes().filter((node) => node.state !== 0);
      const clipped = activeNodes.filter((node) => {
        if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return true;
        const radius = nodeVisualRadius(node);
        return node.x - radius < bounds.left - 0.5
          || node.x + radius > bounds.right + 0.5
          || node.y - radius < bounds.top - 0.5
          || node.y + radius > bounds.bottom + 0.5;
      });
      return {
        nodeCount: activeNodes.length,
        clippedCount: clipped.length,
        bounds,
      };
    },
  };

  applyGuard();
  return engine;
}

export function createNetworkEngine(canvas, options = {}) {
  return installViewportGuard(createCoreNetworkEngine(canvas, options), canvas);
}
