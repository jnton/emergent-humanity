const menus = [...document.querySelectorAll('.chapter-menu, .audio-menu')]
  .filter((menu) => menu instanceof HTMLDetailsElement);

function closeMenu(menu, restoreFocus = false) {
  if (!(menu instanceof HTMLDetailsElement) || !menu.open) return;
  menu.open = false;
  if (restoreFocus) menu.querySelector('summary')?.focus();
}

menus.forEach((menu) => {
  const summary = menu.querySelector('summary');
  const syncExpanded = () => summary?.setAttribute('aria-expanded', String(menu.open));

  syncExpanded();
  menu.addEventListener('toggle', () => {
    syncExpanded();
    if (!menu.open) return;
    menus.forEach((otherMenu) => {
      if (otherMenu !== menu) closeMenu(otherMenu);
    });
  });
});

document.addEventListener('pointerdown', (event) => {
  menus.forEach((menu) => {
    if (menu.open && !menu.contains(event.target)) closeMenu(menu);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const openMenu = menus.find((menu) => menu.open);
  if (openMenu) {
    event.preventDefault();
    closeMenu(openMenu, true);
  }
});

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    menus.forEach((menu) => closeMenu(menu));
  });
}, { passive: true });
