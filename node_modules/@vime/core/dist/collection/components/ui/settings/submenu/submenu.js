var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, Element, Event, h, Method, Prop, State, writeTask, } from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
let idCount = 0;
/**
 * A menu that is to be nested inside another menu. A submenu is closed by default and it provides a
 * menu item that will open/close it. It's main purpose is to organize a menu by grouping related
 * sections/options together that can be navigated to by the user.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/submenu/submenu.png"
 *   alt="Vime submenu component"
 * />
 *
 * @slot - Used to pass in the body of the submenu which is usually a set of choices in the form
 * of a radio group (`vm-menu-radio-group`).
 */
export class Submenu {
  constructor() {
    /**
     * The direction the submenu should slide in from.
     */
    this.slideInDirection = 'right';
    /**
     * Whether the submenu is open/closed.
     */
    this.active = false;
    withComponentRegistry(this);
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
    return (h("div", null,
      h("vm-menu-item", { identifier: this.getControllerId(), menu: this.menu, label: this.label, hint: this.hint, expanded: this.active, ref: el => {
          writeTask(() => {
            this.controller = el;
          });
        } }),
      h("vm-menu", { identifier: this.id, controller: this.controller, active: this.active, slideInDirection: this.slideInDirection, onVmOpen: this.onMenuOpen.bind(this), onVmClose: this.onMenuClose.bind(this), ref: el => {
          writeTask(() => {
            this.menu = el;
          });
        }, style: { top: `${this.getControllerHeightSync() + 1}px` } },
        h("slot", null))));
  }
  static get is() { return "vm-submenu"; }
  static get encapsulation() { return "shadow"; }
  static get properties() { return {
    "label": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": true,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The title of the submenu."
      },
      "attribute": "label",
      "reflect": false
    },
    "hint": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "This can provide additional context about the current state of the submenu. For example, the\nhint could be the currently selected option if the submenu contains a radio group."
      },
      "attribute": "hint",
      "reflect": false
    },
    "slideInDirection": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'left' | 'right'",
        "resolved": "\"left\" | \"right\" | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The direction the submenu should slide in from."
      },
      "attribute": "slide-in-direction",
      "reflect": false,
      "defaultValue": "'right'"
    },
    "active": {
      "type": "boolean",
      "mutable": true,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Whether the submenu is open/closed."
      },
      "attribute": "active",
      "reflect": true,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "menu": {},
    "controller": {}
  }; }
  static get events() { return [{
      "method": "vmOpenSubmenu",
      "name": "vmOpenSubmenu",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the submenu is open/active."
      },
      "complexType": {
        "original": "HTMLVmSubmenuElement",
        "resolved": "HTMLVmSubmenuElement",
        "references": {
          "HTMLVmSubmenuElement": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "vmCloseSubmenu",
      "name": "vmCloseSubmenu",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the submenu has closed/is not active."
      },
      "complexType": {
        "original": "HTMLVmSubmenuElement",
        "resolved": "HTMLVmSubmenuElement",
        "references": {
          "HTMLVmSubmenuElement": {
            "location": "global"
          }
        }
      }
    }]; }
  static get methods() { return {
    "getController": {
      "complexType": {
        "signature": "() => Promise<HTMLVmMenuItemElement | undefined>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          },
          "HTMLVmMenuItemElement": {
            "location": "global"
          }
        },
        "return": "Promise<HTMLVmMenuItemElement | undefined>"
      },
      "docs": {
        "text": "Returns the controller (`vm-menu-item`) for this submenu.",
        "tags": []
      }
    },
    "getMenu": {
      "complexType": {
        "signature": "() => Promise<HTMLVmMenuElement | undefined>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          },
          "HTMLVmMenuElement": {
            "location": "global"
          }
        },
        "return": "Promise<HTMLVmMenuElement | undefined>"
      },
      "docs": {
        "text": "Returns the menu (`vm-menu`) for this submenu.",
        "tags": []
      }
    },
    "getControllerHeight": {
      "complexType": {
        "signature": "() => Promise<number>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<number>"
      },
      "docs": {
        "text": "Returns the height of the submenu controller.",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "host"; }
}
