var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, Element, h, Method, Prop, State, Watch, } from '@stencil/core';
import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { isUndefined } from '../../../../utils/unit';
import { createDispatcher, } from '../../../core/player/PlayerDispatcher';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import { withControlsCollisionDetection } from '../../controls/controls/withControlsCollisionDetection';
let idCount = 0;
/**
 * A container for a collection of submenus and options for the player. On desktop, the settings
 * is displayed as a small popup menu (scroll appears if `height >= maxHeight`) on the bottom
 * right-hand side of a video player, or slightly above the right-hand side of an audio player. On
 * mobile, the settings is displayed as a [bottom sheet](https://material.io/components/sheets-bottom).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/settings/settings.png"
 *   alt="Vime settings component"
 * />
 *
 * @slot - Used to pass in the body of the settings menu, which usually contains submenus.
 */
export class Settings {
  constructor() {
    this.disposal = new Disposal();
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
    withComponentRegistry(this);
    withControlsCollisionDetection(this);
    withPlayerContext(this, ['isMobile', 'isAudioView']);
  }
  onActiveChange() {
    this.dispatch('isSettingsActive', this.active);
    if (isUndefined(this.controller))
      return;
    this.controller.expanded = this.active;
  }
  connectedCallback() {
    this.dispatch = createDispatcher(this);
    idCount += 1;
    this.id = `vm-settings-${idCount}`;
  }
  disconnectedCallback() {
    this.disposal.empty();
  }
  /**
   * Sets the controller responsible for opening/closing this settings menu.
   */
  setController(controller) {
    return __awaiter(this, void 0, void 0, function* () {
      this.controller = controller;
      this.controller.menu = this.id;
      this.disposal.empty();
      this.disposal.add(listen(this.controller, 'click', () => {
        this.active = !this.active;
      }));
      this.disposal.add(listen(this.controller, 'keydown', (event) => {
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
    return (h("div", { style: Object.assign({}, this.getPosition()), class: {
        settings: true,
        active: this.active,
        mobile: this.isMobile,
      } },
      h("div", { class: "container", style: { height: `${this.menuHeight}px` } },
        h("vm-menu", { identifier: this.id, active: this.active, controller: this.controller, onVmOpen: this.onOpen.bind(this), onVmClose: this.onClose.bind(this), onVmMenuHeightChange: this.onHeightChange.bind(this), ref: (el) => {
            this.menu = el;
          } },
          h("slot", null)))));
  }
  static get is() { return "vm-settings"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["settings.css"]
  }; }
  static get styleUrls() { return {
    "$": ["settings.css"]
  }; }
  static get properties() { return {
    "pin": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'",
        "resolved": "\"bottomLeft\" | \"bottomRight\" | \"topLeft\" | \"topRight\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Pins the settings to the defined position inside the video player. This has no effect when\nthe view is of type `audio` (always `bottomRight`) and on mobile devices (always bottom sheet)."
      },
      "attribute": "pin",
      "reflect": true,
      "defaultValue": "'bottomRight'"
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
        "text": "Whether the settings menu is opened/closed."
      },
      "attribute": "active",
      "reflect": true,
      "defaultValue": "false"
    },
    "isMobile": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isMobile']",
        "resolved": "boolean",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../../core/player/PlayerProps"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "is-mobile",
      "reflect": false,
      "defaultValue": "false"
    },
    "isAudioView": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isAudioView']",
        "resolved": "boolean",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../../core/player/PlayerProps"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "is-audio-view",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "menuHeight": {}
  }; }
  static get methods() { return {
    "setController": {
      "complexType": {
        "signature": "(controller: SettingsController) => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "SettingsController": {
            "location": "import",
            "path": "./SettingsController"
          },
          "KeyboardEvent": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Sets the controller responsible for opening/closing this settings menu.",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "host"; }
  static get watchers() { return [{
      "propName": "active",
      "methodName": "onActiveChange"
    }]; }
}
