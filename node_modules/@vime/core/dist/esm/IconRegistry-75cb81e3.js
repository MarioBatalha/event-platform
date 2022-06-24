import { g as getElement } from './index-f5fd0f81.js';
import { j as createStencilHook, e as isUndefined } from './withComponentRegistry-28311671.js';

/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon-library/icon-library-registry.ts
 */
const ICONS_BASE_CDN_URL = 'https://cdn.jsdelivr.net/npm/@vime/core@latest/icons';
const registry = new Map(Object.entries({
  vime: iconName => `${ICONS_BASE_CDN_URL}/vime/vm-${iconName}.svg`,
  material: iconName => `${ICONS_BASE_CDN_URL}/material/md-${iconName}.svg`,
}));
const watch = new Set();
function withIconRegistry(component) {
  const el = getElement(component);
  createStencilHook(component, () => {
    watch.add(el);
  }, () => {
    watch.delete(el);
  });
}
const getIconLibraryResolver = (name) => registry.get(name);
function registerIconLibrary(name, resolver) {
  if (!isUndefined(resolver)) {
    registry.set(name, resolver);
  }
  // Redraw watched icons.
  watch.forEach(iconEl => {
    if (iconEl.library === name)
      iconEl.redraw();
  });
}
function deregisterIconLibrary(name) {
  registry.delete(name);
}

export { deregisterIconLibrary as d, getIconLibraryResolver as g, registerIconLibrary as r, withIconRegistry as w };
