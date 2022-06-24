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
import { isUndefined } from '../../../utils/unit';
import { findPlayer } from '../../core/player/findPlayer';
import { getComponentFromRegistry, withComponentRegistry, } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
/**
 * Enables toggling fullscreen mode by double clicking the player.
 */
export class DblClickFullscreen {
  constructor() {
    this.canSetFullscreen = false;
    /**
     * By default this is disabled on mobile to not interfere with playback, set this to `true` to
     * enable it.
     */
    this.useOnMobile = false;
    /** @internal */
    this.isFullscreenActive = true;
    /** @internal */
    this.isVideoView = false;
    /** @internal */
    this.playbackReady = false;
    /** @internal */
    this.isMobile = false;
    this.clicks = 0;
    withComponentRegistry(this);
    withPlayerContext(this, [
      'playbackReady',
      'isFullscreenActive',
      'isVideoView',
      'isMobile',
    ]);
  }
  onPlaybackReadyChange() {
    return __awaiter(this, void 0, void 0, function* () {
      const player = yield findPlayer(this);
      if (isUndefined(player))
        return;
      this.canSetFullscreen = yield player.canSetFullscreen();
    });
  }
  onTriggerClickToPlay() {
    return __awaiter(this, void 0, void 0, function* () {
      const [clickToPlay] = getComponentFromRegistry(this, 'vm-click-to-play');
      yield (clickToPlay === null || clickToPlay === void 0 ? void 0 : clickToPlay.forceClick());
    });
  }
  onToggleFullscreen() {
    return __awaiter(this, void 0, void 0, function* () {
      const player = yield findPlayer(this);
      if (isUndefined(player))
        return;
      this.isFullscreenActive
        ? player.exitFullscreen()
        : player.enterFullscreen();
    });
  }
  onClick() {
    this.clicks += 1;
    if (this.clicks === 1) {
      setTimeout(() => {
        if (this.clicks === 1) {
          this.onTriggerClickToPlay();
        }
        else {
          this.onToggleFullscreen();
        }
        this.clicks = 0;
      }, 300);
    }
  }
  render() {
    return (h("div", { class: {
        dblClickFullscreen: true,
        enabled: this.playbackReady &&
          this.canSetFullscreen &&
          this.isVideoView &&
          (!this.isMobile || this.useOnMobile),
      }, onClick: this.onClick.bind(this) }));
  }
  static get is() { return "vm-dbl-click-fullscreen"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["dbl-click-fullscreen.css"]
  }; }
  static get styleUrls() { return {
    "$": ["dbl-click-fullscreen.css"]
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
    "isFullscreenActive": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isFullscreenActive']",
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
      "attribute": "is-fullscreen-active",
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
    "playbackReady": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['playbackReady']",
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
      "attribute": "playback-ready",
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
  static get states() { return {
    "canSetFullscreen": {}
  }; }
  static get watchers() { return [{
      "propName": "playbackReady",
      "methodName": "onPlaybackReadyChange"
    }]; }
}
