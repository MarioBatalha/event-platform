'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-86498cbd.js');
const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');
const ViewType = require('./ViewType-ea1402c0.js');
const utils = require('./utils-b8b7354f.js');
const ProviderConnect = require('./ProviderConnect-100da60f.js');
require('./Provider-b6123cae.js');
require('./PlayerProps-4bbfc16a.js');

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
    index.registerInstance(this, hostRef);
    /**
     * @internal Whether an external SDK will attach itself to the media player and control it.
     */
    this.willAttach = false;
    /** @inheritdoc */
    this.preload = 'metadata';
    withComponentRegistry.withComponentRegistry(this);
    if (!this.willAttach)
      ProviderConnect.withProviderConnect(this);
  }
  /** @internal */
  getAdapter() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const adapter = (_b = (yield ((_a = this.fileProvider) === null || _a === void 0 ? void 0 : _a.getAdapter()))) !== null && _b !== void 0 ? _b : {};
      adapter.canPlay = (type) => __awaiter(this, void 0, void 0, function* () { return withComponentRegistry.isString(type) && utils.audioRegex.test(type); });
      return adapter;
    });
  }
  render() {
    return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    index.h("vm-file", { noConnect: true, willAttach: this.willAttach, crossOrigin: this.crossOrigin, preload: this.preload, disableRemotePlayback: this.disableRemotePlayback, mediaTitle: this.mediaTitle, viewType: ViewType.ViewType.Audio, ref: (el) => {
        this.fileProvider = el;
      } }, index.h("slot", null)));
  }
};

exports.vm_audio = Audio;
