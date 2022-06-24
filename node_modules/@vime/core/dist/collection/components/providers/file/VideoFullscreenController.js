var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { noop } from '../../../utils/unit';
import { FullscreenController } from '../../core/player/fullscreen/FullscreenController';
/**
 * Extends the base `FullscreenController` with additional logic for handling fullscreen
 * on iOS Safari where the native Fullscreen API is not available (in this case it fallsback to
 * using the `VideoPresentationController`).
 */
export class VideoFullscreenController extends FullscreenController {
  constructor(host, presentationController) {
    super(host);
    this.host = host;
    this.presentationController = presentationController;
  }
  get isFullscreen() {
    return this.presentationController.isFullscreenMode;
  }
  /**
   * Whether a fallback fullscreen API is available on Safari using presentation modes. This
   * is only used on iOS where the native fullscreen API is not available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get isSupported() {
    return this.presentationController.isSupported;
  }
  makeEnterFullscreenRequest() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.presentationController.setPresentationMode('fullscreen');
    });
  }
  makeExitFullscreenRequest() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.presentationController.setPresentationMode('inline');
    });
  }
  addFullscreenChangeEventListener() {
    if (!this.isSupported)
      return noop;
    this.presentationController.on('change', this.handlePresentationModeChange.bind(this));
    return () => {
      this.presentationController.off('change', this.handlePresentationModeChange.bind(this));
    };
  }
  handlePresentationModeChange() {
    this.handleFullscreenChange();
  }
  addFullscreenErrorEventListener() {
    return noop;
  }
}
