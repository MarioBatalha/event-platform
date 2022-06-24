import { FullscreenController } from '../../core/player/fullscreen/FullscreenController';
import { VideoPresentationController } from './VideoPresentationController';
/**
 * Extends the base `FullscreenController` with additional logic for handling fullscreen
 * on iOS Safari where the native Fullscreen API is not available (in this case it fallsback to
 * using the `VideoPresentationController`).
 */
export declare class VideoFullscreenController extends FullscreenController {
  protected host: HTMLElement;
  protected presentationController: VideoPresentationController;
  constructor(host: HTMLElement, presentationController: VideoPresentationController);
  get isFullscreen(): boolean;
  /**
   * Whether a fallback fullscreen API is available on Safari using presentation modes. This
   * is only used on iOS where the native fullscreen API is not available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get isSupported(): boolean;
  protected makeEnterFullscreenRequest(): Promise<void>;
  protected makeExitFullscreenRequest(): Promise<void>;
  protected addFullscreenChangeEventListener(): () => void;
  protected handlePresentationModeChange(): void;
  protected addFullscreenErrorEventListener(): () => void;
}
