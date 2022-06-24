/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon/icon.tsx
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, Event, h, Method, Prop, State, Watch, } from '@stencil/core';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { getIconLibraryResolver, withIconRegistry, } from '../icon-library/IconRegistry';
import { requestIcon } from './requestIcon';
const parser = new DOMParser();
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
export class Icon {
  constructor() {
    /** @internal */
    this.icons = 'material';
    withComponentRegistry(this);
    withIconRegistry(this);
  }
  handleChange() {
    this.setIcon();
  }
  connectedCallback() {
    withPlayerContext(this, ['icons']);
  }
  componentDidLoad() {
    this.setIcon();
  }
  /**
   * @internal Fetches the icon and redraws it. Used to handle library registrations.
   */
  redraw() {
    return __awaiter(this, void 0, void 0, function* () {
      this.setIcon();
    });
  }
  getLabel() {
    let label = '';
    if (this.label) {
      label = this.label;
    }
    else if (this.name) {
      label = this.name.replace(/-/g, ' ');
    }
    else if (this.src) {
      label = this.src
        .replace(/.*\//, '')
        .replace(/-/g, ' ')
        .replace(/\.svg/i, '');
    }
    return label;
  }
  setIcon() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const resolver = getIconLibraryResolver((_a = this.library) !== null && _a !== void 0 ? _a : this.icons);
      let url = this.src;
      if (this.name && resolver) {
        url = resolver(this.name);
      }
      if (url) {
        try {
          const file = yield requestIcon(url);
          if (file.ok) {
            const doc = parser.parseFromString(file.svg, 'text/html');
            const svg = doc.body.querySelector('svg');
            if (svg) {
              this.svg = svg.outerHTML;
              this.vmLoad.emit();
            }
            else {
              this.svg = '';
              this.vmError.emit({ status: file.status });
            }
          }
        }
        catch (_b) {
          this.vmError.emit();
        }
      }
    });
  }
  render() {
    return (h("div", { class: "icon", role: "img", "aria-label": this.getLabel(), innerHTML: this.svg }));
  }
  static get is() { return "vm-icon"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["icon.css"]
  }; }
  static get styleUrls() { return {
    "$": ["icon.css"]
  }; }
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
        "text": "The name of the icon to draw."
      },
      "attribute": "name",
      "reflect": false
    },
    "src": {
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
        "text": "The absolute URL of an SVG file to load."
      },
      "attribute": "src",
      "reflect": false
    },
    "label": {
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
        "text": "An alternative description to use for accessibility. If omitted, the name or src will be used\nto generate it."
      },
      "attribute": "label",
      "reflect": false
    },
    "library": {
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
        "text": "The name of a registered icon library."
      },
      "attribute": "library",
      "reflect": false
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
            "path": "../../.."
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
  static get states() { return {
    "svg": {}
  }; }
  static get events() { return [{
      "method": "vmLoad",
      "name": "vmLoad",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the icon has loaded."
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }, {
      "method": "vmError",
      "name": "vmError",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the icon failed to load."
      },
      "complexType": {
        "original": "{ status?: number }",
        "resolved": "{ status?: number | undefined; }",
        "references": {}
      }
    }]; }
  static get methods() { return {
    "redraw": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "",
        "tags": [{
            "name": "internal",
            "text": "Fetches the icon and redraws it. Used to handle library registrations."
          }]
      }
    }
  }; }
  static get watchers() { return [{
      "propName": "name",
      "methodName": "handleChange"
    }, {
      "propName": "src",
      "methodName": "handleChange"
    }, {
      "propName": "library",
      "methodName": "handleChange"
    }, {
      "propName": "icons",
      "methodName": "handleChange"
    }]; }
}
