var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, h, Listen, Method, Prop } from '@stencil/core';
import { ViewType } from '../../core/player/ViewType';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withProviderConnect } from '../ProviderConnect';
/**
 * Enables loading, playing and controlling videos via the
 * HTML5 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element.
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 *
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class Video {
  constructor() {
    /**
     * @internal Whether an external SDK will attach itself to the media player and control it.
     */
    this.willAttach = false;
    /**
     * @internal Whether an external SDK will manage the text tracks.
     */
    this.hasCustomTextManager = false;
    /** @inheritdoc */
    this.preload = 'metadata';
    withComponentRegistry(this);
    withProviderConnect(this);
  }
  onProviderConnect(event) {
    if (this.willAttach)
      event.stopImmediatePropagation();
  }
  onProviderDisconnect(event) {
    if (this.willAttach)
      event.stopImmediatePropagation();
  }
  /** @internal */
  getAdapter() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      return (_a = this.fileProvider) === null || _a === void 0 ? void 0 : _a.getAdapter();
    });
  }
  render() {
    return (h("vm-file", { noConnect: true, willAttach: this.willAttach, crossOrigin: this.crossOrigin, poster: this.poster, preload: this.preload, controlsList: this.controlsList, autoPiP: this.autoPiP, disablePiP: this.disablePiP, disableRemotePlayback: this.disableRemotePlayback, hasCustomTextManager: this.hasCustomTextManager, mediaTitle: this.mediaTitle, viewType: ViewType.Video, ref: (el) => {
        this.fileProvider = el;
      } },
      h("slot", null)));
  }
  static get is() { return "vm-video"; }
  static get properties() { return {
    "willAttach": {
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
        "tags": [{
            "text": "Whether an external SDK will attach itself to the media player and control it.",
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "will-attach",
      "reflect": false,
      "defaultValue": "false"
    },
    "hasCustomTextManager": {
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
        "tags": [{
            "text": "Whether an external SDK will manage the text tracks.",
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "has-custom-text-manager",
      "reflect": false,
      "defaultValue": "false"
    },
    "crossOrigin": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "MediaCrossOriginOption",
        "resolved": "\"\" | \"anonymous\" | \"use-credentials\" | undefined",
        "references": {
          "MediaCrossOriginOption": {
            "location": "import",
            "path": "../file/MediaFileProvider"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "Whether to use CORS to fetch the related image. See\n[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more\ninformation."
      },
      "attribute": "cross-origin",
      "reflect": false
    },
    "preload": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "MediaPreloadOption",
        "resolved": "\"\" | \"auto\" | \"metadata\" | \"none\" | undefined",
        "references": {
          "MediaPreloadOption": {
            "location": "import",
            "path": "../file/MediaFileProvider"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "Provides a hint to the browser about what the author thinks will lead to the best user\nexperience with regards to what content is loaded before the video is played. See\n[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more\ninformation."
      },
      "attribute": "preload",
      "reflect": false,
      "defaultValue": "'metadata'"
    },
    "poster": {
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
        "text": "A URL for an image to be shown while the video is downloading. If this attribute isn't\nspecified, nothing is displayed until the first frame is available, then the first frame is\nshown as the poster frame."
      },
      "attribute": "poster",
      "reflect": false
    },
    "controlsList": {
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
        "text": "Determines what controls to show on the media element whenever the browser shows its own set\nof controls (e.g. when the controls attribute is specified)."
      },
      "attribute": "controls-list",
      "reflect": false
    },
    "autoPiP": {
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
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "**EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as\nthe user switches back and forth between this document and another document or application."
      },
      "attribute": "auto-pip",
      "reflect": false
    },
    "disablePiP": {
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
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "**EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or to\nrequest picture-in-picture automatically in some cases."
      },
      "attribute": "disable-pip",
      "reflect": false
    },
    "disableRemotePlayback": {
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
        "tags": [{
            "text": undefined,
            "name": "inheritdoc"
          }],
        "text": "**EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are\nattached using wired (HDMI, DVI, etc.) and wireless technologies\n(Miracast, Chromecast, DLNA, AirPlay, etc)."
      },
      "attribute": "disable-remote-playback",
      "reflect": false
    },
    "mediaTitle": {
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
        "text": "The title of the current media."
      },
      "attribute": "media-title",
      "reflect": false
    }
  }; }
  static get methods() { return {
    "getAdapter": {
      "complexType": {
        "signature": "() => Promise<{ getInternalPlayer: () => Promise<HTMLMediaElement>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; canPlay: (type: any) => Promise<boolean>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<void>; exitFullscreen: () => Promise<void>; setCurrentTextTrack: (trackId: number) => Promise<void>; setTextTrackVisibility: (isVisible: boolean) => Promise<void>; }>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          },
          "HTMLMediaElement": {
            "location": "global"
          }
        },
        "return": "Promise<{ getInternalPlayer: () => Promise<HTMLMediaElement>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; canPlay: (type: any) => Promise<boolean>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<void>; exitFullscreen: () => Promise<void>; setCurrentTextTrack: (trackId: number) => Promise<void>; setTextTrackVisibility: (isVisible: boolean) => Promise<void>; }>"
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
  static get listeners() { return [{
      "name": "vmMediaProviderConnect",
      "method": "onProviderConnect",
      "target": undefined,
      "capture": false,
      "passive": false
    }, {
      "name": "vmMediaProviderDisconnect",
      "method": "onProviderDisconnect",
      "target": undefined,
      "capture": false,
      "passive": false
    }]; }
}
