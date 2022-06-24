export declare type Constructor<T = Record<string, unknown>> = {
  new (...args: any[]): T;
  prototype: T;
};
/**
 * No-operation (noop).
 */
export declare const noop: (..._: unknown[]) => void;
/**
 * Checks if `value` is `null`.
 *
 * @param value - The value to check.
 */
export declare const isNull: (value: unknown) => value is null;
/**
 * Checks if `value` is `undefined`.
 *
 * @param value - The value to check.
 */
export declare const isUndefined: (value: unknown) => value is undefined;
/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @param value - The value to check.
 */
export declare const isNil: (value: unknown) => value is null | undefined;
/**
 * Returns the constructor of the given `value`.
 *
 * @param value - The value to return the constructor of.
 */
export declare const getConstructor: <T = unknown>(value: unknown) => T | undefined;
/**
 * Checks if `value` is classified as a `Object` object.
 *
 * @param value - The value to check.
 */
export declare const isObject: (value: unknown) => boolean;
/**
 * Checks if `value` is classified as a `Number` object.
 *
 * @param value - The value to check.
 */
export declare const isNumber: (value: unknown) => value is number;
/**
 * Checks if `value` is classified as a `String` object.
 *
 * @param value - The value to check.
 */
export declare const isString: (value: unknown) => value is string;
/**
 * Checks if `value` is classified as a `Boolean` object.
 *
 * @param value - The value to check.
 */
export declare const isBoolean: (value: unknown) => value is boolean;
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param value - The value to check.
 */
export declare const isFunction: (value: unknown) => value is Function;
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @param value - The value to check.
 */
export declare const isArray: (value: unknown) => value is unknown[];
/**
 * Checks if `value` is an instanceof the given `constructor`.
 *
 * @param value - The value to check.
 * @param constructor - The constructor to check against.
 */
export declare const isInstanceOf: (value: unknown, constructor: Constructor<unknown>) => boolean;
/**
 * Checks if the `value` prototype chain includes the given `object`.
 *
 * @param value - The value whose prototype chain to check.
 * @param object - The object to search for in the prototype chain.
 */
export declare const isPrototypeOf: (value: Object, object: Constructor<unknown>) => boolean;
