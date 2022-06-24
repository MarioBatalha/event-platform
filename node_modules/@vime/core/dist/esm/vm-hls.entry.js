import { r as registerInstance, c as createEvent, h } from './index-f5fd0f81.js';
import { l as loadSDK } from './network-1fe1550f.js';
import { c as withComponentRegistry, n as isNil, e as isUndefined, h as isString } from './withComponentRegistry-28311671.js';
import { M as MediaType } from './MediaType-aec4c150.js';
import { w as withPlayerContext } from './withPlayerContext-4c52f564.js';
import { h as hlsRegex, b as hlsTypeRegex } from './utils-7dc44688.js';
import { w as withProviderConnect, c as createProviderDispatcher } from './ProviderConnect-42dc4f0d.js';
import './support-b6811262.js';
import './PlayerEvents-5c5704d6.js';
import './Provider-2e7e8366.js';
import './PlayerProps-2c57fcea.js';

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
const HLS = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmLoadStart = createEvent(this, "vmLoadStart", 7);
    this.vmError = createEvent(this, "vmError", 7);
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
      } }, h("slot", null)));
  }
};

export { HLS as vm_hls };
