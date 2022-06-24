var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { getElement } from '@stencil/core';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { createStencilHook } from '../../../utils/stencil';
import { isInstanceOf, isUndefined } from '../../../utils/unit';
import { findPlayer } from './findPlayer';
export const PLAYER_KEY = Symbol('vmPlayerKey');
export const COMPONENT_NAME_KEY = Symbol('vmNameKey');
export const REGISTRY_KEY = Symbol('vmRegistryKey');
export const REGISTRATION_KEY = Symbol('vmRegistrationKey');
export const REGISTER_COMPONENT_EVENT = 'vmComponentRegister';
export const DEREGISTER_COMPONENT_EVENT = 'vmComponentDeregister';
export const COMPONENT_REGISTERED_EVENT = 'vmComponentRegistered';
export const COMPONENT_DEREGISTERED_EVENT = 'vmComponentDeregistered';
const getRegistrant = (ref) => isInstanceOf(ref, HTMLElement)
  ? ref
  : getElement(ref);
/**
 * Handles registering/deregistering the given `component` in the player registry. All registries
 * are bound per player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 */
export function withComponentRegistry(ref, name) {
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
export function withComponentRegistrar(player) {
  const el = getElement(player);
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
export function isComponentRegistered(ref, name) {
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
export function getPlayerFromRegistry(ref) {
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
export function getComponentFromRegistry(ref, name) {
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
export function watchComponentRegistry(ref, name, onChange) {
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
