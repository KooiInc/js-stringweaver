import xString, {CustomStringConstructor, customMethods} from "../index.js";
import {default as randomString, uuid4}  from "./Factories/randomStringFactory.js";
import createRegExp from "./Factories/regExpFromMultilineStringFactory.js";

export {
  createExtendedCTOR, 
  resolveTemplateString, 
  xString, 
  isNumber, 
  isArrayOf,
  defineQuotingStyles,
  getStringValue,
  escapeRE,
};

const immutables =  `constructor,history,indexOf,toString,value,valueOf`.split(`,`);

function resolveTemplateString(str, ...args) {
  return str?.raw
      ? String.raw({ raw: str }, ...args)
      :  getStringValue(str).length ? str : "";
}

function getStringValue(string) {
  return string?.value || (string?.constructor === String && string) || ``;
}

function checkType(type, item, includeInstances) {
  return type === String && includeInstances
    ? item?.constructor !== CustomStringConstructor && item?.constructor !== type
    : item?.constructor !== type;
}

function isArrayOf(type, value, includeInstances = true) {
  return Array.isArray(value) && value.length > 0 && !value.find(v => checkType(type, v, includeInstances));
}

function isNumber(value) {
  return value?.constructor === Number && !Number.isNaN(value);
}

function getSWInformation() {
  const firstLines = xString(decode());
  return firstLines.value.split(/\n/).concat(
    Object.entries(Object.getOwnPropertyDescriptors(firstLines))
    .map(([key, descriptr]) => {
      if (key === `quote`) { return `quote (Object. See [constructor].quoteInfo)`; }
      const isChainable = !immutables.find(k => k === key);
      return `${key} (${
        key === `value` 
          ? `getter/setter`
          : key === `clone`
            ? `chainable getter`
            : key in String.prototype 
              ? `method (override)` 
              : descriptr.value && descriptr.value.constructor === Function
                ? (isChainable 
                  ? `chainable method${key in customMethods ? ` *custom*` : ``}` : `method`)
                : descriptr.value
                  ? `property`
                  : descriptr.get ? (isChainable 
                    ? `chainable getter${key in customMethods ? ` *custom*` : ``}` 
                    : `getter`) : `-`})`; })
    .sort( (a,b) => a.localeCompare(b) ) 
  );
}

function createExtendedCTOR(ctor, customMethods) {
  Object.defineProperties(ctor, {
    constructor: {
      get() { return ctor; },
      enumerable: false,
    },
    format: {
      value(str, ...tokens) {
        return xString(str).format(...tokens);
      }
    },
    addCustom: {
      value( { name, method, enumerable = false, isGetter = false } = {} ) {
        if (xString``[name]) {
          return console.error(`addCustom: the property "${name}" exists and can not be redefined`);
        }
        if (name?.constructor === String && method?.constructor === Function && method.length > 0) {
          customMethods[name] = {method, enumerable, isGetter};
        }
      }
    },
    info: {
      get() { return getSWInformation(); }
    },
    keys: {
      get() { 
        return Object.keys(Object.getOwnPropertyDescriptors(xString``)).sort( (a,b) => a.localeCompare(b) )
          .map(v => !/constructor|toString|valueOf/.test(v) && v in customMethods ? `${v} *custom*` : v); 
      }
    },
    quoteInfo: {
      get() {
        const qStyles = {...defineQuotingStyles()};
        delete qStyles.re;
        return Object.entries(qStyles)
          .sort( (a,b) => a[0].localeCompare(b[0]) )
          .reduce((acc, [k, v]) => {
            const val = v.constructor === Function ? `(start:string[, end:string])` : ` (${v.join(` [instance value] `)})`;
            return [...acc, `[instance].quote.${k}${val}`];
          }, []);
      }
    },
    uuid4: {
      get() { return uuid4(); }
    },
    randomString: {
      value: function({len, includeUppercase, includeNumbers, includeSymbols, startAlphabetic} = {}) {
        return xString(randomString({len, includeUppercase, includeNumbers, includeSymbols, startAlphabetic})); 
      }
    },
    regExp: { value: createRegExp }
  });
  
  return ctor;
}

function escapeRE(reString, modifiers) {
  return new RegExp(reString.replace(/\p{S}|\p{P}/gu, a => `\\${a}`), modifiers);
}

function decode() {
  return atob`Rm9yIHRoZSByZWNvcmQ6CltjbV0gY2hhaW5hYmxlIGdldHRlcnMvbWV0aG9kcyBtb2RpZnkgdGhlIGluc3RhbmNlIHN0cmluZwpbY21dIGluZGV4T2Ygb3ZlcnJpZGVzIHJldHVybiBbdW5kZWZpbmVkXSBpZiBub3RoaW5nIHdhcyBmb3VuZCAoc28gb25lIGNhbiB1c2UgW2xhc3RJXWluZGV4T2YoW3NvbWUgc3RyaW5nIHZhbHVlXSkgPz8gMApbY21dIGluY2x1ZGVzIGluZm9ybWF0aW9uIGZvciBjdXN0b20gbWV0aG9kcy9nZXR0ZXJzIGlmIGFwcGxpY2FibGU=`.replace(/\[cm\]/g, `\u2714`);
}

function defineQuotingStyles() {
  // see https://en.wikipedia.org/wiki/Quotation_mark
  const custom = (start, end) => {
    start = getStringValue(start);
    end = getStringValue(end);
    return [getStringValue(start), end.length ? end  : start]; 
  } 
  const quots = {
    backtick: ["`", "`"],
    bracket: [`{`, `}`],
    curlyDoubleInward: [`”`, `“`],
    curlyDouble: [`“`, `”`],
    curlyDoubleEqual: [`“`, `“`],
    curlyLHDouble: [`„`, `”`],
    curlyLHDoubleInward: [`„`, `“`],
    curlyLHSingle: [`‚`, `’`],
    curlyLHSingleInward: [`‚`, `‘`],
    curlySingle: [`‛`, `’`],
    curlySingleEqual: [`‛`, `‛`],
    curlySingleInward: [`’`, `‛`],
    custom,
    double: [`"`, `"`],
    guillemets: [`«`, `»`],
    guillemetsInward: [`»`, `«`],
    guillemetsSingle: [`‹`, `›`],
    guillemetsSingleInward: [`›`, `‹`],
    single: [`'`, `'`],
    squareBrackets: [`[`, `]`],
  };
  const regExpValues = Object.values(quots).filter(v => Array.isArray(v)).map(v => v.map(v => `\\${v}`).join(``)).join('');
  quots.re = RegExp(`^[${regExpValues}]|[${regExpValues}]$`, "g");
  return quots;
}
