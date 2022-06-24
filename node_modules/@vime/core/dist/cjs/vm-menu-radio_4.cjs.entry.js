'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-86498cbd.js');
const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');
const PlayerDispatcher = require('./PlayerDispatcher-00dbedc9.js');
const withPlayerContext = require('./withPlayerContext-77ea833f.js');
const withControlsCollisionDetection = require('./withControlsCollisionDetection-7c7e2319.js');
require('./PlayerEvents-79156eee.js');

const MenuRadio = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.vmCheck = index.createEvent(this, "vmCheck", 7);
    /**
     * Whether the radio item is selected or not.
     */
    this.checked = false;
    /**
     * The URL to an SVG element or fragment to load.
     */
    this.checkIcon = 'check';
    withComponentRegistry.withComponentRegistry(this);
  }
  onClick() {
    this.checked = true;
    this.vmCheck.emit();
  }
  render() {
    return (index.h("vm-menu-item", { label: this.label, checked: this.checked, badge: this.badge, checkIcon: this.checkIcon, icons: this.icons, onClick: this.onClick.bind(this) }));
  }
};

const MenuRadioGroup = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.vmCheck = index.createEvent(this, "vmCheck", 7);
    withComponentRegistry.withComponentRegistry(this);
  }
  onValueChange() {
    var _a;
    (_a = this.findRadios()) === null || _a === void 0 ? void 0 : _a.forEach(radio => {
      radio.checked = radio.value === this.value;
    });
  }
  connectedCallback() {
    this.onValueChange();
  }
  componentDidLoad() {
    this.onValueChange();
  }
  onSelectionChange(event) {
    const radio = event.target;
    this.value = radio.value;
  }
  findRadios() {
    var _a;
    return (_a = this.host
      .shadowRoot.querySelector('slot')) === null || _a === void 0 ? void 0 : _a.assignedElements();
  }
  render() {
    return index.h("slot", null);
  }
  get host() { return index.getElement(this); }
  static get watchers() { return {
    "value": ["onValueChange"]
  }; }
};

const settingsCss = ":host{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:var(--vm-menu-z-index)}.settings{position:absolute;opacity:0;pointer-events:none;overflow-x:hidden;overflow-y:auto;background-color:var(--vm-menu-bg);max-height:var(--vm-settings-max-height);border-radius:var(--vm-settings-border-radius);padding:var(--vm-settings-padding);box-shadow:var(--vm-settings-shadow);box-sizing:border-box;scrollbar-width:thin;scroll-behavior:smooth;scrollbar-color:var(--vm-settings-scroll-thumb-color)\n    var(--vm-settings-scroll-track-color);transform:translateY(8px);transition:var(--vm-settings-transition)}.container{display:block;width:var(--vm-settings-width);height:100%;position:relative;transition:width 0.25s ease-in, height 0.25s ease-in}.settings.hydrated{visibility:hidden !important}.settings::-webkit-scrollbar{width:var(--vm-settings-scroll-width)}.settings::-webkit-scrollbar-track{background:var(--vm-settings-scroll-track-color)}.settings::-webkit-scrollbar-thumb{border-radius:var(--vm-settings-scroll-width);background-color:var(--vm-settings-scroll-thumb-color);border:2px solid var(--vm-menu-bg)}.settings.active{transform:translateY(0);opacity:1;pointer-events:auto;visibility:visible !important}.settings.mobile{position:fixed;top:auto !important;left:0 !important;right:0 !important;bottom:0 !important;width:100%;min-height:56px;max-height:50%;border-radius:0;z-index:2147483647;transform:translateY(100%)}.settings.mobile.active{transform:translateY(0)}.settings.mobile>vm-menu{height:100% !important;overflow:auto !important}";

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try {
      step(generator.next(value));
    }
    catch (e) {
      reject(e);
    } }
    function rejected(value) { try {
      step(generator["throw"](value));
    }
    catch (e) {
      reject(e);
    } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
let idCount$1 = 0;
const Settings = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.disposal = new withComponentRegistry.Disposal();
    this.menuHeight = 0;
    /**
     * Pins the settings to the defined position inside the video player. This has no effect when
     * the view is of type `audio` (always `bottomRight`) and on mobile devices (always bottom sheet).
     */
    this.pin = 'bottomRight';
    /**
     * Whether the settings menu is opened/closed.
     */
    this.active = false;
    /** @internal */
    this.isMobile = false;
    /** @internal */
    this.isAudioView = false;
    withComponentRegistry.withComponentRegistry(this);
    withControlsCollisionDetection.withControlsCollisionDetection(this);
    withPlayerContext.withPlayerContext(this, ['isMobile', 'isAudioView']);
  }
  onActiveChange() {
    this.dispatch('isSettingsActive', this.active);
    if (withComponentRegistry.isUndefined(this.controller))
      return;
    this.controller.expanded = this.active;
  }
  connectedCallback() {
    this.dispatch = PlayerDispatcher.createDispatcher(this);
    idCount$1 += 1;
    this.id = `vm-settings-${idCount$1}`;
  }
  disconnectedCallback() {
    this.disposal.empty();
  }
  /**
   * Sets the controller responsible for opening/closing this settings menu.
   */
  setController(controller) {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.controller = controller;
      this.controller.menu = this.id;
      this.disposal.empty();
      this.disposal.add(withComponentRegistry.listen(this.controller, 'click', () => {
        this.active = !this.active;
      }));
      this.disposal.add(withComponentRegistry.listen(this.controller, 'keydown', (event) => {
        if (event.key !== 'Enter')
          return;
        // We're looking for !active because the `click` event above will toggle it to active.
        if (!this.active)
          this.menu.focusMenu();
      }));
    });
  }
  getPosition() {
    if (this.isAudioView) {
      return {
        right: '0',
        bottom: 'calc(var(--vm-controls-height, 0) + 4px)',
      };
    }
    // topLeft => { top: 0, left: 0 }
    const pos = this.pin.split(/(?=[L|R])/).map(s => s.toLowerCase());
    return {
      [pos.includes('top') ? 'top' : 'bottom']: 'var(--vm-controls-height, 0)',
      [pos.includes('left') ? 'left' : 'right']: '8px',
    };
  }
  onOpen(event) {
    var _a;
    if (((_a = event.detail) === null || _a === void 0 ? void 0 : _a.identifier) !== this.id)
      return;
    this.active = true;
  }
  onClose(event) {
    var _a;
    if (((_a = event.detail) === null || _a === void 0 ? void 0 : _a.identifier) !== this.id)
      return;
    this.active = false;
  }
  onHeightChange(event) {
    this.menuHeight = event.detail;
  }
  render() {
    return (index.h("div", { style: Object.assign({}, this.getPosition()), class: {
        settings: true,
        active: this.active,
        mobile: this.isMobile,
      } }, index.h("div", { class: "container", style: { height: `${this.menuHeight}px` } }, index.h("vm-menu", { identifier: this.id, active: this.active, controller: this.controller, onVmOpen: this.onOpen.bind(this), onVmClose: this.onClose.bind(this), onVmMenuHeightChange: this.onHeightChange.bind(this), ref: (el) => {
        this.menu = el;
      } }, index.h("slot", null)))));
  }
  get host() { return index.getElement(this); }
  static get watchers() { return {
    "active": ["onActiveChange"]
  }; }
};
Settings.style = settingsCss;

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try {
      step(generator.next(value));
    }
    catch (e) {
      reject(e);
    } }
    function rejected(value) { try {
      step(generator["throw"](value));
    }
    catch (e) {
      reject(e);
    } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
let idCount = 0;
const Submenu = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.vmOpenSubmenu = index.createEvent(this, "vmOpenSubmenu", 7);
    this.vmCloseSubmenu = index.createEvent(this, "vmCloseSubmenu", 7);
    /**
     * The direction the submenu should slide in from.
     */
    this.slideInDirection = 'right';
    /**
     * Whether the submenu is open/closed.
     */
    this.active = false;
    withComponentRegistry.withComponentRegistry(this);
  }
  connectedCallback() {
    this.genId();
  }
  /**
   * Returns the controller (`vm-menu-item`) for this submenu.
   */
  getController() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.controller;
    });
  }
  /**
   * Returns the menu (`vm-menu`) for this submenu.
   */
  getMenu() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.menu;
    });
  }
  /**
   * Returns the height of the submenu controller.
   */
  getControllerHeight() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      return (_b = (_a = this.controller) === null || _a === void 0 ? void 0 : _a.getHeight()) !== null && _b !== void 0 ? _b : 0;
    });
  }
  getControllerHeightSync() {
    var _a;
    const el = (_a = this.controller) === null || _a === void 0 ? void 0 : _a.shadowRoot.querySelector("[role='menuitem']");
    return el ? parseFloat(window.getComputedStyle(el).height) : 0;
  }
  onMenuOpen() {
    this.active = true;
    this.vmOpenSubmenu.emit(this.host);
  }
  onMenuClose() {
    this.active = false;
    this.vmCloseSubmenu.emit(this.host);
  }
  genId() {
    idCount += 1;
    this.id = `vm-submenu-${idCount}`;
  }
  getControllerId() {
    return `${this.id}-controller`;
  }
  render() {
    return (index.h("div", null, index.h("vm-menu-item", { identifier: this.getControllerId(), menu: this.menu, label: this.label, hint: this.hint, expanded: this.active, ref: el => {
        index.writeTask(() => {
          this.controller = el;
        });
      } }), index.h("vm-menu", { identifier: this.id, controller: this.controller, active: this.active, slideInDirection: this.slideInDirection, onVmOpen: this.onMenuOpen.bind(this), onVmClose: this.onMenuClose.bind(this), ref: el => {
        index.writeTask(() => {
          this.menu = el;
        });
      }, style: { top: `${this.getControllerHeightSync() + 1}px` } }, index.h("slot", null))));
  }
  get host() { return index.getElement(this); }
};

exports.vm_menu_radio = MenuRadio;
exports.vm_menu_radio_group = MenuRadioGroup;
exports.vm_settings = Settings;
exports.vm_submenu = Submenu;
