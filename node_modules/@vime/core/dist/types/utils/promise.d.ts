export interface DeferredPromise<ResolveType, RejectType = unknown> {
  promise: Promise<ResolveType | undefined>;
  resolve: (value?: ResolveType) => void;
  reject: (reason: RejectType) => void;
}
/**
 * Creates an empty Promise and defers resolving/rejecting it.
 */
export declare const deferredPromise: <ResolveType, RejectType = unknown>() => DeferredPromise<ResolveType, RejectType>;
