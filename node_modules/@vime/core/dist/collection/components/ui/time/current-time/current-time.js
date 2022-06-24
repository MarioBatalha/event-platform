import { Component, h, Prop } from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
/**
 * Formats and displays the current time of playback.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/current-time/current-time.png"
 *   alt="Vime current time component"
 * />
 */
export class CurrentTime {
  constructor() {
    /** @internal */
    this.currentTime = 0;
    /** @internal */
    this.i18n = {};
    /**
     * Whether the time should always show the hours unit, even if the time is less than
     * 1 hour (eg: `20:35` -> `00:20:35`).
     */
    this.alwaysShowHours = false;
    withComponentRegistry(this);
    withPlayerContext(this, ['currentTime', 'i18n']);
  }
  render() {
    return (h("vm-time", { label: this.i18n.currentTime, seconds: this.currentTime, alwaysShowHours: this.alwaysShowHours }));
  }
  static get is() { return "vm-current-time"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["current-time.css"]
  }; }
  static get styleUrls() { return {
    "$": ["current-time.css"]
  }; }
  static get properties() { return {
    "currentTime": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['currentTime']",
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
      "attribute": "current-time",
      "reflect": false,
      "defaultValue": "0"
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
