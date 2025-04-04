import interpolate from "./Factories/interpolateFactory.js";

import {isArrayOf, isNumber, defineQuotingStyles} from "./genericMethods.js";
const quotingStyles = defineQuotingStyles();

export {
  format, ucFirst, truncate, extract, trimAll, 
  replaceWords, find, indexOf, lastIndexOf, insert,
  append, isNumber, prefix, getStringValue, toCamelcase,
  wordsFirstUp, toDashedNotation, quotGetters,
  surroundWith, defineQuotingStyles,
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
  return `${start}${string}${end || start}`;
}

function toDashedNotation(string) {
  return checkAndRun(string, () => 
    string
      .replace(/\s/g, '')
      .replace(/[A-Z]/g, a => `-${a.toLowerCase()}`)
      .replace(/^-|-$/, ``) 
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

function extract(str, start, end) { return str.slice(start || 0, end); }

function trimAll(string,  keepLines) {
  return checkAndRun(string, () => {
    let newString = ``;
    string = keepLines ? string.replace(/\n/g, `#LF#`) : string;
    const test = chr => /\s/.test(chr);
    for (let char of [...string]) {
      newString += !test(char) || (test(char) && !test(newString.slice(-2))) ? char : ``;
    }
    return keepLines
      ? newString.replace(/#LF#/g, `\n`)
      : newString.replace(/\n{2,}/g, `\n`);  
  });
}

function replaceWords(string, {replacements = [], caseSensitive = false} = {}) {
  return checkAndRun(string, () => {
    const evenLength =  replacements?.length % 2 === 0;
    const cando = Array.isArray(replacements) && !replacements.find( v =>
        Object.getPrototypeOf( v ?? -1)?.constructor !== String) &&
      caseSensitive?.constructor === Boolean;
    
    replacements = cando && !evenLength ? replacements.slice(0, -1) : replacements;
    
    if (cando) {
      while (replacements.length) {
        const [initial, replacement] = [replacements.shift(), replacements.shift()];
        const re = RegExp(initial, `g${!caseSensitive ? 'i' : ''}`);
        string = string.replace(re, replacement);
      }
    }
    
    return string;  
  });
}

function find(string, {terms, caseSensitive = false} = {}) {
  return checkAndRun(string, () => {
    const termsIsArrayOfStrings = isArrayOf(String, terms);
    const termsIsSingleString = terms?.constructor === String;
    const termsIsRE = terms?.constructor === RegExp;
    caseSensitive = caseSensitive?.constructor !== Boolean ? false : caseSensitive;
    terms = termsIsRE || termsIsArrayOfStrings ? terms : termsIsSingleString && [terms] || undefined;
    
    if (!terms) {
      return {hits: `n/a`, result: `please provide valid search terms`};
    }
    
    const xCase = !termsIsRE && (!caseSensitive ? `i` : ``) || ``;
    if (termsIsRE && !/g/.test(terms.flags)) { terms = RegExp(terms, `g${terms.flags}`); }
    const re = termsIsRE ? terms : RegExp(terms.join(`|`), `g${xCase}`);
    let result = [...string.matchAll(re)];
    const hits = result?.length;
    const foundAny = hits > 0;
    const caseSensitiveTxt = /i/.test(re.flags) ? `no` : `YES`;
    
    result = foundAny
      ? result.reduce( (acc, v) =>
        ({...acc, ...{ [v[0]]: { at: ( acc[v[0]]?.at || []).concat(v.index) } } } ),{})
      : {};
    return { searched4: termsIsRE ? terms.toString() : terms.join(`, `), caseSensitive: caseSensitiveTxt, foundAny, hits, result };  
  }, {hits: `n/a`, result: `input is empty`});
}

// SEE https://youtu.be/99Zacm7SsWQ?t=2101
function indexOf(string, findMe, fromIndex) {
  const index = (string?.value || string || ``).indexOf(findMe, fromIndex);
  return index < 0 ? undefined : index;
}

function lastIndexOf(string, findMe, beforeIndex) {
  const index = (string?.value || string || ``).lastIndexOf(findMe, beforeIndex);
  return index < 0 ? undefined : index;
}

function insert(string, { values, at = 0 } = {}) {
  string = string?.value || string || ``;
  at = at || 0;
  values = isArrayOf(String, values) ? values.join(``) : values?.constructor === String ?  values : ``;
  
  return values.length <= 1
    ? string
    : string.length === 0 
      ? `${values}${string}` 
      : `${string.slice(0, at)}${values}${string.slice(at)}`;
}

function prefix(string, ...strings) {
  string = getStringValue(string);
  strings = strings?.constructor === String && strings.length ? [strings] : isArrayOf(String, strings) && strings;
  return strings ? insert(string, {values: strings, at: 0}) : string;
}

function append(string, ...strings2Append) {
  string = getStringValue(string);
  strings2Append = isArrayOf(String, strings2Append) && strings2Append;
  return strings2Append ? `${string}`.concat(strings2Append.join(``)) : string;
}

function getStringValue(string) {
  return string?.value || (string?.constructor === String && string) || ``;
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
