/**
 * A simple container that enables player controls to be organized into groups. Each group starts on
 * a new line.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control-group/control-group.png"
 *   alt="Vime control group component"
 * />
 */
export declare class ControlNewLine {
  host: HTMLVmControlGroupElement;
  /**
   * Determines where to add spacing/margin. The amount of spacing is determined by the CSS variable
   * `--control-group-spacing`.
   */
  space: 'top' | 'bottom' | 'both' | 'none';
  constructor();
  render(): any;
}
