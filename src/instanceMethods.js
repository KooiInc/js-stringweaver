import interpolate from "./Factories/interpolateFactory.js";
import {isArrayOf, isNumber} from "./genericMethods.js";

export {
  format, ucFirst, truncate, extract, trimAll, escHTML, 
  replaceWords, find, indexOf, lastIndexOf, insert,
  append, casingFactory, quoteFactory, isNumber, prefix, };

function format(instance, ...tokens) { return`${interpolate(instance, ...tokens)}`; }

function ucFirst(str) { return `${str[0].toUpperCase()}${str.slice(1)}`; }

function toDashedNotation(str2Convert) {
  return  str2Convert
    .replace(/\s/g, '')
    .replace(/[A-Z]/g, a => `-${a.toLowerCase()}`)
    .replace(/^-|-$/, ``);
}

function wordsFirstUp(instance) {
  return [...instance.toLowerCase()].slice(1).reduce( (acc, v) =>
      acc + ( !/\p{L}|[-']/u.test(acc.at(-1)) ? v.toUpperCase() : v.toLowerCase() ),
    instance[0].toUpperCase()
  );
}

function toCamelcase(str2Convert) {
  return str2Convert.toLowerCase()
    .trim()
    .split(/[- ]/)
    .filter(l => l && l.length > 0)
    .map( (str, i) => i > 0 && `${ucFirst(str)}`|| str)
    .join(``);
}

function truncate(string, {at, html = false, wordBoundary = false} = {} ) {
  if (!string || string.constructor !== String || string.length <= at) { return string; }
  
  const subString = string.slice(0, at - 1);
  const endwith = html ? "&hellip;" : `...`;
  
  return (wordBoundary
    ? subString.slice(0, subString.lastIndexOf(" "))
    : subString) + endwith;
}

function extract(str, start, end) { return str.slice(start || 0, end); }

function trimAll(string,  keepLines) {
  let newString = ``;
  string = keepLines ? string.replace(/\n/g, `#LF#`) : string;
  const test = chr => /\s/.test(chr); 
  for (let char of [...string]) {
    newString += !test(char) || (test(char) && !test(newString.slice(-2))) ? char : ``; 
  }
  return keepLines 
    ? newString.replace(/#LF#/g, `\n`) 
    : newString.replace(/\n{2,}/g, `\n`);
}

function escHTML(str) {return str.replace(/</g, `&lt;`); }

function replaceWords(string, {replacements = [], caseSensitive = false} = {}) {
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
}

function find(string, {terms, caseSensitive = false} = {}) {
  const termsIsArrayOfStrings = isArrayOf(String, terms);
  const termsIsSingleString = terms?.constructor === String;
  const termsIsRE = terms?.constructor === RegExp;
  caseSensitive = caseSensitive?.constructor !== Boolean ? false : caseSensitive;
  terms = termsIsRE || termsIsArrayOfStrings ? terms : termsIsSingleString && [terms] || undefined;
  
  if (!terms) {
    return {hits: `n/a`, result: `please provide valid search terms`};
  }
  
  const xCase = !termsIsRE && (!caseSensitive ? `i` : ``) || ``;
  if (termsIsRE && !/g/.test(terms.flags)) { terms = RegExp(terms, `g${terms.flags}`); };
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
}

// SEE https://youtu.be/99Zacm7SsWQ?t=2101
function indexOf(instance, findMe, fromIndex) {
  const index = instance.indexOf(findMe, fromIndex);
  return index < 0 ? undefined : index;
}

function lastIndexOf(instance, findMe, beforeIndex) {
  const index = instance.lastIndexOf(findMe, beforeIndex);
  return index < 0 ? undefined : index;
}

function insert(instance, { values, at = 0 } = {}) {
  at = at || 0;
  values = isArrayOf(String, values) ? values.join(``) : values?.constructor === String ?  values : ``;
  const stringified = String(instance);
  
  return values.length <= 1
    ? stringified
    : `${stringified.slice(0, at)}${values}${stringified.slice(at)}`;
}

function prefix(instance, ...strings) {
  strings = strings?.constructor === String && strings.length ? [strings] : isArrayOf(String, strings) && strings;
  return strings ? insert(instance, {values: strings, at: 0}) : instance;
}

function append(string, ...strings2Append) {
  strings2Append = isArrayOf(String, strings2Append) && strings2Append;
  return strings2Append ? `${string}`.concat(strings2Append.join(``)) : string;
}

function casingFactory() {
  return {
    camel(string) {
      return toCamelcase(string);
    },
    wordsFirstUC(string) {
      return wordsFirstUp(string);
    },
    dashed(string) {
      return toDashedNotation(string);
    },
    firstUC(string) {
      return ucFirst(string);
    },
  };
}

function quoteFactory() {
  return {
    single(string) {
      return `'${string}'`;
    },
    double(string) {
      return `"${string}"`;
    },
    backtick(string) {
      return `\`${string}\``;
    },
    curlyDouble(string) {
      return `“${string}”`;
    },
    curlyDoubleUni(string) {
      return `“${string}“`;
    },
    curlySingle(string) {
      return `❛${string}❜`;
    },
    curlySingleUni(string) {
      return `❛${string}❛`;
    },
    pointyDouble(string) {
      return `«${string}»`;
    },
    pointySingle(string) {
      return `‹${string}›`;
    },
    curlyLHDouble(string) {
      return `„${string}”`;
    },
    curlyLHSingle(string) {
      return `‚${string}’`;
    },
    curlyLHDoubleUni(string) {
      return `„${string}“`;
    },
    curlyLHSingleUni(string) {
      return `‚${string}❛`;
    },
    remove(string) {
      return `${string.trim().replace(/^[^a-z0-9]|[^a-z0-9]$/gi, ``)}`;
    },
  };
}
