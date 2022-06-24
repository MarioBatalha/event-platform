var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import mitt from 'mitt';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { IS_IOS } from '../../../utils/support';
import { isFunction, isNil, noop } from '../../../utils/unit';
/**
 * Contains the logic for handling presentation modes on Safari. This class is used by
 * the `VideoFullscreenController` as a fallback when the native Fullscreen API is not
 * available (ie: iOS Safari).
 */
export class VideoPresentationController {
  constructor(host) {
    this.host = host;
    this.disposal = new Disposal();
    this.emitter = mitt();
    const disconnectedCallback = host.disconnectedCallback;
    host.disconnectedCallback = () => __awaiter(this, void 0, void 0, function* () {
      yield this.destroy();
      disconnectedCallback === null || disconnectedCallback === void 0 ? void 0 : disconnectedCallback.call(host);
    });
  }
  get videoElement() {
    var _a;
    if (((_a = this.host.mediaEl) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase()) === 'video') {
      return this.host.mediaEl;
    }
    return undefined;
  }
  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`. Only available in Safari.
   *
   * @default undefined
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get presentationMode() {
    var _a;
    return (_a = this.videoElement) === null || _a === void 0 ? void 0 : _a.webkitPresentationMode;
  }
  /**
   * Whether the current `presentationMode` is `inline`.
   */
  get isInlineMode() {
    return this.presentationMode === 'inline';
  }
  /**
   * Whether the current `presentationMode` is `picture-in-picture`.
   */
  get isPictureInPictureMode() {
    return this.presentationMode === 'inline';
  }
  /**
   * Whether the current `presentationMode` is `fullscreen`.
   */
  get isFullscreenMode() {
    return this.presentationMode === 'fullscreen';
  }
  /**
   * Whether the presentation mode API is available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
   */
  get isSupported() {
    var _a, _b, _c;
    return (IS_IOS &&
      isFunction((_a = this.videoElement) === null || _a === void 0 ? void 0 : _a.webkitSetPresentationMode) &&
      ((_c = (_b = this.videoElement) === null || _b === void 0 ? void 0 : _b.webkitSupportsFullscreen) !== null && _c !== void 0 ? _c : false));
  }
  setPresentationMode(mode) {
    var _a, _b;
    (_b = (_a = this.videoElement) === null || _a === void 0 ? void 0 : _a.webkitSetPresentationMode) === null || _b === void 0 ? void 0 : _b.call(_a, mode);
  }
  on(type, handler) {
    // @ts-expect-error - not typed yet.
    this.emitter.on(type, handler);
  }
  off(type, handler) {
    // @ts-expect-error - not typed yet.
    this.emitter.off(type, handler);
  }
  destroy() {
    this.setPresentationMode('inline');
    this.disposal.empty();
  }
  addPresentationModeChangeEventListener() {
    if (!this.isSupported || isNil(this.videoElement))
      return noop;
    return listen(this.videoElement, 'webkitpresentationmodechanged', this.handlePresentationModeChange.bind(this));
  }
  handlePresentationModeChange() {
    this.emitter.emit('change', this.presentationMode);
  }
}
