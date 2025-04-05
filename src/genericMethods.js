import xString from "../index.js";
import {default as randomString, uuid4}  from "./Factories/randomStringFactory.js";
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
    }
  });
  
  return ctor;
}

function createRegExp(str, ...args) {
  try {
    return regExp(str, ...args);
  } catch (err) {
    args = args && args.map(arg => `\${${ Array.isArray(arg) ? JSON.stringify(arg) : arg }}`) || [];
    
    return `Error creating Regular Expression from string "${
      resolveTemplateString(str, ...args)}" \nRegExp error message: "${err.message}"`;
  }
}

function regExp(regexStr, ...args) {
  const flags = args.length && Array.isArray(args.slice(-1)) ? args.pop().join(``) : ``;
  
  return new RegExp(
    (args.length &&
      regexStr.raw.reduce( (a, v, i ) => a.concat(args[i-1] || ``).concat(v), ``) ||
      regexStr.raw.join(``))
      .split(`\n`)
      .map( line => line.replace(/\s|\/\/.*$/g, ``).trim().replace(/(@s!)/g, ` `) )
      .join(``), flags);
}
