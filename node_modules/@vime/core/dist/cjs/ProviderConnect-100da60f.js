'use strict';

const index = require('./index-86498cbd.js');
const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');
const Provider = require('./Provider-b6123cae.js');
const PlayerProps = require('./PlayerProps-4bbfc16a.js');

const PROVIDER_CHANGE_EVENT = 'vmProviderChange';
/**
 * Creates a dispatcher on the given `ref`, to send updates to the closest ancestor player via
 * the custom `vmProviderChange` event.
 *
 * @param ref A component reference to dispatch the state change events from.
 */
const createProviderDispatcher = (ref) => (prop, value) => {
  const el = withComponentRegistry.isInstanceOf(ref, HTMLElement) ? ref : index.getElement(ref);
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
const isProviderWritableProp = (prop) => PlayerProps.isWritableProp(prop) || providerWritableProps.has(prop);

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
  const el = index.getElement(connector);
  const disposal = new withComponentRegistry.Disposal();
  const cache = new Map();
  connector[PROVIDER_CACHE_KEY] = cache;
  function initCache() {
    Object.keys(connector).forEach(prop => {
      cache.set(prop, connector[prop]);
    });
  }
  function onDisconnect() {
    index.writeTask(() => __awaiter(this, void 0, void 0, function* () {
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
    const host = index.getElement(event.detail);
    if (connector.provider === host)
      return;
    const name = host === null || host === void 0 ? void 0 : host.nodeName.toLowerCase().replace('vm-', '');
    index.writeTask(() => __awaiter(this, void 0, void 0, function* () {
      connector.provider = host;
      connector.currentProvider = Object.values(Provider.Provider).find(provider => name === provider);
      withComponentRegistry.createStencilHook(hostRef, undefined, () => onDisconnect());
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
    index.writeTask(() => {
      cache.set(prop, value);
      connector[prop] = value;
    });
  }
  withComponentRegistry.createStencilHook(connector, () => {
    disposal.add(withComponentRegistry.listen(el, PROVIDER_CONNECT_EVENT, onConnect));
    disposal.add(withComponentRegistry.listen(el, PROVIDER_CHANGE_EVENT, onChange));
  }, () => {
    disposal.empty();
    cache.clear();
  });
}
function withProviderConnect(ref) {
  const connectEvent = buildProviderConnectEvent(PROVIDER_CONNECT_EVENT, ref);
  withComponentRegistry.createStencilHook(ref, () => {
    index.getElement(ref).dispatchEvent(connectEvent);
  });
}

exports.PROVIDER_CACHE_KEY = PROVIDER_CACHE_KEY;
exports.createProviderDispatcher = createProviderDispatcher;
exports.withProviderConnect = withProviderConnect;
exports.withProviderHost = withProviderHost;
