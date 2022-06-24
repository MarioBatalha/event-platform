import { PlayerProps } from '../../../core/player/PlayerProps';
/**
 * Creates a settings menu with options for changing the audio track, playback rate, quality and
 * captions of the current media. This component is provider aware. For example, it will only show
 * options for changing the playback rate if the current provider allows changing it
 * (`player.canSetPlaybackRate()`).  In addition, you can extend the settings with more options
 * via the default `slot`.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/default-settings/default-settings.png"
 *   alt="Vime default settings component"
 * />
 *
 * @slot - Used to extend the settings with additional menu options (see `vm-submenu` or
 * `vm-menu-item`).
 */
export declare class DefaultSettings {
  private textTracksDisposal;
  private dispatch;
  canSetPlaybackRate: boolean;
  canSetPlaybackQuality: boolean;
  canSetTextTrack: boolean;
  canSetAudioTrack: boolean;
  /**
   * Pins the settings to the defined position inside the video player. This has no effect when
   * the view is of type `audio`, it will always be `bottomRight`.
   */
  pin: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  /** @internal */
  i18n: PlayerProps['i18n'];
  /** @internal */
  playbackReady: PlayerProps['playbackReady'];
  onPlaybackReady(): Promise<void>;
  /** @internal */
  playbackRate: PlayerProps['playbackRate'];
  /** @internal */
  playbackRates: PlayerProps['playbackRates'];
  /** @internal */
  isVideoView: PlayerProps['isAudioView'];
  /** @internal */
  playbackQuality?: PlayerProps['playbackQuality'];
  /** @internal */
  playbackQualities: PlayerProps['playbackQualities'];
  /** @internal */
  textTracks: PlayerProps['textTracks'];
  /** @internal */
  currentTextTrack: number;
  /** @internal */
  audioTracks: PlayerProps['audioTracks'];
  onAudioTracksChange(): Promise<void>;
  /** @internal */
  currentAudioTrack: number;
  /** @internal */
  isTextTrackVisible: boolean;
  onTextTracksChange(): Promise<void>;
  constructor();
  connectedCallback(): void;
  componentDidLoad(): void;
  disconnectedCallback(): void;
  private onPlaybackRateSelect;
  private buildPlaybackRateSubmenu;
  private onPlaybackQualitySelect;
  private buildPlaybackQualitySubmenu;
  private onTextTrackSelect;
  private buildTextTracksSubmenu;
  private onAudioTrackSelect;
  private buildAudioTracksMenu;
  render(): any;
}
