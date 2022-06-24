import { EventEmitter } from '../../../../stencil-public-runtime';
/**
 * This component is responsible for containing and managing menu items and submenus. The menu is
 * ARIA friendly by ensuring the correct ARIA properties are set, and enabling keyboard navigation
 * when it is focused.
 *
 * You can use this component if you'd like to build out a custom settings menu. If you're looking
 * to only customize the content of the settings see [`vime-settings`](settings.md), and if you
 * want an easier starting point see [`vime-default-settings`](default-settings.md).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/menu/menu.png"
 *   alt="Vime settings menu component"
 * />
 *
 * @slot - Used to pass in radio buttons (`vm-menu-radio`).
 */
export declare class MenuRadioGroup {
  host: HTMLVmMenuRadioGroupElement;
  /**
   * The current value selected for this group.
   */
  value?: string;
  onValueChange(): void;
  /**
   * Emitted when a new radio button is selected for this group.
   */
  vmCheck: EventEmitter<void>;
  constructor();
  connectedCallback(): void;
  componentDidLoad(): void;
  onSelectionChange(event: Event): void;
  private findRadios;
  render(): any;
}
