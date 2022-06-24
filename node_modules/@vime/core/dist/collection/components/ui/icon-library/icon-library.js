/**
 * INSPIRED BY: https://shoelace.style/components/icon-library
 */
import { Component, Element, Prop, Watch } from '@stencil/core';
import { isUndefined } from '../../../utils/unit';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { deregisterIconLibrary, registerIconLibrary, } from './IconRegistry';
/**
 * _This component was inspired by [Shoelace](https://shoelace.style/)._
 *
 * Loads and renders an SVG icon. The icon be loaded from an [icon library](./icon-library) or from
 * an absolute URL via the `src` property. Only SVGs on a local or CORS-enabled endpoint are
 * supported. If you're using more than one custom icon, it might make sense to register a custom
 * [icon library](./icon-library).
 */
export class IconLibrary {
  constructor() {
    /** @internal */
    this.icons = 'material';
    withComponentRegistry(this);
    withPlayerContext(this, ['icons']);
  }
  handleUpdate() {
    this.register();
  }
  connectedCallback() {
    this.register();
  }
  disconnectedCallback() {
    if (!isUndefined(this.name))
      deregisterIconLibrary(this.name);
  }
  register() {
    var _a;
    registerIconLibrary((_a = this.name) !== null && _a !== void 0 ? _a : this.icons, this.name ? this.resolver : undefined);
  }
  static get is() { return "vm-icon-library"; }
  static get encapsulation() { return "shadow"; }
  static get properties() { return {
    "name": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The name of the icon library to register. Vime provides some default libraries out of the box\nsuch as `vime`or `material`."
      },
      "attribute": "name",
      "reflect": false
    },
    "resolver": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "IconLibraryResolver",
        "resolved": "((name: string) => string) | undefined",
        "references": {
          "IconLibraryResolver": {
            "location": "import",
            "path": "./IconRegistry"
          }
        }
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "A function that translates an icon name to a URL where the corresponding SVG file exists.\nThe URL can be local or a CORS-enabled endpoint."
      }
    },
    "icons": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['icons']",
        "resolved": "string",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../core/player/PlayerProps"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "icons",
      "reflect": false,
      "defaultValue": "'material'"
    }
  }; }
  static get elementRef() { return "host"; }
  static get watchers() { return [{
      "propName": "name",
      "methodName": "handleUpdate"
    }, {
      "propName": "resolver",
      "methodName": "handleUpdate"
    }, {
      "propName": "icons",
      "methodName": "handleUpdate"
    }]; }
}
