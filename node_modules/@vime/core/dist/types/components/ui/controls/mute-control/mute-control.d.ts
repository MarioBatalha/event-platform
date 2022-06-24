import { EventEmitter } from '../../../../stencil-public-runtime';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
/**
 * A control for toggling whether there is audio output or not. In other words the muted state of
 * the player.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/mute-control/mute-control.png"
 *   alt="Vime mute control component"
 * />
 */
export declare class MuteControl implements KeyboardControl {
  private dispatch;
  /**
   * The name of the low volume icon to resolve from the icon library.
   */
  lowVolumeIcon: string;
  /**
   * The name of the high volume icon to resolve from the icon library.
   */
  highVolumeIcon: string;
  /**
   * The name of the muted volume icon to resolve from the icon library.
   */
  mutedIcon: string;
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
  volume: PlayerProps['volume'];
  /** @internal */
  muted: PlayerProps['muted'];
  /** @internal */
  i18n: PlayerProps['i18n'];
  /**
   * Emitted when the control receives focus.
   */
  vmFocus: EventEmitter<void>;
  /**
   * Emitted when the control loses focus.
   */
  vmBlur: EventEmitter<void>;
  constructor();
  connectedCallback(): void;
  private getIcon;
  private onClick;
  render(): any;
}
