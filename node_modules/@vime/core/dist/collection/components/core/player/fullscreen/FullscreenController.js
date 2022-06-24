var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import fscreen from 'fscreen';
import mitt from 'mitt';
import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { noop } from '../../../../utils/unit';
/**
 * Unfortunately fullscreen isn't straight forward due to cross-browser inconsistencies. This
 * class abstract the logic for handling fullscreen across browsers.
 */
export class FullscreenController {
  constructor(host) {
    this.host = host;
    this.disposal = new Disposal();
    this.emitter = mitt();
  }
  /**
   * Whether fullscreen mode can be requested, generally is an API available to do so.
   */
  get isSupported() {
    return this.isSupportedNatively;
  }
  /**
   * Whether the native Fullscreen API is enabled/available.
   */
  get isSupportedNatively() {
    return fscreen.fullscreenEnabled;
  }
  /**
   * Whether the host element is in fullscreen mode.
   */
  get isFullscreen() {
    return this.isNativeFullscreen;
  }
  /**
   * Whether the host element is in fullscreen mode via the native Fullscreen API.
   */
  get isNativeFullscreen() {
    if (fscreen.fullscreenElement === this.host)
      return true;
    try {
      // Throws in iOS Safari...
      return this.host.matches(
      // Property `fullscreenPseudoClass` is missing from `@types/fscreen`.
      fscreen
        .fullscreenPseudoClass);
    }
    catch (error) {
      return false;
    }
  }
  on(type, handler) {
    // @ts-expect-error - not typed yet.
    this.emitter.on(type, handler);
  }
  off(type, handler) {
    // @ts-expect-error - not typed yet.
    this.emitter.off(type, handler);
  }
  /**
   * Dispose of any event listeners and exit fullscreen (if active).
   */
  destroy() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.isFullscreen)
        yield this.exitFullscreen();
      this.disposal.empty();
      this.emitter.all.clear();
    });
  }
  addFullscreenChangeEventListener(handler) {
    if (!this.isSupported)
      return noop;
    return listen(fscreen, 'fullscreenchange', handler);
  }
  addFullscreenErrorEventListener(handler) {
    if (!this.isSupported)
      return noop;
    return listen(fscreen, 'fullscreenerror', handler);
  }
  requestFullscreen() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.isFullscreen)
        return;
      this.throwIfNoFullscreenSupport();
      // TODO: Check if PiP is active, if so make sure to exit - need PipController.
      this.disposal.add(this.addFullscreenChangeEventListener(this.handleFullscreenChange.bind(this)));
      this.disposal.add(this.addFullscreenErrorEventListener(this.handleFullscreenError.bind(this)));
      return this.makeEnterFullscreenRequest();
    });
  }
  makeEnterFullscreenRequest() {
    return __awaiter(this, void 0, void 0, function* () {
      return fscreen.requestFullscreen(this.host);
    });
  }
  handleFullscreenChange() {
    if (!this.isFullscreen)
      this.disposal.empty();
    this.emitter.emit('change', this.isFullscreen);
  }
  handleFullscreenError(event) {
    this.emitter.emit('error', event);
  }
  exitFullscreen() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.isFullscreen)
        return;
      this.throwIfNoFullscreenSupport();
      return this.makeExitFullscreenRequest();
    });
  }
  makeExitFullscreenRequest() {
    return __awaiter(this, void 0, void 0, function* () {
      return fscreen.exitFullscreen();
    });
  }
  throwIfNoFullscreenSupport() {
    if (this.isSupported)
      return;
    throw Error('Fullscreen API is not enabled or supported in this environment.');
  }
}
