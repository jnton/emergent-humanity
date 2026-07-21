function initializeAgentApi() {
  const normalizeControlId = (controlId) => String(controlId).replace(/^ctrl-/, '');

  const serializeControl = (element) => {
    if (!(element instanceof HTMLElement)) return null;
    const id = normalizeControlId(element.id);

    if (element instanceof HTMLButtonElement) {
      return {
        id,
        type: 'button',
        label: element.textContent?.trim() ?? id,
        disabled: element.disabled,
      };
    }

    if (element instanceof HTMLInputElement && element.type === 'range') {
      return {
        id,
        type: 'slider',
        label: element.labels?.[0]?.textContent?.trim() ?? element.getAttribute('aria-label') ?? id,
        value: Number(element.value),
        min: Number(element.min),
        max: Number(element.max),
        step: Number(element.step),
        valueText: element.getAttribute('aria-valuetext'),
        disabled: element.disabled,
      };
    }

    if (element instanceof HTMLInputElement && element.type === 'checkbox') {
      return {
        id,
        type: 'switch',
        label: element.labels?.[0]?.textContent?.trim() ?? element.getAttribute('aria-label') ?? id,
        checked: element.checked,
        disabled: element.disabled,
      };
    }

    return null;
  };

  const getSection = (sectionId) => document.getElementById(`section-${sectionId}`);

  const getChapters = () => [...document.querySelectorAll('.section')].map((section) => ({
    id: section.dataset.sectionId,
    number: section.querySelector('.section-number')?.textContent?.trim() ?? null,
    title: section.querySelector('.section-title')?.textContent?.trim() ?? null,
    subtitle: section.querySelector('.section-subtitle')?.textContent?.trim() ?? null,
    insight: section.querySelector('.insight')?.textContent?.trim() ?? null,
  }));

  const getControls = (sectionId) => {
    const section = getSection(sectionId);
    if (!section) return [];
    return [...section.querySelectorAll('[id^="ctrl-"]')]
      .map(serializeControl)
      .filter(Boolean);
  };

  const getStatus = (sectionId) => {
    const section = getSection(sectionId);
    if (!section) return null;
    return {
      sectionId,
      stats: section.querySelector('.viz-stats')?.textContent?.trim() || null,
      hint: section.querySelector('.viz-hint')?.textContent?.trim() || null,
      controls: getControls(sectionId),
    };
  };

  const operateControl = (controlId, value) => {
    const normalizedId = normalizeControlId(controlId);
    const element = document.getElementById(`ctrl-${normalizedId}`);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Unknown control: ${normalizedId}`);
    }

    if (element instanceof HTMLButtonElement) {
      if (element.disabled) throw new Error(`Control is disabled: ${normalizedId}`);
      element.click();
      return serializeControl(element);
    }

    if (element instanceof HTMLInputElement && element.type === 'range') {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) throw new TypeError(`Slider ${normalizedId} requires a numeric value.`);
      const min = Number(element.min);
      const max = Number(element.max);
      element.value = String(Math.min(max, Math.max(min, numericValue)));
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return serializeControl(element);
    }

    if (element instanceof HTMLInputElement && element.type === 'checkbox') {
      element.checked = value === undefined ? !element.checked : Boolean(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return serializeControl(element);
    }

    throw new Error(`Unsupported control: ${normalizedId}`);
  };

  const scrollToChapter = (sectionId) => {
    const section = getSection(sectionId);
    if (!section) throw new Error(`Unknown chapter: ${sectionId}`);
    section.scrollIntoView({ block: 'start', behavior: 'auto' });
    return { sectionId };
  };

  window.emergentHumanity = Object.freeze({
    version: '1.0.0',
    capabilities: Object.freeze([
      'list-chapters',
      'read-chapter-status',
      'list-controls',
      'operate-buttons',
      'set-sliders',
      'set-switches',
      'navigate-chapters',
    ]),
    getChapters,
    getCurrentChapter: () => document.querySelector('[aria-current="location"]')?.dataset.sectionLink ?? null,
    getControls,
    getStatus,
    operateControl,
    scrollToChapter,
  });

  document.documentElement.dataset.agentReady = 'true';
  document.dispatchEvent(new CustomEvent('emergent-humanity:agent-ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAgentApi, { once: true });
} else {
  initializeAgentApi();
}
