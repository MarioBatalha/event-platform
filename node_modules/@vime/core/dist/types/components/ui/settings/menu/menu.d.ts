import { EventEmitter } from '../../../../stencil-public-runtime';
/**
 * A multi-purpose interactable element inside a menu. The behaviour and style of the item depends
 * on the props set.
 *
 * - **Default:** By default, the menu item only contains a label and optional hint/badge text that is
 * displayed on the right-hand side of the item.
 *
 * - **Navigation:** If the `menu` prop is set, the item behaves as a navigational control and displays
 * arrows to indicate whether clicking the control will navigate forwards/backwards.
 *
 * - **Radio:** If the `checked` prop is set, the item behaves as a radio button and displays a
 * checkmark icon to indicate whether it is checked or not.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/menu-item/menu-item.png"
 *   alt="Vime settings menu item component"
 * />
 *
 * @slot - Used to pass in the body of the menu which usually contains menu items, radio groups
 * and/or submenus.
 */
export declare class Menu {
  private menu?;
  private hasDisconnected;
  container?: HTMLDivElement;
  host: HTMLVmMenuElement;
  activeMenuItem?: HTMLVmMenuItemElement;
  onActiveMenuitemChange(): void;
  activeSubmenu?: HTMLVmSubmenuElement;
  onActiveSubmenuChange(): void;
  /**
   * Whether the menu is open/visible.
   */
  active: boolean;
  onActiveChange(): void;
  /**
   * The `id` attribute of the menu.
   */
  identifier: string;
  /**
   * Reference to the controller DOM element that is responsible for opening/closing this menu.
   */
  controller?: HTMLElement;
  /**
   * The direction the menu should slide in from.
   */
  slideInDirection?: 'left' | 'right';
  /**
   * Emitted when the menu is open/active.
   */
  vmOpen: EventEmitter<HTMLVmMenuElement>;
  /**
   * Emitted when the menu has closed/is not active.
   */
  vmClose: EventEmitter<HTMLVmMenuElement>;
  /**
   * Emitted when the menu is focused.
   */
  vmFocus: EventEmitter<void>;
  /**
   * Emitted when the menu loses focus.
   */
  vmBlur: EventEmitter<void>;
  /**
   * Emitted when the active submenu changes.
   */
  vmActiveSubmenuChange: EventEmitter<HTMLVmSubmenuElement | undefined>;
  /**
   * Emitted when the currently focused menu item changes.
   */
  vmActiveMenuItemChange: EventEmitter<HTMLVmMenuItemElement | undefined>;
  /**
   * Emitted when the height of the menu changes.
   */
  vmMenuHeightChange: EventEmitter<number>;
  constructor();
  connectedCallback(): void;
  componentDidRender(): void;
  disconnectedCallback(): void;
  /**
   * Focuses the menu.
   */
  focusMenu(): Promise<void>;
  /**
   * Removes focus from the menu.
   */
  blurMenu(): Promise<void>;
  /**
   * Returns the currently focused menu item.
   */
  getActiveMenuItem(): Promise<HTMLVmMenuItemElement | undefined>;
  /**
   * Sets the currently focused menu item.
   */
  setActiveMenuItem(item?: HTMLVmMenuItemElement): Promise<void>;
  /**
   * Calculates the height of the settings menu based on its children.
   */
  calculateHeight(): Promise<number>;
  onOpenSubmenu(event: CustomEvent<HTMLVmSubmenuElement>): void;
  onCloseSubmenu(event?: Event): void;
  onWindowClick(): void;
  onWindowKeyDown(event: KeyboardEvent): void;
  private getChildren;
  private getMenuItems;
  private focusController;
  private triggerMenuItem;
  private onClose;
  private onClick;
  private onFocus;
  private onBlur;
  private foucsMenuItem;
  private onKeyDown;
  render(): any;
}
