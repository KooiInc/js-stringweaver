import {
  format, ucFirst, truncate, extract, trimAll, escHTML,
  replaceWords, find, indexOf, lastIndexOf, insert,
  append, casingFactory, quoteFactory,
  prefix,
} from "./instanceMethods.js";

import {xString as $S, isNumber, copyObjectToUnEnumerable} from "./genericMethods.js";
const quots = Object.entries(quoteFactory());
const casing = Object.entries(casingFactory());
export default instanceCreator;

function instanceCreator({initialstring, customMethods, includeQuotCase = false} = {}) {
  let instance;
  let actualValue = initialstring?.constructor === String ? initialstring : ``;
  const history = [actualValue];
  const customStringExtensions = copyObjectToUnEnumerable({
    append(...strings) { return wrap(append(actualValue, ...strings)); },
    extract(from, to) { return wrap(extract(actualValue, from, to)); },
    find({terms, caseSensitive = false} = {}) { return find(actualValue, {terms, caseSensitive}); },
    format(...tokens) { return wrap(format(actualValue, ...tokens)); },
    indexOf(str) { return indexOf(actualValue, str); },
    interpolate(...tokens) { return wrap(format(actualValue, ...tokens)); },
    insert({values, at = 0} = {}) { return wrap(insert(actualValue, {values, at})); },
    lastIndexOf(str) { return lastIndexOf(actualValue, str); },
    prefix(...strings) { return wrap(prefix(actualValue, ...strings)); },
    prepend(...strings) { return wrap(prefix(actualValue, ...strings)); },
    replaceWords({replacements = [], caseSensitive = false} = {}) {
      return wrap(replaceWords(actualValue, {replacements, caseSensitive}));
    },
    toString() { return actualValue; },
    truncate({at, html = false, wordBoundary = false} = {}) {
      return wrap(truncate(actualValue, {at, html, wordBoundary})); 
    },
    valueOf() { return actualValue; },
    undoLast(nSteps) { return undoSteps(nSteps); },
    
    set value(value) { actualValue = value; },
    
    get clone() { return $S(actualValue); },
    get constructor() { return $S.constructor; },
    get history() { return history; },
    get trimAll() { return wrap(trimAll(actualValue)); },
    get trimAllKeepLF() { return wrap(trimAll(actualValue, true)); },
    get undoAll() { return undoAll(); },
    get undo() { return undoLast(); },
    get value() { return actualValue; },
    quote: {},
    case: {},
  });
  
  instance = new Proxy(customStringExtensions, getTraps(customStringExtensions));
  injectMethods(customStringExtensions, customMethods, instance);
  
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
      set( target, key, value ) {
        return key in extensions && Reflect.set(extensions, key, value);
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
  
  function injectMethods(customStringExtensions, customMethods, instance) {
    createQuotsAndCasing(customStringExtensions);
    Object.entries(customMethods).forEach(([methodName, methodContainer]) => {
      const {enumerable, method, isGetter} = methodContainer;
      const descriptor = isGetter
        ? { get() { return wrap(method(instance).value); }, enumerable }
        : { value(...args) { return wrap(method(instance, ...args).value); }, enumerable, };
      
      Object.defineProperty(customStringExtensions, methodName, descriptor);
    });
  }
  
  function createQuotsAndCasing(customStringExtensions) {
    quots.forEach(([key, method]) => {
      const getter = { get() { return wrap(method(actualValue)); } };
      Object.defineProperty(customStringExtensions.quote, key, getter);
      Object.defineProperty(customStringExtensions, `q${ucFirst(key)}`, getter);
    } );
    
    casing.forEach(([key, method]) => {
      const getter = { get() { return wrap(method(actualValue)); } };
      Object.defineProperty(customStringExtensions.case, key, getter);
      Object.defineProperty(customStringExtensions, `c${ucFirst(key)}`, getter);
    } );
  }
}
