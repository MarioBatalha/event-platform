var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, Element, Event, h, Method, Prop, State, Watch, } from '@stencil/core';
import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { isNull, isUndefined } from '../../../../utils/unit';
import { findPlayer } from '../../../core/player/findPlayer';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
/**
 * A generic player control that is designed to work with both touch and mouse devices. It also
 * seamlessly works with `vime-tooltip`, which can be passed in via the default `slot`.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control/control.png"
 *   alt="Vime control component"
 * />
 *
 * @slot - Used to pass in the content of the control (text/icon/tooltip).
 */
export class Control {
  constructor() {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      (_a = this.button) === null || _a === void 0 ? void 0 : _a.focus();
    });
  }
  /**
   * Removes focus from the control.
   */
  blurControl() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
      } },
      h("slot", null)));
  }
  static get is() { return "vm-control"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["control.css"]
  }; }
  static get styleUrls() { return {
    "$": ["control.css"]
  }; }
  static get properties() { return {
    "keys": {
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
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "A slash (`/`) separated string of JS keyboard keys (`KeyboardEvent.key`), that when caught in\na `keydown` event, will trigger a `click` event on the control."
      },
      "attribute": "keys",
      "reflect": false
    },
    "identifier": {
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
        "text": "The `id` attribute of the control."
      },
      "attribute": "identifier",
      "reflect": false
    },
    "hidden": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Whether the control should be displayed or not."
      },
      "attribute": "hidden",
      "reflect": false,
      "defaultValue": "false"
    },
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
        "text": "The `aria-label` property of the control."
      },
      "attribute": "label",
      "reflect": false
    },
    "menu": {
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
        "text": "If the control has a popup menu, then this should be the `id` of said menu. Sets the\n`aria-controls` property."
      },
      "attribute": "menu",
      "reflect": false
    },
    "expanded": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "If the control has a popup menu, this indicates whether the menu is open or not. Sets the\n`aria-expanded` property."
      },
      "attribute": "expanded",
      "reflect": false
    },
    "pressed": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "If the control is a toggle, this indicated whether the control is in a \"pressed\" state or not.\nSets the `aria-pressed` property."
      },
      "attribute": "pressed",
      "reflect": false
    },
    "isTouch": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isTouch']",
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
      "attribute": "is-touch",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "describedBy": {},
    "showTapHighlight": {}
  }; }
  static get events() { return [{
      "method": "vmInteractionChange",
      "name": "vmInteractionChange",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the user is interacting with the control by focusing, touching or hovering on it."
      },
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      }
    }, {
      "method": "vmFocus",
      "name": "vmFocus",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the control receives focus."
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }, {
      "method": "vmBlur",
      "name": "vmBlur",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the control loses focus."
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }]; }
  static get methods() { return {
    "focusControl": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Focuses the control.",
        "tags": []
      }
    },
    "blurControl": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Removes focus from the control.",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "host"; }
  static get watchers() { return [{
      "propName": "keys",
      "methodName": "onKeysChange"
    }]; }
}
