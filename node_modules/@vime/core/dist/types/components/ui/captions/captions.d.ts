import { PlayerProps } from '../../core/player/PlayerProps';
/**
 * Renders and displays VTT cues by hooking into the `textTracks` player property. This is a simple
 * implementation that can only handle rendering one text track, and one cue for the given track at a
 * time (even if many are active). The active track can be changed by setting the mode of any track
 * in the list to `showing`.
 *
 * Be aware that after you set the text track mode to `showing`, the component will automatically set
 * it to hidden to avoid double captions. This also means that this component is **not recommended**
 * to be used in combination with the native HTML5 player controls.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/captions/captions.png"
 *   alt="Vime captions component"
 * />
 */
export declare class Captions {
  private dispatch;
  private sizeDisposal;
  private textDisposal;
  isEnabled: boolean;
  cue?: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether the captions should be visible or not.
   */
  hidden: boolean;
  /** @internal */
  isControlsActive: PlayerProps['isControlsActive'];
  /** @internal */
  isVideoView: PlayerProps['isVideoView'];
  /** @internal */
  playbackStarted: PlayerProps['playbackStarted'];
  onEnabledChange(): void;
  /** @internal */
  textTracks: PlayerProps['textTracks'];
  /** @internal */
  currentTextTrack: PlayerProps['currentTextTrack'];
  /** @internal */
  isTextTrackVisible: PlayerProps['isTextTrackVisible'];
  onTextTracksChange(): void;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  private onPlayerResize;
  private renderCurrentCue;
  render(): any;
}
