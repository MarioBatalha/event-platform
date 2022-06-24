/**
 * Formats and displays the progression of playback as `currentTime (separator) endTime`.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/time-progress/time-progress.png"
 *   alt="Vime time progress component"
 * />
 */
export declare class Time {
  /**
   * The `aria-label` property of the time.
   */
  label: string;
  /**
   * The length of time in seconds.
   */
  seconds: number;
  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  alwaysShowHours: boolean;
  constructor();
  render(): any;
}
