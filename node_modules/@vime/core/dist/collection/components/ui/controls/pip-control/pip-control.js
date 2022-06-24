var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { isUndefined } from '../../../../utils/unit';
import { getPlayerFromRegistry, withComponentRegistry, } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
/**
 * A control for toggling picture-in-picture (PiP) mode. This control is not displayed if PiP cannot
 * be requested (checked via the `canSetPiP()` player method).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/pip-control/pip-control.png"
 *   alt="Vime mute control component"
 * />
 */
export class PiPControl {
  constructor() {
    this.canSetPiP = false;
    /**
     * The name of the enter pip icon to resolve from the icon library.
     */
    this.enterIcon = 'pip-enter';
    /**
     * The name of the exit pip icon to resolve from the icon library.
     */
    this.exitIcon = 'pip-exit';
    /**
     * Whether the tooltip is positioned above/below the control.
     */
    this.tooltipPosition = 'top';
    /**
     * Whether the tooltip should not be displayed.
     */
    this.hideTooltip = false;
    /** @inheritdoc */
    this.keys = 'p';
    /** @internal */
    this.isPiPActive = false;
    /** @internal */
    this.i18n = {};
    /** @internal */
    this.playbackReady = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['isPiPActive', 'playbackReady', 'i18n']);
  }
  onPlaybackReadyChange() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const player = getPlayerFromRegistry(this);
      this.canSetPiP = (_a = (yield (player === null || player === void 0 ? void 0 : player.canSetPiP()))) !== null && _a !== void 0 ? _a : false;
    });
  }
  componentDidLoad() {
    this.onPlaybackReadyChange();
  }
  onClick() {
    const player = getPlayerFromRegistry(this);
    !this.isPiPActive ? player === null || player === void 0 ? void 0 : player.enterPiP() : player === null || player === void 0 ? void 0 : player.exitPiP();
  }
  render() {
    const tooltip = this.isPiPActive ? this.i18n.exitPiP : this.i18n.enterPiP;
    const tooltipWithHint = !isUndefined(this.keys)
      ? `${tooltip} (${this.keys})`
      : tooltip;
    return (h(Host, { hidden: !this.canSetPiP },
      h("vm-control", { label: this.i18n.pip, keys: this.keys, pressed: this.isPiPActive, hidden: !this.canSetPiP, onClick: this.onClick.bind(this) },
        h("vm-icon", { name: this.isPiPActive ? this.exitIcon : this.enterIcon, library: this.icons }),
        h("vm-tooltip", { hidden: this.hideTooltip, position: this.tooltipPosition, direction: this.tooltipDirection }, tooltipWithHint))));
  }
  static get is() { return "vm-pip-control"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["pip-control.css"]
  }; }
  static get styleUrls() { return {
    "$": ["pip-control.css"]
  }; }
  static get properties() { return {
    "enterIcon": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The name of the enter pip icon to resolve from the icon library."
      },
      "attribute": "enter-icon",
      "reflect": false,
      "defaultValue": "'pip-enter'"
    },
    "exitIcon": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The name of the exit pip icon to resolve from the icon library."
      },
      "attribute": "exit-icon",
      "reflect": false,
      "defaultValue": "'pip-exit'"
    },
    "icons": {
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
        "text": "The name of an icon library to use. Defaults to the library defined by the `icons` player\nproperty."
      },
      "attribute": "icons",
      "reflect": false
    },
    "tooltipPosition": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "TooltipPosition",
        "resolved": "\"bottom\" | \"top\"",
        "references": {
          "TooltipPosition": {
            "location": "import",
            "path": "../../tooltip/types"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Whether the tooltip is positioned above/below the control."
      },
      "attribute": "tooltip-position",
      "reflect": false,
      "defaultValue": "'top'"
    },
    "tooltipDirection": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "TooltipDirection",
        "resolved": "\"left\" | \"right\" | undefined",
        "references": {
          "TooltipDirection": {
            "location": "import",
            "path": "../../tooltip/types"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The direction in which the tooltip should grow."
      },
      "attribute": "tooltip-direction",
      "reflect": false
    },
    "hideTooltip": {
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
        "text": "Whether the tooltip should not be displayed."
      },
      "attribute": "hide-tooltip",
      "reflect": false,
      "defaultValue": "false"
    },
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
      "reflect": false,
      "defaultValue": "'p'"
    },
    "isPiPActive": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isPiPActive']",
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
      "attribute": "is-pi-p-active",
      "reflect": false,
      "defaultValue": "false"
    },
    "i18n": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['i18n']",
        "resolved": "Translation | { [x: string]: string; }",
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
      "defaultValue": "{}"
    },
    "playbackReady": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['playbackReady']",
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
      "attribute": "playback-ready",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "canSetPiP": {}
  }; }
  static get watchers() { return [{
      "propName": "playbackReady",
      "methodName": "onPlaybackReadyChange"
    }]; }
}
