import { r as registerInstance, h } from './index-f5fd0f81.js';
import { V as ViewType } from './ViewType-6da43616.js';
import { c as withComponentRegistry } from './withComponentRegistry-28311671.js';
import { w as withProviderConnect } from './ProviderConnect-42dc4f0d.js';
import './Provider-2e7e8366.js';
import './PlayerProps-2c57fcea.js';

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try {
      step(generator.next(value));
    }
    catch (e) {
      reject(e);
    } }
    function rejected(value) { try {
      step(generator["throw"](value));
    }
    catch (e) {
      reject(e);
    } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const Video = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    /**
     * @internal Whether an external SDK will attach itself to the media player and control it.
     */
    this.willAttach = false;
    /**
     * @internal Whether an external SDK will manage the text tracks.
     */
    this.hasCustomTextManager = false;
    /** @inheritdoc */
    this.preload = 'metadata';
    withComponentRegistry(this);
    withProviderConnect(this);
  }
  onProviderConnect(event) {
    if (this.willAttach)
      event.stopImmediatePropagation();
  }
  onProviderDisconnect(event) {
    if (this.willAttach)
      event.stopImmediatePropagation();
  }
  /** @internal */
  getAdapter() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      return (_a = this.fileProvider) === null || _a === void 0 ? void 0 : _a.getAdapter();
    });
  }
  render() {
    return (h("vm-file", { noConnect: true, willAttach: this.willAttach, crossOrigin: this.crossOrigin, poster: this.poster, preload: this.preload, controlsList: this.controlsList, autoPiP: this.autoPiP, disablePiP: this.disablePiP, disableRemotePlayback: this.disableRemotePlayback, hasCustomTextManager: this.hasCustomTextManager, mediaTitle: this.mediaTitle, viewType: ViewType.Video, ref: (el) => {
        this.fileProvider = el;
      } }, h("slot", null)));
  }
};

export { Video as vm_video };
