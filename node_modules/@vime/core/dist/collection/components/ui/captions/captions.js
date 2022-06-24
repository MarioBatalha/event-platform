var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Component, h, Prop, State, Watch } from '@stencil/core';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { isNil, isUndefined } from '../../../utils/unit';
import { findPlayer } from '../../core/player/findPlayer';
import { createDispatcher, } from '../../core/player/PlayerDispatcher';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { withControlsCollisionDetection } from '../controls/controls/withControlsCollisionDetection';
/**
 * Renders and displays VTT cues by hooking into the `textTracks` player property. This is a simple
 * implementation that can only handle rendering one text track, and one cue for the given track at a
 * time (even if many are active). The active track can be changed by setting the mode of any track
 * in the list to `showing`.
 *
 * Be aware that after you set the text track mode to `showing`, the component will automatically set
 * it to hidden to avoid double captions. This also means that this component is **not recommended**
 * to be used in combination with the native HTML5 player controls.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/captions/captions.png"
 *   alt="Vime captions component"
 * />
 */
export class Captions {
  constructor() {
    this.sizeDisposal = new Disposal();
    this.textDisposal = new Disposal();
    this.isEnabled = false;
    this.fontSize = 'sm';
    /**
     * Whether the captions should be visible or not.
     */
    this.hidden = false;
    /** @internal */
    this.isControlsActive = false;
    /** @internal */
    this.isVideoView = false;
    /** @internal */
    this.playbackStarted = false;
    /** @internal */
    this.textTracks = [];
    /** @internal */
    this.currentTextTrack = -1;
    /** @internal */
    this.isTextTrackVisible = true;
    withComponentRegistry(this);
    withControlsCollisionDetection(this);
    withPlayerContext(this, [
      'isVideoView',
      'playbackStarted',
      'isControlsActive',
      'textTracks',
      'currentTextTrack',
      'isTextTrackVisible',
    ]);
  }
  onEnabledChange() {
    this.isEnabled = this.playbackStarted && this.isVideoView;
  }
  onTextTracksChange() {
    const textTrack = this.textTracks[this.currentTextTrack];
    const renderCues = () => {
      var _a;
      const activeCues = Array.from((_a = textTrack.activeCues) !== null && _a !== void 0 ? _a : []);
      this.renderCurrentCue(activeCues[0]);
    };
    this.textDisposal.empty();
    if (!isNil(textTrack)) {
      renderCues();
      this.textDisposal.add(listen(textTrack, 'cuechange', renderCues));
    }
  }
  connectedCallback() {
    this.dispatch = createDispatcher(this);
    this.dispatch('shouldRenderNativeTextTracks', false);
    this.onTextTracksChange();
    this.onPlayerResize();
  }
  disconnectedCallback() {
    this.textDisposal.empty();
    this.sizeDisposal.empty();
    this.dispatch('shouldRenderNativeTextTracks', true);
  }
  onPlayerResize() {
    return __awaiter(this, void 0, void 0, function* () {
      const player = yield findPlayer(this);
      if (isUndefined(player))
        return;
      const container = (yield player.getContainer());
      const resizeObs = new ResizeObserver(entries => {
        const entry = entries[0];
        const { width } = entry.contentRect;
        if (width >= 1360) {
          this.fontSize = 'xl';
        }
        else if (width >= 1024) {
          this.fontSize = 'lg';
        }
        else if (width >= 768) {
          this.fontSize = 'md';
        }
        else {
          this.fontSize = 'sm';
        }
      });
      resizeObs.observe(container);
    });
  }
  renderCurrentCue(cue) {
    if (isNil(cue)) {
      this.cue = '';
      return;
    }
    const div = document.createElement('div');
    div.append(cue.getCueAsHTML());
    this.cue = div.innerHTML.trim();
  }
  render() {
    return (h("div", { style: {
        transform: `translateY(calc(${this.isControlsActive ? 'var(--vm-controls-height)' : '24px'} * -1))`,
      }, class: {
        captions: true,
        enabled: this.isEnabled,
        hidden: this.hidden,
        fontMd: this.fontSize === 'md',
        fontLg: this.fontSize === 'lg',
        fontXl: this.fontSize === 'xl',
        inactive: !this.isTextTrackVisible,
      } },
      h("span", { class: "cue" }, this.cue)));
  }
  static get is() { return "vm-captions"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["captions.css"]
  }; }
  static get styleUrls() { return {
    "$": ["captions.css"]
  }; }
  static get properties() { return {
    "hidden": {
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
        "text": "Whether the captions should be visible or not."
      },
      "attribute": "hidden",
      "reflect": false,
      "defaultValue": "false"
    },
    "isControlsActive": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isControlsActive']",
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
      "attribute": "is-controls-active",
      "reflect": false,
      "defaultValue": "false"
    },
    "isVideoView": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isVideoView']",
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
      "attribute": "is-video-view",
      "reflect": false,
      "defaultValue": "false"
    },
    "playbackStarted": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['playbackStarted']",
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
      "attribute": "playback-started",
      "reflect": false,
      "defaultValue": "false"
    },
    "textTracks": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['textTracks']",
        "resolved": "TextTrack[]",
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
      "defaultValue": "[]"
    },
    "currentTextTrack": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['currentTextTrack']",
        "resolved": "number",
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
      "attribute": "current-text-track",
      "reflect": false,
      "defaultValue": "-1"
    },
    "isTextTrackVisible": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "PlayerProps['isTextTrackVisible']",
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
      "attribute": "is-text-track-visible",
      "reflect": false,
      "defaultValue": "true"
    }
  }; }
  static get states() { return {
    "isEnabled": {},
    "cue": {},
    "fontSize": {}
  }; }
  static get watchers() { return [{
      "propName": "isVideoView",
      "methodName": "onEnabledChange"
    }, {
      "propName": "playbackStarted",
      "methodName": "onEnabledChange"
    }, {
      "propName": "textTracks",
      "methodName": "onTextTracksChange"
    }, {
      "propName": "currentTextTrack",
      "methodName": "onTextTracksChange"
    }]; }
}
