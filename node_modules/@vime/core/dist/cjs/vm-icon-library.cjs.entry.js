'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-86498cbd.js');
const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');
const withPlayerContext = require('./withPlayerContext-77ea833f.js');
const IconRegistry = require('./IconRegistry-24a44c42.js');
require('./PlayerEvents-79156eee.js');

const IconLibrary = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    /** @internal */
    this.icons = 'material';
    withComponentRegistry.withComponentRegistry(this);
    withPlayerContext.withPlayerContext(this, ['icons']);
  }
  handleUpdate() {
    this.register();
  }
  connectedCallback() {
    this.register();
  }
  disconnectedCallback() {
    if (!withComponentRegistry.isUndefined(this.name))
      IconRegistry.deregisterIconLibrary(this.name);
  }
  register() {
    var _a;
    IconRegistry.registerIconLibrary((_a = this.name) !== null && _a !== void 0 ? _a : this.icons, this.name ? this.resolver : undefined);
  }
  get host() { return index.getElement(this); }
  static get watchers() { return {
    "name": ["handleUpdate"],
    "resolver": ["handleUpdate"],
    "icons": ["handleUpdate"]
  }; }
};

exports.vm_icon_library = IconLibrary;
