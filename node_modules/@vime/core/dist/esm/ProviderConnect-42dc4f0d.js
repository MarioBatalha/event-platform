import { g as getElement, w as writeTask } from './index-f5fd0f81.js';
import { d as isInstanceOf, j as createStencilHook, l as listen, D as Disposal } from './withComponentRegistry-28311671.js';
import { P as Provider } from './Provider-2e7e8366.js';
import { a as isWritableProp } from './PlayerProps-2c57fcea.js';

const PROVIDER_CHANGE_EVENT = 'vmProviderChange';
/**
 * Creates a dispatcher on the given `ref`, to send updates to the closest ancestor player via
 * the custom `vmProviderChange` event.
 *
 * @param ref A component reference to dispatch the state change events from.
 */
const createProviderDispatcher = (ref) => (prop, value) => {
  const el = isInstanceOf(ref, HTMLElement) ? ref : getElement(ref);
  const event = new CustomEvent(PROVIDER_CHANGE_EVENT, {
    bubbles: true,
    composed: true,
    detail: { by: el, prop, value },
  });
  el.dispatchEvent(event);
};

const providerWritableProps = new Set([
  'ready',
  'playing',
  'playbackReady',
  'playbackStarted',
  'playbackEnded',
  'seeking',
  'buffered',
  'buffering',
  'duration',
  'viewType',
  'mediaTitle',
  'mediaType',
  'currentSrc',
  'currentPoster',
  'playbackRates',
  'playbackQualities',
  'textTracks',
  'currentTextTrack',
  'isTextTrackVisible',
  'audioTracks',
  'currentAudioTrack',
  'isPiPActive',
  'isFullscreenActive',
]);
const isProviderWritableProp = (prop) => isWritableProp(prop) || providerWritableProps.has(prop);

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const PROVIDER_CACHE_KEY = Symbol('vmProviderCache');
const PROVIDER_CONNECT_EVENT = 'vmMediaProviderConnect';
const PROVIDER_DISCONNECT_EVENT = 'vmMediaProviderDisconnect';
function buildProviderConnectEvent(name, host) {
  return new CustomEvent(name, {
    bubbles: true,
    composed: true,
    detail: host,
  });
}
function withProviderHost(connector) {
  const el = getElement(connector);
  const disposal = new Disposal();
  const cache = new Map();
  connector[PROVIDER_CACHE_KEY] = cache;
  function initCache() {
    Object.keys(connector).forEach(prop => {
      cache.set(prop, connector[prop]);
    });
  }
  function onDisconnect() {
    writeTask(() => __awaiter(this, void 0, void 0, function* () {
      var _a;
      connector.ready = false;
      connector.provider = undefined;
      cache.clear();
      (_a = connector.onProviderDisconnect) === null || _a === void 0 ? void 0 : _a.call(connector);
      el.dispatchEvent(buildProviderConnectEvent(PROVIDER_DISCONNECT_EVENT));
    }));
  }
  function onConnect(event) {
    event.stopImmediatePropagation();
    initCache();
    const hostRef = event.detail;
    const host = getElement(event.detail);
    if (connector.provider === host)
      return;
    const name = host === null || host === void 0 ? void 0 : host.nodeName.toLowerCase().replace('vm-', '');
    writeTask(() => __awaiter(this, void 0, void 0, function* () {
      connector.provider = host;
      connector.currentProvider = Object.values(Provider).find(provider => name === provider);
      createStencilHook(hostRef, undefined, () => onDisconnect());
    }));
  }
  function onChange(event) {
    var _a;
    event.stopImmediatePropagation();
    const { by, prop, value } = event.detail;
    if (!isProviderWritableProp(prop)) {
      (_a = connector.logger) === null || _a === void 0 ? void 0 : _a.warn(`${by.nodeName} tried to change \`${prop}\` but it is readonly.`);
      return;
    }
    writeTask(() => {
      cache.set(prop, value);
      connector[prop] = value;
    });
  }
  createStencilHook(connector, () => {
    disposal.add(listen(el, PROVIDER_CONNECT_EVENT, onConnect));
    disposal.add(listen(el, PROVIDER_CHANGE_EVENT, onChange));
  }, () => {
    disposal.empty();
    cache.clear();
  });
}
function withProviderConnect(ref) {
  const connectEvent = buildProviderConnectEvent(PROVIDER_CONNECT_EVENT, ref);
  createStencilHook(ref, () => {
    getElement(ref).dispatchEvent(connectEvent);
  });
}

export { PROVIDER_CACHE_KEY as P, withProviderHost as a, createProviderDispatcher as c, withProviderConnect as w };
