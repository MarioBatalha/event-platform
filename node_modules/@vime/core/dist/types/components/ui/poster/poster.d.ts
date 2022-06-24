import { EventEmitter } from '../../../stencil-public-runtime';
import { PlayerProps } from '../../core/player/PlayerProps';
/**
 * Loads the poster set in the player prop `currentPoster` and displays it. The poster will automatically
 * dissapear once playback starts.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/poster/poster.png"
 *   alt="Vime poster component"
 * />
 */
export declare class Poster {
  private lazyLoader;
  host: HTMLVmPosterElement;
  isHidden: boolean;
  isActive: boolean;
  hasLoaded: boolean;
  /**
   * How the poster image should be resized to fit the container (sets the `object-fit` property).
   */
  fit?: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none';
  /** @internal */
  isVideoView: PlayerProps['isVideoView'];
  /** @internal */
  currentPoster?: PlayerProps['currentPoster'];
  onCurrentPosterChange(): void;
  /** @internal */
  mediaTitle?: PlayerProps['mediaTitle'];
  /** @internal */
  playbackStarted: PlayerProps['playbackStarted'];
  /** @internal */
  currentTime: PlayerProps['currentTime'];
  /**
   * Emitted when the poster has loaded.
   */
  vmLoaded: EventEmitter<void>;
  /**
   * Emitted when the poster will be shown.
   */
  vmWillShow: EventEmitter<void>;
  /**
   * Emitted when the poster will be hidden.
   */
  vmWillHide: EventEmitter<void>;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  private onVisibilityChange;
  onEnabledChange(): void;
  onActiveChange(): void;
  private onPosterLoad;
  render(): any;
}
