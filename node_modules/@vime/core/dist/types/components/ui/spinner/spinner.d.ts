import { EventEmitter } from '../../../stencil-public-runtime';
import { PlayerProps } from '../../core/player/PlayerProps';
/**
 * Displays a loading indicator when the video is `buffering`.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/spinner/spinner.png"
 *   alt="Vime spinner component"
 * />
 */
export declare class Spinner {
  private blacklist;
  isHidden: boolean;
  isActive: boolean;
  /** @internal */
  isVideoView: PlayerProps['isVideoView'];
  onVideoViewChange(): void;
  /** @internal */
  currentProvider?: PlayerProps['currentProvider'];
  /**
   * Whether the spinner should be active when the player is booting or media is loading.
   */
  showWhenMediaLoading: boolean;
  /**
   * Emitted when the spinner will be shown.
   */
  vmWillShow: EventEmitter<void>;
  /**
   * Emitted when the spinner will be hidden.
   */
  vmWillHide: EventEmitter<void>;
  /** @internal */
  playbackReady: PlayerProps['playbackReady'];
  /** @internal */
  buffering: PlayerProps['buffering'];
  onActiveChange(): void;
  constructor();
  private onVisiblityChange;
  render(): any;
}
