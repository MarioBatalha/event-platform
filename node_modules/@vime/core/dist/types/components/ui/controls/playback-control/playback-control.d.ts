import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
/**
 * A control for toggling the playback state (play/pause) of the current media.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/playback-control/playback-control.png"
 *   alt="Vime playback control component"
 * />
 */
export declare class PlaybackControl implements KeyboardControl {
  private dispatch;
  /**
   * The name of the play icon to resolve from the icon library.
   */
  playIcon: string;
  /**
   * The name of the pause icon to resolve from the icon library.
   */
  pauseIcon: string;
  /**
   * The name of an icon library to use. Defaults to the library defined by the `icons` player
   * property.
   */
  icons?: string;
  /**
   * Whether the tooltip is positioned above/below the control.
   */
  tooltipPosition: TooltipPosition;
  /**
   * The direction in which the tooltip should grow.
   */
  tooltipDirection: TooltipDirection;
  /**
   * Whether the tooltip should not be displayed.
   */
  hideTooltip: boolean;
  /** @inheritdoc */
  keys?: string;
  /** @internal */
  paused: PlayerProps['paused'];
  /** @internal */
  i18n: PlayerProps['i18n'];
  constructor();
  connectedCallback(): void;
  private onClick;
  render(): any;
}
