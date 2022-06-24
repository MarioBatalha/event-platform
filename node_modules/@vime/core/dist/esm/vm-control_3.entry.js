import { r as registerInstance, c as createEvent, h, g as getElement } from './index-f5fd0f81.js';
import { D as Disposal, c as withComponentRegistry, e as isUndefined, f as findPlayer, l as listen, x as isNull, h as isString } from './withComponentRegistry-28311671.js';
import { w as withPlayerContext } from './withPlayerContext-4c52f564.js';
import { w as withIconRegistry, g as getIconLibraryResolver } from './IconRegistry-75cb81e3.js';
import './PlayerEvents-5c5704d6.js';

const controlCss = "button{display:flex;align-items:center;flex-direction:row;border:var(--vm-control-border);cursor:pointer;flex-shrink:0;font-size:var(--vm-control-icon-size);color:var(--vm-control-color);background:var(--vm-control-bg, transparent);border-radius:var(--vm-control-border-radius);padding:var(--vm-control-padding);position:relative;pointer-events:auto;transition:all 0.3s ease;transform:scale(var(--vm-control-scale, 1));touch-action:manipulation;box-sizing:border-box}button.hidden{display:none}button:focus{outline:0}button.tapHighlight{background:var(--vm-control-tap-highlight)}button.notTouch:focus,button.notTouch:hover,button.notTouch[aria-expanded='true']{background:var(--vm-control-focus-bg);color:var(--vm-control-focus-color);transform:scale(calc(var(--vm-control-scale, 1) + 0.06))}";

var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
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
const Control = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmInteractionChange = createEvent(this, "vmInteractionChange", 7);
    this.vmFocus = createEvent(this, "vmFocus", 7);
    this.vmBlur = createEvent(this, "vmBlur", 7);
    this.keyboardDisposal = new Disposal();
    this.showTapHighlight = false;
    /**
     * Whether the control should be displayed or not.
     */
    this.hidden = false;
    /** @internal */
    this.isTouch = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['isTouch']);
  }
  onKeysChange() {
    return __awaiter$2(this, void 0, void 0, function* () {
      this.keyboardDisposal.empty();
      if (isUndefined(this.keys))
        return;
      const player = yield findPlayer(this);
      const codes = this.keys.split('/');
      if (isUndefined(player))
        return;
      this.keyboardDisposal.add(listen(player, 'keydown', (event) => {
        if (codes.includes(event.key)) {
          this.button.click();
        }
      }));
    });
  }
  connectedCallback() {
    this.findTooltip();
    this.onKeysChange();
  }
  componentWillLoad() {
    this.findTooltip();
  }
  disconnectedCallback() {
    this.keyboardDisposal.empty();
  }
  /**
   * Focuses the control.
   */
  focusControl() {
    var _a;
    return __awaiter$2(this, void 0, void 0, function* () {
      (_a = this.button) === null || _a === void 0 ? void 0 : _a.focus();
    });
  }
  /**
   * Removes focus from the control.
   */
  blurControl() {
    var _a;
    return __awaiter$2(this, void 0, void 0, function* () {
      (_a = this.button) === null || _a === void 0 ? void 0 : _a.blur();
    });
  }
  onTouchStart() {
    this.showTapHighlight = true;
  }
  onTouchEnd() {
    setTimeout(() => {
      this.showTapHighlight = false;
    }, 100);
  }
  findTooltip() {
    const tooltip = this.host.querySelector('vm-tooltip');
    if (!isNull(tooltip))
      this.describedBy = tooltip.id;
    return tooltip;
  }
  onShowTooltip() {
    const tooltip = this.findTooltip();
    if (!isNull(tooltip))
      tooltip.active = true;
    this.vmInteractionChange.emit(true);
  }
  onHideTooltip() {
    const tooltip = this.findTooltip();
    if (!isNull(tooltip))
      tooltip.active = false;
    this.button.blur();
    this.vmInteractionChange.emit(false);
  }
  onFocus() {
    this.vmFocus.emit();
    this.onShowTooltip();
  }
  onBlur() {
    this.vmBlur.emit();
    this.onHideTooltip();
  }
  onMouseEnter() {
    this.onShowTooltip();
  }
  onMouseLeave() {
    this.onHideTooltip();
  }
  render() {
    const isMenuExpanded = this.expanded ? 'true' : 'false';
    const isPressed = this.pressed ? 'true' : 'false';
    return (h("button", { class: {
        hidden: this.hidden,
        notTouch: !this.isTouch,
        tapHighlight: this.showTapHighlight,
      }, id: this.identifier, type: "button", "aria-label": this.label, "aria-haspopup": !isUndefined(this.menu) ? 'true' : undefined, "aria-controls": this.menu, "aria-expanded": !isUndefined(this.menu) ? isMenuExpanded : undefined, "aria-pressed": !isUndefined(this.pressed) ? isPressed : undefined, "aria-hidden": this.hidden ? 'true' : 'false', "aria-describedby": this.describedBy, onTouchStart: this.onTouchStart.bind(this), onTouchEnd: this.onTouchEnd.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onMouseEnter: this.onMouseEnter.bind(this), onMouseLeave: this.onMouseLeave.bind(this), ref: (el) => {
        this.button = el;
      } }, h("slot", null)));
  }
  get host() { return getElement(this); }
  static get watchers() { return {
    "keys": ["onKeysChange"]
  }; }
};
Control.style = controlCss;

/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon/request.ts
 */
var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const iconFiles = new Map();
const requestIcon = (url) => {
  if (iconFiles.has(url))
    return iconFiles.get(url);
  const request = fetch(url).then((response) => __awaiter$1(void 0, void 0, void 0, function* () {
    if (response.ok) {
      const div = document.createElement('div');
      div.innerHTML = yield response.text();
      const svg = div.firstElementChild;
      return {
        ok: response.ok,
        status: response.status,
        svg: svg && svg.tagName.toLowerCase() === 'svg' ? svg.outerHTML : '',
      };
    }
    return {
      ok: response.ok,
      status: response.status,
    };
  }));
  iconFiles.set(url, request);
  return request;
};

const iconCss = ":host{display:inline-block;width:1em;height:1em;contain:strict;box-sizing:content-box !important}.icon,svg{display:block;height:100%;width:100%;transition:var(--vm-icon-transition);transform:var(--vm-icon-transform);fill:var(--vm-icon-fill, currentColor);stroke:var(--vm-icon-stroke)}";

/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon/icon.tsx
 */
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
const parser = new DOMParser();
const Icon = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmLoad = createEvent(this, "vmLoad", 7);
    this.vmError = createEvent(this, "vmError", 7);
    /** @internal */
    this.icons = 'material';
    withComponentRegistry(this);
    withIconRegistry(this);
  }
  handleChange() {
    this.setIcon();
  }
  connectedCallback() {
    withPlayerContext(this, ['icons']);
  }
  componentDidLoad() {
    this.setIcon();
  }
  /**
   * @internal Fetches the icon and redraws it. Used to handle library registrations.
   */
  redraw() {
    return __awaiter(this, void 0, void 0, function* () {
      this.setIcon();
    });
  }
  getLabel() {
    let label = '';
    if (this.label) {
      label = this.label;
    }
    else if (this.name) {
      label = this.name.replace(/-/g, ' ');
    }
    else if (this.src) {
      label = this.src
        .replace(/.*\//, '')
        .replace(/-/g, ' ')
        .replace(/\.svg/i, '');
    }
    return label;
  }
  setIcon() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const resolver = getIconLibraryResolver((_a = this.library) !== null && _a !== void 0 ? _a : this.icons);
      let url = this.src;
      if (this.name && resolver) {
        url = resolver(this.name);
      }
      if (url) {
        try {
          const file = yield requestIcon(url);
          if (file.ok) {
            const doc = parser.parseFromString(file.svg, 'text/html');
            const svg = doc.body.querySelector('svg');
            if (svg) {
              this.svg = svg.outerHTML;
              this.vmLoad.emit();
            }
            else {
              this.svg = '';
              this.vmError.emit({ status: file.status });
            }
          }
        }
        catch (_b) {
          this.vmError.emit();
        }
      }
    });
  }
  render() {
    return (h("div", { class: "icon", role: "img", "aria-label": this.getLabel(), innerHTML: this.svg }));
  }
  static get watchers() { return {
    "name": ["handleChange"],
    "src": ["handleChange"],
    "library": ["handleChange"],
    "icons": ["handleChange"]
  }; }
};
Icon.style = iconCss;

const tooltipCss = ":host{display:contents;z-index:var(--vm-tooltip-z-index)}.tooltip{left:var(--vm-tooltip-left, 50%);transform:translateX(-50%);line-height:1.3;pointer-events:none;position:absolute;opacity:0;white-space:nowrap;visibility:hidden;background:var(--vm-tooltip-bg);border-radius:var(--vm-tooltip-border-radius);box-sizing:border-box;box-shadow:var(--vm-tooltip-box-shadow);color:var(--vm-tooltip-color);font-size:var(--vm-tooltip-font-size);padding:var(--vm-tooltip-padding);transition:opacity var(--vm-tooltip-fade-duration)\n    var(--vm-tooltip-fade-timing-func)}.tooltip[aria-hidden='false']{opacity:1;visibility:visible}.tooltip.hidden{display:none}.tooltip.onTop{bottom:100%;margin-bottom:var(--vm-tooltip-spacing)}.tooltip.onBottom{top:100%;margin-top:var(--vm-tooltip-spacing)}.tooltip.growLeft{left:auto;right:0;transform:none}.tooltip.growRight{left:0;transform:none}";

let tooltipIdCount = 0;
const Tooltip = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    // Avoid tooltips flashing when player initializing.
    this.hasLoaded = false;
    /**
     * Whether the tooltip is displayed or not.
     */
    this.hidden = false;
    /**
     * Whether the tooltip is visible or not.
     */
    this.active = false;
    /**
     * Determines if the tooltip appears on top/bottom of it's parent.
     */
    this.position = 'top';
    /** @internal */
    this.isTouch = false;
    /** @internal */
    this.isMobile = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['isTouch', 'isMobile']);
  }
  componentDidLoad() {
    this.hasLoaded = true;
  }
  getId() {
    // eslint-disable-next-line prefer-destructuring
    const id = this.host.id;
    if (isString(id) && id.length > 0)
      return id;
    tooltipIdCount += 1;
    return `vm-tooltip-${tooltipIdCount}`;
  }
  render() {
    return (h("div", { id: this.getId(), role: "tooltip", "aria-hidden": !this.active || this.isTouch || this.isMobile ? 'true' : 'false', class: {
        tooltip: true,
        hidden: !this.hasLoaded || this.hidden,
        onTop: this.position === 'top',
        onBottom: this.position === 'bottom',
        growLeft: this.direction === 'left',
        growRight: this.direction === 'right',
      } }, h("slot", null)));
  }
  get host() { return getElement(this); }
};
Tooltip.style = tooltipCss;

export { Control as vm_control, Icon as vm_icon, Tooltip as vm_tooltip };
