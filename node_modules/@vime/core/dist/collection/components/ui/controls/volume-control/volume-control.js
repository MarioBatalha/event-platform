var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, h, Prop, State, Watch } from '@stencil/core';
import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { isUndefined } from '../../../../utils/unit';
import { findPlayer } from '../../../core/player/findPlayer';
import { createDispatcher, } from '../../../core/player/PlayerDispatcher';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
/**
 * A control for adjusting the volume of the player and toggling the muted state.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/volume-control/volume-control.png"
 *   alt="Vime volume control component"
 * />
 */
export class VolumeControl {
  constructor() {
    this.keyboardDisposal = new Disposal();
    this.prevMuted = false;
    this.currentVolume = 50;
    this.isSliderActive = false;
    /**
     * The name of the low volume icon to resolve from the icon library.
     */
    this.lowVolumeIcon = 'volume-low';
    /**
     * The name of the high volume icon to resolve from the icon library.
     */
    this.highVolumeIcon = 'volume-high';
    /**
     * The name of the muted volume icon to resolve from the icon library.
     */
    this.mutedIcon = 'volume-mute';
    /**
     * Whether the tooltip is positioned above/below the control.
     */
    this.tooltipPosition = 'top';
    /**
     * Whether the tooltip should be hidden.
     */
    this.hideTooltip = false;
    /**
     * A pipe (`/`) separated string of JS keyboard keys, that when caught in a `keydown` event, will
     * toggle the muted state of the player.
     */
    this.muteKeys = 'm';
    /**
     * Prevents the volume being changed using the Up/Down arrow keys.
     */
    this.noKeyboard = false;
    /** @internal */
    this.muted = false;
    /** @internal */
    this.volume = 50;
    /** @internal */
    this.isMobile = false;
    /** @internal */
    this.i18n = {};
    withComponentRegistry(this);
    withPlayerContext(this, ['volume', 'muted', 'isMobile', 'i18n']);
  }
  onNoKeyboardChange() {
    return __awaiter(this, void 0, void 0, function* () {
      this.keyboardDisposal.empty();
      if (this.noKeyboard)
        return;
      const player = yield findPlayer(this);
      if (isUndefined(player))
        return;
      this.keyboardDisposal.add(listen(player, 'keydown', (event) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
          return;
        const isUpArrow = event.key === 'ArrowUp';
        const newVolume = isUpArrow
          ? Math.min(100, this.volume + 5)
          : Math.max(0, this.volume - 5);
        this.dispatch('volume', parseInt(`${newVolume}`, 10));
      }));
    });
  }
  onPlayerVolumeChange() {
    this.currentVolume = this.muted ? 0 : this.volume;
    if (!this.muted && this.prevMuted && this.volume === 0) {
      this.dispatch('volume', 30);
    }
    this.prevMuted = this.muted;
  }
  connectedCallback() {
    this.prevMuted = this.muted;
    this.dispatch = createDispatcher(this);
    this.onNoKeyboardChange();
  }
  disconnectedCallback() {
    this.keyboardDisposal.empty();
  }
  onShowSlider() {
    clearTimeout(this.hideSliderTimeout);
    this.isSliderActive = true;
  }
  onHideSlider() {
    this.hideSliderTimeout = setTimeout(() => {
      this.isSliderActive = false;
    }, 100);
  }
  onVolumeChange(event) {
    const newVolume = event.detail;
    this.currentVolume = newVolume;
    this.dispatch('volume', newVolume);
    this.dispatch('muted', newVolume === 0);
  }
  onKeyDown(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
      return;
    event.stopPropagation();
  }
  render() {
    return (h("div", { class: "volumeControl", onMouseEnter: this.onShowSlider.bind(this), onMouseLeave: this.onHideSlider.bind(this) },
      h("vm-mute-control", { keys: this.muteKeys, lowVolumeIcon: this.lowVolumeIcon, highVolumeIcon: this.highVolumeIcon, mutedIcon: this.mutedIcon, icons: this.icons, tooltipPosition: this.tooltipPosition, tooltipDirection: this.tooltipDirection, hideTooltip: this.hideTooltip, onVmFocus: this.onShowSlider.bind(this), onVmBlur: this.onHideSlider.bind(this) }),
      h("vm-slider", { class: {
          hidden: this.isMobile,
          active: this.isSliderActive,
        }, step: 5, max: 100, value: this.currentVolume, label: this.i18n.volume, onKeyDown: this.onKeyDown.bind(this), onVmFocus: this.onShowSlider.bind(this), onVmBlur: this.onHideSlider.bind(this), onVmValueChange: this.onVolumeChange.bind(this) })));
  }
  static get is() { return "vm-volume-control"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["volume-control.css"]
  }; }
  static get styleUrls() { return {
    "$": ["volume-control.css"]
  }; }
  static get properties() { return {
    "lowVolumeIcon": {
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
        "text": "The name of the low volume icon to resolve from the icon library."
      },
      "attribute": "low-volume-icon",
      "reflect": false,
      "defaultValue": "'volume-low'"
    },
    "highVolumeIcon": {
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
        "text": "The name of the high volume icon to resolve from the icon library."
      },
      "attribute": "high-volume-icon",
      "reflect": false,
      "defaultValue": "'volume-high'"
    },
    "mutedIcon": {
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
        "text": "The name of the muted volume icon to resolve from the icon library."
      },
      "attribute": "muted-icon",
      "reflect": false,
      "defaultValue": "'volume-mute'"
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
        "text": "Whether the tooltip should be hidden."
      },
      "attribute": "hide-tooltip",
      "reflect": false,
      "defaultValue": "false"
    },
    "muteKeys": {
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
        "text": "A pipe (`/`) separated string of JS keyboard keys, that when caught in a `keydown` event, will\ntoggle the muted state of the player."
      },
      "attribute": "mute-keys",
      "reflect": false,
      "defaultValue": "'m'"
    },
    "noKeyboard": {
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
        "text": "Prevents the volume being changed using the Up/Down arrow keys."
      },
      "attribute": "no-keyboard",
      "reflect": false,
      "defaultValue": "false"
    },
    "muted": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['muted']",
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
      "attribute": "muted",
      "reflect": false,
      "defaultValue": "false"
    },
    "volume": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['volume']",
        "resolved": "number",
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
      "attribute": "volume",
      "reflect": false,
      "defaultValue": "50"
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
    }
  }; }
  static get states() { return {
    "currentVolume": {},
    "isSliderActive": {}
  }; }
  static get watchers() { return [{
      "propName": "noKeyboard",
      "methodName": "onNoKeyboardChange"
    }, {
      "propName": "muted",
      "methodName": "onPlayerVolumeChange"
    }, {
      "propName": "volume",
      "methodName": "onPlayerVolumeChange"
    }]; }
}
