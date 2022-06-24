import { PlayerProps } from '../../core/player/PlayerProps';
/**
 * This can be used to indicate to the user that the current media is being streamed live.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/live-indicator/live-indicator.png"
 *   alt="Vime live indicator component"
 * />
 */
export declare class LiveIndicator {
  /** @internal */
  isLive: PlayerProps['isLive'];
  /** @internal */
  i18n: PlayerProps['i18n'];
  constructor();
  render(): any;
}
