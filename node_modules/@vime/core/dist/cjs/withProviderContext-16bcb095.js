'use strict';

const withPlayerContext = require('./withPlayerContext-77ea833f.js');

const withProviderContext = (provider, additionalProps = []) => withPlayerContext.withPlayerContext(provider, [
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

exports.withProviderContext = withProviderContext;
