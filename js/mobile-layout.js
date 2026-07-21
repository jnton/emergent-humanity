const mobileQuery = window.matchMedia('(max-width: 900px)');

function createMobileHeading(section) {
  const existing = section.querySelector(':scope > .mobile-section-heading');
  if (existing) return existing;

  const number = section.querySelector('.section-number')?.textContent?.trim() ?? '';
  const title = section.querySelector('.section-title')?.textContent?.trim() ?? '';
  const heading = document.createElement('div');
  heading.className = 'mobile-section-heading';

  const copy = document.createElement('div');
  copy.className = 'mobile-section-heading-copy';
  copy.setAttribute('aria-hidden', 'true');

  const numberElement = document.createElement('span');
  numberElement.className = 'mobile-section-number';
  numberElement.textContent = number;

  const titleElement = document.createElement('strong');
  titleElement.className = 'mobile-section-title';
  titleElement.textContent = title;

  copy.append(numberElement, titleElement);
  heading.appendChild(copy);

  if (section.dataset.sectionId === 'whats-next') {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'canvas-touch-toggle';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.setAttribute('aria-label', 'Enable node dragging on the visualization');
    toggle.textContent = 'Move nodes';
    toggle.addEventListener('click', () => {
      const pane = section.querySelector('.viz-pane');
      if (!pane) return;
      const active = pane.classList.toggle('touch-interaction-active');
      toggle.setAttribute('aria-pressed', String(active));
      toggle.textContent = active ? 'Done' : 'Move nodes';
      toggle.setAttribute(
        'aria-label',
        active ? 'Disable node dragging and restore page scrolling' : 'Enable node dragging on the visualization'
      );
    });
    heading.appendChild(toggle);
  }

  return heading;
}

function applyMobileLayout() {
  document.querySelectorAll('.section').forEach((section) => {
    const pane = section.querySelector(':scope > .viz-pane');
    if (!pane) return;

    const heading = createMobileHeading(section);
    if (!heading.isConnected) section.insertBefore(heading, pane);

    const controls = pane.querySelector(':scope > .viz-controls')
      ?? section.querySelector(':scope > .viz-controls');
    if (controls) {
      controls.classList.add('mobile-control-dock');
      if (controls.parentElement !== section) pane.insertAdjacentElement('afterend', controls);
    }
  });

  window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
}

function restoreDesktopLayout() {
  document.querySelectorAll('.section').forEach((section) => {
    const pane = section.querySelector(':scope > .viz-pane');
    const controls = section.querySelector(':scope > .viz-controls');
    if (pane && controls) {
      controls.classList.remove('mobile-control-dock');
      pane.appendChild(controls);
    }

    pane?.classList.remove('touch-interaction-active');
    section.querySelector(':scope > .mobile-section-heading')?.remove();
  });

  window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
}

function syncLayout() {
  if (mobileQuery.matches) applyMobileLayout();
  else restoreDesktopLayout();

  document.documentElement.dataset.mobileLayout = mobileQuery.matches ? 'active' : 'inactive';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncLayout, { once: true });
} else {
  syncLayout();
}

mobileQuery.addEventListener?.('change', syncLayout);

window.__EMERGENT_MOBILE_DEBUG__ = {
  syncLayout,
  getState: () => ({
    active: mobileQuery.matches,
    headings: document.querySelectorAll('.mobile-section-heading').length,
    dockedControls: document.querySelectorAll('.mobile-control-dock').length,
  }),
};
