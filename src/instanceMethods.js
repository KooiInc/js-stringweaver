import { customMethods, } from "./helpers.js";

import {
  createRegExp as $RE, escapeRE, getStringValue, isArrayOf, interpolate, isNumber
} from "./helpers.js";

export {
  format,
  ucFirst,
  truncate,
  trimAll,
  replaceWords,
  indexOf,
  insert,
  append,
  isNumber,
  prefix,
  getStringValue,
  parseCamelcase,
  wordsFirstUp,
  parseKebabCase,
  parseSnakeCase,
  customMethods,
  trim,
};

function checkAndRun(string, fn, or) {
  string = getStringValue(string);
  return string.length > 0 ? fn(string) : or || string;
}

function format(string, ...tokens) {
  return checkAndRun(string, () => `${interpolate(string, ...tokens)}`);
}

function ucFirst(string) {
  return checkAndRun(string, () => `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`);
}

function parseKebabCase(str) {
  let result = ``;

  for (const s of [...str]) {
    switch(true) {
      case !/[a-z _-]/i.test(s): break;
      case /[ _]/.test(s): result += `-`; break;
      case s === s.toUpperCase(): result += `-${s.toLowerCase()}`; break;
      default: result += s;
    }
  }

  return result.replace(/-{2,}/g, `-`).replace(/^-|-$/g, ``);
}

function parseSnakeCase(str) {
  let result = ``;

  for (const s of [...str]) {
    switch(true) {
      case !/[a-z _-]/i.test(s): break;
      case /[ -]/.test(s): result += `_`; break;
      case s === s.toUpperCase(): result += `_${s.toLowerCase()}`; break;
      default: result += s;
    }
  }

  return result.replace(/_{2,}/g, `_`).replace(/^_|_$/g, ``);
}

function parseCamelcase(string) {
  return checkAndRun(string, () =>
    string.toLowerCase()
      .trim()
      .split(/[-\s]/)
      .filter(l => l && l.length > 0)
      .map( (str, i) => i > 0 && `${ucFirst(str)}` || str)
      .join(``)
  );
}

function wordsFirstUp(string) {
  const toUpperWords = checkAndRun(string, () => [...string.toLowerCase()].slice(1).reduce( (acc, v) =>
      acc + ( /\p{P}|\p{Zs}|\p{M}|\p{S}|[\^|`][^'?\W]/u.test(acc.at(-1)) ? v.toUpperCase() : v.toLowerCase() ),
      string[0].toUpperCase()
  ));

  return toUpperWords.replace(/\p{P}[A-Z]\s/gu, a => a.toLocaleLowerCase());
}

function trim(string, start, end) {
  return checkAndRun(string, () => {
    if (!end && !start) { return string.trim(); }

    end = $RE.escape(end || start);
    start = $RE.escape(start);

    return string.replace($RE`^(${start})+ | (${end})+$`.flags(`gm`), ``);
  });
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
  const cando = isArrayOf({type: String, value: replacements2Array}) && caseSensitive?.constructor === Boolean;
  const modifiers = `g${!caseSensitive ? 'i' : ''}`;

  if (!cando) { return string; }

  while (replacements2Array.length) {
    const [initial, replacement] = [replacements2Array.shift(), replacements2Array.shift()];
    const re = new RegExp(escapeRE(initial), modifiers);
    string = string.replace(re, replacement);
  }

  return string;
}

// SEE https://youtu.be/99Zacm7SsWQ?t=2101
function _indexOf(string, findMe, fromIndex = 0) {
  string = getStringValue(string);
  fromIndex = isNumber(fromIndex) && fromIndex || 0;
  const index = string.indexOf(findMe, fromIndex || 0);
  return index < 0 ? undefined : index;
}

function lastIndexOf(string, findMe, beforeIndex) {
  string = getStringValue(string);
  beforeIndex = isNumber(beforeIndex) && beforeIndex || string.length;
  const index = string.lastIndexOf(findMe, beforeIndex);
  return index < 0 ? undefined : index;
}

function indexOf({actualValue, str2Find, last, fromIndex}) {
  fromIndex = isNumber(fromIndex) ? fromIndex : !!last ? actualValue.length : 0;
  const indexMethod = !!last ? `lastIndexOf` : `indexOf`;
  const index = actualValue[indexMethod](String(str2Find), fromIndex);
  return index < 0 ? false : index;
}

function prefix(value, ...strings) {
  strings = strings.filter(s => (typeof s === `string`) || !!s?.value);
  return insert({actualValue: value, values: strings});
}

function insert({ actualValue, values, at } = {}) {
  at = typeof at === "number" && at || 0;
  values = [values].flat();
  actualValue = actualValue.slice(0, at) + values.join(``) + actualValue.slice(at);

  return actualValue;
}

function append(actualValue, ...strings2Append) {
  if (strings2Append.length > 0) {
    strings2Append = strings2Append?.filter(s => (typeof s === `string`) || !!s?.value);
    return `${getStringValue(actualValue)}`.concat(strings2Append.join(``));
  }

  return getStringValue(actualValue);
}
