import { PlayerProps } from '../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from './types';
/**
 * A small pop-up box that appears when a user moves their mouse over an element. Their main purpose
 * is to provide a description about the function of that element.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/tooltip/tooltip.png"
 *   alt="Vime tooltip component"
 * />
 *
 * @slot - Used to pass in the contents of the tooltip.
 */
export declare class Tooltip {
  private hasLoaded;
  host: HTMLVmTooltipElement;
  /**
   * Whether the tooltip is displayed or not.
   */
  hidden: boolean;
  /**
   * Whether the tooltip is visible or not.
   */
  active: boolean;
  /**
   * Determines if the tooltip appears on top/bottom of it's parent.
   */
  position: TooltipPosition;
  /**
   * Determines if the tooltip should grow according to its contents to the left/right. By default
   * content grows outwards from the center.
   */
  direction?: TooltipDirection;
  /** @internal */
  isTouch: PlayerProps['isTouch'];
  /** @internal */
  isMobile: PlayerProps['isMobile'];
  constructor();
  componentDidLoad(): void;
  private getId;
  render(): any;
}
