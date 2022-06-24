import { PlayerProps } from '../../core/player/PlayerProps';
/**
 * Simple container that holds a collection of user interface components.
 *
 * The only important role this component really has is, avoiding overlapping custom UI with the
 * native iOS media player UI. Therefore, custom UI is only displayed on iOS if the `playsinline`
 * prop is `true`, and the player is not in fullscreen mode.
 *
 * @slot - Used to pass in UI components for the player.
 */
export declare class UI {
  /** @internal */
  isVideoView: PlayerProps['isVideoView'];
  /** @internal */
  playsinline: PlayerProps['playsinline'];
  /** @internal */
  isFullscreenActive: PlayerProps['isFullscreenActive'];
  constructor();
  render(): any;
}
