import {
  format, ucFirst, truncate, extract, trimAll, 
  replaceWords, find, indexOf, lastIndexOf, insert, append, 
  prefix, getStringValue, quotGetters, surroundWith,
  toCamelcase, wordsFirstUp, toDashedNotation,
} from "./instanceMethods.js";

import {xString as $S, isNumber} from "./genericMethods.js";
export default instanceCreator;

function instanceCreator({initialstring, customMethods} = {}) {
  let customStringExtensions = { };
  let instance = new Proxy(customStringExtensions, getTraps(customStringExtensions));
  let actualValue = initialstring?.constructor === String ? initialstring : ``;
  const history = [actualValue];
  const enumerable = false;
  
  Object.defineProperties(customStringExtensions, { 
    append: { value(...strings) { return wrap(append(actualValue, ...strings)); }, enumerable },
    enclose: { value(start, end) { return wrap(surroundWith(actualValue, start, end)); }, enumerable },
    extract: { value(from, to) { return wrap(extract(actualValue, from, to)); }, enumerable },
    find: { value({terms, caseSensitive = false} = {}) { return find(actualValue, {terms, caseSensitive}); }, enumerable },
    format: { value(...tokens) { return wrap(format(actualValue, ...tokens)); }, enumerable },
    indexOf: { value(str) { return indexOf(actualValue, str); }, enumerable },
    interpolate: { value(...tokens) { return wrap(format(actualValue, ...tokens)); }, enumerable },
    insert: { value({ values, at = 0} = {}) { return wrap(insert(actualValue, { values, at})); }, enumerable },
    lastIndexOf: { value(str) { return lastIndexOf(actualValue, str); }, enumerable },
    prefix: { value(...strings) { return wrap(prefix(actualValue, ...strings)); }, enumerable },
    replaceWords: { value({replacements = [], caseSensitive = false} = {}) {
      return wrap(replaceWords(actualValue, {replacements, caseSensitive}));
    }, enumerable },
    toString: { value() { return actualValue; }, enumerable },
    truncate: { value({at, html = false, wordBoundary = false} = {}) {
      return wrap(truncate(actualValue, {at, html, wordBoundary})); }, enumerable },
    valueOf: { value() { return actualValue; }, enumerable },
    undoLast: { value(nSteps) { return undoSteps(nSteps); }, enumerable },

    camelCase: { get() { return wrap(toCamelcase(getStringValue(actualValue))); }, enumerable },    
    clone: { get() { return $S(actualValue); }, enumerable },
    constructor: { get() { return $S.constructor; }, enumerable },
    kebabCase: { get() { return wrap(toDashedNotation(getStringValue(actualValue))); }, enumerable },
    firstUp: { get() { return wrap(ucFirst(getStringValue(actualValue))); }, enumerable },
    history: { get() { return history; }, enumerable },
    quote: quotGetters(instance, wrap),
    trimAll: { get() { return wrap(trimAll(actualValue)); }, enumerable },
    trimAllKeepLF: { get() { return wrap(trimAll(actualValue, true)); }, enumerable },
    undoAll: { get() { return undoAll(); }, enumerable },
    undo: { get() { return undoLast(); }, enumerable },
    wordsUCFirst: { get() { return wrap(wordsFirstUp(getStringValue(actualValue))); }, enumerable },
    value: { 
      get() { return actualValue; }, 
      set(value) { actualValue = getStringValue(value).length ? value : actualValue; }, enumerable },
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
    if (!isNumber(steps)) { return wrap(actualValue, false); }
    steps = history.length - steps;
    while(history.length > steps ) { history.pop(); }
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
    pushHistory && history.push(result);
    actualValue = result;
    return instance;
  }
  
  function injectCustomMethods(customMethods) {
    Object.entries(customMethods).forEach(([methodName, methodContainer]) => {
      const {enumerable, method, isGetter} = methodContainer;
      const descriptor = isGetter
        ? { get() { return wrap(method(instance).value); }, enumerable }
        : { value(...args) { return wrap(method(instance, ...args).value); }, enumerable, };
      
      Object.defineProperty(customStringExtensions, methodName, descriptor);
    });
  }
}
