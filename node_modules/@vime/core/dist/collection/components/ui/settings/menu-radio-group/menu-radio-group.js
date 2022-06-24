import { Component, Element, Event, h, Listen, Prop, Watch, } from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
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
export class MenuRadioGroup {
  constructor() {
    withComponentRegistry(this);
  }
  onValueChange() {
    var _a;
    (_a = this.findRadios()) === null || _a === void 0 ? void 0 : _a.forEach(radio => {
      radio.checked = radio.value === this.value;
    });
  }
  connectedCallback() {
    this.onValueChange();
  }
  componentDidLoad() {
    this.onValueChange();
  }
  onSelectionChange(event) {
    const radio = event.target;
    this.value = radio.value;
  }
  findRadios() {
    var _a;
    return (_a = this.host
      .shadowRoot.querySelector('slot')) === null || _a === void 0 ? void 0 : _a.assignedElements();
  }
  render() {
    return h("slot", null);
  }
  static get is() { return "vm-menu-radio-group"; }
  static get encapsulation() { return "shadow"; }
  static get properties() { return {
    "value": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string | undefined",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The current value selected for this group."
      },
      "attribute": "value",
      "reflect": false
    }
  }; }
  static get events() { return [{
      "method": "vmCheck",
      "name": "vmCheck",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when a new radio button is selected for this group."
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }]; }
  static get elementRef() { return "host"; }
  static get watchers() { return [{
      "propName": "value",
      "methodName": "onValueChange"
    }]; }
  static get listeners() { return [{
      "name": "vmCheck",
      "method": "onSelectionChange",
      "target": undefined,
      "capture": false,
      "passive": false
    }]; }
}
