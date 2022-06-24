import { g as getElement } from './index-f5fd0f81.js';
import { d as isInstanceOf } from './withComponentRegistry-28311671.js';

const STATE_CHANGE_EVENT = 'vmStateChange';
/**
 * Creates a dispatcher on the given `ref`, to send updates to the closest ancestor player via
 * the custom `vmStateChange` event.
 *
 * @param ref An element to dispatch the state change events from.
 */
const createDispatcher = (ref) => (prop, value) => {
  const el = isInstanceOf(ref, HTMLElement) ? ref : getElement(ref);
  const event = new CustomEvent(STATE_CHANGE_EVENT, {
    bubbles: true,
    composed: true,
    detail: { by: el, prop, value },
  });
  el.dispatchEvent(event);
};

export { STATE_CHANGE_EVENT as S, createDispatcher as c };
