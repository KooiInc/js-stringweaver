import {
  append, getStringValue, format, indexOf, insert, isNumber,
  parseCamelcase, parseKebabCase, parseSnakeCase, prefix,
  replaceWords, trim, trimAll, truncate, ucFirst, wordsFirstUp,
} from "./instanceMethods.js";

import {
  capitalizerFactory, cloneInstance, enclose, encloseFactory,
  getTraps, maybeInjectCustomMethods, customMethods } from "./helpers.js";

export default instanceCreator;

function instanceCreator({initialstring} = {}) {
  let customStringProperties = {};
  let instance = new Proxy(customStringProperties, getTraps({maybeRevalue}));
  let actualValue = getStringValue(initialstring);
  let history = [actualValue];
  maybeInjectCustomMethods({customStringProperties, customMethods, instance, reValue});

  Object.defineProperties( customStringProperties, {
    // methods
    append: { value(...strings) { return reValue(append(actualValue, ...strings)); } },
    enclose: { value(start, end) { return reValue(enclose({value: actualValue, start, end})); } },
    format: { value(...tokens) { return reValue(format(actualValue, ...tokens)); } },
    indexOf: { value(str2Find, fromIndex) { return indexOf({actualValue, str2Find, last: false, fromIndex}); } },
    insert: { value({ values, at } = {}) { return reValue(insert({actualValue, values: [values].flat(), at })); } },
    interpolate: { value(...tokens) { return reValue(format(actualValue, ...tokens)); } },
    lastIndexOf: { value(str2Find, fromIndex) { return indexOf({actualValue, str2Find, last: true, fromIndex}); } },
    prefix: { value(...strings) { return reValue(prefix(actualValue, ...strings)); } },
    replaceWords: { value({caseSensitive = false, replacements = {}} = {}) {
      return reValue(replaceWords(actualValue, { replacements: replacements ?? {}, caseSensitive })); } },
    toString: { value() { return actualValue; } },
    valueOf: { value() { return actualValue; } },
    [Symbol.toPrimitive]: { value() { return actualValue; } },
    trim: {value(start, end) { return reValue(trim(actualValue, start, end)); } },
    truncate: { value({at, html = false, wordBoundary = false} = {}) {
      return reValue(truncate(actualValue, {at, html, wordBoundary})); } },
    undoLast: { value(nSteps) { return undoSteps(nSteps); } },

    // getters
    camelCase: { get() { return reValue(parseCamelcase(actualValue)); } },
    capitalize: { value: capitalizerFactory(actualValue, reValue) },
    clone: { get() { return cloneInstance(instance); } },
    empty: { get() { return actualValue.length < 1; } },
    firstUp: { get() { return reValue(ucFirst(actualValue)); } },
    history: { get() { return history; }, set(value) { history = value; } },
    kebabCase: { get() { return reValue(parseKebabCase(actualValue)); } },
    notEmpty: { get() { return actualValue.length < 1 ? undefined : instance; } },
    quote: { get() { return encloseFactory(reValue, actualValue); } },
    snakeCase: { get() { return reValue(parseSnakeCase(actualValue)); } },
    trimAll: { get() { return reValue(trimAll(actualValue)); } },
    trimAllKeepLF: { get() { return reValue(trimAll(actualValue, true)); } },
    undoAll: { get() { return undoAll(); } },
    undo: { get() { return undoLast(); } },
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
    wordsUCFirst: { get() { return reValue(wordsFirstUp(actualValue)); } },
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

  function maybeRevalue(key) {
    return typeof actualValue[key] === `function`
      ? function(...args) {
          const result = actualValue[key](...args);
          return typeof result === `string` ? reValue(result) : result;
      }
      : actualValue[key];
  }

  function reValue(result, push2History = true) {
    const changed = actualValue !== result;
    changed && push2History && history.push(result);
    actualValue = changed ? result : actualValue;
    return instance;
  }
}
