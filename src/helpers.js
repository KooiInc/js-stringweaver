import interpolate from "./factories/splatESBundle.js";
import createRegExp from "./Factories/regExpFromMultilineStringFactory.js";
import {default as randomString, uuid4}  from "./Factories/randomStringFactory.js";
import {CustomStringConstructor} from "./CTORCreator.js";
import {parseCamelcase, parseKebabCase, parseSnakeCase, ucFirst, wordsFirstUp} from "./instanceMethods.js";
const quotingStyles = defineQuotingStyles();
const deprecatedRE = /symbol|anchor|big|blink|bold|fixed|fontsize|fontcolor|italics|link|small|strike|sup|sub/i

export {
  capitalizerFactory, createExtendedCTOR, createRegExp, defineQuotingStyles,
  deprecatedRE, getStringValue, escapeRE, infoValue, interpolate, isArrayOf, isNumber,
  randomString, resolveTemplateString, retrieveQuotInfo, quotGetters4Instance, uuid4,
};

function defineQuotingStyles() {
  // see https://en.wikipedia.org/wiki/Quotation_mark
  const quots = {
    backtick: ["`", "`"],
    parentheses: [`(`, `)`],
    curlyBrackets: [`{`, `}`],
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
  quots.re = escapeRE([...new Set(
    Object.values(quots)
      .filter(v => Array.isArray(v))
      .flat())].join(``), "g");
  return quots;
}

function escapeRE(reString, modifiers) {
  return new RegExp(reString.replace(/\p{S}|\p{P}/gu, a => `\\${a}`), modifiers);
}


function getStringValue(string) {
  return string?.value || (string?.constructor === String && string) || ``;
}

function isArrayOf(type, value, includeInstances = true) {
  return Array.isArray(value) && value.length > 0 &&
    !value.find(v => checkType(type, v, includeInstances));
}

function isNumber(value) {
  return value?.constructor === Number && !Number.isNaN(value);
}

function infoValue(key, infoValue) {
  return `${key} (${infoValue})`;
}

function checkType(type, item, includeInstances) {
  return type === String && includeInstances
    ? item?.constructor !== CustomStringConstructor && item?.constructor !== type
    : item?.constructor !== type;
}

function resolveTemplateString(str, ...args) {
  return str?.raw
    ? String.raw({ raw: str }, ...args)
    : getStringValue(str).length ? str : "";
}

function retrieveQuotInfo(instanceQuotGetters4Info, ctor) {
  return Object.entries(Object.getOwnPropertyDescriptors(instanceQuotGetters4Info.value))
    .sort( (a,b) => a[0].localeCompare(b[0]) )
    .reduce((acc, [k,]) => {
      if (k === `remove`) { return [...acc, `[instance].quote.remove (only predefined)`]; }
      if (k === `custom`) { return [...acc, `[instance].quote.custom(start:string, end:string)`]; }

      const val = ctor(`[instance]`).quote[k];
      return [...acc, `[instance].quote.${k} ( ${val} )`];
    }, []);
}

function quotGetters4Instance(instance, wrap) {
  wrap = wrap ?? function(me) { return me; };
  return {
    value: {
      get backtick() { return instance.enclose(...quotingStyles.backtick); },
      get parentheses() { return instance.enclose(...quotingStyles.parentheses); },
      get curlyBrackets() { return instance.enclose(...quotingStyles.curlyBrackets); },
      get curlyDouble() { return instance.enclose(...quotingStyles.curlyDouble); },
      get curlyDoubleInward() { return instance.enclose(...quotingStyles.curlyDoubleInward); },
      get curlyDoubleEqual() { return instance.enclose(...quotingStyles.curlyDoubleEqual); },
      get curlyLHDoubleInward() { return instance.enclose(...quotingStyles.curlyLHDoubleInward); },
      get curlyLHSingle() { return instance.enclose(...quotingStyles.curlyLHSingle); },
      get curlyLHSingleInward() { return instance.enclose(...quotingStyles.curlyLHSingleInward); },
      get curlySingle() { return instance.enclose(...quotingStyles.curlySingle); },
      get curlySingleEqual() { return instance.enclose(...quotingStyles.curlySingleEqual); },
      get curlySingleInward() { return instance.enclose(...quotingStyles.curlySingleInward); },
      get custom() { return (start, end) => instance.enclose(...[start, end ?? start]); },
      get double() { return instance.enclose(...quotingStyles.double);  },
      get guillemets() { return instance.enclose(...quotingStyles.guillemets); },
      get guillemetsInward() { return instance.enclose(...quotingStyles.guillemetsInward); },
      get guillemetsSingle() { return instance.enclose(...quotingStyles.guillemetsSingle); },
      get guillemetsSingleInward() { return instance.enclose(...quotingStyles.guillemetsSingleInward); },
      get remove() { return wrap(`${instance.value.replace(quotingStyles.re, ``)}`); },
      get single() { return instance.enclose(...quotingStyles.single); },
      get squareBrackets() { return instance.enclose(...quotingStyles.squareBrackets); },
    },
    enumerable: false,
    configurable: false,
  };
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
      return wrap(parseCamelcase(instance.value));
    },
    get snake() {
      return wrap(parseSnakeCase(instance.value));
    },
    get first() {
      return wrap(ucFirst(instance.value));
    },
    get kebab() {
      return wrap(parseKebabCase(instance.value));
    },
    get words() {
      return wrap(wordsFirstUp(instance.value));
    },
    get dashed() {
      return wrap(parseKebabCase(instance.value));
    },
  }
}

function createExtendedCTOR(ctor, customMethods) {
  const quoteInfo = retrieveQuotInfo(quotGetters4Instance(ctor()), ctor);
  const swInfo = getSWInformation(`constructor,history,indexOf,toString,value,valueOf,empty`.split(`,`), ctor);
  Symbol.toSB = Symbol(`toStringBuilder`);
  Object.defineProperty(
    String.prototype,
    Symbol.toSB, {
      get() { return ctor(this); },
      enumerable: false,
      configurable: false
    }
  );

  Object.defineProperties(ctor, {
    create: {
      get() { return ctor(); },
      enumerable: false
    },
    constructor: {
      get() { return ctor; },
      enumerable: false,
    },
    format: {
      value(str, ...tokens) {
        return CustomStringConstructor(str).format(...tokens);
      }
    },
    addCustom: {
      value( { name, method, enumerable = false, isGetter = false } = {} ) {
        if (CustomStringConstructor``[name]) {
          console.error(`addCustom: the property "${name}" exists and can not be redefined`);
          return `addCustom: the property "${name}" exists and can not be redefined`;
        }

        if (name?.constructor === String && method?.constructor === Function && method.length > 0) {
          customMethods[name] = {method, enumerable, isGetter};
          return `addCustom: the ${isGetter ? `getter` : `method`} named "${name}" is added`;
        }
      }
    },
    info: { value: swInfo, },
    keys: {
      get() {
        return Object.keys(Object.getOwnPropertyDescriptors(CustomStringConstructor``))
          .sort( (a,b) => a.localeCompare(b) )
          .map(v => !/constructor|toString|valueOf/.test(v) && v in customMethods ? `${v} *custom*` : v);
      }
    },
    quoteInfo: { value: quoteInfo },
    uuid4: { get() { return CustomStringConstructor(uuid4()); } },
    randomString: {
      value: function({len, includeUppercase, includeNumbers, includeSymbols, startAlphabetic} = {}) {
        return CustomStringConstructor(randomString({len, includeUppercase, includeNumbers, includeSymbols, startAlphabetic}));
      }
    },
    regExp: { value: createRegExp }
  });

  return;
}

function getSWInformation(notChainable, customMethods) {
  const firstLines = CustomStringConstructor(getInfoPrefix());
  const plainValues = getPlainValues();

  return firstLines.split(/\n/)
    .concat(
      Object.entries(Object.getOwnPropertyDescriptors(firstLines))
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, descriptr]) => {
            const isChainable = !notChainable.find(k => k === key);
            const isGetter = 'get' in descriptr;
            const isMethod = 'value' in descriptr;
            const isNative = key in String.prototype;
            const isPlainValue = !isNative && key in plainValues;
            const custom = key in customMethods ? ` *custom*` : ``;
            const getter = isGetter && isChainable ? `chainable getter${custom}` : `getter`;
            const method = isMethod && isChainable ? `chainable method${custom}` : `method`;
            const native = isNative && `${descriptr.get ? `getter` : `method`} (override)`;

            switch (true) {
              case isPlainValue: return infoValue(key, plainValues[key]);
              case isNative: return infoValue(key, native);
              case isMethod: return infoValue(key, method);
              case isGetter: return infoValue(key, getter);
            }
          }
        )
    );
}

function getPlainValues() {
  const capitalizerKeys = Object.keys(capitalizerFactory());
  return {
    value: `getter/setter`,
    clone: `chainable getter`,
    notEmpty: `chainable getter|undefined`,
    quote: `Object. See [constructor].quoteInfo`,
    capitalize: `getter. Object with chainable getters: [${capitalizerKeys.join(`, `)}]`,
  };
}

function getInfoPrefix() {
  return atob(
    `Rm9yIHRoZSByZWNvcmQ6CltjbV0gY2hhaW5hYmxlIGdldHRlcnMvbWV0aG9kcyBtb2RpZnkgdGhlIGluc3RhbmNlIHN0cmluZwpbY21d`+
    `IGluZGV4T2Ygb3ZlcnJpZGVzIHJldHVybnMgW3VuZGVmaW5lZF0gaWYgbm90aGluZyB3YXMgZm91bmQgKHNvIG9uZSBjYW4gdXNlIFtsYXN0`+
    `SV1pbmRleE9mKFtzb21lIHN0cmluZyB2YWx1ZV0pID8/IDAKW2NtXSBpbmNsdWRlcyBpbmZvcm1hdGlvbiBmb3IgY3VzdG9tIG1ldGhv`+
    `ZHMvZ2V0dGVycyBpZiBhcHBsaWNhYmxl`).replace(/\[cm]/g, `\u2714`);
}
