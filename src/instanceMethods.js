import interpolate from "./Factories/interpolateFactory.js";

import {isArrayOf, isNumber, defineQuotingStyles, getStringValue, escapeRE} from "./genericMethods.js";
const quotingStyles = defineQuotingStyles();

export {
  format, ucFirst, truncate, trimAll, replaceWords,
  indexOf, lastIndexOf, insert, append,
  isNumber, prefix, getStringValue, toCamelcase,
  wordsFirstUp, toDashedNotation, quotGetters,
  surroundWith, defineQuotingStyles, toSnakeCase,
};

function checkAndRun(string, fn, or) {
  string = getStringValue(string);
  return string.length > 0 ? fn(string) : or || string;
}

function format(string, ...tokens) {
  return checkAndRun(string, () => `${interpolate(string, ...tokens)}`); 
}

function ucFirst(string) {
  return checkAndRun(string, () => `${string[0].toUpperCase()}${string.slice(1)}`); 
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
      .replace(/\s/g, '')
      .replace(/[A-Z]/g, a => `-${a.toLowerCase()}`)
      .replace(/-{2,}/g, `-`)
      .replace(/[^a-z-]/g, ``)
      .replace(/^-|-$/, ``)
  );
}

function toSnakeCase(string) {
  return checkAndRun(string, () =>
    string
      .replace(/\s/g, '')
      .replace(/[A-Z]/g, a => `_${a.toLowerCase()}`)
      .replace(/_{2,}/g, `_`)
      .replace(/[^a-z_]/g, ``)
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

function truncate(string, {at, html = false, wordBoundary = false} = {} ) {
  return checkAndRun(string, () => {
    if (string.length <= at) { return string; }
    
    const subString = string.slice(0, at - 1);
    const endwith = html ? "&hellip;" : `...`;
    
    return (wordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString) + endwith; 
    }
  );
}

function trimAll(string,  keepLines) {
  return checkAndRun(string, () => {
    const lines = string
      .split(/\n/)
      .map(line => line.trim().replace(/\s{2,}/g, ` `));
    return keepLines ? lines.join('\n') : lines.filter(l => l.length > 0).join(`\n`);
  });
}

function replaceWords(string, { replacements = {}, caseSensitive = false} = {}) {
  string = getStringValue(string);
  let replacements2Array = Object.entries(replacements).flat();
  const cando = isArrayOf(String, replacements2Array) && caseSensitive?.constructor === Boolean;
  const modifiers = `g${!caseSensitive ? 'i' : ''}`;
  
  if (cando) {
    replacements2Array = replacements2Array.map(v => getStringValue(v)).filter(v => replacements2Array.length > 0);
    
    if (replacements2Array.length) {
      while (replacements2Array.length) {
        const [initial, replacement] = [replacements2Array.shift(), replacements2Array.shift()];
        const re = escapeRE(initial, modifiers);
        string = string.replace(re, replacement);
      }
    }
  }
  
  return string;
}

// SEE https://youtu.be/99Zacm7SsWQ?t=2101
function indexOf(string, findMe, fromIndex) {
  string = getStringValue(string);
  fromIndex = isNumber(fromIndex) ? fromIndex : 0;
  const index = string.indexOf(findMe, fromIndex || 0);
  return index < 0 ? undefined : index;  
}

function lastIndexOf(string, findMe, beforeIndex) {
  string = getStringValue(string);
  beforeIndex = isNumber(beforeIndex) ? beforeIndex : string.length;
  const index = string.lastIndexOf(findMe, beforeIndex);
  return index < 0 ? undefined : index;
}

function insert(string, { value, values, at = 0 } = {}) {
  string = getStringValue(string);
  at = isNumber(at) ? at : 0;
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

function quotGetters(instance, wrap) {
  return { 
    value: {
      get backtick() { return instance.enclose(...quotingStyles.backtick); },
      get bracket() { return instance.enclose(...quotingStyles.bracket); },
      get curlyDouble() { return instance.enclose(...quotingStyles.curlyDouble); },
      get curlyDoubleInward() { return instance.enclose(...quotingStyles.curlyDoubleInward); },
      get curlyDoubleEqual() { return instance.enclose(...quotingStyles.curlyDoubleEqual); },
      get curlyLHDoubleInward() { return instance.enclose(...quotingStyles.curlyLHDoubleInward); },
      get curlyLHSingle() { return instance.enclose(...quotingStyles.curlyLHSingle); },
      get curlyLHSingleInward() { return instance.enclose(...quotingStyles.curlyLHSingleInward); },
      get curlySingle() { return instance.enclose(...quotingStyles.curlySingle); },
      get curlySingleEqual() { return instance.enclose(...quotingStyles.curlySingleEqual); },
      get curlySingleInward() { return instance.enclose(...quotingStyles.curlySingleInward); },
      custom(start, end) { return instance.enclose(...[start, end ?? start]); },
      get double() { return instance.enclose(...quotingStyles.double);  },
      get guillemets() { return instance.enclose(...quotingStyles.guillemets); },
      get guillemetsInward() { return instance.enclose(...quotingStyles.guillemetsInward); },
      get guillemetsSingle() { return instance.enclose(...quotingStyles.guillemetsSingle); },
      get guillemetsSingleInward() { return instance.enclose(...quotingStyles.guillemetsSingleInward); },
      get remove() { return wrap(`${instance.value.replace(quotingStyles.re, ``)}`); },
      get single() { return instance.enclose(...quotingStyles.single); },
      get squareBrackets() { return instance.enclose(...quotingStyles.squareBrackets); },
    }, 
    enumerable: false 
  };
}
