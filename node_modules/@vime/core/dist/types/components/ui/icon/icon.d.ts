/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon/icon.tsx
 */
import { EventEmitter } from '../../../stencil-public-runtime';
import { PlayerProps } from '../../..';
/**
 * _This component was inspired by [Shoelace](https://shoelace.style/)._
 *
 * **Icon libraries let you register additional icons to be used throughout the player.**
 *
 * An icon library is a renderless component that registers a custom set of SVG icons. The icon
 * files can exist locally or on a CORS-enabled endpoint (eg: CDN). There is no limit to how many
 * icon libraries you can register, and there is no cost associated with registering them, as
 * individual icons are only requested when they're used.
 *
 * By default, Vime provides the `vime` and `material` icon sets, to register your own icon
 * library create an `<vm-icon-library>` element with a name and resolver function. The resolver
 * function translates an icon name to a URL where its corresponding SVG file exists.
 *
 * Refer to the examples below and in the [icon](./icon) component to better understand how it all
 * works.
 */
export declare class Icon {
  svg?: string;
  /**
   * The name of the icon to draw.
   */
  name?: string;
  /**
   * The absolute URL of an SVG file to load.
   */
  src?: string;
  /**
   * An alternative description to use for accessibility. If omitted, the name or src will be used
   * to generate it.
   */
  label?: string;
  /**
   * The name of a registered icon library.
   */
  library?: string;
  /** @internal */
  icons: PlayerProps['icons'];
  /**
   * Emitted when the icon has loaded.
   */
  vmLoad: EventEmitter<void>;
  /**
   * Emitted when the icon failed to load.
   */
  vmError: EventEmitter<{
    status?: number;
  }>;
  handleChange(): void;
  constructor();
  connectedCallback(): void;
  componentDidLoad(): void;
  /**
   * @internal Fetches the icon and redraws it. Used to handle library registrations.
   */
  redraw(): Promise<void>;
  getLabel(): string;
  setIcon(): Promise<void>;
  render(): any;
}
