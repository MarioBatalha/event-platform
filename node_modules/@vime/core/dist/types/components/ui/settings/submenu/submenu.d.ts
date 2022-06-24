import { EventEmitter } from '../../../../stencil-public-runtime';
/**
 * A menu that is to be nested inside another menu. A submenu is closed by default and it provides a
 * menu item that will open/close it. It's main purpose is to organize a menu by grouping related
 * sections/options together that can be navigated to by the user.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/submenu/submenu.png"
 *   alt="Vime submenu component"
 * />
 *
 * @slot - Used to pass in the body of the submenu which is usually a set of choices in the form
 * of a radio group (`vm-menu-radio-group`).
 */
export declare class Submenu {
  private id;
  host: HTMLVmSubmenuElement;
  menu?: HTMLVmMenuElement;
  controller?: HTMLVmMenuItemElement;
  /**
   * The title of the submenu.
   */
  label: string;
  /**
   * This can provide additional context about the current state of the submenu. For example, the
   * hint could be the currently selected option if the submenu contains a radio group.
   */
  hint?: string;
  /**
   * The direction the submenu should slide in from.
   */
  slideInDirection?: 'left' | 'right';
  /**
   * Whether the submenu is open/closed.
   */
  active: boolean;
  /**
   * Emitted when the submenu is open/active.
   */
  vmOpenSubmenu: EventEmitter<HTMLVmSubmenuElement>;
  /**
   * Emitted when the submenu has closed/is not active.
   */
  vmCloseSubmenu: EventEmitter<HTMLVmSubmenuElement>;
  constructor();
  connectedCallback(): void;
  /**
   * Returns the controller (`vm-menu-item`) for this submenu.
   */
  getController(): Promise<HTMLVmMenuItemElement | undefined>;
  /**
   * Returns the menu (`vm-menu`) for this submenu.
   */
  getMenu(): Promise<HTMLVmMenuElement | undefined>;
  /**
   * Returns the height of the submenu controller.
   */
  getControllerHeight(): Promise<number>;
  private getControllerHeightSync;
  private onMenuOpen;
  private onMenuClose;
  private genId;
  private getControllerId;
  render(): any;
}
