import createInstance from "./src/extensions.js";
import { resolveTemplateString as resolveString, createExtendedCTOR } from "./src/genericMethods.js";

const customMethods = {};
const defaultStringCTOR = createExtendedCTOR(CustomStringConstructor, customMethods);

export {defaultStringCTOR as default, CustomStringConstructor};

function CustomStringConstructor(str, ...args) {
  return createInstance({initialstring: resolveString(str, ...args), customMethods});
}
