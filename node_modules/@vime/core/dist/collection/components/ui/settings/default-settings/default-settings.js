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
import { isUndefined } from '../../../../utils/unit';
import { findPlayer } from '../../../core/player/findPlayer';
import { createDispatcher, } from '../../../core/player/PlayerDispatcher';
import { getPlayerFromRegistry, withComponentRegistry, } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
/**
 * Creates a settings menu with options for changing the audio track, playback rate, quality and
 * captions of the current media. This component is provider aware. For example, it will only show
 * options for changing the playback rate if the current provider allows changing it
 * (`player.canSetPlaybackRate()`).  In addition, you can extend the settings with more options
 * via the default `slot`.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/default-settings/default-settings.png"
 *   alt="Vime default settings component"
 * />
 *
 * @slot - Used to extend the settings with additional menu options (see `vm-submenu` or
 * `vm-menu-item`).
 */
export class DefaultSettings {
  constructor() {
    this.textTracksDisposal = new Disposal();
    this.canSetPlaybackRate = false;
    this.canSetPlaybackQuality = false;
    this.canSetTextTrack = false;
    this.canSetAudioTrack = false;
    /**
     * Pins the settings to the defined position inside the video player. This has no effect when
     * the view is of type `audio`, it will always be `bottomRight`.
     */
    this.pin = 'bottomRight';
    /** @internal */
    this.i18n = {};
    /** @internal */
    this.playbackReady = false;
    /** @internal */
    this.playbackRate = 1;
    /** @internal */
    this.playbackRates = [1];
    /** @internal */
    this.isVideoView = false;
    /** @internal */
    this.playbackQualities = [];
    /** @internal */
    this.textTracks = [];
    /** @internal */
    this.currentTextTrack = -1;
    /** @internal */
    this.audioTracks = [];
    /** @internal */
    this.currentAudioTrack = -1;
    /** @internal */
    this.isTextTrackVisible = true;
    withComponentRegistry(this);
    withPlayerContext(this, [
      'i18n',
      'playbackReady',
      'playbackRate',
      'playbackRates',
      'playbackQuality',
      'playbackQualities',
      'isVideoView',
      'textTracks',
      'currentTextTrack',
      'isTextTrackVisible',
      'audioTracks',
      'currentAudioTrack',
    ]);
  }
  onPlaybackReady() {
    return __awaiter(this, void 0, void 0, function* () {
      const player = yield findPlayer(this);
      if (isUndefined(player))
        return;
      this.canSetPlaybackQuality = yield player.canSetPlaybackQuality();
      this.canSetPlaybackRate = yield player.canSetPlaybackRate();
    });
  }
  onAudioTracksChange() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const player = getPlayerFromRegistry(this);
      this.canSetAudioTrack = (_a = (yield (player === null || player === void 0 ? void 0 : player.canSetAudioTrack()))) !== null && _a !== void 0 ? _a : false;
    });
  }
  onTextTracksChange() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const player = getPlayerFromRegistry(this);
      this.canSetTextTrack = (_a = (yield (player === null || player === void 0 ? void 0 : player.canSetTextTrack()))) !== null && _a !== void 0 ? _a : false;
    });
  }
  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }
  componentDidLoad() {
    this.onTextTracksChange();
  }
  disconnectedCallback() {
    this.textTracksDisposal.empty();
  }
  onPlaybackRateSelect(event) {
    const radio = event.target;
    this.dispatch('playbackRate', parseFloat(radio.value));
  }
  buildPlaybackRateSubmenu() {
    if (this.playbackRates.length <= 1 || !this.canSetPlaybackRate) {
      return (h("vm-menu-item", { label: this.i18n.playbackRate, hint: this.i18n.normal }));
    }
    const formatRate = (rate) => rate === 1 ? this.i18n.normal : `${rate}`;
    return (h("vm-submenu", { label: this.i18n.playbackRate, hint: formatRate(this.playbackRate) },
      h("vm-menu-radio-group", { value: `${this.playbackRate}`, onVmCheck: this.onPlaybackRateSelect.bind(this) }, this.playbackRates.map(rate => (h("vm-menu-radio", { label: formatRate(rate), value: `${rate}` }))))));
  }
  onPlaybackQualitySelect(event) {
    const radio = event.target;
    this.dispatch('playbackQuality', radio.value);
  }
  buildPlaybackQualitySubmenu() {
    var _a;
    if (this.playbackQualities.length <= 1 || !this.canSetPlaybackQuality) {
      return (h("vm-menu-item", { label: this.i18n.playbackQuality, hint: (_a = this.playbackQuality) !== null && _a !== void 0 ? _a : this.i18n.auto }));
    }
    // @TODO this doesn't account for audio qualities yet.
    const getBadge = (quality) => {
      const verticalPixels = parseInt(quality.slice(0, -1), 10);
      if (verticalPixels >= 2160)
        return 'UHD';
      if (verticalPixels >= 1080)
        return 'HD';
      return undefined;
    };
    return (h("vm-submenu", { label: this.i18n.playbackQuality, hint: this.playbackQuality },
      h("vm-menu-radio-group", { value: this.playbackQuality, onVmCheck: this.onPlaybackQualitySelect.bind(this) }, this.playbackQualities.map(quality => (h("vm-menu-radio", { label: quality, value: quality, badge: getBadge(quality) }))))));
  }
  onTextTrackSelect(event) {
    const radio = event.target;
    const trackId = parseInt(radio.value, 10);
    const player = getPlayerFromRegistry(this);
    if (trackId === -1) {
      player === null || player === void 0 ? void 0 : player.setTextTrackVisibility(false);
      return;
    }
    player === null || player === void 0 ? void 0 : player.setTextTrackVisibility(true);
    player === null || player === void 0 ? void 0 : player.setCurrentTextTrack(trackId);
  }
  buildTextTracksSubmenu() {
    var _a, _b, _c;
    if (this.textTracks.length <= 1 || !this.canSetTextTrack) {
      return (h("vm-menu-item", { label: this.i18n.subtitlesOrCc, hint: (_b = (_a = this.textTracks[this.currentTextTrack]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : this.i18n.none }));
    }
    return (h("vm-submenu", { label: this.i18n.subtitlesOrCc, hint: this.isTextTrackVisible
        ? (_c = this.textTracks[this.currentTextTrack]) === null || _c === void 0 ? void 0 : _c.label
        : this.i18n.off },
      h("vm-menu-radio-group", { value: `${!this.isTextTrackVisible ? -1 : this.currentTextTrack}`, onVmCheck: this.onTextTrackSelect.bind(this) }, [h("vm-menu-radio", { label: this.i18n.off, value: "-1" })].concat(this.textTracks.map((track, i) => (h("vm-menu-radio", { label: track.label, value: `${i}` })))))));
  }
  onAudioTrackSelect(event) {
    const radio = event.target;
    const trackId = parseInt(radio.value, 10);
    const player = getPlayerFromRegistry(this);
    player === null || player === void 0 ? void 0 : player.setCurrentAudioTrack(trackId);
  }
  buildAudioTracksMenu() {
    var _a, _b, _c;
    if (this.audioTracks.length <= 1 || !this.canSetAudioTrack) {
      return (h("vm-menu-item", { label: this.i18n.audio, hint: (_b = (_a = this.audioTracks[this.currentAudioTrack]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : this.i18n.default }));
    }
    return (h("vm-submenu", { label: this.i18n.audio, hint: (_c = this.audioTracks[this.currentAudioTrack]) === null || _c === void 0 ? void 0 : _c.label },
      h("vm-menu-radio-group", { value: `${this.currentAudioTrack}`, onVmCheck: this.onAudioTrackSelect.bind(this) }, this.audioTracks.map((track, i) => (h("vm-menu-radio", { label: track.label, value: `${i}` }))))));
  }
  render() {
    return (h("vm-settings", { pin: this.pin },
      this.buildAudioTracksMenu(),
      this.buildPlaybackRateSubmenu(),
      this.buildPlaybackQualitySubmenu(),
      this.isVideoView && this.buildTextTracksSubmenu(),
      h("slot", null)));
  }
  static get is() { return "vm-default-settings"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["default-settings.css"]
  }; }
  static get styleUrls() { return {
    "$": ["default-settings.css"]
  }; }
  static get properties() { return {
    "pin": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'",
        "resolved": "\"bottomLeft\" | \"bottomRight\" | \"topLeft\" | \"topRight\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Pins the settings to the defined position inside the video player. This has no effect when\nthe view is of type `audio`, it will always be `bottomRight`."
      },
      "attribute": "pin",
      "reflect": true,
      "defaultValue": "'bottomRight'"
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
    "playbackRate": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['playbackRate']",
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
      "attribute": "playback-rate",
      "reflect": false,
      "defaultValue": "1"
    },
    "playbackRates": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['playbackRates']",
        "resolved": "number[]",
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
      "defaultValue": "[1]"
    },
    "isVideoView": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isAudioView']",
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
      "attribute": "is-video-view",
      "reflect": false,
      "defaultValue": "false"
    },
    "playbackQuality": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['playbackQuality']",
        "resolved": "string | undefined",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../../core/player/PlayerProps"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "playback-quality",
      "reflect": false
    },
    "playbackQualities": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['playbackQualities']",
        "resolved": "string[]",
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
    },
    "audioTracks": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['audioTracks']",
        "resolved": "any[]",
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
    "currentAudioTrack": {
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
      "attribute": "current-audio-track",
      "reflect": false,
      "defaultValue": "-1"
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
    }
  }; }
  static get states() { return {
    "canSetPlaybackRate": {},
    "canSetPlaybackQuality": {},
    "canSetTextTrack": {},
    "canSetAudioTrack": {}
  }; }
  static get watchers() { return [{
      "propName": "playbackReady",
      "methodName": "onPlaybackReady"
    }, {
      "propName": "audioTracks",
      "methodName": "onAudioTracksChange"
    }, {
      "propName": "playbackReady",
      "methodName": "onAudioTracksChange"
    }, {
      "propName": "textTracks",
      "methodName": "onTextTracksChange"
    }, {
      "propName": "playbackReady",
      "methodName": "onTextTracksChange"
    }]; }
}
