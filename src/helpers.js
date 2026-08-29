import interpolate from "./factories/splatESBundle.js";
import createRegExp from "./Factories/regExpFromMultilineStringFactory.js";
import {default as randomString, uuid4}  from "./Factories/randomStringFactory.js";
import {parseCamelcase, parseKebabCase, parseSnakeCase, ucFirst, wordsFirstUp} from "./instanceMethods.js";
const deprecatedRE = /symbol|anchor|big|blink|bold|fixed|fontsize|fontcolor|italics|link|small|strike|sup|sub/i;
const customMethods = Object.create(null, {});
const quotingStyles = {
  backtick: ["`", "`"],
  parentheses: [`(`, `)`],
  curlyBrackets: [`{`, `}`],
  curlyDouble: [`“`, `”`],
  curlyDoubleInward: [`”`, `“`],
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
  custom(start, end) { return [start, end]; }
};
let CTOR;

export {
  capitalizerFactory, checkNotOfType, cloneInstance, createExtendedCTOR, createRegExp, customMethods,
  deprecatedRE, enclose, encloseFactory, getInfoPrefix, getStringValue, getTraps,
  getWrapperFunction /*for test*/, infoValue, interpolate, isArrayOf, isNumber, escapeRE,
  maybe, maybeInjectCustomMethods, randomString, resolveTemplateString, quotingStyles, uuid4,
};

function escapeRE(str2Escape) {
  return str2Escape.replace(/\p{S}|\p{P}/gu, a => `\\${a}`);
}

function getStringValue(string) {
  return string?.value || (typeof string === `string` && string) || ``;
}

function isArrayOf(type, value, StringsMayBeSWInstances = true) {
  return Array.isArray(value) && value.length > 0 &&
    !value.find(v => checkNotOfType(type, v, StringsMayBeSWInstances));
}

function isNumber(value) {
  return typeof value === `number` && !Number.isNaN(value) && value !== Infinity;
}

function infoValue(key, infoValue) {
  return `${key} (${infoValue})`;
}

function resolveTemplateString(str, ...args) {
  return str?.raw
    ? String.raw({ raw: str }, ...args)
    : getStringValue(str).length ? str : "";
}

function canWrapNative(key) {
  return !deprecatedRE.test(key) && Object.hasOwn(String.prototype, key);
}

function checkNotOfType(type, item, StringsMayBeSWInstances = true) {
  return !item?.constructor
    ? true
    : type === String && StringsMayBeSWInstances
      ? maybe(_ => item?.constructor !== CTOR).result && item?.constructor !== type
      : item?.constructor !== type;
}

function getTraps({maybeRevalueNative}) {
  return {
    get( target, key ) {
      switch(true) {
        case key === Symbol.for("type"): return `StringWeaver instance (Proxy)`;
        case Object.hasOwn(target, key): return target[key];
        case canWrapNative(String(key)): return maybeRevalueNative(key);
        default: return maybeRevalueNative(key);
      }
    },
  };
}

function cloneInstance(instance) {
  const newInstance = CTOR(instance.value);
  newInstance.history = [...instance.history];
  return newInstance;
}

function getWrapperFunction(wrap) {
  return wrap ?? function(me) { return me; };
}

function enclose({value, start, end}) {
  start = start?.value || start;
  end = end?.value || end;
  start = typeof start === 'string' && start?.length > 0 ? start : ``;
  end = typeof start === 'string' && end?.length > 0 ? end : start;
  return `${start}${value}${end}`;
}

function encloseFactory(reValue, value) {
  const methods = Object.create(null, {
    custom: { value(start, end) { return reValue(enclose({value, start, end})); } }
  });
  Object.entries(quotingStyles).filter(([_, value]) => Array.isArray(value))
    .forEach(([qs, [start, end]]) => {
      const prop2Set = { get() { return reValue(enclose({value, start, end})); } }
      return qs === `custom` ? false : Object.defineProperty( methods, qs, prop2Set );
    } );
  return methods;
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

function createExtendedCTOR(ctor) {
  const swInfo = () =>
    getSWInformation(`constructor,history,indexOf,toString,value,valueOf,empty`.split(`,`), customMethods);
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
        return ctor(str).format(...tokens);
      }
    },
    addCustom: {
      value( { name, method, enumerable = false, isGetter = false } = {} ) {
        if (ctor``[name]) {
          console.error(`addCustom: the property "${name}" exists and can not be redefined`);
          return `addCustom: the property "${name}" exists and can not be redefined`;
        }

        if (typeof name === `string` && typeof method === `function` && method.length > 0) {
          customMethods[name] = {method, enumerable, isGetter};
          return `addCustom: the ${isGetter ? `getter` : `method`} named "${name}" is added`;
        }
      }
    },
    info: { get() { return swInfo(); } },
    keys: {
      get() {
        return Object.keys(Object.getOwnPropertyDescriptors(ctor``))
          .sort( (a,b) => a.localeCompare(b) )
          .map(v => !/constructor|toString|valueOf/.test(v) && Object.hasOwn(customMethods, v) ? `${v} *custom*` : v);
      }
    },
    quoteInfo: { get() {
      return Object.keys(quotingStyles).filter(quot => !/^(re|remove)$/.test(quot)).map(quot => {
          if (quot === `custom`) { return `[instance].quote.custom(start:string, end:string)`; }
          const val = ctor(`[instance]`).quote[quot];
          return `[instance].quote.${quot} ( ${val} )`;
        }).sort((a, b) => a.localeCompare(b));
      }
    },
    uuid4: { get() { return ctor(uuid4()); } },
    randomString: {
      value: function({len, includeUppercase, includeNumbers, includeSymbols, startAlphabetic} = {}) {
        return ctor(
          randomString({len, includeUppercase, includeNumbers, includeSymbols, startAlphabetic})
        );
      }
    },
    regExp: { value: createRegExp }
  });

  return CTOR = ctor;
}

function maybeInjectCustomMethods(specs) {
  if (!specs || Object.keys(specs).length < 1 ) { return true; }

  const {customMethods, instance, reValue, customStringProperties} = specs;

  return Object.entries(customMethods).length < 1
    ? true
    : Object.entries(customMethods).forEach(([methodName, methodContainer]) => {
        const {enumerable, method, isGetter} = methodContainer;
        const descriptor = isGetter
          ? { get() { return reValue(method(instance).value); }, enumerable }
          : { value(...args) { return reValue(method(instance, ...args).value); }, enumerable };

        Object.defineProperty(customStringProperties, methodName, descriptor);
      });
}

function getSWInformation(notChainable, customMethods) {
  const firstLines = CTOR(getInfoPrefix());
  const plainValues = getPlainValues();

  return firstLines.split(/\n/)
    .concat(
      Object.entries(Object.getOwnPropertyDescriptors(firstLines))
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, descriptr]) => {
            const isChainable = !notChainable.find(k => k === key);
            const isGetter = Object.hasOwn(descriptr, `get`);
            const isMethod = Object.hasOwn(descriptr, `value`);
            const isNative = Object.hasOwn(String.prototype, key);
            const isPlainValue = !isNative && Object.hasOwn(plainValues, key);
            const custom = Object.hasOwn(customMethods, key) ? ` *custom*` : ``;
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

function maybe(/**type function*/test) {
  try {
    return {
      ok: true,
      result: test(),
    };
  }
  catch(e) {
    return {
      ok: false,
      result: undefined,
      errorMessage: e.message,
    }
  }
}

function getInfoPrefix() {
  return atob(
    `Rm9yIHRoZSByZWNvcmQ6CltjbV0gY2hhaW5hYmxlIGdldHRlcnMvbWV0aG9kcyBtb2RpZnkgdGhlIGluc3RhbmNlIHN0cmluZwpbY21d`+
    `IGluZGV4T2Ygb3ZlcnJpZGVzIHJldHVybnMgW3VuZGVmaW5lZF0gaWYgbm90aGluZyB3YXMgZm91bmQgKHNvIG9uZSBjYW4gdXNlIFtsYXN0`+
    `SV1pbmRleE9mKFtzb21lIHN0cmluZyB2YWx1ZV0pID8/IDAKW2NtXSBpbmNsdWRlcyBpbmZvcm1hdGlvbiBmb3IgY3VzdG9tIG1ldGhv`+
    `ZHMvZ2V0dGVycyBpZiBhcHBsaWNhYmxl`).replace(/\[cm]/g, `\u2714`);
}
