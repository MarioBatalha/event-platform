import { PlayerProps } from '../../../core/player/PlayerProps';
/**
 * A control that displays the progression of playback and the amount buffered on a horizontal
 * timeline. The timeline is a slider (`input[type="range"]`) that can be used to change the
 * current playback time.
 *
 * If the player is buffering, the scrubber will display an animated candystripe in the porition
 * of the timeline that has not buffered.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/scrubber-control/scrubber-control.png"
 *   alt="Vime scrubber control component"
 * />
 */
export declare class ScrubberControl {
  private slider;
  private tooltip;
  private dispatch;
  private keyboardDisposal;
  host: HTMLVmScrubberControlElement;
  timestamp: string;
  endTime: number;
  /**
   * Whether the timestamp in the tooltip should show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  alwaysShowHours: boolean;
  /**
   * Whether the tooltip should not be displayed.
   */
  hideTooltip: boolean;
  /** @internal */
  currentTime: PlayerProps['currentTime'];
  /** @internal */
  duration: PlayerProps['duration'];
  /**
   * Prevents seeking forward/backward by using the Left/Right arrow keys.
   */
  noKeyboard: boolean;
  onNoKeyboardChange(): Promise<void>;
  onDurationChange(): void;
  /** @internal */
  buffering: PlayerProps['buffering'];
  /** @internal */
  buffered: PlayerProps['buffered'];
  /** @internal */
  i18n: PlayerProps['i18n'];
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  private setTooltipPosition;
  private onSeek;
  private onSeeking;
  private getSliderInput;
  render(): any;
}
