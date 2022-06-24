import { Component, h, Prop } from '@stencil/core';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
/**
 * This can be used to indicate to the user that the current media is being streamed live.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/live-indicator/live-indicator.png"
 *   alt="Vime live indicator component"
 * />
 */
export class LiveIndicator {
  constructor() {
    /** @internal */
    this.isLive = false;
    /** @internal */
    this.i18n = {};
    withComponentRegistry(this);
    withPlayerContext(this, ['isLive', 'i18n']);
  }
  render() {
    return (h("div", { class: {
        liveIndicator: true,
        hidden: !this.isLive,
      } },
      h("div", { class: "indicator" }),
      this.i18n.live));
  }
  static get is() { return "vm-live-indicator"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["live-indicator.css"]
  }; }
  static get styleUrls() { return {
    "$": ["live-indicator.css"]
  }; }
  static get properties() { return {
    "isLive": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isLive']",
        "resolved": "boolean",
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
      "attribute": "is-live",
      "reflect": false,
      "defaultValue": "false"
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
      "defaultValue": "{}"
    }
  }; }
}
