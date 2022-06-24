import { Handler } from 'mitt';
import { Disposal } from '../../../../utils/Disposal';
export interface FullscreenEventPayload {
  change: boolean;
  error: Event;
}
/**
 * Unfortunately fullscreen isn't straight forward due to cross-browser inconsistencies. This
 * class abstract the logic for handling fullscreen across browsers.
 */
export declare class FullscreenController {
  protected host: HTMLElement;
  protected disposal: Disposal;
  protected emitter: import("mitt").Emitter<Record<import("mitt").EventType, unknown>>;
  constructor(host: HTMLElement);
  /**
   * Whether fullscreen mode can be requested, generally is an API available to do so.
   */
  get isSupported(): boolean;
  /**
   * Whether the native Fullscreen API is enabled/available.
   */
  get isSupportedNatively(): boolean;
  /**
   * Whether the host element is in fullscreen mode.
   */
  get isFullscreen(): boolean;
  /**
   * Whether the host element is in fullscreen mode via the native Fullscreen API.
   */
  get isNativeFullscreen(): boolean;
  on<EventType extends keyof FullscreenEventPayload>(type: EventType, handler: Handler<FullscreenEventPayload[EventType]>): void;
  off<EventType extends keyof FullscreenEventPayload>(type: EventType, handler: Handler<FullscreenEventPayload[EventType]>): void;
  /**
   * Dispose of any event listeners and exit fullscreen (if active).
   */
  destroy(): Promise<void>;
  protected addFullscreenChangeEventListener(handler: (this: HTMLElement, event: Event) => void): () => void;
  protected addFullscreenErrorEventListener(handler: (this: HTMLElement, event: Event) => void): () => void;
  requestFullscreen(): Promise<void>;
  protected makeEnterFullscreenRequest(): Promise<void>;
  protected handleFullscreenChange(): void;
  protected handleFullscreenError(event: Event): void;
  exitFullscreen(): Promise<void>;
  protected makeExitFullscreenRequest(): Promise<void>;
  protected throwIfNoFullscreenSupport(): void;
}
