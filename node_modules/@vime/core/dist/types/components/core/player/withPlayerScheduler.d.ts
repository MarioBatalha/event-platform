import { MediaProviderAdapter } from '../../providers/MediaProvider';
import { MediaPlayer } from './MediaPlayer';
import { WritableProps } from './PlayerProps';
export declare type SafeAdapterCall = <P extends keyof WritableProps>(prop: P, method: keyof MediaProviderAdapter) => Promise<void>;
export declare function withPlayerScheduler(player: MediaPlayer): SafeAdapterCall;
