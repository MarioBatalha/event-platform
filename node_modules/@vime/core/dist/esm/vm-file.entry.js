import { r as registerInstance, c as createEvent, h, g as getElement } from './index-f5fd0f81.js';
import { p as noop, D as Disposal, q as isFunction, n as isNil, l as listen, c as withComponentRegistry, w as watchComponentRegistry, x as isNull, e as isUndefined, u as isNumber, h as isString } from './withComponentRegistry-28311671.js';
import { d as IS_IOS, e as canUsePiPInChrome, f as canUsePiPInSafari, g as canUsePiP } from './support-b6811262.js';
import { L as LazyLoader } from './LazyLoader-295ab4d4.js';
import { M as MediaType } from './MediaType-aec4c150.js';
import { V as ViewType } from './ViewType-6da43616.js';
import { w as withProviderConnect, c as createProviderDispatcher } from './ProviderConnect-42dc4f0d.js';
import { w as withProviderContext } from './withProviderContext-a9e7f1bc.js';
import { a as audioRegex, v as videoRegex, h as hlsRegex } from './utils-7dc44688.js';
import { F as FullscreenController, m as mitt } from './FullscreenController-b811bf0c.js';
import './Provider-2e7e8366.js';
import './PlayerProps-2c57fcea.js';
import './withPlayerContext-4c52f564.js';
import './PlayerEvents-5c5704d6.js';

var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/**
 * Extends the base `FullscreenController` with additional logic for handling fullscreen
 * on iOS Safari where the native Fullscreen API is not available (in this case it fallsback to
 * using the `VideoPresentationController`).
 */
class VideoFullscreenController extends FullscreenController {
  constructor(host, presentationController) {
    super(host);
    this.host = host;
    this.presentationController = presentationController;
  }
  get isFullscreen() {
    return this.presentationController.isFullscreenMode;
  }
  /**
   * Whether a fallback fullscreen API is available on Safari using presentation modes. This
   * is only used on iOS where the native fullscreen API is not available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get isSupported() {
    return this.presentationController.isSupported;
  }
  makeEnterFullscreenRequest() {
    return __awaiter$2(this, void 0, void 0, function* () {
      return this.presentationController.setPresentationMode('fullscreen');
    });
  }
  makeExitFullscreenRequest() {
    return __awaiter$2(this, void 0, void 0, function* () {
      return this.presentationController.setPresentationMode('inline');
    });
  }
  addFullscreenChangeEventListener() {
    if (!this.isSupported)
      return noop;
    this.presentationController.on('change', this.handlePresentationModeChange.bind(this));
    return () => {
      this.presentationController.off('change', this.handlePresentationModeChange.bind(this));
    };
  }
  handlePresentationModeChange() {
    this.handleFullscreenChange();
  }
  addFullscreenErrorEventListener() {
    return noop;
  }
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/**
 * Contains the logic for handling presentation modes on Safari. This class is used by
 * the `VideoFullscreenController` as a fallback when the native Fullscreen API is not
 * available (ie: iOS Safari).
 */
class VideoPresentationController {
  constructor(host) {
    this.host = host;
    this.disposal = new Disposal();
    this.emitter = mitt();
    const disconnectedCallback = host.disconnectedCallback;
    host.disconnectedCallback = () => __awaiter$1(this, void 0, void 0, function* () {
      yield this.destroy();
      disconnectedCallback === null || disconnectedCallback === void 0 ? void 0 : disconnectedCallback.call(host);
    });
  }
  get videoElement() {
    var _a;
    if (((_a = this.host.mediaEl) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase()) === 'video') {
      return this.host.mediaEl;
    }
    return undefined;
  }
  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`. Only available in Safari.
   *
   * @default undefined
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get presentationMode() {
    var _a;
    return (_a = this.videoElement) === null || _a === void 0 ? void 0 : _a.webkitPresentationMode;
  }
  /**
   * Whether the current `presentationMode` is `inline`.
   */
  get isInlineMode() {
    return this.presentationMode === 'inline';
  }
  /**
   * Whether the current `presentationMode` is `picture-in-picture`.
   */
  get isPictureInPictureMode() {
    return this.presentationMode === 'inline';
  }
  /**
   * Whether the current `presentationMode` is `fullscreen`.
   */
  get isFullscreenMode() {
    return this.presentationMode === 'fullscreen';
  }
  /**
   * Whether the presentation mode API is available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
   */
  get isSupported() {
    var _a, _b, _c;
    return (IS_IOS &&
      isFunction((_a = this.videoElement) === null || _a === void 0 ? void 0 : _a.webkitSetPresentationMode) &&
      ((_c = (_b = this.videoElement) === null || _b === void 0 ? void 0 : _b.webkitSupportsFullscreen) !== null && _c !== void 0 ? _c : false));
  }
  setPresentationMode(mode) {
    var _a, _b;
    (_b = (_a = this.videoElement) === null || _a === void 0 ? void 0 : _a.webkitSetPresentationMode) === null || _b === void 0 ? void 0 : _b.call(_a, mode);
  }
  on(type, handler) {
    // @ts-expect-error - not typed yet.
    this.emitter.on(type, handler);
  }
  off(type, handler) {
    // @ts-expect-error - not typed yet.
    this.emitter.off(type, handler);
  }
  destroy() {
    this.setPresentationMode('inline');
    this.disposal.empty();
  }
  addPresentationModeChangeEventListener() {
    if (!this.isSupported || isNil(this.videoElement))
      return noop;
    return listen(this.videoElement, 'webkitpresentationmodechanged', this.handlePresentationModeChange.bind(this));
  }
  handlePresentationModeChange() {
    this.emitter.emit('change', this.presentationMode);
  }
}

const fileCss = "audio.sc-vm-file,video.sc-vm-file{border-radius:inherit;vertical-align:middle;width:100%;outline:0}video.sc-vm-file{position:absolute;top:0;left:0;border:0;height:100%;user-select:none}";

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
const File = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmLoadStart = createEvent(this, "vmLoadStart", 7);
    this.vmError = createEvent(this, "vmError", 7);
    this.vmMediaElChange = createEvent(this, "vmMediaElChange", 7);
    this.vmSrcSetChange = createEvent(this, "vmSrcSetChange", 7);
    this.textTracksDisposal = new Disposal();
    this.wasPausedBeforeSeeking = true;
    this.currentSrcSet = [];
    this.mediaQueryDisposal = new Disposal();
    /** @internal Whether an external SDK will attach itself to the media player and control it. */
    this.willAttach = false;
    /** @inheritdoc */
    this.preload = 'metadata';
    /**
     * The playback rates that are available for this media.
     */
    this.playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
    /** @internal */
    this.language = 'en';
    /** @internal */
    this.autoplay = false;
    /** @internal */
    this.controls = false;
    /** @internal */
    this.loop = false;
    /** @internal */
    this.muted = false;
    /** @internal */
    this.playsinline = false;
    /** @internal */
    this.noConnect = false;
    /** @internal */
    this.paused = true;
    /** @internal */
    this.currentTime = 0;
    /** @internal */
    this.volume = 0;
    /** @internal */
    this.playbackReady = false;
    /** @internal */
    this.playbackStarted = false;
    this.presentationController = new VideoPresentationController(this);
    this.fullscreenController = new VideoFullscreenController(this, this.presentationController);
    /** @internal */
    this.currentTextTrack = -1;
    /** @internal */
    this.hasCustomTextManager = false;
    /** @internal */
    this.isTextTrackVisible = true;
    /** @internal */
    this.shouldRenderNativeTextTracks = true;
    withComponentRegistry(this);
    withProviderConnect(this);
    withProviderContext(this, [
      'playbackReady',
      'playbackStarted',
      'currentTime',
      'volume',
      'paused',
      'currentTextTrack',
      'isTextTrackVisible',
      'shouldRenderNativeTextTracks',
    ]);
    watchComponentRegistry(this, 'vm-poster', regs => {
      [this.vmPoster] = regs;
    });
  }
  onMediaTitleChange() {
    this.dispatch('mediaTitle', this.mediaTitle);
  }
  onPosterChange() {
    var _a;
    if (!this.playbackStarted)
      (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.load();
  }
  onViewTypeChange() {
    this.dispatch('viewType', this.viewType);
  }
  connectedCallback() {
    this.initLazyLoader();
    this.dispatch = createProviderDispatcher(this);
    this.onViewTypeChange();
    this.onPosterChange();
    this.onMediaTitleChange();
    this.addPresentationControllerListeners();
  }
  componentDidRender() {
    if (this.prevMediaEl !== this.mediaEl) {
      this.prevMediaEl = this.mediaEl;
      this.vmMediaElChange.emit(this.mediaEl);
      this.presentationController.addPresentationModeChangeEventListener();
    }
  }
  componentDidLoad() {
    this.onViewTypeChange();
  }
  disconnectedCallback() {
    var _a;
    this.mediaQueryDisposal.empty();
    this.textTracksDisposal.empty();
    this.cancelTimeUpdates();
    (_a = this.lazyLoader) === null || _a === void 0 ? void 0 : _a.destroy();
    this.wasPausedBeforeSeeking = true;
  }
  initLazyLoader() {
    this.lazyLoader = new LazyLoader(this.host, ['data-src', 'data-poster'], () => {
      if (isNil(this.mediaEl))
        return;
      const poster = this.mediaEl.getAttribute('data-poster');
      if (!isNull(poster))
        this.mediaEl.setAttribute('poster', poster);
      this.refresh();
      this.didSrcSetChange();
    });
  }
  refresh() {
    if (isNil(this.mediaEl))
      return;
    const { children } = this.mediaEl;
    for (let i = 0; i <= children.length - 1; i += 1) {
      const child = children[i];
      const src = child.getAttribute('data-src') ||
        child.getAttribute('src') ||
        child.getAttribute('data-vs');
      child.removeAttribute('src');
      if (isNull(src))
        continue;
      child.setAttribute('data-vs', src);
      child.setAttribute('src', src);
    }
  }
  didSrcSetChange() {
    if (isNil(this.mediaEl))
      return;
    const sources = Array.from(this.mediaEl.querySelectorAll('source'));
    const srcSet = sources.map(source => {
      var _a;
      return ({
        src: source.getAttribute('data-vs'),
        media: (_a = source.getAttribute('data-media')) !== null && _a !== void 0 ? _a : undefined,
        ref: source,
      });
    });
    const didChange = this.currentSrcSet.length !== srcSet.length ||
      srcSet.some((resource, i) => this.currentSrcSet[i].src !== resource.src);
    if (didChange) {
      this.currentSrcSet = srcSet;
      this.onSrcSetChange();
    }
  }
  onSrcSetChange() {
    var _a;
    this.textTracksDisposal.empty();
    this.mediaQueryDisposal.empty();
    this.vmLoadStart.emit();
    this.vmSrcSetChange.emit(this.currentSrcSet);
    if (!this.willAttach)
      (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.load();
  }
  hasCustomPoster() {
    return !IS_IOS && !isUndefined(this.vmPoster);
  }
  cancelTimeUpdates() {
    if (isNumber(this.timeRAF))
      window.cancelAnimationFrame(this.timeRAF);
    this.timeRAF = undefined;
  }
  requestTimeUpdates() {
    var _a, _b;
    this.dispatch('currentTime', (_b = (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.currentTime) !== null && _b !== void 0 ? _b : 0);
    this.timeRAF = window.requestAnimationFrame(() => {
      this.requestTimeUpdates();
    });
  }
  getMediaType() {
    const { currentSrc } = this.mediaEl;
    if (audioRegex.test(currentSrc))
      return MediaType.Audio;
    if (videoRegex.test(currentSrc) || hlsRegex.test(currentSrc))
      return MediaType.Video;
    return undefined;
  }
  onLoadedMetadata() {
    this.mediaEl.volume = this.volume / 100;
    this.listenToTextTracksForChanges();
    this.onTextTracksChange();
    this.onProgress();
    this.dispatch('currentPoster', this.poster);
    this.dispatch('duration', this.mediaEl.duration);
    this.dispatch('playbackRates', this.playbackRates);
    if (!this.willAttach) {
      this.dispatch('currentSrc', this.mediaEl.currentSrc);
      this.dispatch('mediaType', this.getMediaType());
      this.dispatch('playbackReady', true);
    }
  }
  onProgress() {
    const { buffered, duration } = this.mediaEl;
    const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
    this.dispatch('buffered', end > duration ? duration : end);
  }
  onPlay() {
    this.requestTimeUpdates();
    this.dispatch('paused', false);
    if (!this.playbackStarted)
      this.dispatch('playbackStarted', true);
  }
  onPause() {
    this.cancelTimeUpdates();
    this.dispatch('paused', true);
    this.dispatch('buffering', false);
  }
  onPlaying() {
    this.dispatch('playing', true);
    this.dispatch('buffering', false);
  }
  onSeeking() {
    if (!this.wasPausedBeforeSeeking)
      this.wasPausedBeforeSeeking = this.mediaEl.paused;
    this.dispatch('currentTime', this.mediaEl.currentTime);
    this.dispatch('seeking', true);
  }
  onSeeked() {
    // Avoid calling `attemptToPlay` if seeking to 0 on 0.
    if (this.currentTime === 0 && !this.playbackStarted)
      return;
    this.dispatch('seeking', false);
    if (!this.playbackStarted || !this.wasPausedBeforeSeeking)
      this.attemptToPlay();
    this.wasPausedBeforeSeeking = true;
  }
  onRateChange() {
    this.dispatch('playbackRate', this.mediaEl.playbackRate);
  }
  onVolumeChange() {
    this.dispatch('muted', this.mediaEl.muted);
    this.dispatch('volume', this.mediaEl.volume * 100);
  }
  onDurationChange() {
    this.dispatch('duration', this.mediaEl.duration);
  }
  onWaiting() {
    this.dispatch('buffering', true);
  }
  onSuspend() {
    this.dispatch('buffering', false);
  }
  onEnded() {
    if (!this.loop)
      this.dispatch('playbackEnded', true);
  }
  onError() {
    this.vmError.emit(this.mediaEl.error);
  }
  attemptToPlay() {
    var _a;
    try {
      (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.play();
    }
    catch (e) {
      this.vmError.emit(e);
    }
  }
  togglePiPInChrome(toggle) {
    var _a;
    return toggle
      ? (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.requestPictureInPicture()
      : document.exitPictureInPicture();
  }
  togglePiPInSafari(toggle) {
    var _a, _b;
    const mode = toggle
      ? "picture-in-picture" /* PiP */
      : "inline" /* Inline */;
    if (!((_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.webkitSupportsPresentationMode(mode))) {
      throw new Error('PiP API is not available.');
    }
    return (_b = this.mediaEl) === null || _b === void 0 ? void 0 : _b.webkitSetPresentationMode(mode);
  }
  togglePiP(toggle) {
    return __awaiter(this, void 0, void 0, function* () {
      if (canUsePiPInChrome())
        return this.togglePiPInChrome(toggle);
      if (canUsePiPInSafari())
        return this.togglePiPInSafari(toggle);
      throw new Error('PiP API is not available.');
    });
  }
  onEnterPiP() {
    this.dispatch('isPiPActive', true);
  }
  onLeavePiP() {
    this.dispatch('isPiPActive', false);
  }
  addPresentationControllerListeners() {
    this.presentationController.on('change', mode => {
      this.dispatch('isPiPActive', mode === "picture-in-picture" /* PiP */);
      this.dispatch('isFullscreenActive', mode === "fullscreen" /* Fullscreen */);
    });
  }
  /** @internal */
  getAdapter() {
    return __awaiter(this, void 0, void 0, function* () {
      return {
        getInternalPlayer: () => __awaiter(this, void 0, void 0, function* () { return this.mediaEl; }),
        play: () => __awaiter(this, void 0, void 0, function* () { var _a; return (_a = this.mediaEl) === null || _a === void 0 ? void 0 : _a.play(); }),
        pause: () => __awaiter(this, void 0, void 0, function* () { var _b; return (_b = this.mediaEl) === null || _b === void 0 ? void 0 : _b.pause(); }),
        canPlay: (type) => __awaiter(this, void 0, void 0, function* () { return isString(type) && (audioRegex.test(type) || videoRegex.test(type)); }),
        setCurrentTime: (time) => __awaiter(this, void 0, void 0, function* () {
          if (this.mediaEl)
            this.mediaEl.currentTime = time;
        }),
        setMuted: (muted) => __awaiter(this, void 0, void 0, function* () {
          if (this.mediaEl)
            this.mediaEl.muted = muted;
        }),
        setVolume: (volume) => __awaiter(this, void 0, void 0, function* () {
          if (this.mediaEl)
            this.mediaEl.volume = volume / 100;
        }),
        canSetPlaybackRate: () => __awaiter(this, void 0, void 0, function* () { return true; }),
        setPlaybackRate: (rate) => __awaiter(this, void 0, void 0, function* () {
          if (this.mediaEl)
            this.mediaEl.playbackRate = rate;
        }),
        canSetPiP: () => __awaiter(this, void 0, void 0, function* () { return canUsePiP(); }),
        enterPiP: () => this.togglePiP(true),
        exitPiP: () => this.togglePiP(false),
        canSetFullscreen: () => __awaiter(this, void 0, void 0, function* () { return this.fullscreenController.isSupported; }),
        enterFullscreen: () => this.fullscreenController.requestFullscreen(),
        exitFullscreen: () => this.fullscreenController.exitFullscreen(),
        setCurrentTextTrack: (trackId) => __awaiter(this, void 0, void 0, function* () {
          if (trackId !== this.currentTextTrack)
            this.toggleTextTrackModes(trackId);
        }),
        setTextTrackVisibility: (isVisible) => __awaiter(this, void 0, void 0, function* () {
          this.isTextTrackVisible = isVisible;
          this.toggleTextTrackModes(this.currentTextTrack);
        }),
      };
    });
  }
  onHasCustomTextManagerChange() {
    if (this.hasCustomTextManager) {
      this.textTracksDisposal.empty();
    }
    else if (this.playbackReady) {
      this.listenToTextTracksForChanges();
    }
  }
  onShouldRenderNativeTextTracksChange() {
    if (this.hasCustomTextManager)
      return;
    this.toggleTextTrackModes(this.currentTextTrack);
  }
  onProviderConnect(event) {
    if (this.noConnect)
      event.stopImmediatePropagation();
  }
  onProviderDisconnect(event) {
    if (this.noConnect)
      event.stopImmediatePropagation();
  }
  getFilteredTextTracks() {
    const tracks = [];
    const textTrackList = Array.from(this.mediaEl.textTracks);
    for (let i = 0; i < textTrackList.length; i += 1) {
      const track = textTrackList[i];
      // Edge adds a track without a label; we don't want to use it.
      if ((track.kind === 'subtitles' || track.kind === 'captions') &&
        track.label) {
        tracks.push(textTrackList[i]);
      }
    }
    return tracks;
  }
  listenToTextTracksForChanges() {
    if (this.hasCustomTextManager)
      return;
    this.textTracksDisposal.empty();
    if (isUndefined(this.mediaEl))
      return;
    this.textTracksDisposal.add(listen(this.mediaEl.textTracks, 'change', this.onTextTracksChange.bind(this)));
  }
  onTextTracksChange() {
    var _a;
    const tracks = this.getFilteredTextTracks();
    let trackId = -1;
    for (let id = 0; id < tracks.length; id += 1) {
      if (tracks[id].mode === 'hidden') {
        // Do not break in case there is a following track with showing.
        trackId = id;
      }
      else if (tracks[id].mode === 'showing') {
        trackId = id;
        break;
      }
    }
    if (!this.shouldRenderNativeTextTracks &&
      ((_a = tracks[trackId]) === null || _a === void 0 ? void 0 : _a.mode) === 'showing') {
      tracks[trackId].mode = 'hidden';
      return;
    }
    if (this.shouldRenderNativeTextTracks) {
      this.isTextTrackVisible =
        trackId !== -1 && tracks[trackId].mode === 'showing';
      this.dispatch('isTextTrackVisible', this.isTextTrackVisible);
    }
    this.dispatch('textTracks', tracks);
    this.dispatch('currentTextTrack', this.shouldRenderNativeTextTracks && !this.isTextTrackVisible
      ? -1
      : trackId);
  }
  toggleTextTrackModes(newTrackId) {
    if (isNil(this.mediaEl))
      return;
    const { textTracks } = this.mediaEl;
    if (newTrackId === -1) {
      Array.from(textTracks).forEach(track => {
        track.mode = 'disabled';
      });
    }
    else {
      const oldTrack = textTracks[this.currentTextTrack];
      if (oldTrack)
        oldTrack.mode = 'disabled';
    }
    const nextTrack = textTracks[newTrackId];
    if (nextTrack) {
      nextTrack.mode =
        this.isTextTrackVisible && this.shouldRenderNativeTextTracks
          ? 'showing'
          : 'hidden';
    }
    this.dispatch('currentTextTrack', this.shouldRenderNativeTextTracks && !this.isTextTrackVisible
      ? -1
      : newTrackId);
    this.dispatch('isTextTrackVisible', this.isTextTrackVisible);
  }
  render() {
    const mediaProps = {
      autoplay: this.autoplay,
      muted: this.muted,
      playsinline: this.playsinline,
      playsInline: this.playsinline,
      'x5-playsinline': this.playsinline,
      'webkit-playsinline': this.playsinline,
      controls: this.controls,
      crossorigin: this.crossOrigin === '' ? 'anonymous' : this.crossOrigin,
      controlslist: this.controlsList,
      'data-poster': !this.hasCustomPoster() ? this.poster : undefined,
      loop: this.loop,
      preload: this.preload,
      disablePictureInPicture: this.disablePiP,
      autoPictureInPicture: this.autoPiP,
      disableRemotePlayback: this.disableRemotePlayback,
      'x-webkit-airplay': this.disableRemotePlayback ? 'deny' : 'allow',
      ref: (el) => {
        this.mediaEl = el;
      },
      onLoadedMetadata: this.onLoadedMetadata.bind(this),
      onProgress: this.onProgress.bind(this),
      onPlay: this.onPlay.bind(this),
      onPause: this.onPause.bind(this),
      onPlaying: this.onPlaying.bind(this),
      onSeeking: this.onSeeking.bind(this),
      onSeeked: this.onSeeked.bind(this),
      onRateChange: this.onRateChange.bind(this),
      onVolumeChange: this.onVolumeChange.bind(this),
      onDurationChange: this.onDurationChange.bind(this),
      onWaiting: this.onWaiting.bind(this),
      onSuspend: this.onSuspend.bind(this),
      onEnded: this.onEnded.bind(this),
      onError: this.onError.bind(this),
    };
    const audio = (h("audio", Object.assign({ class: "lazy" }, mediaProps), h("slot", null), "Your browser does not support the", h("code", null, "audio"), "element."));
    const video = (h("video", Object.assign({ class: "lazy" }, mediaProps, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onenterpictureinpicture: this.onEnterPiP.bind(this), onleavepictureinpicture: this.onLeavePiP.bind(this)
    }), h("slot", null), "Your browser does not support the", h("code", null, "video"), "element."));
    return this.viewType === ViewType.Audio ? audio : video;
  }
  get host() { return getElement(this); }
  static get watchers() { return {
    "mediaTitle": ["onMediaTitleChange"],
    "poster": ["onPosterChange"],
    "viewType": ["onViewTypeChange"],
    "hasCustomTextManager": ["onHasCustomTextManagerChange"],
    "shouldRenderNativeTextTracks": ["onShouldRenderNativeTextTracksChange"]
  }; }
};
File.style = fileCss;

export { File as vm_file };
