var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, h, Method, Prop } from '@stencil/core';
import { createDispatcher, } from '../../core/player/PlayerDispatcher';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
/**
 * Enables toggling playback by clicking the player.
 */
export class ClickToPlay {
  constructor() {
    /**
     * By default this is disabled on mobile to not interfere with playback, set this to `true` to
     * enable it.
     */
    this.useOnMobile = false;
    /** @internal */
    this.paused = true;
    /** @internal */
    this.isVideoView = false;
    /** @internal */
    this.isMobile = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['paused', 'isVideoView', 'isMobile']);
  }
  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }
  /** @internal */
  forceClick() {
    return __awaiter(this, void 0, void 0, function* () {
      this.onClick();
    });
  }
  onClick() {
    this.dispatch('paused', !this.paused);
  }
  render() {
    return (h("div", { class: {
        clickToPlay: true,
        enabled: this.isVideoView && (!this.isMobile || this.useOnMobile),
      }, onClick: this.onClick.bind(this) }));
  }
  static get is() { return "vm-click-to-play"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["click-to-play.css"]
  }; }
  static get styleUrls() { return {
    "$": ["click-to-play.css"]
  }; }
  static get properties() { return {
    "useOnMobile": {
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
        "text": "By default this is disabled on mobile to not interfere with playback, set this to `true` to\nenable it."
      },
      "attribute": "use-on-mobile",
      "reflect": false,
      "defaultValue": "false"
    },
    "paused": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['paused']",
        "resolved": "boolean",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../core/player/PlayerProps"
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
      "attribute": "paused",
      "reflect": false,
      "defaultValue": "true"
    },
    "isVideoView": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isVideoView']",
        "resolved": "boolean",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../core/player/PlayerProps"
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
      "attribute": "is-video-view",
      "reflect": false,
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
            "path": "../../core/player/PlayerProps"
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
    }
  }; }
  static get methods() { return {
    "forceClick": {
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
        "text": "",
        "tags": [{
            "name": "internal",
            "text": undefined
          }]
      }
    }
  }; }
}
