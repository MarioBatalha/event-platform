import { Component, h, Prop } from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
/**
 * Formats and displays the duration of the current media.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/end-time/end-time.png"
 *   alt="Vime end time component"
 * />
 */
export class EndTime {
  constructor() {
    /** @internal */
    this.duration = -1;
    /** @internal */
    this.i18n = {};
    /**
     * Whether the time should always show the hours unit, even if the time is less than
     * 1 hour (eg: `20:35` -> `00:20:35`).
     */
    this.alwaysShowHours = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['duration', 'i18n']);
  }
  render() {
    return (h("vm-time", { label: this.i18n.duration, seconds: Math.max(0, this.duration), alwaysShowHours: this.alwaysShowHours }));
  }
  static get is() { return "vm-end-time"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["end-time.css"]
  }; }
  static get styleUrls() { return {
    "$": ["end-time.css"]
  }; }
  static get properties() { return {
    "duration": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['duration']",
        "resolved": "number",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../../core/player/PlayerProps"
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
      "attribute": "duration",
      "reflect": false,
      "defaultValue": "-1"
    },
    "i18n": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['i18n']",
        "resolved": "Translation | { [x: string]: string; }",
        "references": {
          "PlayerProps": {
            "location": "import",
            "path": "../../../core/player/PlayerProps"
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
      "defaultValue": "{}"
    },
    "alwaysShowHours": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Whether the time should always show the hours unit, even if the time is less than\n1 hour (eg: `20:35` -> `00:20:35`)."
      },
      "attribute": "always-show-hours",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
}
