import { PlayerProps } from '../../core/player/PlayerProps';
/**
 * A temporary placeholder that is used while content is loading. The implementation was inspired
 * by [Shoelace](https://github.com/shoelace-style/shoelace), thanks Cory!
 */
export declare class Skeleton {
  hidden: boolean;
  /**
   * Determines which animation effect the skeleton will use.
   * */
  effect: 'sheen' | 'none';
  /** @internal */
  ready: PlayerProps['ready'];
  onReadyChange(): void;
  constructor();
  render(): any;
}
