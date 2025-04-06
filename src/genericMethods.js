import xString from "../index.js";
import {default as randomString, uuid4}  from "./Factories/randomStringFactory.js";
import createRegExp from "./Factories/regExpFromMultilineStringFactory.js";

export {
  createExtendedCTOR, 
  resolveTemplateString, 
  xString, 
  isNumber, 
  isArrayOf,
  defineQuotingStyles,
};

function resolveTemplateString(str, ...args) {
  return str.raw ?  String.raw({ raw: str }, ...args) : str;
}

function isArrayOf(type, value) {
  return Array.isArray(value) && value.length > 0 && !value.find(v => v?.constructor !== type);
}

function isNumber(value) {
  return value?.constructor === Number && !Number.isNaN(value);
}

function isMutating(descriptor) {
  return /wrap\(|undo.*/i.test(descriptor.toString())
}

function getSWInformation() {
  const firstLine = xString`For the record:
    - chainable getters/methods modify the instance string
    - indexOf overrides deliver undefined when nothing was found (so one can use indexOf([some string value]) ?? 0`
    .trimAll;
  return [
    firstLine.value,
    ...Object.entries(Object.getOwnPropertyDescriptors(firstLine))
      .map(([key, descriptr]) => {
        if (key === `quote`) { return `quote (Object. Use [constructor].quoteInfo for keys)`; }
        return `${key} (${
          key === `clone`
            ? `chainable getter`
            : key in String.prototype 
              ? `method, String override` 
              : descriptr.value && descriptr.value.constructor === Function
                ? (isMutating(descriptr.value) ? `chainable method` : `method`)
                : descriptr.value
                  ? `property`
                  : descriptr.get ? (isMutating(descriptr.get) ? `chainable getter` : `getter`) : `-`})`; })
      .sort( (a,b) => a.localeCompare(b) )
  ];
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
      get() { return Object.keys(Object.getOwnPropertyDescriptors(xString``)).sort( (a,b) => a.localeCompare(b) ); }
    },
    quoteInfo: {
      get() {
        const qStyles = {...defineQuotingStyles()};
        delete qStyles.re;
        return Object.entries(qStyles)
          .sort( (a,b) => a[0].localeCompare(b[0]) )
          .reduce((acc, [k, v]) => ([...acc, `[instance].quote.${k} (${v.join(` [instance value] `)})`]), []);
      }
    },
    uuid4: {
      get() { return uuid4(); }
    },
    randomString: {
      value: randomString
    },
    regExp: { value: createRegExp }
  });
  
  return ctor;
}

function defineQuotingStyles() {
  // see https://en.wikipedia.org/wiki/Quotation_mark
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
    double: [`"`, `"`],
    guillemets: [`«`, `»`],
    guillemetsInward: [`»`, `«`],
    guillemetsSingle: [`‹`, `›`],
    guillemetsSingleInward: [`›`, `‹`],
    single: [`'`, `'`],
    squareBrackets: [`[`, `]`],
  };
  const regExpValues = Object.values(quots).map(v => v.map(v => `\\${v}`).join(``)).join('');
  quots.re = RegExp(`^[${regExpValues}]|[${regExpValues}]$`, "g");
  return quots;
}
