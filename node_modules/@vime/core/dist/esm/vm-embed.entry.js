import { r as registerInstance, c as createEvent, h, g as getElement } from './index-f5fd0f81.js';
import { c as appendParamsToURL, p as preconnect } from './network-1fe1550f.js';
import { c as withComponentRegistry, h as isString, e as isUndefined, x as isNull } from './withComponentRegistry-28311671.js';
import { L as LazyLoader } from './LazyLoader-295ab4d4.js';
import './support-b6811262.js';

const embedCss = ":host{z-index:var(--vm-media-z-index)}iframe{position:absolute;top:0;left:0;border:0;width:100%;height:100%;user-select:none}";

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try {
      step(generator.next(value));
    }
    catch (e) {
      reject(e);
    } }
    function rejected(value) { try {
      step(generator["throw"](value));
    }
    catch (e) {
      reject(e);
    } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
let idCount = 0;
const connected = new Set();
const Embed = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.vmEmbedSrcChange = createEvent(this, "vmEmbedSrcChange", 3);
    this.vmEmbedMessage = createEvent(this, "vmEmbedMessage", 3);
    this.vmEmbedLoaded = createEvent(this, "vmEmbedLoaded", 3);
    this.srcWithParams = '';
    this.hasEnteredViewport = false;
    /**
     * A URL that will load the external player and media (Eg: https://www.youtube.com/embed/DyTCOwB0DVw).
     */
    this.embedSrc = '';
    /**
     * The title of the current media so it can be set on the inner `iframe` for screen readers.
     */
    this.mediaTitle = '';
    /**
     * The parameters to pass to the embedded player which are appended to the `embedSrc` prop. These
     * can be passed in as a query string or object.
     */
    this.params = '';
    /**
     * A collection of URLs to that the browser should immediately start establishing a connection
     * with.
     */
    this.preconnections = [];
    withComponentRegistry(this);
  }
  onEmbedSrcChange() {
    this.srcWithParams =
      isString(this.embedSrc) && this.embedSrc.length > 0
        ? appendParamsToURL(this.embedSrc, this.params)
        : undefined;
  }
  srcWithParamsChange() {
    if (isUndefined(this.srcWithParams)) {
      this.vmEmbedSrcChange.emit(this.srcWithParams);
      return;
    }
    if (!this.hasEnteredViewport && !connected.has(this.embedSrc)) {
      if (preconnect(this.srcWithParams))
        connected.add(this.embedSrc);
    }
    this.vmEmbedSrcChange.emit(this.srcWithParams);
  }
  preconnectionsChange() {
    if (this.hasEnteredViewport) {
      return;
    }
    this.preconnections
      .filter(connection => !connected.has(connection))
      .forEach(connection => {
      if (preconnect(connection))
        connected.add(connection);
    });
  }
  connectedCallback() {
    this.lazyLoader = new LazyLoader(this.host, ['data-src'], el => {
      const src = el.getAttribute('data-src');
      el.removeAttribute('src');
      if (!isNull(src))
        el.setAttribute('src', src);
    });
    this.onEmbedSrcChange();
    this.genIframeId();
  }
  disconnectedCallback() {
    this.lazyLoader.destroy();
  }
  onWindowMessage(e) {
    var _a, _b, _c;
    const originMatches = e.source === ((_a = this.iframe) === null || _a === void 0 ? void 0 : _a.contentWindow) &&
      (!isString(this.origin) || this.origin === e.origin);
    if (!originMatches)
      return;
    const message = (_c = (_b = this.decoder) === null || _b === void 0 ? void 0 : _b.call(this, e.data)) !== null && _c !== void 0 ? _c : e.data;
    if (message)
      this.vmEmbedMessage.emit(message);
  }
  /**
   * Posts a message to the embedded media player.
   */
  postMessage(message, target) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      (_b = (_a = this.iframe) === null || _a === void 0 ? void 0 : _a.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify(message), target !== null && target !== void 0 ? target : '*');
    });
  }
  onLoad() {
    this.vmEmbedLoaded.emit();
  }
  genIframeId() {
    idCount += 1;
    this.id = `vm-iframe-${idCount}`;
  }
  render() {
    return (h("iframe", { id: this.id, class: "lazy", title: this.mediaTitle, "data-src": this.srcWithParams, allowFullScreen: true, allow: "autoplay; encrypted-media; picture-in-picture;", onLoad: this.onLoad.bind(this), ref: (el) => {
        this.iframe = el;
      } }));
  }
  get host() { return getElement(this); }
  static get watchers() { return {
    "embedSrc": ["onEmbedSrcChange"],
    "params": ["onEmbedSrcChange"],
    "srcWithParams": ["srcWithParamsChange"],
    "preconnections": ["preconnectionsChange"]
  }; }
};
Embed.style = embedCss;

export { Embed as vm_embed };
