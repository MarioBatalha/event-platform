import { r as registerInstance, c as createEvent, w as writeTask, h, g as getElement } from './index-f5fd0f81.js';
import { e as isUndefined, c as withComponentRegistry, n as isNil } from './withComponentRegistry-28311671.js';
import { w as withPlayerContext } from './withPlayerContext-4c52f564.js';
import './PlayerEvents-5c5704d6.js';

function unwrapSubmenu(el) {
  if (el.tagName.toLowerCase() !== 'vm-submenu')
    return el;
  const submenu = el;
  return submenu.shadowRoot.querySelector('vm-menu-item');
}
function unwrapRadioGroup(el) {
  var _a;
  if (el.tagName.toLowerCase() !== 'vm-menu-radio-group')
    return el;
  const radioGroup = el;
  const slot = radioGroup.shadowRoot.querySelector('slot');
  const assignedElements = Array.from((_a = slot === null || slot === void 0 ? void 0 : slot.assignedElements()) !== null && _a !== void 0 ? _a : []);
  return assignedElements
    .filter(radio => radio.tagName.toLowerCase() === 'vm-menu-radio')
    .map(radio => radio.shadowRoot.querySelector('vm-menu-item'));
}
function menuItemHunter(assignedElements) {
  if (isUndefined(assignedElements))
    return [];
  const allowed = ['vm-menu-item', 'vm-menu-radio-group', 'vm-submenu'];
  return Array.from(assignedElements !== null && assignedElements !== void 0 ? assignedElements : [])
    .filter(el => allowed.includes(el.tagName.toLowerCase()))
    .map(el => unwrapSubmenu(el))
    .map(el => unwrapRadioGroup(el))
    .reduce((acc, val) => acc.concat(val), []);
}

const menuCss = ":host{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:var(--vm-menu-z-index)}:host([active]){pointer-events:auto;z-index:calc(var(--vm-menu-z-index) + 1)}.menu{position:absolute;top:0;left:0;width:100%;height:100%;box-sizing:border-box;transition:var(--vm-menu-transition)}.menu.slideIn{transform:translateX(0)}.menu[aria-hidden='true'].slideInFromLeft{transform:translateX(-100%)}.menu[aria-hidden='true'].slideInFromRight{transform:translateX(100%)}.container{display:flex;flex-direction:column;position:relative;text-align:left;width:100%;height:100%;color:var(--vm-menu-color);background:var(--vm-menu-bg);font-size:var(--vm-menu-font-size);font-weight:var(--vm-menu-font-weight)}.menu:focus{outline:0}";

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
const Menu = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmOpen = createEvent(this, "vmOpen", 7);
    this.vmClose = createEvent(this, "vmClose", 7);
    this.vmFocus = createEvent(this, "vmFocus", 7);
    this.vmBlur = createEvent(this, "vmBlur", 7);
    this.vmActiveSubmenuChange = createEvent(this, "vmActiveSubmenuChange", 7);
    this.vmActiveMenuItemChange = createEvent(this, "vmActiveMenuItemChange", 7);
    this.vmMenuHeightChange = createEvent(this, "vmMenuHeightChange", 3);
    this.hasDisconnected = false;
    /**
     * Whether the menu is open/visible.
     */
    this.active = false;
    withComponentRegistry(this);
  }
  onActiveMenuitemChange() {
    this.vmActiveMenuItemChange.emit(this.activeMenuItem);
  }
  onActiveSubmenuChange() {
    this.vmActiveSubmenuChange.emit(this.activeSubmenu);
  }
  onActiveChange() {
    var _a;
    if (this.hasDisconnected)
      return;
    this.active ? this.vmOpen.emit(this.host) : this.vmClose.emit(this.host);
    if (((_a = this.controller) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase()) === 'vm-menu-item') {
      this.controller.expanded = true;
    }
  }
  connectedCallback() {
    this.hasDisconnected = false;
  }
  componentDidRender() {
    writeTask(() => {
      if (!this.hasDisconnected)
        this.calculateHeight();
    });
  }
  disconnectedCallback() {
    this.controller = undefined;
    this.hasDisconnected = true;
  }
  /**
   * Focuses the menu.
   */
  focusMenu() {
    var _a;
    return __awaiter$1(this, void 0, void 0, function* () {
      (_a = this.menu) === null || _a === void 0 ? void 0 : _a.focus();
    });
  }
  /**
   * Removes focus from the menu.
   */
  blurMenu() {
    var _a;
    return __awaiter$1(this, void 0, void 0, function* () {
      (_a = this.menu) === null || _a === void 0 ? void 0 : _a.blur();
    });
  }
  /**
   * Returns the currently focused menu item.
   */
  getActiveMenuItem() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.activeMenuItem;
    });
  }
  /**
   * Sets the currently focused menu item.
   */
  setActiveMenuItem(item) {
    return __awaiter$1(this, void 0, void 0, function* () {
      item === null || item === void 0 ? void 0 : item.focusItem();
      this.activeMenuItem = item;
    });
  }
  /**
   * Calculates the height of the settings menu based on its children.
   */
  calculateHeight() {
    var _a, _b;
    return __awaiter$1(this, void 0, void 0, function* () {
      let height = 0;
      if (this.activeSubmenu) {
        const submenu = yield this.activeSubmenu.getMenu();
        height = (_a = (yield (submenu === null || submenu === void 0 ? void 0 : submenu.calculateHeight()))) !== null && _a !== void 0 ? _a : 0;
        height += yield this.activeSubmenu.getControllerHeight();
      }
      else {
        const children = ((_b = this.container) === null || _b === void 0 ? void 0 : _b.firstChild).assignedElements({ flatten: true });
        children === null || children === void 0 ? void 0 : children.forEach(child => {
          height += parseFloat(window.getComputedStyle(child).height);
        });
      }
      this.vmMenuHeightChange.emit(height);
      return height;
    });
  }
  onOpenSubmenu(event) {
    event.stopPropagation();
    if (!isUndefined(this.activeSubmenu))
      this.activeSubmenu.active = false;
    this.activeSubmenu = event.detail;
    this.getChildren().forEach(child => {
      if (child !== this.activeSubmenu) {
        child.style.opacity = '0';
        child.style.visibility = 'hidden';
      }
    });
    writeTask(() => {
      this.activeSubmenu.active = true;
    });
  }
  onCloseSubmenu(event) {
    event === null || event === void 0 ? void 0 : event.stopPropagation();
    if (!isUndefined(this.activeSubmenu))
      this.activeSubmenu.active = false;
    this.getChildren().forEach(child => {
      if (child !== this.activeSubmenu) {
        child.style.opacity = '';
        child.style.visibility = '';
      }
    });
    writeTask(() => {
      this.activeSubmenu = undefined;
    });
  }
  onWindowClick() {
    this.onCloseSubmenu();
    this.onClose();
  }
  onWindowKeyDown(event) {
    if (this.active && event.key === 'Escape') {
      this.onCloseSubmenu();
      this.onClose();
      this.focusController();
    }
  }
  getChildren() {
    var _a;
    const assignedElements = (_a = this.host
      .shadowRoot.querySelector('slot')) === null || _a === void 0 ? void 0 : _a.assignedElements({ flatten: true });
    return (assignedElements !== null && assignedElements !== void 0 ? assignedElements : []);
  }
  getMenuItems() {
    var _a;
    const assignedElements = (_a = this.host
      .shadowRoot.querySelector('slot')) === null || _a === void 0 ? void 0 : _a.assignedElements({ flatten: true });
    return menuItemHunter(assignedElements);
  }
  focusController() {
    var _a, _b, _c, _d, _e;
    if (!isUndefined((_a = this.controller) === null || _a === void 0 ? void 0 : _a.focusItem)) {
      (_b = this.controller) === null || _b === void 0 ? void 0 : _b.focusItem();
    }
    else if (!isUndefined((_c = this.controller) === null || _c === void 0 ? void 0 : _c.focusControl)) {
      (_d = this.controller) === null || _d === void 0 ? void 0 : _d.focusControl();
    }
    else {
      (_e = this.controller) === null || _e === void 0 ? void 0 : _e.focus();
    }
  }
  triggerMenuItem() {
    var _a;
    if (isUndefined(this.activeMenuItem))
      return;
    this.activeMenuItem.click();
    // If it controls a menu then focus it essentially opening it.
    (_a = this.activeMenuItem.menu) === null || _a === void 0 ? void 0 : _a.focusMenu();
  }
  onClose() {
    this.activeMenuItem = undefined;
    this.active = false;
  }
  onClick(event) {
    // Stop the event from propagating while playing with menu so that when it is clicked outside
    // the menu we can close it in the `onWindowClick` handler above.
    event.stopPropagation();
  }
  onFocus() {
    var _a;
    this.active = true;
    [this.activeMenuItem] = this.getMenuItems();
    (_a = this.activeMenuItem) === null || _a === void 0 ? void 0 : _a.focusItem();
    this.vmFocus.emit();
  }
  onBlur() {
    this.vmBlur.emit();
  }
  foucsMenuItem(items, index) {
    if (index < 0)
      index = items.length - 1;
    if (index > items.length - 1)
      index = 0;
    this.activeMenuItem = items[index];
    this.activeMenuItem.focusItem();
  }
  onKeyDown(event) {
    if (!this.active)
      return;
    event.preventDefault();
    event.stopPropagation();
    const items = this.getMenuItems();
    let index = items.findIndex(item => item === this.activeMenuItem);
    switch (event.key) {
      case 'Escape':
        this.onClose();
        this.focusController();
        break;
      case 'ArrowDown':
      case 'Tab':
        this.foucsMenuItem(items, (index += 1));
        break;
      case 'ArrowUp':
        this.foucsMenuItem(items, (index -= 1));
        break;
      case 'ArrowLeft':
        this.onClose();
        this.focusController();
        break;
      case 'ArrowRight':
      case 'Enter':
      case ' ':
        this.triggerMenuItem();
        break;
      case 'Home':
      case 'PageUp':
        this.foucsMenuItem(items, 0);
        break;
      case 'End':
      case 'PageDown':
        this.foucsMenuItem(items, items.length - 1);
        break;
    }
  }
  render() {
    var _a, _b, _c;
    return (h("div", { id: this.identifier, class: {
        menu: true,
        slideIn: !isUndefined(this.slideInDirection),
        slideInFromLeft: this.slideInDirection === 'left',
        slideInFromRight: this.slideInDirection === 'right',
      }, role: "menu", tabindex: "-1", "aria-labelledby": (_b = (_a = this.controller) === null || _a === void 0 ? void 0 : _a.identifier) !== null && _b !== void 0 ? _b : (_c = this.controller) === null || _c === void 0 ? void 0 : _c.id, "aria-hidden": !this.active ? 'true' : 'false', onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onClick: this.onClick.bind(this), onKeyDown: this.onKeyDown.bind(this), ref: el => {
        this.menu = el;
      } }, h("div", { class: "container", ref: el => {
        this.container = el;
      } }, h("slot", null))));
  }
  get host() { return getElement(this); }
  static get watchers() { return {
    "activeMenuItem": ["onActiveMenuitemChange"],
    "activeSubmenu": ["onActiveSubmenuChange"],
    "active": ["onActiveChange"]
  }; }
};
Menu.style = menuCss;

const menuItemCss = ":host{display:block}.menuItem{display:flex;position:relative;align-items:center;flex-direction:row;cursor:pointer;color:var(--vm-menu-color);background:var(--vm-menu-bg);font-size:var(--vm-menu-font-size);font-weight:var(--vm-menu-font-weight);padding:var(--vm-menu-item-padding);touch-action:manipulation;box-sizing:border-box}.menuItem:focus{outline:0}.menuItem.hidden{display:none}.menuItem.tapHighlight{background:var(--vm-menu-item-tap-highlight)}.menuItem.showDivider{border-bottom:0.5px solid var(--vm-menu-item-divider-color)}.menuItem.notTouch:hover,.menuItem.notTouch:focus{outline:0;color:var(--vm-menu-item-focus-color);background-color:var(--vm-menu-item-focus-bg)}.menuItem[aria-expanded='true']{position:absolute;z-index:2;top:0;width:100%}.menuItem[aria-hidden='true']{display:none}.menuItem[aria-checked='true'] vm-icon{opacity:1;visibility:visible}vm-icon{display:inline-block}vm-icon{fill:currentColor;pointer-events:none;font-size:var(--vm-menu-item-check-icon-size);margin-right:10px;opacity:0;visibility:hidden;transition:var(--vm-fade-transition)}.hint{display:inline-block;margin-left:auto;overflow:hidden;pointer-events:none;margin-right:6px;font-size:var(--vm-menu-item-hint-font-size);opacity:var(--vm-menu-item-hint-opacity);color:var(--vm-menu-item-hint-color)}.badge{display:inline-block;line-height:1;overflow:hidden;pointer-events:none;margin-left:6px;color:var(--vm-menu-item-badge-color);background:var(--vm-menu-item-badge-bg);font-size:var(--vm-menu-item-badge-font-size)}.spacer{flex:1}.arrow{color:var(--vm-menu-item-arrow-color);border:2px solid;padding:2px;display:inline-block;border-width:0 2px 2px 0}.arrow.left{margin-right:6px;transform:rotate(135deg)}.arrow.right{transform:rotate(-45deg);opacity:0.38}";

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
const MenuItem = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmFocus = createEvent(this, "vmFocus", 7);
    this.vmBlur = createEvent(this, "vmBlur", 7);
    this.showTapHighlight = false;
    /**
     * Whether the item is displayed or not.
     */
    this.hidden = false;
    /**
     * The name of the checkmark icon to resolve from the icon library.
     */
    this.checkIcon = 'check';
    /** @internal */
    this.isTouch = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['isTouch']);
  }
  /**
   * Focuses the menu item.
   */
  focusItem() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      (_a = this.menuItem) === null || _a === void 0 ? void 0 : _a.focus();
    });
  }
  /**
   * Removes focus from the menu item.
   */
  blurItem() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      (_a = this.menuItem) === null || _a === void 0 ? void 0 : _a.blur();
    });
  }
  /**
   * Returns the height of the menu item.
   */
  getHeight() {
    return __awaiter(this, void 0, void 0, function* () {
      return parseFloat(this.menuItem ? window.getComputedStyle(this.menuItem).height : '0');
    });
  }
  onClick() {
    if (!isNil(this.menu))
      this.menu.active = !this.expanded;
  }
  onFocus() {
    this.vmFocus.emit();
  }
  onBlur() {
    this.vmBlur.emit();
  }
  onTouchStart() {
    this.showTapHighlight = true;
  }
  onTouchEnd() {
    setTimeout(() => {
      this.showTapHighlight = false;
    }, 100);
  }
  onMouseLeave() {
    var _a;
    (_a = this.menuItem) === null || _a === void 0 ? void 0 : _a.blur();
  }
  render() {
    var _a, _b, _c, _d;
    const isCheckedDefined = !isUndefined(this.checked);
    const isMenuDefined = !isUndefined(this.menu);
    const hasExpanded = this.expanded ? 'true' : 'false';
    const isChecked = this.checked ? 'true' : 'false';
    const showCheckedIcon = isCheckedDefined && !isUndefined(this.checkIcon);
    const showLeftNavArrow = isMenuDefined && this.expanded;
    const showRightNavArrow = isMenuDefined && !this.expanded;
    const showHint = !isUndefined(this.hint) &&
      !isCheckedDefined &&
      (!isMenuDefined || !this.expanded);
    const showBadge = !isUndefined(this.badge) && !showHint && !showRightNavArrow;
    const hasSpacer = showHint || showRightNavArrow;
    return (h("div", { class: {
        menuItem: true,
        notTouch: !this.isTouch,
        tapHighlight: this.showTapHighlight,
        showDivider: isMenuDefined && ((_a = this.expanded) !== null && _a !== void 0 ? _a : false),
      }, id: this.identifier, role: isCheckedDefined ? 'menuitemradio' : 'menuitem', tabindex: "0", "aria-label": this.label, "aria-hidden": this.hidden ? 'true' : 'false', "aria-haspopup": isMenuDefined ? 'true' : undefined, "aria-controls": (_c = (_b = this.menu) === null || _b === void 0 ? void 0 : _b.identifier) !== null && _c !== void 0 ? _c : (_d = this.menu) === null || _d === void 0 ? void 0 : _d.id, "aria-expanded": isMenuDefined ? hasExpanded : undefined, "aria-checked": isCheckedDefined ? isChecked : undefined, onClick: this.onClick.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onTouchStart: this.onTouchStart.bind(this), onTouchEnd: this.onTouchEnd.bind(this), onMouseLeave: this.onMouseLeave.bind(this), ref: el => {
        this.menuItem = el;
      } }, showCheckedIcon && (h("vm-icon", { name: this.checkIcon, library: this.icons })), showLeftNavArrow && h("span", { class: "arrow left" }), this.label, hasSpacer && h("span", { class: "spacer" }), showHint && h("span", { class: "hint" }, this.hint), showBadge && h("span", { class: "badge" }, this.badge), showRightNavArrow && h("span", { class: "arrow right" })));
  }
  get host() { return getElement(this); }
};
MenuItem.style = menuItemCss;

export { Menu as vm_menu, MenuItem as vm_menu_item };
