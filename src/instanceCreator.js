import {
  append, getStringValue, format, indexOf, insert, isNumber,
  lastIndexOf, parseCamelcase, parseKebabCase, parseSnakeCase, prefix, quotGetters,
  replaceWords, surroundWith, trim, trimAll, truncate, ucFirst, wordsFirstUp,
} from "./instanceMethods.js";

import { capitalizerFactory, cloneInstance, getTraps, maybeInjectCustomMethods, customMethods } from "./helpers.js";

export default instanceCreator;

function instanceCreator({initialstring} = {}) {
  let customStringProperties = new WeakRef(Object.create(null, { }));
  let instance = new Proxy(customStringProperties, getTraps({maybeRevalueNative}));
  let actualValue = getStringValue(initialstring);
  let history = [actualValue];
  maybeInjectCustomMethods({customStringProperties, customMethods, instance, reValue});

  Object.defineProperties( customStringProperties, {
    // methods
    append: { value(...strings) { return reValue(append(actualValue, ...strings)); } },
    enclose: { value(start, end) { return reValue(surroundWith(actualValue, start, end)); } },
    format: { value(...tokens) { return reValue(format(actualValue, ...tokens)); } },
    indexOf: { value(str) { return indexOf(actualValue, str); } },
    interpolate: { value(...tokens) { return reValue(format(actualValue, ...tokens)); } },
    insert: { value({ value, values, at } = {}) { return reValue(insert(actualValue, { value, values, at })); } },
    lastIndexOf: { value(str) { return lastIndexOf(actualValue, str); } },
    prefix: { value(...strings) { return reValue(prefix(actualValue, ...strings)); } },
    replaceWords: { value({caseSensitive = false, replacements = {}} = {}) {
      return reValue(replaceWords(actualValue, { replacements: replacements ?? {}, caseSensitive })); } },
    toString: { value() { return actualValue; } },
    trim: {value(start, end) { return reValue(trim(actualValue, start, end)); } },
    truncate: { value({at, html = false, wordBoundary = false} = {}) {
      return reValue(truncate(actualValue, {at, html, wordBoundary})); } },
    valueOf: { value() { return actualValue; } },
    undoLast: { value(nSteps) { return undoSteps(nSteps); } },

    // getters
    camelCase: { get() { return reValue(parseCamelcase(getStringValue(actualValue))); } },
    capitalize: { value: capitalizerFactory(instance, reValue) },
    clone: { get() { return cloneInstance(instance); } },
    firstUp: { get() { return reValue(ucFirst(getStringValue(actualValue))); } },
    history: { get() { return history; }, set(value) { history = value; } },
    empty: { get() { return actualValue.length < 1; } },
    notEmpty: { get() { return actualValue.length < 1 ? undefined : instance; } },
    kebabCase: { get() { return reValue(parseKebabCase(getStringValue(actualValue))); } },
    quote: quotGetters(instance, reValue),
    snakeCase: { get() { return reValue(parseSnakeCase(getStringValue(actualValue))); } },
    trimAll: { get() { return reValue(trimAll(actualValue)); } },
    trimAllKeepLF: { get() { return reValue(trimAll(actualValue, true)); } },
    undoAll: { get() { return undoAll(); } },
    undo: { get() { return undoLast(); } },
    wordsUCFirst: { get() { return reValue(wordsFirstUp(getStringValue(actualValue))); } },
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

  function undoAll() {
    while (history.length > 1) { history.pop(); }
    actualValue = history.at(-1);
    return reValue(actualValue, false);
  }

  function undoSteps(steps) {
    if (!isNumber(steps)) {
      return reValue(actualValue, false);
    }

    const historyLen = history.length;

    if (steps >= historyLen || steps < 1) {
      history = history.slice(0, 1);
      actualValue = history.at(-1);
      return reValue(history.at(-1), false);
    }

    history = history.slice(0, historyLen - steps);

    actualValue = history.at(-1);
    return reValue(actualValue, false);
  }

  function undoLast() {
    if (history.length === 1) {
      return reValue(history[0]);
    }

    history.pop();
    actualValue = history.at(-1);
    return reValue(actualValue, false);
  }

  function maybeRevalueNative(key) {
    return typeof actualValue[key] === `function`
      ? function(...args) {
        const result = actualValue[key](...args);
        return typeof result === `string` ? reValue(actualValue[key](...args)) : result;
      }
      : actualValue[key];
  }

  function reValue(result, push2History = true) {
    const changed = actualValue !== result;
    changed && push2History && history.push(result);
    actualValue = result;
    return instance;
  }
}
