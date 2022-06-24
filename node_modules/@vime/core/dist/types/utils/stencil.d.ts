import { ComponentInterface } from '../stencil-public-runtime';
export declare type StencilHook = 'connectedCallback' | 'disconnectedCallback' | 'componentWillRender' | 'componentDidRender' | 'componentWillLoad' | 'componentDidLoad' | 'componentShouldUpdate' | 'componentWillUpdate' | 'componentDidUpdate';
export declare function wrapStencilHook<P extends keyof ComponentInterface>(component: ComponentInterface, lifecycle: P, hook: ComponentInterface[P]): void;
export declare function createStencilHook(component: ComponentInterface, onConnect?: () => void, onDisconnect?: () => void): void;
