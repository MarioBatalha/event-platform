import { noop } from './unit';
/**
 * Creates an empty Promise and defers resolving/rejecting it.
 */
export const deferredPromise = () => {
  let resolve = noop;
  let reject = noop;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
