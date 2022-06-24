import { r as registerInstance, c as createEvent, h } from './index-f5fd0f81.js';
import { D as Disposal, c as withComponentRegistry, e as isUndefined, l as listen, h as isString } from './withComponentRegistry-28311671.js';
import { l as loadSDK } from './network-1fe1550f.js';
import { M as MediaType } from './MediaType-aec4c150.js';
import { w as withPlayerContext } from './withPlayerContext-4c52f564.js';
import { d as dashRegex } from './utils-7dc44688.js';
import { w as withProviderConnect, c as createProviderDispatcher } from './ProviderConnect-42dc4f0d.js';
import './support-b6811262.js';
import './PlayerEvents-5c5704d6.js';
import './Provider-2e7e8366.js';
import './PlayerProps-2c57fcea.js';

const dashCss = ":host{z-index:var(--vm-media-z-index)}";

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try {
      step(generator.next(value));
    }
    catch (e) {
      reject(e);
    } }
    function rejected(value) { try {
      step(generator["throw"](value));
    }
    catch (e) {
      reject(e);
    } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const Dash = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmLoadStart = createEvent(this, "vmLoadStart", 7);
    this.vmError = createEvent(this, "vmError", 7);
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
  static get watchers() { return {
    "src": ["onSrcChange"],
    "hasAttached": ["onSrcChange"],
    "shouldRenderNativeTextTracks": ["onShouldRenderNativeTextTracks"],
    "isTextTrackVisible": ["onTextTrackChange"],
    "currentTextTrack": ["onTextTrackChange"]
  }; }
};
Dash.style = dashCss;

export { Dash as vm_dash };
