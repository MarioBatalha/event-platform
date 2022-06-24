import { sortBy } from './array';
import { dashToPascalCase } from './string';
export const ignoreChecks = () => ['/* eslint-disable */', '/* tslint:disable */', '// @ts-nocheck'].join('\n');
export const fileName = (c) => dashToPascalCase(c.tagName).slice(2);
export const buildImports = (components, ext = '', isDefaultExport = true) => components
  .map(c => `import ${isDefaultExport
  ? `${fileName(c)}Proxy`
  : `{ ${fileName(c)} as ${fileName(c)}Proxy }`} from './${fileName(c)}${ext}';`)
  .join('\n');
export const buildExports = (components) => components
  .map(c => `export const ${fileName(c)} = /*#__PURE__*/${fileName(c)}Proxy;`)
  .join('\n');
export const sortComponents = (cmps) => sortBy(cmps, (cmp) => cmp.tagName);
export const jsxEventName = (eventName) => `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
export const safeDefaultValue = (value) => {
  try {
    // eslint-disable-next-line no-eval
    eval(value !== null && value !== void 0 ? value : '');
    return true;
  }
  catch (e) {
    return false;
  }
};
export const findAllDependencies = (cmpMeta, components) => {
  const getDirectDeps = (tagName) => { var _a, _b; return (_b = (_a = components.find(cmp => cmp.tagName === tagName)) === null || _a === void 0 ? void 0 : _a.dependencies) !== null && _b !== void 0 ? _b : []; };
  const getDepTree = (tagName, imports = new Set()) => {
    var _a;
    imports.add(tagName);
    const deps = (_a = getDirectDeps(tagName)) !== null && _a !== void 0 ? _a : [];
    deps.forEach(dep => {
      getDepTree(dep, imports);
    });
    return Array.from(imports);
  };
  return getDepTree(cmpMeta.tagName).map(tagName => ({
    tagName,
    className: dashToPascalCase(tagName),
  }));
};
export const importAllDepdencies = (cmpMeta, components) => {
  const deps = findAllDependencies(cmpMeta, components);
  return `
import { 
  ${[...deps.map(i => i.className)].join(',\n  ')} 
} from '@vime/core';

import { define } from '../lib';
  `;
};
export const defineAllDependencies = (cmpMeta, components) => {
  const deps = findAllDependencies(cmpMeta, components);
  return `
${deps.map(cmp => `define('${cmp.tagName}', ${cmp.className});`).join('\n')}
  `;
};
