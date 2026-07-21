// Small platform guards loaded before the application modules.

if ('ResizeObserver' in window) {
  const NativeResizeObserver = window.ResizeObserver;

  window.ResizeObserver = class StableResizeObserver extends NativeResizeObserver {
    constructor(callback) {
      const lastSizes = new WeakMap();
      super((entries, observer) => {
        const changedEntries = entries.filter((entry) => {
          const width = Math.round(entry.contentRect.width * 100) / 100;
          const height = Math.round(entry.contentRect.height * 100) / 100;
          const signature = `${width}:${height}`;
          if (lastSizes.get(entry.target) === signature) return false;
          lastSizes.set(entry.target, signature);
          return true;
        });

        if (changedEntries.length > 0) callback(changedEntries, observer);
      });
    }
  };
}

// The visualization lifecycle intentionally tears down on pagehide. A full
// refresh on a back/forward-cache restore guarantees fresh canvas instances.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.location.reload();
});
