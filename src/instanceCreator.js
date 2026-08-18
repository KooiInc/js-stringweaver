import {
  append, clone, customMethods, getStringValue, format, indexOf, insert, isNumber,
  lastIndexOf, parseCamelcase, parseKebabCase, parseSnakeCase, prefix, quotGetters,
  replaceWords, surroundWith, trim, trimAll, truncate, ucFirst, wordsFirstUp,
} from "./instanceMethods.js";

import { capitalizerFactory, deprecatedRE, getTraps, maybeInjectCustomMethods } from "./helpers.js";

export default instanceCreator;

function instanceCreator({initialstring} = {}) {
  let customStringProperties = Object.create(null, { });
  let instance = new Proxy(customStringProperties, getTraps({customStringProperties, wrapNative}));
  let actualValue = getStringValue(initialstring);
  let history = [actualValue];
  maybeInjectCustomMethods({customStringProperties, customMethods, instance, wrap});

  Object.defineProperties( customStringProperties, {
    // methods
    append: { value(...strings) { return wrap(append(actualValue, ...strings)); } },
    enclose: { value(start, end) { return wrap(surroundWith(actualValue, start, end)); } },
    format: { value(...tokens) { return wrap(format(actualValue, ...tokens)); } },
    indexOf: { value(str) { return indexOf(actualValue, str); } },
    interpolate: { value(...tokens) { return wrap(format(actualValue, ...tokens)); } },
    insert: { value({ value, values, at } = {}) {
        return wrap(insert(actualValue, { value, values, at }));
      }
    },
    lastIndexOf: { value(str) { return lastIndexOf(actualValue, str); } },
    prefix: { value(...strings) { return wrap(prefix(actualValue, ...strings)); } },
    replaceWords: { value({caseSensitive = false, replacements = {}} = {}) {
      return wrap(replaceWords(actualValue, { replacements: replacements ?? {}, caseSensitive }));
    } },
    toString: { value() { return actualValue; } },
    trim: {value(start, end) { return wrap(trim(actualValue, start, end)); } },
    truncate: { value({at, html = false, wordBoundary = false} = {}) {
      return wrap(truncate(actualValue, {at, html, wordBoundary})); } },
    valueOf: { value() { return actualValue; } },
    undoLast: { value(nSteps) { return undoSteps(nSteps); } },

    // getters
    camelCase: { get() { return wrap(parseCamelcase(getStringValue(actualValue))); } },
    capitalize: { value: capitalizerFactory(instance, wrap) },
    clone: { get() { return clone(instance, customMethods); } },
    firstUp: { get() { return wrap(ucFirst(getStringValue(actualValue))); } },
    history: { get() { return history; }, set(value) { history = value; } },
    empty: { get() { return actualValue.length < 1; } },
    notEmpty: { get() { return actualValue.length < 1 ? undefined : instance; } },
    kebabCase: { get() { return wrap(parseKebabCase(getStringValue(actualValue))); } },
    quote: quotGetters(instance, wrap),
    snakeCase: { get() { return wrap(parseSnakeCase(getStringValue(actualValue))); } },
    trimAll: { get() { return wrap(trimAll(actualValue)); } },
    trimAllKeepLF: { get() { return wrap(trimAll(actualValue, true)); } },
    undoAll: { get() { return undoAll(); } },
    undo: { get() { return undoLast(); } },
    wordsUCFirst: { get() { return wrap(wordsFirstUp(getStringValue(actualValue))); } },
    value: {
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

  return instance;

  function wrapNative(key) {
    return typeof actualValue[key] === `function`
      ? function(...args) {
          const result = actualValue[key](...args);
          return result?.constructor === String ? wrap(actualValue[key](...args)) : result;
        }
      : actualValue[key];
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

  function wrap(result, push2History = true) {
    const changed = actualValue !== result;
    changed && push2History && history.push(result);
    actualValue = result;
    return instance;
  }
}
