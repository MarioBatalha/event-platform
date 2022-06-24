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
 * A control for toggling the visibility of captions. This control is not displayed if there's no
 * track currently set.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/caption-control/caption-control.png"
 *   alt="Vime caption control component"
 * />
 */
export class CaptionControl {
  constructor() {
    this.canToggleCaptionVisibility = false;
    /**
     * The URL to an SVG element or fragment to load.
     */
    this.showIcon = 'captions-on';
    /**
     * The URL to an SVG element or fragment to load.
     */
    this.hideIcon = 'captions-off';
    /**
     * Whether the tooltip is positioned above/below the control.
     */
    this.tooltipPosition = 'top';
    /**
     * Whether the tooltip should not be displayed.
     */
    this.hideTooltip = false;
    /** @inheritdoc */
    this.keys = 'c';
    /** @internal */
    this.i18n = {};
    /** @internal */
    this.playbackReady = false;
    /** @internal */
    this.textTracks = [];
    /** @internal */
    this.isTextTrackVisible = false;
    withComponentRegistry(this);
    withPlayerContext(this, [
      'i18n',
      'textTracks',
      'isTextTrackVisible',
      'playbackReady',
    ]);
  }
  onTextTracksChange() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const player = getPlayerFromRegistry(this);
      this.canToggleCaptionVisibility =
        this.textTracks.length > 0 &&
          ((_a = (yield (player === null || player === void 0 ? void 0 : player.canSetTextTrackVisibility()))) !== null && _a !== void 0 ? _a : false);
    });
  }
  componentDidLoad() {
    this.onTextTracksChange();
  }
  onClick() {
    var _a;
    const player = getPlayerFromRegistry(this);
    (_a = player === null || player === void 0 ? void 0 : player.setTextTrackVisibility) === null || _a === void 0 ? void 0 : _a.call(player, !this.isTextTrackVisible);
  }
  render() {
    const tooltip = this.isTextTrackVisible
      ? this.i18n.disableCaptions
      : this.i18n.enableCaptions;
    const tooltipWithHint = !isUndefined(this.keys)
      ? `${tooltip} (${this.keys})`
      : tooltip;
    return (h(Host, { hidden: !this.canToggleCaptionVisibility },
      h("vm-control", { label: this.i18n.captions, keys: this.keys, hidden: !this.canToggleCaptionVisibility, pressed: this.isTextTrackVisible, onClick: this.onClick.bind(this) },
        h("vm-icon", { name: this.isTextTrackVisible ? this.showIcon : this.hideIcon, library: this.icons }),
        h("vm-tooltip", { hidden: this.hideTooltip, position: this.tooltipPosition, direction: this.tooltipDirection }, tooltipWithHint))));
  }
  static get is() { return "vm-caption-control"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["caption-control.css"]
  }; }
  static get styleUrls() { return {
    "$": ["caption-control.css"]
  }; }
  static get properties() { return {
    "showIcon": {
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
        "text": "The URL to an SVG element or fragment to load."
      },
      "attribute": "show-icon",
      "reflect": false,
      "defaultValue": "'captions-on'"
    },
    "hideIcon": {
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
        "text": "The URL to an SVG element or fragment to load."
      },
      "attribute": "hide-icon",
      "reflect": false,
      "defaultValue": "'captions-off'"
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
      "defaultValue": "'c'"
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
    },
    "textTracks": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['textTracks']",
        "resolved": "TextTrack[]",
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
      "defaultValue": "[]"
    },
    "isTextTrackVisible": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isTextTrackVisible']",
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
      "attribute": "is-text-track-visible",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "canToggleCaptionVisibility": {}
  }; }
  static get watchers() { return [{
      "propName": "textTracks",
      "methodName": "onTextTracksChange"
    }, {
      "propName": "playbackReady",
      "methodName": "onTextTracksChange"
    }]; }
}
