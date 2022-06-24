var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { Event, h, Method, Prop } from '@stencil/core';
import { ViewType } from '../../core/player/ViewType';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withProviderConnect } from '../ProviderConnect';
import { createProviderDispatcher, } from '../ProviderDispatcher';
import { withProviderContext } from '../withProviderContext';
// @component
export class Name {
  constructor() {
    /** @internal */
    this.language = 'en';
    /** @internal */
    this.autoplay = false;
    /** @internal */
    this.controls = false;
    /** @internal */
    this.loop = false;
    /** @internal */
    this.muted = false;
    /** @internal */
    this.playsinline = false;
    withComponentRegistry(this);
    withProviderConnect(this);
    withProviderContext(this);
  }
  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    // @TODO change this if view is of type audio.
    this.dispatch('viewType', ViewType.Video);
  }
  /** @internal */
  getAdapter() {
    return __awaiter(this, void 0, void 0, function* () {
      // @TODO implement the following, commented out methods are optional and can be deleted.
      return {
        getInternalPlayer: () => __awaiter(this, void 0, void 0, function* () { }),
        play: () => __awaiter(this, void 0, void 0, function* () { }),
        pause: () => __awaiter(this, void 0, void 0, function* () { }),
        canPlay: () => __awaiter(this, void 0, void 0, function* () { return false; }),
        setCurrentTime: (time) => __awaiter(this, void 0, void 0, function* () {
          this.logger.log(time);
        }),
        setMuted: (muted) => __awaiter(this, void 0, void 0, function* () {
          this.logger.log(muted);
        }),
        setVolume: (volume) => __awaiter(this, void 0, void 0, function* () {
          this.logger.log(volume);
        }),
        // canSetPlaybackRate: async () => false,
        // setPlaybackRate: async (playbackRate: number) => {},
        // canSetPlaybackQuality: async () => false,
        // setPlaybackQuality: async (playbackQuality: string) => {},
        // canSetFullscreen: async () => false,
        // enterFullscreen: async () => {},
        // exitFullscreen: async () => {},
        // canSetPiP: async () => {},
        // enterPiP: async () => {},
        // exitPiP: async () => {},
      };
    });
  }
  // @TODO implement the render function.
  render() {
    return h("div", null);
  }
}
__decorate([
  Prop()
], Name.prototype, "language", void 0);
__decorate([
  Prop()
], Name.prototype, "autoplay", void 0);
__decorate([
  Prop()
], Name.prototype, "controls", void 0);
__decorate([
  Prop()
], Name.prototype, "logger", void 0);
__decorate([
  Prop()
], Name.prototype, "loop", void 0);
__decorate([
  Prop()
], Name.prototype, "muted", void 0);
__decorate([
  Prop()
], Name.prototype, "playsinline", void 0);
__decorate([
  Event()
], Name.prototype, "vmLoadStart", void 0);
__decorate([
  Method()
], Name.prototype, "getAdapter", null);
