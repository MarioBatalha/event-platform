'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-86498cbd.js');
const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');
const network = require('./network-7dc3feca.js');
const MediaType = require('./MediaType-8f0adf5d.js');
const withPlayerContext = require('./withPlayerContext-77ea833f.js');
const utils = require('./utils-b8b7354f.js');
const ProviderConnect = require('./ProviderConnect-100da60f.js');
require('./support-e1714cb5.js');
require('./PlayerEvents-79156eee.js');
require('./Provider-b6123cae.js');
require('./PlayerProps-4bbfc16a.js');

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
    index.registerInstance(this, hostRef);
    this.vmLoadStart = index.createEvent(this, "vmLoadStart", 7);
    this.vmError = index.createEvent(this, "vmError", 7);
    this.textTracksDisposal = new withComponentRegistry.Disposal();
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
    withComponentRegistry.withComponentRegistry(this);
    ProviderConnect.withProviderConnect(this);
    withPlayerContext.withPlayerContext(this, [
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
    if (!this.shouldRenderNativeTextTracks || withComponentRegistry.isUndefined(this.dash))
      return;
    this.dash.setTextTrack(!this.isTextTrackVisible ? -1 : this.currentTextTrack);
    if (!this.isTextTrackVisible) {
      const track = Array.from((_b = (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.textTracks) !== null && _b !== void 0 ? _b : [])[this.currentTextTrack];
      if ((track === null || track === void 0 ? void 0 : track.mode) === 'hidden')
        this.dispatch('currentTextTrack', -1);
    }
  }
  connectedCallback() {
    this.dispatch = ProviderConnect.createProviderDispatcher(this);
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
        const DashSDK = (yield network.loadSDK(url, 'dashjs'));
        this.dash = DashSDK.MediaPlayer(this.config).create();
        this.dash.initialize(this.mediaEl, null, this.autoplay);
        this.dash.setTextDefaultEnabled(this.enableTextTracksByDefault);
        this.dash.enableForcedTextStreaming(!this.shouldRenderNativeTextTracks);
        this.dash.on(DashSDK.MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
          this.dispatch('mediaType', MediaType.MediaType.Video);
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
      if (withComponentRegistry.isUndefined(event.detail))
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
    if (withComponentRegistry.isUndefined(this.mediaEl) || this.shouldRenderNativeTextTracks)
      return;
    // Init current track.
    const currentTrack = (_c = ((_b = (_a = this.dash) === null || _a === void 0 ? void 0 : _a.getCurrentTrackFor('text')) === null || _b === void 0 ? void 0 : _b.index) - 1) !== null && _c !== void 0 ? _c : -1;
    this.currentTextTrack = currentTrack;
    this.dispatch('currentTextTrack', currentTrack);
    this.textTracksDisposal.add(withComponentRegistry.listen(this.mediaEl.textTracks, 'change', this.onTextTracksChange.bind(this)));
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
          return (withComponentRegistry.isString(type) && utils.dashRegex.test(type)) ||
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
          if (!withComponentRegistry.isUndefined(this.dash)) {
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
    return (index.h("vm-video", { willAttach: true, crossOrigin: this.crossOrigin, preload: this.preload, poster: this.poster, controlsList: this.controlsList, autoPiP: this.autoPiP, disablePiP: this.disablePiP, hasCustomTextManager: !this.shouldRenderNativeTextTracks, disableRemotePlayback: this.disableRemotePlayback, mediaTitle: this.mediaTitle, ref: (el) => {
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

exports.vm_dash = Dash;
