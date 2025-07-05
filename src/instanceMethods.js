import {
  isArrayOf,
  isNumber,
  quotGetters4Instance as quotGetters,
  getStringValue,
  escapeRE,
  customMethods,
  interpolate,
  clone } from "./genericMethods.js";

export {
  format,
  ucFirst,
  truncate,
  trimAll,
  replaceWords,
  indexOf,
  lastIndexOf,
  insert,
  append,
  isNumber,
  prefix,
  getStringValue,
  toCamelcase,
  wordsFirstUp,
  toDashedNotation,
  quotGetters,
  surroundWith,
  toSnakeCase,
  customMethods,
  clone,
  capitalizerFactory,
};

function checkAndRun(string, fn, or) {
  string = getStringValue(string);
  return string.length > 0 ? fn(string) : or || string;
}

function ucFirst(string) {
  return checkAndRun(string, () => `${string[0].toUpperCase()}${string.slice(1)}`);
}

function format(string, ...tokens) {
  return checkAndRun(string, () => `${interpolate(string, ...tokens)}`);
}

function surroundWith(string, start, end) {
  if (!start && !end) {
    return string;
  }
  [start, end] = isArrayOf(String, [start, end ?? ``]) ? [start, end] : [``, ``];
  return `${start}${string}${end || start}`;
}

function toDashedNotation(string) {
  return checkAndRun(string, () =>
    string
      .replace(/\s/g, '-')
      .replace(/[A-Z_]/g, a => `-${a.toLowerCase()}`)
      .replace(/[^a-z-]/g, ``)
      .replace(/-{2,}/g, `-`)
      .replace(/^-|-$/, ``)
  );
}

function toSnakeCase(string) {
  return checkAndRun(string, () =>
    string
      .replace(/\s/g, '_')
      .replace(/[A-Z]/g, a => `_${a.toLowerCase()}`)
      .replace(/[^a-z_]/g, ``)
      .replace(/_{2,}/g, `_`)
      .replace(/^_|_$/, ``)
  );
}

function wordsFirstUp(string) {
  return checkAndRun(string, () => [...string.toLowerCase()].slice(1).reduce( (acc, v) =>
      acc + ( !/\p{L}|[-']/u.test(acc.at(-1)) ? v.toUpperCase() : v.toLowerCase() ),
    string[0].toUpperCase()
  ));
}

function toCamelcase(string) {
  return checkAndRun(string, () =>
    string.toLowerCase()
      .trim()
      .split(/[- ]/)
      .filter(l => l && l.length > 0)
      .map( (str, i) => i > 0 && `${ucFirst(str)}`|| str)
      .join(``)
  );
}

function getWordBoundary(string) {
  const match = [...string.matchAll(/\p{Pe}|\p{Z}/gu)].at(-1);
  return match?.index ?? string.length;
}

function truncate(string, {at, html = false, wordBoundary = false} = {} ) {
  html = html?.constructor === Boolean && html || false;
  wordBoundary = wordBoundary?.constructor === Boolean && wordBoundary || false;
  return checkAndRun(string, () => {
    if (string.length <= at) { return string; }

    const subString = string.slice(0, at - 1);
    const endwith = html ? "&hellip;" : `...`;
    const boundary = wordBoundary
      ? getWordBoundary(subString)
      : subString.length;

    return (wordBoundary
      ? subString.slice(0, boundary+1).trim()
      : subString) + endwith;
    }
  );
}

function trimAll(string,  keepLines = false) {
  keepLines = keepLines?.constructor === Boolean && keepLines || false;
  return checkAndRun(string, () => {
    const lines = string.replace(/\n/gm, `#LF#`)
      .split(/#LF#/)
      .map(line => line.trim().replace(/\s{2,}/g, a => a[0]) );
    return keepLines
      ? lines.join(`#LF#`).replace(/#LF#/g, `\n`).trim()
      : lines.filter(l => l.length > 0).join(`\n`);
  });
}

function replaceWords(string, { replacements = {}, caseSensitive = false} = {}) {
  string = getStringValue(string);
  let replacements2Array = Object.entries(replacements).flat();
  const cando = isArrayOf(String, replacements2Array) && caseSensitive?.constructor === Boolean;
  const modifiers = `g${!caseSensitive ? 'i' : ''}`;

  if (!cando) { return string; }

  while (replacements2Array.length) {
    const [initial, replacement] = [replacements2Array.shift(), replacements2Array.shift()];
    const re = escapeRE(initial, modifiers);
    string = string.replace(re, replacement);
  }

  return string;
}

// SEE https://youtu.be/99Zacm7SsWQ?t=2101
function indexOf(string, findMe, fromIndex = 0) {
  string = getStringValue(string);
  fromIndex = isNumber(fromIndex) && fromIndex || 0;
  const index = string.indexOf(findMe, fromIndex || 0);
  return index < 0 ? undefined : index;
}

function lastIndexOf(string, findMe, beforeIndex = 0) {
  string = getStringValue(string);
  beforeIndex = isNumber(beforeIndex) && beforeIndex || string.length;
  const index = string.lastIndexOf(findMe, beforeIndex);
  return index < 0 ? undefined : index;
}

function insert(string, { value, values, at = 0 } = {}) {
  string = getStringValue(string);
  at = isNumber(at) && at || 0;
  const valuesMaybeValue = getStringValue(values);
  values = getStringValue(value).length
    ? value
    : valuesMaybeValue.length
    ? valuesMaybeValue
    : isArrayOf(String, values)
      ? values.map(v => getStringValue(v)).join(``)
      : [];

  return values.length <= 1
    ? string
    : string.length === 0
      ? `${values}${string}`
      : `${string.slice(0, at)}${values}${string.slice(at)}`;
}

function prefix(string, ...strings) {
  strings = isArrayOf(String, strings) && strings;
  return strings ? insert(getStringValue(string), {values: strings, at: 0}) : getStringValue(string);
}

function append(string, ...strings2Append) {
  strings2Append = isArrayOf(String, strings2Append) && strings2Append;

  if (strings2Append && strings2Append.length > 0) {
    return `${getStringValue(string)}`.concat(strings2Append.join(``))
  }

  return getStringValue(string);
}

function capitalizerFactory(instance, wrap) {
  return {
    get full() {
      return wrap(instance.value.toUpperCase());
    },
    get none() {
      return wrap(instance.value.toLowerCase());
    },
    get camel() {
      return wrap(toCamelcase(instance.value));
    },
    get snake() {
      return wrap(toSnakeCase(instance.value));
    },
    get first() {
      return wrap(ucFirst(instance.value));
    },
    get kebab() {
      return wrap(toDashedNotation(instance.value));
    },
    get words() {
      return wrap(wordsFirstUp(instance.value));
    },
    get dashed() {
      return wrap(toDashedNotation(instance.value));
    },
  }
}
