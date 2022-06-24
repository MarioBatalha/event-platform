/**
 * INSPIRED BY: https://shoelace.style/components/icon-library
 */
import { PlayerProps } from '../../core/player/PlayerProps';
import { IconLibraryResolver } from './IconRegistry';
/**
 * _This component was inspired by [Shoelace](https://shoelace.style/)._
 *
 * Loads and renders an SVG icon. The icon be loaded from an [icon library](./icon-library) or from
 * an absolute URL via the `src` property. Only SVGs on a local or CORS-enabled endpoint are
 * supported. If you're using more than one custom icon, it might make sense to register a custom
 * [icon library](./icon-library).
 */
export declare class IconLibrary {
  host: HTMLVmIconLibraryElement;
  /**
   * The name of the icon library to register. Vime provides some default libraries out of the box
   * such as `vime`or `material`.
   */
  name?: string;
  /**
   * A function that translates an icon name to a URL where the corresponding SVG file exists.
   * The URL can be local or a CORS-enabled endpoint.
   */
  resolver?: IconLibraryResolver;
  /** @internal */
  icons: PlayerProps['icons'];
  handleUpdate(): void;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  private register;
}
