/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon/request.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const iconFiles = new Map();
export const requestIcon = (url) => {
  if (iconFiles.has(url))
    return iconFiles.get(url);
  const request = fetch(url).then((response) => __awaiter(void 0, void 0, void 0, function* () {
    if (response.ok) {
      const div = document.createElement('div');
      div.innerHTML = yield response.text();
      const svg = div.firstElementChild;
      return {
        ok: response.ok,
        status: response.status,
        svg: svg && svg.tagName.toLowerCase() === 'svg' ? svg.outerHTML : '',
      };
    }
    return {
      ok: response.ok,
      status: response.status,
    };
  }));
  iconFiles.set(url, request);
  return request;
};
