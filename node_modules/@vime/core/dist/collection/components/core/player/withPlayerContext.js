var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { openWormhole } from 'stencil-wormhole';
import { listen } from '../../../utils/dom';
import { isUndefined } from '../../../utils/unit';
import { findPlayer } from './findPlayer';
import { getEventName } from './PlayerEvents';
/**
 * Binds props between an instance of a given component class and it's closest ancestor player.
 *
 * @param component A Stencil component instance.
 * @param props A set of props to watch and update on the given component instance.
 */
export const withPlayerContext = (component, props) => openWormhole(component, props);
/**
 * Finds the closest ancestor player to the given `ref` and watches the given props for changes. On
 * a prop change the given `updater` fn is called.
 *
 * @param ref A element within any player's subtree.
 * @param props A set of props to watch and call the `updater` fn with.
 * @param updater This function is called with the prop/value of any watched properties.
 */
export const usePlayerContext = (ref, props, updater, playerRef) => __awaiter(void 0, void 0, void 0, function* () {
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
