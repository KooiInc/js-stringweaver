import createInstance from "./instanceCreator.js";
import { createExtendedCTOR, resolveTemplateString, } from "./helpers.js";
const customMethods = Object.create(null, {});

export { customMethods, CustomStringConstructor, clone, };

createExtendedCTOR(CustomStringConstructor, customMethods);

function CustomStringConstructor(str, ...args) {
  const instance = createInstance({initialstring: resolveTemplateString(str, ...args)});
  Object.defineProperty( instance,
    `constructor`, { get() { return CustomStringConstructor; }, enumerable: false}
  );
  return Object.freeze(instance);
}

function clone(instance) {
  const newInstance = CustomStringConstructor(instance.value);
  newInstance.history = [...instance.history];
  return newInstance;
}
