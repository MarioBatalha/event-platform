var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, Element, Event, h, Listen, Method, Prop, State, Watch, } from '@stencil/core';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { canUsePiP, canUsePiPInChrome, canUsePiPInSafari, IS_IOS, } from '../../../utils/support';
import { isNil, isNull, isNumber, isString, isUndefined, } from '../../../utils/unit';
import { LazyLoader } from '../../core/player/LazyLoader';
import { MediaType } from '../../core/player/MediaType';
import { ViewType } from '../../core/player/ViewType';
import { watchComponentRegistry, withComponentRegistry, } from '../../core/player/withComponentRegistry';
import { withProviderConnect } from '../ProviderConnect';
import { createProviderDispatcher, } from '../ProviderDispatcher';
import { withProviderContext } from '../withProviderContext';
import { audioRegex, hlsRegex, videoRegex } from './utils';
import { VideoFullscreenController } from './VideoFullscreenController';
import { VideoPresentationController, } from './VideoPresentationController';
/**
 * Enables loading, playing and controlling media files via the
 * HTML5 [MediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) API.
 * This is used internally by the [`vime-audio`](audio.md) and [`vime-video`](video.md) components,
 * which are the preferred components to use for loading file-based media.
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 *
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class File {
  constructor() {
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
    const audio = (h("audio", Object.assign({ class: "lazy" }, mediaProps),
      h("slot", null),
      "Your browser does not support the",
      h("code", null, "audio"),
      "element."));
    const video = (h("video", Object.assign({ class: "lazy" }, mediaProps, { 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onenterpictureinpicture: this.onEnterPiP.bind(this), onleavepictureinpicture: this.onLeavePiP.bind(this) }),
      h("slot", null),
      "Your browser does not support the",
      h("code", null, "video"),
      "element."));
    return this.viewType === ViewType.Audio ? audio : video;
  }
  static get is() { return "vm-file"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["file.css"]
  }; }
  static get styleUrls() { return {
    "$": ["file.css"]
  }; }
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
    "crossOrigin": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "MediaCrossOriginOption",
        "resolved": "\"\" | \"anonymous\" | \"use-credentials\" | undefined",
        "references": {
          "MediaCrossOriginOption": {
            "location": "import",
            "path": "./MediaFileProvider"
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
            "path": "./MediaFileProvider"
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
    "viewType": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "ViewType",
        "resolved": "ViewType.Audio | ViewType.Video | undefined",
        "references": {
          "ViewType": {
            "location": "import",
            "path": "../../core/player/ViewType"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "Whether to use an `audio` or `video` element to play the media."
      },
      "attribute": "view-type",
      "reflect": false
    },
    "playbackRates": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "number[]",
        "resolved": "number[]",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The playback rates that are available for this media."
      },
      "defaultValue": "[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]"
    },
    "language": {
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
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "language",
      "reflect": false,
      "defaultValue": "'en'"
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
    "controls": {
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
      "attribute": "controls",
      "reflect": false,
      "defaultValue": "false"
    },
    "logger": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Logger",
        "resolved": "Logger | undefined",
        "references": {
          "Logger": {
            "location": "import",
            "path": "../../core/player/PlayerLogger"
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
      }
    },
    "loop": {
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
      "attribute": "loop",
      "reflect": false,
      "defaultValue": "false"
    },
    "muted": {
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
      "attribute": "muted",
      "reflect": false,
      "defaultValue": "false"
    },
    "playsinline": {
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
      "attribute": "playsinline",
      "reflect": false,
      "defaultValue": "false"
    },
    "noConnect": {
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
      "attribute": "no-connect",
      "reflect": false,
      "defaultValue": "false"
    },
    "paused": {
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
      "attribute": "paused",
      "reflect": false,
      "defaultValue": "true"
    },
    "currentTime": {
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
      "attribute": "current-time",
      "reflect": false,
      "defaultValue": "0"
    },
    "volume": {
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
      "attribute": "volume",
      "reflect": false,
      "defaultValue": "0"
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
    "playbackStarted": {
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
      "attribute": "playback-started",
      "reflect": false,
      "defaultValue": "false"
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
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "has-custom-text-manager",
      "reflect": false,
      "defaultValue": "false"
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
    }
  }; }
  static get states() { return {
    "vmPoster": {}
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
    }, {
      "method": "vmMediaElChange",
      "name": "vmMediaElChange",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the underlying media element changes."
      },
      "complexType": {
        "original": "HTMLAudioElement | HTMLVideoElement | undefined",
        "resolved": "HTMLAudioElement | HTMLVideoElement | undefined",
        "references": {
          "HTMLAudioElement": {
            "location": "global"
          },
          "HTMLVideoElement": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "vmSrcSetChange",
      "name": "vmSrcSetChange",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the child `<source />` elements are modified."
      },
      "complexType": {
        "original": "MediaResource[]",
        "resolved": "MediaResource[]",
        "references": {
          "MediaResource": {
            "location": "import",
            "path": "./MediaResource"
          }
        }
      }
    }]; }
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
  static get elementRef() { return "host"; }
  static get watchers() { return [{
      "propName": "mediaTitle",
      "methodName": "onMediaTitleChange"
    }, {
      "propName": "poster",
      "methodName": "onPosterChange"
    }, {
      "propName": "viewType",
      "methodName": "onViewTypeChange"
    }, {
      "propName": "hasCustomTextManager",
      "methodName": "onHasCustomTextManagerChange"
    }, {
      "propName": "shouldRenderNativeTextTracks",
      "methodName": "onShouldRenderNativeTextTracksChange"
    }]; }
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
