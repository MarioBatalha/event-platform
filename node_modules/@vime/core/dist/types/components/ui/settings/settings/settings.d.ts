import { PlayerProps } from '../../../core/player/PlayerProps';
import { SettingsController } from './SettingsController';
/**
 * A container for a collection of submenus and options for the player. On desktop, the settings
 * is displayed as a small popup menu (scroll appears if `height >= maxHeight`) on the bottom
 * right-hand side of a video player, or slightly above the right-hand side of an audio player. On
 * mobile, the settings is displayed as a [bottom sheet](https://material.io/components/sheets-bottom).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/settings/settings.png"
 *   alt="Vime settings component"
 * />
 *
 * @slot - Used to pass in the body of the settings menu, which usually contains submenus.
 */
export declare class Settings {
  private id;
  private menu;
  private disposal;
  private controller?;
  private dispatch;
  host: HTMLVmSettingsElement;
  menuHeight: number;
  /**
   * Pins the settings to the defined position inside the video player. This has no effect when
   * the view is of type `audio` (always `bottomRight`) and on mobile devices (always bottom sheet).
   */
  pin: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  /**
   * Whether the settings menu is opened/closed.
   */
  active: boolean;
  onActiveChange(): void;
  /** @internal */
  isMobile: PlayerProps['isMobile'];
  /** @internal */
  isAudioView: PlayerProps['isAudioView'];
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  /**
   * Sets the controller responsible for opening/closing this settings menu.
   */
  setController(controller: SettingsController): Promise<void>;
  private getPosition;
  private onOpen;
  private onClose;
  private onHeightChange;
  render(): any;
}
