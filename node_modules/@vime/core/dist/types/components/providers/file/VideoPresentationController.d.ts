import { HTMLStencilElement } from '../../../stencil-public-runtime';
import { Handler } from 'mitt';
import { Disposal } from '../../../utils/Disposal';
import { WebKitPresentationMode } from '../../../utils/support';
export interface VideoPresentationControllerHost extends HTMLStencilElement {
  readonly mediaEl: HTMLMediaElement | undefined;
  disconnectedCallback?: () => void;
}
export interface VideoPresentationEventPayload {
  change: WebKitPresentationMode;
}
/**
 * Contains the logic for handling presentation modes on Safari. This class is used by
 * the `VideoFullscreenController` as a fallback when the native Fullscreen API is not
 * available (ie: iOS Safari).
 */
export declare class VideoPresentationController {
  protected host: VideoPresentationControllerHost;
  protected disposal: Disposal;
  protected emitter: import("mitt").Emitter<Record<import("mitt").EventType, unknown>>;
  constructor(host: VideoPresentationControllerHost);
  get videoElement(): HTMLVideoElement | undefined;
  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`. Only available in Safari.
   *
   * @default undefined
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get presentationMode(): WebKitPresentationMode | undefined;
  /**
   * Whether the current `presentationMode` is `inline`.
   */
  get isInlineMode(): boolean;
  /**
   * Whether the current `presentationMode` is `picture-in-picture`.
   */
  get isPictureInPictureMode(): boolean;
  /**
   * Whether the current `presentationMode` is `fullscreen`.
   */
  get isFullscreenMode(): boolean;
  /**
   * Whether the presentation mode API is available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
   */
  get isSupported(): boolean;
  setPresentationMode(mode: WebKitPresentationMode): void;
  on<EventType extends keyof VideoPresentationEventPayload>(type: EventType, handler: Handler<VideoPresentationEventPayload[EventType]>): void;
  off<EventType extends keyof VideoPresentationEventPayload>(type: EventType, handler: Handler<VideoPresentationEventPayload[EventType]>): void;
  destroy(): void;
  addPresentationModeChangeEventListener(): () => void;
  protected handlePresentationModeChange(): void;
}
