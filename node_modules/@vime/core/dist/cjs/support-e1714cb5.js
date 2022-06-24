'use strict';

const withComponentRegistry = require('./withComponentRegistry-90ec334c.js');

var _a, _b;
const IS_CLIENT = typeof window !== 'undefined';
const UA = IS_CLIENT ? (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent.toLowerCase() : '';
const IS_IOS = /iphone|ipad|ipod|ios|CriOS|FxiOS/.test(UA);
const IS_ANDROID = /android/.test(UA);
const IS_MOBILE = IS_CLIENT && (IS_IOS || IS_ANDROID);
const IS_IPHONE = IS_CLIENT && /(iPhone|iPod)/gi.test((_b = window.navigator) === null || _b === void 0 ? void 0 : _b.platform);
/firefox/.test(UA);
const IS_CHROME = IS_CLIENT && window.chrome;
IS_CLIENT &&
  !IS_CHROME &&
  (window.safari || IS_IOS || /(apple|safari)/.test(UA));
const onMobileChange = (callback) => {
  if (!IS_CLIENT || withComponentRegistry.isUndefined(window.ResizeObserver)) {
    callback(IS_MOBILE);
    return withComponentRegistry.noop;
  }
  function onResize() {
    callback(window.innerWidth <= 480 || IS_MOBILE);
  }
  callback(window.innerWidth <= 480 || IS_MOBILE);
  return withComponentRegistry.listen(window, 'resize', onResize);
};
const onTouchInputChange = (callback) => {
  if (!IS_CLIENT)
    return withComponentRegistry.noop;
  let lastTouchTime = 0;
  const offTouchListener = withComponentRegistry.listen(document, 'touchstart', () => {
    lastTouchTime = new Date().getTime();
    callback(true);
  }, true);
  const offMouseListener = withComponentRegistry.listen(document, 'mousemove', () => {
    // Filter emulated events coming from touch events
    if (new Date().getTime() - lastTouchTime < 500)
      return;
    callback(false);
  }, true);
  return () => {
    offTouchListener();
    offMouseListener();
  };
};
/**
 * Checks if the screen orientation can be changed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
const canRotateScreen = () => IS_CLIENT && window.screen.orientation && !!window.screen.orientation.lock;
/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the Chrome browser.
 *
 * @see  https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture
 */
const canUsePiPInChrome = () => {
  if (!IS_CLIENT)
    return false;
  const video = document.createElement('video');
  return !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
};
/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the desktop Safari browser, iOS Safari appears to "support" PiP through the check, however PiP
 * does not function.
 *
 * @see https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls
 */
const canUsePiPInSafari = () => {
  if (!IS_CLIENT)
    return false;
  const video = document.createElement('video');
  return (withComponentRegistry.isFunction(video.webkitSupportsPresentationMode) &&
    withComponentRegistry.isFunction(video.webkitSetPresentationMode) &&
    !IS_IPHONE);
};
// Checks if the native HTML5 video player can enter PIP.
const canUsePiP = () => canUsePiPInChrome() || canUsePiPInSafari();
/**
 * To detect autoplay, we create a video element and call play on it, if it is `paused` after
 * a `play()` call, autoplay is supported. Although this unintuitive, it works across browsers
 * and is currently the lightest way to detect autoplay without using a data source.
 *
 * @see https://github.com/ampproject/amphtml/blob/9bc8756536956780e249d895f3e1001acdee0bc0/src/utils/video.js#L25
 */
const canAutoplay = (muted = true, playsinline = true) => {
  if (!IS_CLIENT)
    return Promise.resolve(false);
  const video = document.createElement('video');
  if (muted) {
    video.setAttribute('muted', '');
    video.muted = true;
  }
  if (playsinline) {
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  }
  video.setAttribute('height', '0');
  video.setAttribute('width', '0');
  video.style.position = 'fixed';
  video.style.top = '0';
  video.style.width = '0';
  video.style.height = '0';
  video.style.opacity = '0';
  // Promise wrapped this way to catch both sync throws and async rejections.
  // More info: https://github.com/tc39/proposal-promise-try
  new Promise(resolve => resolve(video.play())).catch(withComponentRegistry.noop);
  return Promise.resolve(!video.paused);
};

exports.IS_CLIENT = IS_CLIENT;
exports.IS_IOS = IS_IOS;
exports.canAutoplay = canAutoplay;
exports.canRotateScreen = canRotateScreen;
exports.canUsePiP = canUsePiP;
exports.canUsePiPInChrome = canUsePiPInChrome;
exports.canUsePiPInSafari = canUsePiPInSafari;
exports.onMobileChange = onMobileChange;
exports.onTouchInputChange = onTouchInputChange;
