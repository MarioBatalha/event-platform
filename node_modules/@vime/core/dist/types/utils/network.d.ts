/**
 * Attempt to parse json into a POJO.
 */
export declare function tryParseJSON<T>(json: string): T | undefined;
/**
 * Check if the given input is json or a plain object.
 */
export declare const isObjOrJSON: (input: unknown) => boolean;
/**
 * If an object return otherwise try to parse it as json.
 */
export declare const objOrParseJSON: <T>(input: unknown) => T | undefined;
/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 */
export declare const loadImage: (src: string, minWidth?: number) => Promise<HTMLImageElement>;
export declare const loadScript: (src: string, onLoad: () => void, onError?: (e: unknown) => void) => void;
/**
 * Tries to parse json and return a object.
 */
export declare const decodeJSON: <T>(data: unknown) => T | undefined;
/**
 * Attempts to safely decode a URI component, on failure it returns the given fallback.
 */
export declare const tryDecodeURIComponent: (component: string, fallback?: string) => string;
export declare const parseQueryString: <T>(qs?: string | undefined) => T;
export declare type Params = Record<string, unknown>;
/**
 * Serializes the given params into a query string.
 */
export declare const serializeQueryString: (params: Params) => string;
/**
 * Notifies the browser to start establishing a connection with the given URL.
 */
export declare const preconnect: (url: string, rel?: 'preconnect' | 'prefetch' | 'preload', as?: string | undefined) => boolean;
/**
 * Safely appends the given query string to the given URL.
 */
export declare const appendQueryStringToURL: (url: string, qs?: string | undefined) => string;
/**
 * Serializes the given params into a query string and appends them to the given URL.
 */
export declare const appendParamsToURL: (url: string, params: string | Params) => string;
/**
 * Tries to convert a query string into a object.
 */
export declare const decodeQueryString: <T>(qs: string) => T | undefined;
/**
 * Loads an SDK into the global window namespace.
 *
 * @see https://github.com/CookPete/react-player/blob/master/src/utils.js#L77
 */
export declare const loadSDK: <SDKType = unknown>(url: string, sdkGlobalVar: string, sdkReadyVar?: string | undefined, isLoaded?: (sdk: SDKType) => boolean, loadScriptFn?: (src: string, onLoad: () => void, onError?: (e: unknown) => void) => void) => Promise<SDKType>;
export declare const loadSprite: (src: string, into?: HTMLElement | ShadowRoot | undefined) => void;
