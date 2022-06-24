import { g as getElement } from './index-f5fd0f81.js';
import { f as findPlayer, e as isUndefined, l as listen } from './withComponentRegistry-28311671.js';
import { g as getEventName } from './PlayerEvents-5c5704d6.js';

var createDeferredPromise = function () {
    var resolve;
    var promise = new Promise(function (res) { resolve = res; });
    return { promise: promise, resolve: resolve };
};

var openWormhole = function (Component, props, isBlocking) {
    if (isBlocking === void 0) { isBlocking = true; }
    var isConstructor = (Component.constructor.name === 'Function');
    var Proto = isConstructor ? Component.prototype : Component;
    var componentWillLoad = Proto.componentWillLoad;
    Proto.componentWillLoad = function () {
        var _this = this;
        var el = getElement(this);
        var onOpen = createDeferredPromise();
        var event = new CustomEvent('openWormhole', {
            bubbles: true,
            composed: true,
            detail: {
                consumer: this,
                fields: props,
                updater: function (prop, value) {
                    var target = (prop in el) ? el : _this;
                    target[prop] = value;
                },
                onOpen: onOpen,
            },
        });
        el.dispatchEvent(event);
        var willLoad = function () {
            if (componentWillLoad) {
                return componentWillLoad.call(_this);
            }
        };
        return isBlocking ? onOpen.promise.then(function () { return willLoad(); }) : (willLoad());
    };
};

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/**
 * Binds props between an instance of a given component class and it's closest ancestor player.
 *
 * @param component A Stencil component instance.
 * @param props A set of props to watch and update on the given component instance.
 */
const withPlayerContext = (component, props) => openWormhole(component, props);
/**
 * Finds the closest ancestor player to the given `ref` and watches the given props for changes. On
 * a prop change the given `updater` fn is called.
 *
 * @param ref A element within any player's subtree.
 * @param props A set of props to watch and call the `updater` fn with.
 * @param updater This function is called with the prop/value of any watched properties.
 */
const usePlayerContext = (ref, props, updater, playerRef) => __awaiter(void 0, void 0, void 0, function* () {
  const player = playerRef !== null && playerRef !== void 0 ? playerRef : (yield findPlayer(ref));
  const listeners = !isUndefined(player)
    ? props.map(prop => {
      const event = getEventName(prop);
      return listen(player, event, () => {
        updater(prop, player[prop]);
      });
    })
    : [];
  return () => {
    listeners.forEach(off => off());
  };
});

export { usePlayerContext as u, withPlayerContext as w };
