import { EventEmitter } from '../../../stencil-public-runtime';
import { MediaCrossOriginOption, MediaFileProvider, MediaPreloadOption } from '../file/MediaFileProvider';
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
export declare class HLS implements MediaFileProvider {
  private hls?;
  private videoProvider;
  private mediaEl?;
  private dispatch;
  hasAttached: boolean;
  /**
   * The NPM package version of the `hls.js` library to download and use if HLS is not natively
   * supported.
   */
  version: string;
  /**
   * The URL where the `hls.js` library source can be found. If this property is used, then the
   * `version` property is ignored.
   */
  libSrc?: string;
  /**
   * The `hls.js` configuration.
   */
  config?: any;
  /** @inheritdoc */
  crossOrigin?: MediaCrossOriginOption;
  /** @inheritdoc */
  preload?: MediaPreloadOption;
  /** @inheritdoc */
  poster?: string;
  /** @inheritdoc */
  controlsList?: string;
  /** @inheritdoc */
  autoPiP?: boolean;
  /** @inheritdoc */
  disablePiP?: boolean;
  /** @inheritdoc */
  disableRemotePlayback?: boolean;
  /** @internal */
  playbackReady: boolean;
  /**
   * The title of the current media.
   */
  mediaTitle?: string;
  /** @internal */
  vmLoadStart: EventEmitter<void>;
  /**
   * Emitted when an error has occurred.
   */
  vmError: EventEmitter<any>;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  get src(): string | undefined;
  private setupHls;
  private dispatchLevels;
  private levelToPlaybackQuality;
  private findLevelIndexFromQuality;
  private destroyHls;
  onMediaElChange(event: CustomEvent<HTMLVideoElement | undefined>): Promise<void>;
  private onSrcChange;
  /** @internal */
  getAdapter(): Promise<{
    getInternalPlayer: () => Promise<any>;
    canPlay: (type: any) => Promise<boolean>;
    canSetPlaybackQuality: () => Promise<boolean>;
    setPlaybackQuality: (quality: string) => Promise<void>;
    setCurrentAudioTrack: (trackId: number) => Promise<void>;
    play: () => Promise<void | undefined>;
    pause: () => Promise<void | undefined>;
    setCurrentTime: (time: number) => Promise<void>;
    setMuted: (muted: boolean) => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
    canSetPlaybackRate: () => Promise<boolean>;
    setPlaybackRate: (rate: number) => Promise<void>;
    canSetPiP: () => Promise<boolean>;
    enterPiP: () => Promise<any>;
    exitPiP: () => Promise<any>;
    canSetFullscreen: () => Promise<boolean>;
    enterFullscreen: () => Promise<void>;
    exitFullscreen: () => Promise<void>;
    setCurrentTextTrack: (trackId: number) => Promise<void>;
    setTextTrackVisibility: (isVisible: boolean) => Promise<void>;
  }>;
  render(): any;
}
