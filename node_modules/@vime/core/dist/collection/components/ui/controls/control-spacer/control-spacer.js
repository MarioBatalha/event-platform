import { Component } from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
/**
 * Used to space controls out vertically/horizontally. Under the hood it's simply `flex: 1`.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control-spacer/control-spacer.png"
 *   alt="Vime control spacer component"
 * />
 */
export class ControlSpacer {
  constructor() {
    withComponentRegistry(this);
  }
  static get is() { return "vm-control-spacer"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["control-spacer.css"]
  }; }
  static get styleUrls() { return {
    "$": ["control-spacer.css"]
  }; }
}
