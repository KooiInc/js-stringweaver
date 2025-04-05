import xString from "../index.js";
import {default as randomString, uuid4}  from "./Factories/randomStringFactory.js";
import createRegExp from "./Factories/regExpFromMultilineStringFactory.js";
export {
  createExtendedCTOR, 
  resolveTemplateString, 
  xString, 
  isNumber, 
  isArrayOf, 
};

function resolveTemplateString(str, ...args) {
  return str.raw ?  String.raw({ raw: str }, ...args) : str;
}

function isArrayOf(type, value) {
  return Array.isArray(value) && value.length > 0 && !value.find(v => v?.constructor !== type);
}

function isNumber(value) {
  return value?.constructor === Number && !Number.isNaN(value);
}

function createExtendedCTOR(ctor, customMethods) {
  Object.defineProperties(ctor, {
    constructor: {
      get() { return ctor; },
      enumerable: false,
    },
    format: {
      value(str, ...tokens) {
        return xString(str).format(...tokens);
      }
    },
    addCustom: {
      value( { name, method, enumerable = false, isGetter = false } = {} ) {
        if (name?.constructor === String && method?.constructor === Function && method.length > 0) {
          customMethods[name] = { method, enumerable, isGetter };
        }
      }
    },
    keys: {
      get() {
        return Object.keys({...Object.getOwnPropertyDescriptors(xString``)})
          .sort( (a,b) => a.localeCompare(b) );
      }
    },
    uuid4: {
      get() { return uuid4(); }
    },
    randomString: {
      value: randomString
    },
    regExp: { value: createRegExp }
  });
  
  return ctor;
}
