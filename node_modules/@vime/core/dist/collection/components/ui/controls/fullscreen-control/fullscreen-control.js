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
 * A control for toggling fullscreen mode. This control is not displayed if fullscreen cannot be
 * requested (checked via the `canSetFullscreen()` player method).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/fullscreen-control/fullscreen-control.png"
 *   alt="Vime fullscreen control component"
 * />
 */
export class FullscreenControl {
  constructor() {
    this.canSetFullscreen = false;
    /**
     * The name of the enter fullscreen icon to resolve from the icon library.
     */
    this.enterIcon = 'fullscreen-enter';
    /**
     * The name of the exit fullscreen icon to resolve from the icon library.
     */
    this.exitIcon = 'fullscreen-exit';
    /**
     * Whether the tooltip is positioned above/below the control.
     */
    this.tooltipPosition = 'top';
    /**
     * Whether the tooltip should not be displayed.
     */
    this.hideTooltip = false;
    /** @inheritdoc */
    this.keys = 'f';
    /** @internal */
    this.isFullscreenActive = false;
    /** @internal */
    this.i18n = {};
    /** @internal */
    this.playbackReady = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['isFullscreenActive', 'playbackReady', 'i18n']);
  }
  onPlaybackReadyChange() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const player = getPlayerFromRegistry(this);
      this.canSetFullscreen = (_a = (yield (player === null || player === void 0 ? void 0 : player.canSetFullscreen()))) !== null && _a !== void 0 ? _a : false;
    });
  }
  componentDidLoad() {
    this.onPlaybackReadyChange();
  }
  onClick() {
    const player = getPlayerFromRegistry(this);
    !this.isFullscreenActive
      ? player === null || player === void 0 ? void 0 : player.enterFullscreen()
      : player === null || player === void 0 ? void 0 : player.exitFullscreen();
  }
  render() {
    const tooltip = this.isFullscreenActive
      ? this.i18n.exitFullscreen
      : this.i18n.enterFullscreen;
    const tooltipWithHint = !isUndefined(this.keys)
      ? `${tooltip} (${this.keys})`
      : tooltip;
    return (h(Host, { hidden: !this.canSetFullscreen },
      h("vm-control", { label: this.i18n.fullscreen, keys: this.keys, pressed: this.isFullscreenActive, hidden: !this.canSetFullscreen, onClick: this.onClick.bind(this) },
        h("vm-icon", { name: this.isFullscreenActive ? this.exitIcon : this.enterIcon, library: this.icons }),
        h("vm-tooltip", { hidden: this.hideTooltip, position: this.tooltipPosition, direction: this.tooltipDirection }, tooltipWithHint))));
  }
  static get is() { return "vm-fullscreen-control"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["fullscreen-control.css"]
  }; }
  static get styleUrls() { return {
    "$": ["fullscreen-control.css"]
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
        "text": "The name of the enter fullscreen icon to resolve from the icon library."
      },
      "attribute": "enter-icon",
      "reflect": false,
      "defaultValue": "'fullscreen-enter'"
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
        "text": "The name of the exit fullscreen icon to resolve from the icon library."
      },
      "attribute": "exit-icon",
      "reflect": false,
      "defaultValue": "'fullscreen-exit'"
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
      "defaultValue": "'f'"
    },
    "isFullscreenActive": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isFullscreenActive']",
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
      "attribute": "is-fullscreen-active",
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
    "canSetFullscreen": {}
  }; }
  static get watchers() { return [{
      "propName": "playbackReady",
      "methodName": "onPlaybackReadyChange"
    }]; }
}
