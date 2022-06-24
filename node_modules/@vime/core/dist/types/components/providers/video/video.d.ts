import { MediaCrossOriginOption, MediaFileProvider, MediaPreloadOption } from '../file/MediaFileProvider';
/**
 * Enables loading, playing and controlling videos via the
 * HTML5 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element.
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 *
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export declare class Video implements MediaFileProvider<HTMLMediaElement> {
  private fileProvider;
  /**
   * @internal Whether an external SDK will attach itself to the media player and control it.
   */
  willAttach: boolean;
  /**
   * @internal Whether an external SDK will manage the text tracks.
   */
  hasCustomTextManager: boolean;
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
  /**
   * The title of the current media.
   */
  mediaTitle?: string;
  constructor();
  onProviderConnect(event: Event): void;
  onProviderDisconnect(event: Event): void;
  /** @internal */
  getAdapter(): Promise<{
    getInternalPlayer: () => Promise<HTMLMediaElement>;
    play: () => Promise<void | undefined>;
    pause: () => Promise<void | undefined>;
    canPlay: (type: any) => Promise<boolean>;
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
