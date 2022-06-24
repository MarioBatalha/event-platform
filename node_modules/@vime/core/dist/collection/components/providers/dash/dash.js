var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, Event, h, Listen, Method, Prop, State, Watch, } from '@stencil/core';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { loadSDK } from '../../../utils/network';
import { isString, isUndefined } from '../../../utils/unit';
import { MediaType } from '../../core/player/MediaType';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { dashRegex } from '../file/utils';
import { withProviderConnect } from '../ProviderConnect';
import { createProviderDispatcher, } from '../ProviderDispatcher';
/**
 * Enables loading, playing and controlling
 * [MPEG DASH](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP) based media. It
 * uses [`dashjs`](https://github.com/Dash-Industry-Forum/dash.js.md) under the hood.
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 */
export class Dash {
  constructor() {
    this.textTracksDisposal = new Disposal();
    this.hasAttached = false;
    /**
     * The NPM package version of the `dashjs` library to download and use.
     */
    this.version = 'latest';
    /**
     * The `dashjs` configuration.
     */
    this.config = {};
    /** @internal */
    this.autoplay = false;
    /** @inheritdoc */
    this.preload = 'metadata';
    /**
     * Are text tracks enabled by default.
     */
    this.enableTextTracksByDefault = true;
    /** @internal */
    this.shouldRenderNativeTextTracks = true;
    /** @internal */
    this.isTextTrackVisible = true;
    /** @internal */
    this.currentTextTrack = -1;
    withComponentRegistry(this);
    withProviderConnect(this);
    withPlayerContext(this, [
      'autoplay',
      'shouldRenderNativeTextTracks',
      'isTextTrackVisible',
      'currentTextTrack',
    ]);
  }
  onSrcChange() {
    var _a;
    if (!this.hasAttached)
      return;
    this.vmLoadStart.emit();
    (_a = this.dash) === null || _a === void 0 ? void 0 : _a.attachSource(this.src);
  }
  onShouldRenderNativeTextTracks() {
    var _a;
    if (this.shouldRenderNativeTextTracks) {
      this.textTracksDisposal.empty();
    }
    else {
      this.hideCurrentTextTrack();
    }
    (_a = this.dash) === null || _a === void 0 ? void 0 : _a.enableForcedTextStreaming(!this.shouldRenderNativeTextTracks);
  }
  onTextTrackChange() {
    var _a, _b;
    if (!this.shouldRenderNativeTextTracks || isUndefined(this.dash))
      return;
    this.dash.setTextTrack(!this.isTextTrackVisible ? -1 : this.currentTextTrack);
    if (!this.isTextTrackVisible) {
      const track = Array.from((_b = (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.textTracks) !== null && _b !== void 0 ? _b : [])[this.currentTextTrack];
      if ((track === null || track === void 0 ? void 0 : track.mode) === 'hidden')
        this.dispatch('currentTextTrack', -1);
    }
  }
  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    if (this.mediaEl)
      this.setupDash();
  }
  disconnectedCallback() {
    this.textTracksDisposal.empty();
    this.destroyDash();
  }
  setupDash() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const url = this.libSrc ||
          `https://cdn.jsdelivr.net/npm/dashjs@${this.version}/dist/dash.all.min.js`;
        const DashSDK = (yield loadSDK(url, 'dashjs'));
        this.dash = DashSDK.MediaPlayer(this.config).create();
        this.dash.initialize(this.mediaEl, null, this.autoplay);
        this.dash.setTextDefaultEnabled(this.enableTextTracksByDefault);
        this.dash.enableForcedTextStreaming(!this.shouldRenderNativeTextTracks);
        this.dash.on(DashSDK.MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
          this.dispatch('mediaType', MediaType.Video);
          this.dispatch('currentSrc', this.src);
          this.dispatchLevels();
          this.listenToTextTracksForChanges();
          this.dispatch('playbackReady', true);
        });
        this.dash.on(DashSDK.MediaPlayer.events.TRACK_CHANGE_RENDERED, () => {
          if (!this.shouldRenderNativeTextTracks)
            this.hideCurrentTextTrack();
        });
        this.dash.on(DashSDK.MediaPlayer.events.ERROR, (e) => {
          this.vmError.emit(e);
        });
        this.hasAttached = true;
      }
      catch (e) {
        this.vmError.emit(e);
      }
    });
  }
  destroyDash() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      (_a = this.dash) === null || _a === void 0 ? void 0 : _a.reset();
      this.hasAttached = false;
    });
  }
  onMediaElChange(event) {
    return __awaiter(this, void 0, void 0, function* () {
      this.destroyDash();
      if (isUndefined(event.detail))
        return;
      this.mediaEl = event.detail;
      yield this.setupDash();
    });
  }
  levelToPlaybackQuality(level) {
    return level === -1 ? 'Auto' : `${level.height}p`;
  }
  findLevelIndexFromQuality(quality) {
    return this.dash
      .getBitrateInfoListFor('video')
      .findIndex((level) => this.levelToPlaybackQuality(level) === quality);
  }
  dispatchLevels() {
    try {
      const levels = this.dash.getBitrateInfoListFor('video');
      if ((levels === null || levels === void 0 ? void 0 : levels.length) > 0) {
        this.dispatch('playbackQualities', [
          'Auto',
          ...levels.map(this.levelToPlaybackQuality),
        ]);
        this.dispatch('playbackQuality', 'Auto');
      }
    }
    catch (e) {
      this.vmError.emit(e);
    }
  }
  listenToTextTracksForChanges() {
    var _a, _b, _c;
    this.textTracksDisposal.empty();
    if (isUndefined(this.mediaEl) || this.shouldRenderNativeTextTracks)
      return;
    // Init current track.
    const currentTrack = (_c = ((_b = (_a = this.dash) === null || _a === void 0 ? void 0 : _a.getCurrentTrackFor('text')) === null || _b === void 0 ? void 0 : _b.index) - 1) !== null && _c !== void 0 ? _c : -1;
    this.currentTextTrack = currentTrack;
    this.dispatch('currentTextTrack', currentTrack);
    this.textTracksDisposal.add(listen(this.mediaEl.textTracks, 'change', this.onTextTracksChange.bind(this)));
  }
  getTextTracks() {
    var _a, _b;
    return Array.from((_b = (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.textTracks) !== null && _b !== void 0 ? _b : []);
  }
  hideCurrentTextTrack() {
    const textTracks = this.getTextTracks();
    if (textTracks[this.currentTextTrack] && this.isTextTrackVisible) {
      textTracks[this.currentTextTrack].mode = 'hidden';
    }
  }
  onTextTracksChange() {
    this.hideCurrentTextTrack();
    this.dispatch('textTracks', this.getTextTracks());
    this.dispatch('isTextTrackVisible', this.isTextTrackVisible);
    this.dispatch('currentTextTrack', this.currentTextTrack);
  }
  /** @internal */
  getAdapter() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const adapter = (_b = (yield ((_a = this.videoProvider) === null || _a === void 0 ? void 0 : _a.getAdapter()))) !== null && _b !== void 0 ? _b : {};
      const canVideoProviderPlay = adapter.canPlay;
      return Object.assign(Object.assign({}, adapter), { getInternalPlayer: () => __awaiter(this, void 0, void 0, function* () { return this.dash; }), canPlay: (type) => __awaiter(this, void 0, void 0, function* () {
          var _c;
          return (isString(type) && dashRegex.test(type)) ||
            ((_c = canVideoProviderPlay === null || canVideoProviderPlay === void 0 ? void 0 : canVideoProviderPlay(type)) !== null && _c !== void 0 ? _c : false);
        }), canSetPlaybackQuality: () => __awaiter(this, void 0, void 0, function* () {
          var _d, _e;
          try {
            return ((_e = (_d = this.dash) === null || _d === void 0 ? void 0 : _d.getBitrateInfoListFor('video')) === null || _e === void 0 ? void 0 : _e.length) > 0;
          }
          catch (e) {
            this.vmError.emit(e);
            return false;
          }
        }), setPlaybackQuality: (quality) => __awaiter(this, void 0, void 0, function* () {
          if (!isUndefined(this.dash)) {
            const index = this.findLevelIndexFromQuality(quality);
            this.dash.updateSettings({
              streaming: {
                abr: {
                  autoSwitchBitrate: {
                    video: index === -1,
                  },
                },
              },
            });
            if (index >= 0)
              this.dash.setQualityFor('video', index);
            // Update the provider cache.
            this.dispatch('playbackQuality', quality);
          }
        }), setCurrentTextTrack: (trackId) => __awaiter(this, void 0, void 0, function* () {
          var _f;
          if (this.shouldRenderNativeTextTracks) {
            adapter.setCurrentTextTrack(trackId);
          }
          else {
            this.currentTextTrack = trackId;
            (_f = this.dash) === null || _f === void 0 ? void 0 : _f.setTextTrack(trackId);
            this.onTextTracksChange();
          }
        }), setTextTrackVisibility: (isVisible) => __awaiter(this, void 0, void 0, function* () {
          var _g;
          if (this.shouldRenderNativeTextTracks) {
            adapter.setTextTrackVisibility(isVisible);
          }
          else {
            this.isTextTrackVisible = isVisible;
            (_g = this.dash) === null || _g === void 0 ? void 0 : _g.enableText(isVisible);
            this.onTextTracksChange();
          }
        }) });
    });
  }
  render() {
    return (h("vm-video", { willAttach: true, crossOrigin: this.crossOrigin, preload: this.preload, poster: this.poster, controlsList: this.controlsList, autoPiP: this.autoPiP, disablePiP: this.disablePiP, hasCustomTextManager: !this.shouldRenderNativeTextTracks, disableRemotePlayback: this.disableRemotePlayback, mediaTitle: this.mediaTitle, ref: (el) => {
        this.videoProvider = el;
      } }));
  }
  static get is() { return "vm-dash"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["dash.css"]
  }; }
  static get styleUrls() { return {
    "$": ["dash.css"]
  }; }
  static get properties() { return {
    "src": {
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
        "text": "The URL of the `manifest.mpd` file to use."
      },
      "attribute": "src",
      "reflect": false
    },
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
        "text": "The NPM package version of the `dashjs` library to download and use."
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
        "text": "The URL where the `dashjs` library source can be found. If this property is used, then the\n`version` property is ignored."
      },
      "attribute": "lib-src",
      "reflect": false
    },
    "config": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Record<string, any>",
        "resolved": "{ [x: string]: any; }",
        "references": {
          "Record": {
            "location": "global"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The `dashjs` configuration."
      },
      "defaultValue": "{}"
    },
    "autoplay": {
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
      "attribute": "autoplay",
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
    },
    "enableTextTracksByDefault": {
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
        "text": "Are text tracks enabled by default."
      },
      "attribute": "enable-text-tracks-by-default",
      "reflect": false,
      "defaultValue": "true"
    },
    "shouldRenderNativeTextTracks": {
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
      "attribute": "should-render-native-text-tracks",
      "reflect": false,
      "defaultValue": "true"
    },
    "isTextTrackVisible": {
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
      "attribute": "is-text-track-visible",
      "reflect": false,
      "defaultValue": "true"
    },
    "currentTextTrack": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
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
      "attribute": "current-text-track",
      "reflect": false,
      "defaultValue": "-1"
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
        "signature": "() => Promise<{ getInternalPlayer: () => Promise<any>; canPlay: (type: any) => Promise<boolean>; canSetPlaybackQuality: () => Promise<boolean>; setPlaybackQuality: (quality: string) => Promise<void>; setCurrentTextTrack: (trackId: number) => Promise<void>; setTextTrackVisibility: (isVisible: boolean) => Promise<void>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<void>; exitFullscreen: () => Promise<void>; }>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<{ getInternalPlayer: () => Promise<any>; canPlay: (type: any) => Promise<boolean>; canSetPlaybackQuality: () => Promise<boolean>; setPlaybackQuality: (quality: string) => Promise<void>; setCurrentTextTrack: (trackId: number) => Promise<void>; setTextTrackVisibility: (isVisible: boolean) => Promise<void>; play: () => Promise<void | undefined>; pause: () => Promise<void | undefined>; setCurrentTime: (time: number) => Promise<void>; setMuted: (muted: boolean) => Promise<void>; setVolume: (volume: number) => Promise<void>; canSetPlaybackRate: () => Promise<boolean>; setPlaybackRate: (rate: number) => Promise<void>; canSetPiP: () => Promise<boolean>; enterPiP: () => Promise<any>; exitPiP: () => Promise<any>; canSetFullscreen: () => Promise<boolean>; enterFullscreen: () => Promise<void>; exitFullscreen: () => Promise<void>; }>"
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
  static get watchers() { return [{
      "propName": "src",
      "methodName": "onSrcChange"
    }, {
      "propName": "hasAttached",
      "methodName": "onSrcChange"
    }, {
      "propName": "shouldRenderNativeTextTracks",
      "methodName": "onShouldRenderNativeTextTracks"
    }, {
      "propName": "isTextTrackVisible",
      "methodName": "onTextTrackChange"
    }, {
      "propName": "currentTextTrack",
      "methodName": "onTextTrackChange"
    }]; }
  static get listeners() { return [{
      "name": "vmMediaElChange",
      "method": "onMediaElChange",
      "target": undefined,
      "capture": false,
      "passive": false
    }]; }
}
