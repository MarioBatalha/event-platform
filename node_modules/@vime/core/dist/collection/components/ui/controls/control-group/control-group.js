import { Component, Element, h, Prop } from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
/**
 * A simple container that enables player controls to be organized into groups. Each group starts on
 * a new line.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control-group/control-group.png"
 *   alt="Vime control group component"
 * />
 */
export class ControlNewLine {
  constructor() {
    /**
     * Determines where to add spacing/margin. The amount of spacing is determined by the CSS variable
     * `--control-group-spacing`.
     */
    this.space = 'none';
    withComponentRegistry(this);
  }
  render() {
    return (h("div", { class: {
        controlGroup: true,
        spaceTop: this.space !== 'none' && this.space !== 'bottom',
        spaceBottom: this.space !== 'none' && this.space !== 'top',
      } },
      h("slot", null)));
  }
  static get is() { return "vm-control-group"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["control-group.css"]
  }; }
  static get styleUrls() { return {
    "$": ["control-group.css"]
  }; }
  static get properties() { return {
    "space": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'top' | 'bottom' | 'both' | 'none'",
        "resolved": "\"both\" | \"bottom\" | \"none\" | \"top\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Determines where to add spacing/margin. The amount of spacing is determined by the CSS variable\n`--control-group-spacing`."
      },
      "attribute": "space",
      "reflect": false,
      "defaultValue": "'none'"
    }
  }; }
  static get elementRef() { return "host"; }
}
