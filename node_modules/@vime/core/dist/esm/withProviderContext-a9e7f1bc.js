import { w as withPlayerContext } from './withPlayerContext-4c52f564.js';

const withProviderContext = (provider, additionalProps = []) => withPlayerContext(provider, [
  'autoplay',
  'controls',
  'language',
  'muted',
  'logger',
  'loop',
  'aspectRatio',
  'playsinline',
  ...additionalProps,
]);

export { withProviderContext as w };
