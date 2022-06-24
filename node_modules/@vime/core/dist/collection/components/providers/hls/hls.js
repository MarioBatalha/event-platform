var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, Event, h, Listen, Method, Prop, State, } from '@stencil/core';
import { loadSDK } from '../../../utils/network';
import { isNil, isString, isUndefined } from '../../../utils/unit';
import { MediaType } from '../../core/player/MediaType';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { hlsRegex, hlsTypeRegex } from '../file/utils';
import { withProviderConnect } from '../ProviderConnect';
import { createProviderDispatcher, } from '../ProviderDispatcher';
/**
 * Enables loading, playing and controlling [HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
 * based media. If the [browser does not support HLS](https://caniuse.com/#search=hls) then the
 * [`hls.js`](https://github.com/video-dev/hls.js) library is downloaded and used as a fallback to
 * play the stream.
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 *
 * @slot - Pass `<source>` elements to the underlying HTML5 media player.
 */
export class HLS {
  constructor() {
    this.hasAttached = false;
    /**
     * The NPM package version of the `hls.js` library to download and use if HLS is not natively
     * supported.
     */
    this.version = 'latest';
    /** @inheritdoc */
    this.preload = 'metadata';
    /** @internal */
    this.playbackReady = false;
    withComponentRegistry(this);
    withProviderConnect(this);
    withPlayerContext(this, ['playbackReady']);
  }
  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    if (this.mediaEl)
      this.setupHls();
  }
  disconnectedCallback() {
    this.destroyHls();
  }
  get src() {
    if (isNil(this.videoProvider))
      return undefined;
    const sources = this.videoProvider.querySelectorAll('source');
    const currSource = Array.from(sources).find(source => hlsRegex.test(source.src) || hlsTypeRegex.test(source.type));
    return currSource === null || currSource === void 0 ? void 0 : currSource.src;
  }
  setupHls() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!isUndefined(this.hls))
        return;
      try {
        const url = this.libSrc ||
          `https://cdn.jsdelivr.net/npm/hls.js@${this.version}/dist/hls.min.js`;
        const Hls = (yield loadSDK(url, 'Hls'));
        if (!Hls.isSupported()) {
          this.vmError.emit('hls.js is not supported');
          return;
        }
        this.hls = new Hls(this.config);
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.hasAttached = true;
          this.onSrcChange();
        });
        this.hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
          this.dispatch('audioTracks', this.hls.audioTracks);
          this.dispatch('currentAudioTrack', this.hls.audioTrack);
        });
        this.hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, () => {
          this.dispatch('currentAudioTrack', this.hls.audioTrack);
        });
        this.hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                this.hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                this.hls.recoverMediaError();
                break;
              default:
                this.destroyHls();
                break;
            }
          }
          this.vmError.emit({ event, data });
        });
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.dispatch('mediaType', MediaType.Video);
          this.dispatch('currentSrc', this.src);
          this.dispatchLevels();
        });
        this.hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
          if (!this.playbackReady) {
            this.dispatch('duration', data.details.totalduration);
            this.dispatch('playbackReady', true);
          }
        });
        this.hls.attachMedia(this.mediaEl);
      }
      catch (e) {
        this.vmError.emit(e);
      }
    });
  }
  dispatchLevels() {
    if (!this.hls.levels || this.hls.levels.length === 0)
      return;
    this.dispatch('playbackQualities', [
      'Auto',
      ...this.hls.levels.map(this.levelToPlaybackQuality),
    ]);
    this.dispatch('playbackQuality', 'Auto');
  }
  levelToPlaybackQuality(level) {
    return level === -1 ? 'Auto' : `${level.height}p`;
  }
  findLevelIndexFromQuality(quality) {
    return this.hls.levels.findIndex((level) => this.levelToPlaybackQuality(level) === quality);
  }
  destroyHls() {
    var _a;
    (_a = this.hls) === null || _a === void 0 ? void 0 : _a.destroy();
    this.hasAttached = false;
  }
  onMediaElChange(event) {
    return __awaiter(this, void 0, void 0, function* () {
      this.destroyHls();
      if (isUndefined(event.detail))
        return;
      this.mediaEl = event.detail;
      // Need a small delay incase the media element changes rapidly and Hls.js can't reattach.
      setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        yield this.setupHls();
      }), 50);
    });
  }
  onSrcChange() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      if (this.hasAttached && this.hls.url !== this.src) {
        this.vmLoadStart.emit();
        (_a = this.hls) === null || _a === void 0 ? void 0 : _a.loadSource(this.src);
      }
    });
  }
  /** @internal */
  getAdapter() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const adapter = (_b = (yield ((_a = this.videoProvider) === null || _a === void 0 ? void 0 : _a.getAdapter()))) !== null && _b !== void 0 ? _b : {};
      const canVideoProviderPlay = adapter.canPlay;
      return Object.assign(Object.assign({}, adapter), { getInternalPlayer: () => __awaiter(this, void 0, void 0, function* () { return this.hls; }), canPlay: (type) => __awaiter(this, void 0, void 0, function* () {
          var _c;
          return (isString(type) && hlsRegex.test(type)) ||
            ((_c = canVideoProviderPlay === null || canVideoProviderPlay === void 0 ? void 0 : canVideoProviderPlay(type)) !== null && _c !== void 0 ? _c : false);
        }), canSetPlaybackQuality: () => __awaiter(this, void 0, void 0, function* () { var _d, _e; return ((_e = (_d = this.hls) === null || _d === void 0 ? void 0 : _d.levels) === null || _e === void 0 ? void 0 : _e.length) > 0; }), setPlaybackQuality: (quality) => __awaiter(this, void 0, void 0, function* () {
          if (!isUndefined(this.hls)) {
            this.hls.currentLevel = this.findLevelIndexFromQuality(quality);
            // Update the provider cache.
            this.dispatch('playbackQuality', quality);
          }
        }), setCurrentAudioTrack: (trackId) => __awaiter(this, void 0, void 0, function* () {
          if (!isUndefined(this.hls)) {
            this.hls.audioTrack = trackId;
          }
        }) });
    });
  }
  render() {
    return (h("vm-video", { willAttach: true, crossOrigin: this.crossOrigin, preload: this.preload, poster: this.poster, controlsList: this.controlsList, autoPiP: this.autoPiP, disablePiP: this.disablePiP, disableRemotePlayback: this.disableRemotePlayback, mediaTitle: this.mediaTitle, ref: (el) => {
        this.videoProvider = el;
      } },
      h("slot", null)));
  }
  static get is() { return "vm-hls"; }
  static get properties() { return {
    "version": {
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
        "text": "The NPM package version of the `hls.js` library to download and use if HLS is not natively\nsupported."
      },
      "attribute": "version",
      "reflect": false,
      "defaultValue": "'latest'"
    },
    "libSrc": {
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
        "text": "The URL where the `hls.js` library source can be found. If this property is used, then the\n`version` property is ignored."
      },
      "attribute": "lib-src",
      "reflect": false
    },
    "config": {
      "type": "any",
      "mutable": false,
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The `hls.js` configuration."
      },
      "attribute": "config",
      "reflect": false
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
    "playbackReady": {
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
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "playback-ready",
      "reflect": false,
      "defaultValue": "false"
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
  static get states() { return {
    "hasAttached": {}
  }; }
  static get events() { return [{
      "method": "vmLoadStart",
      "name": "vmLoadStart",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }, {
      "method": "vmError",
      "name": "vmError",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when an error has occurred."
      },
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      }
    }]; }
  static get methods() { return {
    "getAdapter": {
      "complexType": {
        "signature": "() => Promise<{ getInternalPlayer: () => Promise<any>; canPlay: (type: any) => Promise<boolean>; canSetPlaybackQuality: () => Promise<boolean>; setPlaybackQuality: (quality: string) => Promise<void>; setCurrentAudioTrack: (trackId: number) => Promise<void>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<void>; exitFullscreen: () => Promise<void>; setCurrentTextTrack: (trackId: number) => Promise<void>; setTextTrackVisibility: (isVisible: boolean) => Promise<void>; }>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<{ getInternalPlayer: () => Promise<any>; canPlay: (type: any) => Promise<boolean>; canSetPlaybackQuality: () => Promise<boolean>; setPlaybackQuality: (quality: string) => Promise<void>; setCurrentAudioTrack: (trackId: number) => Promise<void>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<void>; exitFullscreen: () => Promise<void>; setCurrentTextTrack: (trackId: number) => Promise<void>; setTextTrackVisibility: (isVisible: boolean) => Promise<void>; }>"
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
      "name": "vmMediaElChange",
      "method": "onMediaElChange",
      "target": undefined,
      "capture": false,
      "passive": false
    }, {
      "name": "vmSrcSetChange",
      "method": "onSrcChange",
      "target": undefined,
      "capture": false,
      "passive": false
    }]; }
}
