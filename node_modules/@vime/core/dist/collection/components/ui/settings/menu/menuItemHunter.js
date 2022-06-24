import { isUndefined } from '../../../../utils/unit';
function unwrapSubmenu(el) {
  if (el.tagName.toLowerCase() !== 'vm-submenu')
    return el;
  const submenu = el;
  return submenu.shadowRoot.querySelector('vm-menu-item');
}
function unwrapRadioGroup(el) {
  var _a;
  if (el.tagName.toLowerCase() !== 'vm-menu-radio-group')
    return el;
  const radioGroup = el;
  const slot = radioGroup.shadowRoot.querySelector('slot');
  const assignedElements = Array.from((_a = slot === null || slot === void 0 ? void 0 : slot.assignedElements()) !== null && _a !== void 0 ? _a : []);
  return assignedElements
    .filter(radio => radio.tagName.toLowerCase() === 'vm-menu-radio')
    .map(radio => radio.shadowRoot.querySelector('vm-menu-item'));
}
export function menuItemHunter(assignedElements) {
  if (isUndefined(assignedElements))
    return [];
  const allowed = ['vm-menu-item', 'vm-menu-radio-group', 'vm-submenu'];
  return Array.from(assignedElements !== null && assignedElements !== void 0 ? assignedElements : [])
    .filter(el => allowed.includes(el.tagName.toLowerCase()))
    .map(el => unwrapSubmenu(el))
    .map(el => unwrapRadioGroup(el))
    .reduce((acc, val) => acc.concat(val), []);
}
