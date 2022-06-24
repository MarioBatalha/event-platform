import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
/**
 * A control for toggling the visibility of captions. This control is not displayed if there's no
 * track currently set.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/caption-control/caption-control.png"
 *   alt="Vime caption control component"
 * />
 */
export declare class CaptionControl implements KeyboardControl {
  canToggleCaptionVisibility: boolean;
  /**
   * The URL to an SVG element or fragment to load.
   */
  showIcon: string;
  /**
   * The URL to an SVG element or fragment to load.
   */
  hideIcon: string;
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
  /**
   * The name of an icon library to use. Defaults to the library defined by the `icons` player
   * property.
   */
  icons?: string;
  /** @inheritdoc */
  keys?: string;
  /** @internal */
  i18n: PlayerProps['i18n'];
  /** @internal */
  playbackReady: PlayerProps['playbackReady'];
  /** @internal */
  textTracks: PlayerProps['textTracks'];
  /** @internal */
  isTextTrackVisible: PlayerProps['isTextTrackVisible'];
  onTextTracksChange(): Promise<void>;
  constructor();
  componentDidLoad(): void;
  private onClick;
  render(): any;
}
