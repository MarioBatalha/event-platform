'use strict';

const index = require('./index-86498cbd.js');
const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');

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
  const el = index.getElement(component);
  withComponentRegistry.createStencilHook(component, () => {
    watch.add(el);
  }, () => {
    watch.delete(el);
  });
}
const getIconLibraryResolver = (name) => registry.get(name);
function registerIconLibrary(name, resolver) {
  if (!withComponentRegistry.isUndefined(resolver)) {
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

exports.deregisterIconLibrary = deregisterIconLibrary;
exports.getIconLibraryResolver = getIconLibraryResolver;
exports.registerIconLibrary = registerIconLibrary;
exports.withIconRegistry = withIconRegistry;
