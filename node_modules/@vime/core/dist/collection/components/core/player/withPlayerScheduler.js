var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/* eslint-disable func-names */
import { getElement, writeTask } from '@stencil/core';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { createStencilHook, wrapStencilHook } from '../../../utils/stencil';
import { isUndefined } from '../../../utils/unit';
import { PROVIDER_CACHE_KEY } from '../../providers/ProviderConnect';
import { STATE_CHANGE_EVENT } from './PlayerDispatcher';
import { LOAD_START_EVENT } from './PlayerEvents';
import { initialState, isWritableProp, shouldPropResetOnMediaChange, } from './PlayerProps';
// These changes need to be called immediately to avoid the browser blocking the request.
const immediateAdapterCall = new Set(['currentTime', 'paused']);
export function withPlayerScheduler(player) {
  const el = getElement(player);
  const disposal = new Disposal();
  const cache = new Map();
  function initCache() {
    Object.keys(initialState).forEach(prop => {
      cache.set(prop, player[prop]);
    });
  }
  // Queue of adapter calls to be run when the media is ready for playback.
  let adapterCalls = [];
  function flushAdapterCalls() {
    return __awaiter(this, void 0, void 0, function* () {
      const adapter = yield player.adapter;
      if (isUndefined(adapter))
        return;
      for (let i = 0; i < adapterCalls.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        yield adapterCalls[i](adapter);
      }
      adapterCalls = [];
    });
  }
  let hasMediaChanged = false;
  function onMediaChange(e) {
    e === null || e === void 0 ? void 0 : e.stopImmediatePropagation();
    // Don't reset first time otherwise props intialized by the user will be reset.
    if (!hasMediaChanged) {
      hasMediaChanged = true;
      return;
    }
    adapterCalls = [];
    writeTask(() => {
      Object.keys(initialState)
        .filter(shouldPropResetOnMediaChange)
        .forEach(prop => {
        player[prop] = initialState[prop];
      });
    });
  }
  function onStateChange(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      event.stopImmediatePropagation();
      const { by, prop, value } = event.detail;
      if (!isWritableProp(prop)) {
        (_a = player.logger) === null || _a === void 0 ? void 0 : _a.warn(`${by.nodeName} tried to change \`${prop}\` but it is readonly.`);
        return;
      }
      if (!player.playbackStarted && immediateAdapterCall.has(prop)) {
        const adapter = yield player.adapter;
        if (prop === 'paused' && !value) {
          adapter === null || adapter === void 0 ? void 0 : adapter.play();
        }
        if (prop === 'currentTime') {
          adapter === null || adapter === void 0 ? void 0 : adapter.play();
          adapter === null || adapter === void 0 ? void 0 : adapter.setCurrentTime(value);
        }
      }
      writeTask(() => {
        player[prop] = value;
      });
    });
  }
  // Called by ProviderConnect.
  const { onProviderDisconnect } = player;
  player.onProviderDisconnect = function () {
    onMediaChange();
    if (onProviderDisconnect)
      onProviderDisconnect.call(player);
  };
  createStencilHook(player, () => {
    initCache();
    disposal.add(listen(el, LOAD_START_EVENT, onMediaChange));
    disposal.add(listen(el, STATE_CHANGE_EVENT, onStateChange));
  }, () => {
    cache.clear();
    disposal.empty();
  });
  wrapStencilHook(player, 'componentWillRender', () => __awaiter(this, void 0, void 0, function* () {
    if (player.playbackReady && adapterCalls.length > 0)
      yield flushAdapterCalls();
  }));
  function isAdapterCallRequired(prop, value) {
    var _a;
    return value !== ((_a = player[PROVIDER_CACHE_KEY]) === null || _a === void 0 ? void 0 : _a.get(prop));
  }
  return function safeAdapterCall(prop, method) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!isAdapterCallRequired(prop, player[prop]))
        return;
      const value = player[prop];
      const safeCall = (adapter) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          yield ((_a = adapter === null || adapter === void 0 ? void 0 : adapter[method]) === null || _a === void 0 ? void 0 : _a.call(adapter, value));
        }
        catch (e) {
          el.dispatchEvent(new CustomEvent('vmError', { detail: e }));
        }
      });
      if (player.playbackReady) {
        yield safeCall(yield player.adapter);
      }
      else {
        adapterCalls.push(safeCall);
      }
    });
  };
}
