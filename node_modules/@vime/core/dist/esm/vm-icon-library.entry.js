import { r as registerInstance, g as getElement } from './index-f5fd0f81.js';
import { c as withComponentRegistry, e as isUndefined } from './withComponentRegistry-28311671.js';
import { w as withPlayerContext } from './withPlayerContext-4c52f564.js';
import { d as deregisterIconLibrary, r as registerIconLibrary } from './IconRegistry-75cb81e3.js';
import './PlayerEvents-5c5704d6.js';

const IconLibrary = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    /** @internal */
    this.icons = 'material';
    withComponentRegistry(this);
    withPlayerContext(this, ['icons']);
  }
  handleUpdate() {
    this.register();
  }
  connectedCallback() {
    this.register();
  }
  disconnectedCallback() {
    if (!isUndefined(this.name))
      deregisterIconLibrary(this.name);
  }
  register() {
    var _a;
    registerIconLibrary((_a = this.name) !== null && _a !== void 0 ? _a : this.icons, this.name ? this.resolver : undefined);
  }
  get host() { return getElement(this); }
  static get watchers() { return {
    "name": ["handleUpdate"],
    "resolver": ["handleUpdate"],
    "icons": ["handleUpdate"]
  }; }
};

export { IconLibrary as vm_icon_library };
