import createInstance from "./instanceCreator.js";
import { createExtendedCTOR, resolveTemplateString, } from "./helpers.js";
const customMethods = Object.create(null, {});
createExtendedCTOR(CustomStringConstructor, customMethods);

export { customMethods, CustomStringConstructor, };

function CustomStringConstructor(str, ...args) {
  const instance = createInstance({initialstring: resolveTemplateString(str, ...args)});
  Object.defineProperty( instance,
    `constructor`, { get() { return CustomStringConstructor; }, enumerable: false}
  );
  return Object.freeze(instance);
}
