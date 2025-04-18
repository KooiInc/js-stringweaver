import {
  format, ucFirst, truncate, trimAll, replaceWords,
  indexOf, lastIndexOf, insert, append, prefix,
  getStringValue, quotGetters, surroundWith,
  toCamelcase, wordsFirstUp, toDashedNotation, toSnakeCase,
} from "./instanceMethods.js";

import {xString as $S, isNumber} from "./genericMethods.js";
export default instanceCreator;

function instanceCreator({initialstring, customMethods} = {}) {
  let customStringExtensions = { };
  let instance = new Proxy(customStringExtensions, getTraps(customStringExtensions));
  let actualValue = initialstring?.constructor === String ? initialstring : ``;
  let history = [actualValue];
  const descriptorProps = {configurable: false, enumerable: false};
  
  Object.defineProperties( customStringExtensions, {
    append: { ...descriptorProps, value(...strings) { return wrap(append(actualValue, ...strings)); } },
    enclose: { ...descriptorProps, value(start, end) { return wrap(surroundWith(actualValue, start, end)); } },
    format: { ...descriptorProps, value(...tokens) { return wrap(format(actualValue, ...tokens)); } },
    indexOf: { ...descriptorProps, value(str) { return indexOf(actualValue, str); } },
    interpolate: { ...descriptorProps, value(...tokens) { return wrap(format(actualValue, ...tokens)); } },
    insert: { ...descriptorProps, value({ value, values, at } = {}) { 
        return wrap(insert(actualValue, { value, values, at })); 
      } 
    },
    lastIndexOf: { ...descriptorProps, value(str) { return lastIndexOf(actualValue, str); } },
    prefix: { ...descriptorProps, value(...strings) { return wrap(prefix(actualValue, ...strings)); } },
    replaceWords: { ...descriptorProps, value({caseSensitive = false, replacements = {}} = {}) {
      return wrap(replaceWords(actualValue, {replacements, caseSensitive}));
    } },
    toString: { ...descriptorProps, value() { return actualValue; } },
    truncate: { ...descriptorProps, value({at, html = false, wordBoundary = false} = {}) {
      return wrap(truncate(actualValue, {at, html, wordBoundary})); } },
    valueOf: { ...descriptorProps, value() { return actualValue; } },
    undoLast: { ...descriptorProps, value(nSteps) { return undoSteps(nSteps); } },

    camelCase: { ...descriptorProps, get() { return wrap(toCamelcase(getStringValue(actualValue))); } },    
    clone: { ...descriptorProps, get() { return clone(); } },
    constructor: { ...descriptorProps, get() { return $S.constructor; } },
    firstUp: { ...descriptorProps, get() { return wrap(ucFirst(getStringValue(actualValue))); } },
    history: { ...descriptorProps, get() { return history; }, set(value) { history = value; } },
    empty: { ...descriptorProps, get() { return actualValue.length < 1; } },
    notEmpty: { ...descriptorProps, get() { return actualValue.length < 1 ? undefined: instance; } },
    kebabCase: { ...descriptorProps, get() { return wrap(toDashedNotation(getStringValue(actualValue))); } },
    quote: quotGetters(instance, wrap),
    snakeCase: { ...descriptorProps, get() { return wrap(toSnakeCase(getStringValue(actualValue))); } },
    trimAll: { ...descriptorProps, get() { return wrap(trimAll(actualValue)); } },
    trimAllKeepLF: { ...descriptorProps, get() { return wrap(trimAll(actualValue, true)); } },
    undoAll: { ...descriptorProps, get() { return undoAll(); } },
    undo: { ...descriptorProps, get() { return undoLast(); } },
    wordsUCFirst: { ...descriptorProps, get() { return wrap(wordsFirstUp(getStringValue(actualValue))); } },
    value: { ...descriptorProps, 
      get() { return actualValue; }, 
      set(value) {
        const nwValue = getStringValue(value);
        if (nwValue.length) {
          actualValue = nwValue;
          history.push(nwValue);  
        }
      }
    },
  });
  
  injectCustomMethods(customMethods);
  
  return Object.freeze(instance);
  
  function getTraps(extensions) {
    return {
      get( target, key ) {
        return key in extensions
          ? extensions[key]
          : key in String.prototype
            ? wrapNative(key)
            : undefined;
      },
    };
  }
  
  function clone() {
    const newInstance = $S(actualValue);
    newInstance.history = [...history];
    return newInstance;
  }
  
  function wrapNative(key) {
    return actualValue[key] instanceof Function
      ? function(...args) {
        const result = actualValue[key](...args); 
        return result?.constructor === String ? wrap(actualValue[key](...args)) : result; 
      } : actualValue[key];
  }
  
  function undoAll() {
    while(history.length > 1) { history.pop(); }
    actualValue = history.at(-1);
    return wrap(actualValue, false);
  }
  
  function undoSteps(steps) {
    if (!isNumber(steps)) {
      return wrap(actualValue, false); 
    }
    
    const historyLen = history.length;
    
    if (steps >= historyLen || steps < 1) {
      history = history.slice(0, 1);
      actualValue = history.at(-1); 
      return wrap(history.at(-1), false);  
    }
    
    history = history.slice(0, historyLen - steps);
    
    actualValue = history.at(-1);
    return wrap(actualValue, false);
  }
  
  function undoLast() {
    if (history.length === 1) {
      return wrap(history[0]);
    }
    history.pop();
    actualValue = history.at(-1);
    return wrap(actualValue, false);
  }
  
  function wrap(result, pushHistory = true) {
    const changed = actualValue !== result;
    changed && pushHistory && history.push(result);
    actualValue = result;
    return instance;
  }
  
  function injectCustomMethods(customMethods) {
    Object.entries(customMethods).forEach(([methodName, methodContainer]) => {
      const {enumerable, method, isGetter} = methodContainer;
      const descriptor = isGetter
        ? { get() { return wrap(method(instance).value); }, enumerable, configurable: false }
        : { value(...args) { return wrap(method(instance, ...args).value); }, enumerable, configurable: false };
      
      Object.defineProperty(customStringExtensions, methodName, descriptor);
    });
  }
}
