import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
/**
 * A control for toggling picture-in-picture (PiP) mode. This control is not displayed if PiP cannot
 * be requested (checked via the `canSetPiP()` player method).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/pip-control/pip-control.png"
 *   alt="Vime mute control component"
 * />
 */
export declare class PiPControl implements KeyboardControl {
  canSetPiP: boolean;
  /**
   * The name of the enter pip icon to resolve from the icon library.
   */
  enterIcon: string;
  /**
   * The name of the exit pip icon to resolve from the icon library.
   */
  exitIcon: string;
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
  isPiPActive: PlayerProps['isPiPActive'];
  /** @internal */
  i18n: PlayerProps['i18n'];
  /** @internal */
  playbackReady: PlayerProps['playbackReady'];
  onPlaybackReadyChange(): Promise<void>;
  constructor();
  componentDidLoad(): void;
  private onClick;
  render(): any;
}
