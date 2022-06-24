'use strict';

const index = require('./index-86498cbd.js');

/**
 * Listen to an event on the given DOM node. Returns a callback to remove the event listener.
 */
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function fireEventAndRetry(el, event, onFail, interval = 300, maxRetries = 10) {
  let timeout;
  let attempt = 0;
  let found = false;
  function retry() {
    if (found)
      return;
    timeout = setTimeout(() => {
      if (attempt === maxRetries) {
        onFail === null || onFail === void 0 ? void 0 : onFail();
        return;
      }
      el.dispatchEvent(event);
      attempt += 1;
      retry();
    }, interval);
  }
  retry();
  return () => {
    window.clearTimeout(timeout);
    found = true;
  };
}
const isColliding = (a, b, translateAx = 0, translateAy = 0, translateBx = 0, translateBy = 0) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return (aRect.left + translateAx < bRect.right + translateBx &&
    aRect.right + translateAx > bRect.left + translateBx &&
    aRect.top + translateAy < bRect.bottom + translateBy &&
    aRect.bottom + translateAy > bRect.top + translateBy);
};

/**
 * No-operation (noop).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (..._) => {
  // ...
};
/**
 * Checks if `value` is `null`.
 *
 * @param value - The value to check.
 */
const isNull = (value) => value === null;
/**
 * Checks if `value` is `undefined`.
 *
 * @param value - The value to check.
 */
const isUndefined = (value) => typeof value === 'undefined';
/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @param value - The value to check.
 */
const isNil = (value) => isNull(value) || isUndefined(value);
/**
 * Returns the constructor of the given `value`.
 *
 * @param value - The value to return the constructor of.
 */
const getConstructor = (value) => 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
!isNil(value) ? value.constructor : undefined;
/**
 * Checks if `value` is classified as a `Object` object.
 *
 * @param value - The value to check.
 */
const isObject = (value) => getConstructor(value) === Object;
/**
 * Checks if `value` is classified as a `Number` object.
 *
 * @param value - The value to check.
 */
const isNumber = (value) => getConstructor(value) === Number && !Number.isNaN(value);
/**
 * Checks if `value` is classified as a `String` object.
 *
 * @param value - The value to check.
 */
const isString = (value) => getConstructor(value) === String;
/**
 * Checks if `value` is classified as a `Boolean` object.
 *
 * @param value - The value to check.
 */
const isBoolean = (value) => getConstructor(value) === Boolean;
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param value - The value to check.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (value) => getConstructor(value) === Function;
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @param value - The value to check.
 */
const isArray = (value) => Array.isArray(value);
/**
 * Checks if `value` is an instanceof the given `constructor`.
 *
 * @param value - The value to check.
 * @param constructor - The constructor to check against.
 */
const isInstanceOf = (value, constructor) => Boolean(value && constructor && value instanceof constructor);

/**
 * Creates an empty Promise and defers resolving/rejecting it.
 */
const deferredPromise = () => {
  let resolve = noop;
  let reject = noop;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

function wrapStencilHook(component, lifecycle, hook) {
  const prevHook = component[lifecycle];
  component[lifecycle] = function () {
    hook();
    return prevHook ? prevHook.call(component) : undefined;
  };
}
function createStencilHook(component, onConnect, onDisconnect) {
  let hasLoaded = false;
  if (!isUndefined(onConnect)) {
    wrapStencilHook(component, 'componentWillLoad', () => {
      onConnect();
      hasLoaded = true;
    });
    wrapStencilHook(component, 'connectedCallback', () => {
      if (hasLoaded)
        onConnect();
    });
  }
  if (!isUndefined(onDisconnect)) {
    wrapStencilHook(component, 'disconnectedCallback', () => {
      onDisconnect();
    });
  }
}

const FIND_PLAYER_EVENT = 'vmFindPlayer';
function withFindPlayer(player) {
  const el = index.getElement(player);
  let off;
  createStencilHook(player, () => {
    off = listen(el, FIND_PLAYER_EVENT, (event) => {
      event.stopPropagation();
      event.detail(el);
    });
  }, () => {
    off === null || off === void 0 ? void 0 : off();
  });
}
/**
 * Finds the closest ancestor player element by firing the `vmFindPlayer` event, and waiting
 * for the player to catch it. This function retries finding the player (`maxRetries`) until it
 * gives up and fails.
 *
 * @param ref - A HTMLElement that is within the player's subtree.
 * @param interval - The length of the timeout before trying again in milliseconds.
 * @param maxRetries - The number of times to retry firing the event.
 */
const findPlayer = (ref, interval = 300, maxRetries = 10) => {
  const el = (isInstanceOf(ref, HTMLElement)
    ? ref
    : index.getElement(ref));
  const search = deferredPromise();
  // eslint-disable-next-line prefer-const
  let stopFiring;
  const event = new CustomEvent(FIND_PLAYER_EVENT, {
    bubbles: true,
    composed: true,
    detail: player => {
      search.resolve(player);
      stopFiring();
    },
  });
  stopFiring = fireEventAndRetry(el, event, () => {
    search.reject(`Could not find player for ${el.nodeName}`);
  }, interval, maxRetries);
  return search.promise;
};

class Disposal {
  constructor(dispose = []) {
    this.dispose = dispose;
  }
  add(callback) {
    this.dispose.push(callback);
  }
  empty() {
    this.dispose.forEach(fn => fn());
    this.dispose = [];
  }
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const PLAYER_KEY = Symbol('vmPlayerKey');
const COMPONENT_NAME_KEY = Symbol('vmNameKey');
const REGISTRY_KEY = Symbol('vmRegistryKey');
const REGISTRATION_KEY = Symbol('vmRegistrationKey');
const REGISTER_COMPONENT_EVENT = 'vmComponentRegister';
const COMPONENT_REGISTERED_EVENT = 'vmComponentRegistered';
const COMPONENT_DEREGISTERED_EVENT = 'vmComponentDeregistered';
const getRegistrant = (ref) => isInstanceOf(ref, HTMLElement)
  ? ref
  : index.getElement(ref);
/**
 * Handles registering/deregistering the given `component` in the player registry. All registries
 * are bound per player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 */
function withComponentRegistry(ref, name) {
  const registryId = Symbol('vmRegistryId');
  const registrant = getRegistrant(ref);
  registrant[COMPONENT_NAME_KEY] = name !== null && name !== void 0 ? name : registrant.nodeName.toLowerCase();
  registrant[REGISTRATION_KEY] = registryId;
  const buildEvent = (eventName) => new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail: registrant,
  });
  const registerEvent = buildEvent(REGISTER_COMPONENT_EVENT);
  createStencilHook(ref, () => {
    registrant.dispatchEvent(registerEvent);
  });
}
function withComponentRegistrar(player) {
  const el = index.getElement(player);
  const registry = new Map();
  const disposal = new Disposal();
  // TODO properly type this later.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  el[REGISTRY_KEY] = registry;
  function onDeregister(registrant) {
    delete registrant[PLAYER_KEY];
    delete registrant[REGISTRY_KEY];
    registry.delete(registrant[REGISTRATION_KEY]);
    el.dispatchEvent(new CustomEvent(COMPONENT_DEREGISTERED_EVENT, { detail: registrant }));
  }
  function onRegister(e) {
    const ref = e.detail;
    const registrant = getRegistrant(ref);
    registrant[PLAYER_KEY] = el;
    registrant[REGISTRY_KEY] = registry;
    registry.set(registrant[REGISTRATION_KEY], registrant);
    el.dispatchEvent(new CustomEvent(COMPONENT_REGISTERED_EVENT, { detail: registrant }));
    createStencilHook(ref, undefined, () => onDeregister(registrant));
  }
  createStencilHook(player, () => {
    disposal.add(listen(el, REGISTER_COMPONENT_EVENT, onRegister));
  }, () => {
    registry.clear();
    disposal.empty();
    delete player[REGISTRY_KEY];
  });
}
/**
 * Checks whether any component with the given `name` exists in the registry. All registries
 * are bound per player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 * @param name - The name of the component to search for.
 */
function isComponentRegistered(ref, name) {
  var _a;
  const registrant = getRegistrant(ref);
  const registry = registrant[REGISTRY_KEY];
  return Array.from((_a = registry === null || registry === void 0 ? void 0 : registry.values()) !== null && _a !== void 0 ? _a : []).some(r => r[COMPONENT_NAME_KEY] === name);
}
/**
 * Returns the player for the given `ref`. This will only work after the component has been
 * registered, prefer using `findPlayer`.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 */
function getPlayerFromRegistry(ref) {
  const registrant = getRegistrant(ref);
  return registrant[PLAYER_KEY];
}
/**
 * Returns a collection of components from the registry for the given `ref`. All registries
 * are bound per player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 * @param name - The name of the components to search for in the registry.
 */
function getComponentFromRegistry(ref, name) {
  var _a, _b;
  const registrant = getRegistrant(ref);
  return Array.from((_b = (_a = registrant[REGISTRY_KEY]) === null || _a === void 0 ? void 0 : _a.values()) !== null && _b !== void 0 ? _b : []).filter(r => r[COMPONENT_NAME_KEY] === name);
}
/**
 * Watches the current registry on the given `ref` for changes. All registries are bound per
 * player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 * @param name - The name of the component to watch for.
 * @param onChange - A callback that is called when a component is registered/deregistered.
 */
function watchComponentRegistry(ref, name, onChange) {
  var _a;
  return __awaiter(this, void 0, void 0, function* () {
    const player = yield findPlayer(ref);
    const disposal = new Disposal();
    const registry = getRegistrant(ref)[REGISTRY_KEY];
    function listener(e) {
      if (e.detail[COMPONENT_NAME_KEY] === name)
        onChange === null || onChange === void 0 ? void 0 : onChange(getComponentFromRegistry(player, name));
    }
    // Hydrate.
    Array.from((_a = registry === null || registry === void 0 ? void 0 : registry.values()) !== null && _a !== void 0 ? _a : []).forEach(reg => listener(new CustomEvent('', { detail: reg })));
    if (!isUndefined(player)) {
      disposal.add(listen(player, COMPONENT_REGISTERED_EVENT, listener));
      disposal.add(listen(player, COMPONENT_DEREGISTERED_EVENT, listener));
    }
    createStencilHook(ref, () => {
      // no-op
    }, () => {
      disposal.empty();
    });
    return () => {
      disposal.empty();
    };
  });
}

exports.COMPONENT_NAME_KEY = COMPONENT_NAME_KEY;
exports.Disposal = Disposal;
exports.PLAYER_KEY = PLAYER_KEY;
exports.REGISTRATION_KEY = REGISTRATION_KEY;
exports.REGISTRY_KEY = REGISTRY_KEY;
exports.createStencilHook = createStencilHook;
exports.deferredPromise = deferredPromise;
exports.findPlayer = findPlayer;
exports.getComponentFromRegistry = getComponentFromRegistry;
exports.getPlayerFromRegistry = getPlayerFromRegistry;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isColliding = isColliding;
exports.isComponentRegistered = isComponentRegistered;
exports.isFunction = isFunction;
exports.isInstanceOf = isInstanceOf;
exports.isNil = isNil;
exports.isNull = isNull;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.isUndefined = isUndefined;
exports.listen = listen;
exports.noop = noop;
exports.watchComponentRegistry = watchComponentRegistry;
exports.withComponentRegistrar = withComponentRegistrar;
exports.withComponentRegistry = withComponentRegistry;
exports.withFindPlayer = withFindPlayer;
exports.wrapStencilHook = wrapStencilHook;
