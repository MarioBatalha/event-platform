import { r as registerInstance, h } from './index-f5fd0f81.js';
import { c as withComponentRegistry, h as isString } from './withComponentRegistry-28311671.js';
import { V as ViewType } from './ViewType-6da43616.js';
import { a as audioRegex } from './utils-7dc44688.js';
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
const Audio = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    /**
     * @internal Whether an external SDK will attach itself to the media player and control it.
     */
    this.willAttach = false;
    /** @inheritdoc */
    this.preload = 'metadata';
    withComponentRegistry(this);
    if (!this.willAttach)
      withProviderConnect(this);
  }
  /** @internal */
  getAdapter() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const adapter = (_b = (yield ((_a = this.fileProvider) === null || _a === void 0 ? void 0 : _a.getAdapter()))) !== null && _b !== void 0 ? _b : {};
      adapter.canPlay = (type) => __awaiter(this, void 0, void 0, function* () { return isString(type) && audioRegex.test(type); });
      return adapter;
    });
  }
  render() {
    return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    h("vm-file", { noConnect: true, willAttach: this.willAttach, crossOrigin: this.crossOrigin, preload: this.preload, disableRemotePlayback: this.disableRemotePlayback, mediaTitle: this.mediaTitle, viewType: ViewType.Audio, ref: (el) => {
        this.fileProvider = el;
      } }, h("slot", null)));
  }
};

export { Audio as vm_audio };
