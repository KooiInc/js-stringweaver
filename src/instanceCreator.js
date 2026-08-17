import {
  format,
  ucFirst,
  truncate,
  trimAll,
  replaceWords,
  indexOf,
  lastIndexOf,
  insert,
  append,
  prefix,
  getStringValue,
  quotGetters,
  surroundWith,
  parseCamelcase,
  wordsFirstUp,
  parseKebabCase,
  parseSnakeCase,
  customMethods,
  isNumber,
  clone,
  trim,
} from "./instanceMethods.js";

import { capitalizerFactory, deprecatedRE } from "./helpers.js";

export default instanceCreator;

function instanceCreator({initialstring} = {}) {
  let customStringExtensions = Object.create(null, { });
  let instance = new Proxy(customStringExtensions, getTraps(customStringExtensions));
  let actualValue = getStringValue(initialstring);
  let history = [actualValue];
  const defaultDescriptorProps = {configurable: false, enumerable: false};

  Object.defineProperties( customStringExtensions, {
    // methods
    append: { ...defaultDescriptorProps, value(...strings) { return wrap(append(actualValue, ...strings)); } },
    enclose: { ...defaultDescriptorProps, value(start, end) { return wrap(surroundWith(actualValue, start, end)); } },
    format: { ...defaultDescriptorProps, value(...tokens) { return wrap(format(actualValue, ...tokens)); } },
    indexOf: { ...defaultDescriptorProps, value(str) { return indexOf(actualValue, str); } },
    interpolate: { ...defaultDescriptorProps, value(...tokens) { return wrap(format(actualValue, ...tokens)); } },
    insert: { ...defaultDescriptorProps, value({ value, values, at } = {}) {
        return wrap(insert(actualValue, { value, values, at }));
      }
    },
    lastIndexOf: { ...defaultDescriptorProps, value(str) { return lastIndexOf(actualValue, str); } },
    prefix: { ...defaultDescriptorProps, value(...strings) { return wrap(prefix(actualValue, ...strings)); } },
    replaceWords: { ...defaultDescriptorProps, value({caseSensitive = false, replacements = {}} = {}) {
      return wrap(replaceWords(actualValue, { replacements: replacements ?? {}, caseSensitive }));
    } },
    toString: { ...defaultDescriptorProps, value() { return actualValue; } },
    trim: {...defaultDescriptorProps, value(start, end) { return wrap(trim(actualValue, start, end)); } },
    truncate: { ...defaultDescriptorProps, value({at, html = false, wordBoundary = false} = {}) {
      return wrap(truncate(actualValue, {at, html, wordBoundary})); } },
    valueOf: { ...defaultDescriptorProps, value() { return actualValue; } },
    undoLast: { ...defaultDescriptorProps, value(nSteps) { return undoSteps(nSteps); } },

    // getters
    camelCase: { ...defaultDescriptorProps, get() { return wrap(parseCamelcase(getStringValue(actualValue))); } },
    capitalize: { ...defaultDescriptorProps, value: capitalizerFactory(instance, wrap) },
    clone: { ...defaultDescriptorProps, get() { return clone(instance, customMethods); } },
    firstUp: { ...defaultDescriptorProps, get() { return wrap(ucFirst(getStringValue(actualValue))); } },
    history: { ...defaultDescriptorProps, get() { return history; }, set(value) { history = value; } },
    empty: { ...defaultDescriptorProps, get() { return actualValue.length < 1; } },
    notEmpty: { ...defaultDescriptorProps, get() { return actualValue.length < 1 ? undefined: instance; } },
    kebabCase: { ...defaultDescriptorProps, get() { return wrap(parseKebabCase(getStringValue(actualValue))); } },
    quote: quotGetters(instance, wrap),
    snakeCase: { ...defaultDescriptorProps, get() { return wrap(parseSnakeCase(getStringValue(actualValue))); } },
    trimAll: { ...defaultDescriptorProps, get() { return wrap(trimAll(actualValue)); } },
    trimAllKeepLF: { ...defaultDescriptorProps, get() { return wrap(trimAll(actualValue, true)); } },
    undoAll: { ...defaultDescriptorProps, get() { return undoAll(); } },
    undo: { ...defaultDescriptorProps, get() { return undoLast(); } },
    wordsUCFirst: { ...defaultDescriptorProps, get() { return wrap(wordsFirstUp(getStringValue(actualValue))); } },
    value: { ...defaultDescriptorProps,
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

  return instance;

  function getTraps(extensions) {
    return {
      get( target, key ) {
        return Object.hasOwn(extensions, key)
          ? extensions[key]
          : canWrapNative(String(key))
            ? wrapNative(key)
            : undefined;
      },
    };
  }

  function canWrapNative(key) {
    return !deprecatedRE.test(key)
      && key in String.prototype;
  }

  function wrapNative(key) {
    return actualValue[key] instanceof Function
      ? function(...args) {
        const result = actualValue[key](...args);
        return result?.constructor === String ? wrap(actualValue[key](...args)) : result;
      } : actualValue[key];
  }

  function undoAll() {
    while (history.length > 1) { history.pop(); }
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
      const configurable = false
      const descriptor = isGetter
        ? { get() { return wrap(method(instance).value); }, enumerable, configurable }
        : { value(...args) { return wrap(method(instance, ...args).value); }, enumerable, configurable };

      Object.defineProperty(customStringExtensions, methodName, descriptor);
    });
  }
}
