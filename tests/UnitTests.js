/* node:coverage disable */
/* For StringWeaver tests we are not interested in coverage for this file */
// noinspection RegExpRedundantEscape,JSValidateTypes

import assert from 'node:assert';
import {describe, it} from 'node:test';
import {default as $S, CustomStringConstructor} from "../index.js";
import {quotingStyles, isArrayOf, quotGetters4Instance} from "../src/genericMethods.js";

describe(`Basics constructor`, () => {
  describe(`Instantiation`, () => {
    it(`Constructor keys are not enumerable`, () => {
      const keys = Object.keys($S);
      assert.strictEqual(keys.length, 0);
    });

    it(`Constructor is extended`, () => {
      const extensions = Object.entries(Object.getOwnPropertyDescriptors($S)).reduce( (a, [k, v]) => {
        return {...a, ...{[k]: {isGetter: !!v.get, isValue: !!v.value}}}
      }, {});
      assert.deepStrictEqual(
        extensions, {
        "length": {
          "isGetter": false,
          "isValue": true
        },
        "name": {
          "isGetter": false,
          "isValue": true
        },
        "prototype": {
          "isGetter": false,
          "isValue": true
        },
        "create": {
          "isGetter": true,
          "isValue": false
        },
        "constructor": {
          "isGetter": true,
          "isValue": false
        },
        "format": {
          "isGetter": false,
          "isValue": true
        },
        "addCustom": {
          "isGetter": false,
          "isValue": true
        },
        "info": {
          "isGetter": true,
          "isValue": false
        },
        "keys": {
          "isGetter": true,
          "isValue": false
        },
        "quoteInfo": {
          "isGetter": true,
          "isValue": false
        },
        "uuid4": {
          "isGetter": true,
          "isValue": false
        },
        "randomString": {
          "isGetter": false,
          "isValue": true
        },
        "regExp": {
          "isGetter": false,
          "isValue": true
        }
      });
    });

    it(`Symbolic String extension in place`, () => {
        const test = `hello world`[Symbol.toSB];
        assert.strictEqual(test.constructor, CustomStringConstructor);
        assert.strictEqual(test.value, `hello world`);
    });

    it(`constructor can be used as regular function`, () => {
      const hi = $S(`Hello world`);
      assert.strictEqual(String(hi), `Hello world`);
    });

    it(`constructor can be used as tagged template function`, () => {
      const wrld = `world`;
      const hi = $S`Hello ${wrld}`;
      assert.strictEqual(String(hi), `Hello world`);
    });

    it(`constructor can be used from symbolic String extension`, () => {
      const wrld = `world`;
      const hi = `Hello ${wrld}`[Symbol.toSB];
      assert.strictEqual(String(hi), `Hello world`);
    });

    it(`$S creates an instance with chainable methods`, () => {
      const hi = $S`Hello world`;
      assert.strictEqual(String(hi), `Hello world`);
      hi.prefix(`=> `);
      assert.strictEqual(String(hi), `=> Hello world`);
    });

    it(`An instance (without custom getters/methods) has no keys`, () => {
      const hi = $S`Hello world`;
      assert.strictEqual(Object.keys(hi).length, 0);
      assert.strictEqual(JSON.stringify(hi), `{}`);
    });

    describe(`Always returns a string`, () => {
      it(`parameter null => empty string`, () => {
        assert.strictEqual($S(null).value, "");
      });

      it(`no parameter => empty string`, () => {
        assert.strictEqual($S().value, "");
      });

      it(`parameter Object => empty string`, () => {
        assert.strictEqual($S({a:1, b: 2}).value, "");
      });

      it(`parameter RegExp => empty string`, () => {
        assert.strictEqual($S(/[a-z]/g).value, "");
      });

      it(`parameter Map instance => empty string`, () => {
        assert.strictEqual($S(new Map()).value, "");
      });

      it(`parameter Array instance => empty string`, () => {
        assert.strictEqual($S([1,2,3]).value, "");
      });

      it(`parameter new String => empty string`, () => {
        assert.strictEqual($S(new String()).value, "");
      });
    });

    describe(`Instantiation by Symbolic String extensions`, () => {
      it(`creates an instance from a plain string`, () => {
        assert.strictEqual("Hello world"[Symbol.toSB].constructor, CustomStringConstructor);
        assert.strictEqual("Hello world"[Symbol.toSB].value, `Hello world`);
      });

      it(`creates an instance from a template string`, () => {
        const wrld = `world`;
        assert.strictEqual(`Hello ${wrld}`[Symbol.toSB].constructor, CustomStringConstructor);
        assert.strictEqual(`Hello ${wrld}`[Symbol.toSB].wordsUCFirst.value, `Hello World`);
      });

      it(`creates an instance from an empty string`, () => {
        assert.strictEqual(``[Symbol.toSB].constructor, CustomStringConstructor);
        assert.strictEqual(``[Symbol.toSB].append(`!!!`).value, `!!!`);
      });
    });
  });

  describe(`Constructor static methods`, () => {
    it(`$S.constructor as expected`, () => {
      assert.strictEqual($S.constructor, CustomStringConstructor);
    });

    it(`$S.keys delivers all keys`, () => {
      const keysShouldbe = [
        'append',
        'camelCase',
        'clone',
        'constructor',
        'empty',
        'enclose',
        'firstUp',
        'format',
        'history',
        'indexOf',
        'insert',
        'interpolate',
        'kebabCase',
        'lastIndexOf',
        'notEmpty',
        'prefix',
        'quote',
        'replaceWords',
        'snakeCase',
        'toString',
        'trimAll',
        'trimAllKeepLF',
        'truncate',
        'undo',
        'undoAll',
        'undoLast',
        'value',
        'valueOf',
        'wordsUCFirst'
      ];

      assert.deepStrictEqual($S.keys, keysShouldbe);
    });

    it(`$S.info delivers all keys with additional information`, () => {
      const keysShouldbe = [
        'append (chainable method)',
        'camelCase (chainable getter)',
        'clone (chainable getter)',
        'constructor (getter (override))',
        'empty (getter)',
        'enclose (chainable method)',
        'firstUp (chainable getter)',
        'format (chainable method)',
        'history (getter)',
        'indexOf (method (override))',
        'insert (chainable method)',
        'interpolate (chainable method)',
        'kebabCase (chainable getter)',
        'lastIndexOf (method (override))',
        'notEmpty (chainable getter|undefined)',
        'prefix (chainable method)',
        'quote (Object. See [constructor].quoteInfo)',
        'replaceWords (chainable method)',
        'snakeCase (chainable getter)',
        'toString (method (override))',
        'trimAll (chainable getter)',
        'trimAllKeepLF (chainable getter)',
        'truncate (chainable method)',
        'undo (chainable getter)',
        'undoAll (chainable getter)',
        'undoLast (chainable method)',
        'value (getter/setter)',
        'valueOf (method (override))',
        'wordsUCFirst (chainable getter)'
      ];
      const info = $S.info;
      // the first lines may vary and is not relevant for the test
      assert.deepStrictEqual(info.slice(info.findIndex(v => v.startsWith(`append`))), keysShouldbe);
    });

    it(`$S.keys for custom getter => *custom* displayed`, () => {
      $S.addCustom({
        name: `tested`,
        method: me => {return me.toUpperCase().quote.curlyDouble; },
        enumerable: true,
        isGetter: true});
      assert.strictEqual($S.keys.find(v => v.startsWith(`tested`)), `tested *custom*`, $S.keys);
    })

    it(`$S.keys.quoteInfo as expected`, () => {
      const shouldBe = [
        '[instance].quote.backtick (` [instance] `)',
        '[instance].quote.bracket ({ [instance] })',
        '[instance].quote.curlyDouble (“ [instance] ”)',
        '[instance].quote.curlyDoubleEqual (“ [instance] “)',
        '[instance].quote.curlyDoubleInward (” [instance] “)',
        '[instance].quote.curlyLHDoubleInward („ [instance] “)',
        '[instance].quote.curlyLHSingle (‚ [instance] ’)',
        '[instance].quote.curlyLHSingleInward (‚ [instance] ‘)',
        '[instance].quote.curlySingle (‛ [instance] ’)',
        '[instance].quote.curlySingleEqual (‛ [instance] ‛)',
        '[instance].quote.curlySingleInward (’ [instance] ‛)',
        '[instance].quote.custom(start:string, end:string)',
        '[instance].quote.double (" [instance] ")',
        '[instance].quote.guillemets (« [instance] »)',
        '[instance].quote.guillemetsInward (» [instance] «)',
        '[instance].quote.guillemetsSingle (‹ [instance] ›)',
        '[instance].quote.guillemetsSingleInward (› [instance] ‹)',
        '[instance].quote.remove (only predefined)',
        "[instance].quote.single (' [instance] ')",
        '[instance].quote.squareBrackets ([ [instance] ])' ];
      assert.deepStrictEqual($S.quoteInfo, shouldBe);
    });

    it(`$S.create getter delivers an instance with an empty string value`, () => {
      const hi = $S.create;
      assert.strictEqual(hi.value, ``);
    });

    it(`$S.create getter delivers an instance`, () => {
      const hi = $S.create.append(`Hello!`);
      assert.strictEqual(hi.value, `Hello!`);
    });

    it(`$S.addCustom getter enumerable works as expected`, () => {
      $S.addCustom({name: `upperQuoted`, method: me => {return me.toUpperCase().quote.curlyDouble; }, enumerable: true, isGetter: true});
      assert.strictEqual(Object.getOwnPropertyDescriptor($S`hi`, 'upperQuoted').enumerable, true);
      assert.strictEqual($S`Hello world`.upperQuoted.value, `“HELLO WORLD”`);
    });

    it(`$S.addCustom getter non enumerable works as expected`, () => {
      $S.addCustom({name: `lowerQuotSingle`, method: me => {return me.toLowerCase().quote.curlySingle; }, enumerable: false, isGetter: true});
      assert.strictEqual(Object.getOwnPropertyDescriptor($S`hi`, 'lowerQuotSingle').enumerable, false);
      assert.strictEqual($S`HELLO WORLD`.lowerQuotSingle.value, `‛hello world’`);
    });

    it(`$S.addCustom method works as expected`, () => {
      const ok = $S.addCustom({name: `surroundWithInvertedArrows`, method: (me, add) => { return me.prefix(`->`).append(add); }, enumerable: false});
      assert.strictEqual($S`HELLO WORLD`.surroundWithInvertedArrows(`<-`).value, `->HELLO WORLD<-`);
      assert.strictEqual(ok, `addCustom: the method named "surroundWithInvertedArrows" is added`);
    });

    it(`$S.addCustom already existing custom as expected`, () => {
      assert.strictEqual(
        $S.addCustom({name: `upperQuoted`, method: me => {return me.toUpperCase().quote.curlyDouble; }, enumerable: true, isGetter: true}),
        `addCustom: the property "upperQuoted" exists and can not be redefined`);
    });

    it(`$S.format works as expected`, () => {
      const mymy = $S.format(`hello {wrld}`, {wrld: `there - `}, {wrld: `world`});
      assert.strictEqual(mymy.value, `hello there - hello world`);
    });

    it(`$S.regExp (tagged template) as expected`, () => {
      const re = $S.regExp`
        [a-z] // only lowercase a-z
        | [0-3] // or numbers 0-3
        ${["g", "i"]} // globally case insensitive`;
      assert.strictEqual(re.valueOf().constructor, RegExp);
      assert.deepStrictEqual(re.re, /[a-z]|[0-3]/gi);
    });

    it(`$S.regExp flags as expected`, () => {
      const re = $S.regExp`
        [a-z] // only lowercase a-z
        | [0-3] // or numbers 0-3`.flags(`gim`);
      assert.strictEqual(re.valueOf().constructor, RegExp);
      assert.deepStrictEqual(re.re, /[a-z]|[0-3]/gim);
    });

    it(`$S.regExp flags chainability as expected`, () => {
      const re = $S.regExp`
        [a-z] // only lowercase a-z
        | [0-3] // or numbers 0-3`.flags(`g`).flags(`i`).flags(`m`);
      assert.strictEqual(re.valueOf().constructor, RegExp);
      assert.deepStrictEqual(re.re, /[a-z]|[0-3]/gim);
    });

    it(`$S.regExp remove flags (-r) as expected`, () => {
      const re = $S.regExp`
        [a-z] // only lowercase a-z
        | [0-3] // or numbers 0-3`.flags(`gim`);
      re.flags(`-r`);
      assert.strictEqual(re.valueOf().constructor, RegExp);
      assert.deepStrictEqual(re.re, /[a-z]|[0-3]/);
    });

    it(`$S.regExp change flags (-r|) as expected`, () => {
      const re = $S.regExp`
        [a-z] // only lowercase a-z
        | [0-3] // or numbers 0-3`.flags(`gim`);
      re.flags(`-r|iv`);
      assert.strictEqual(re.valueOf().constructor, RegExp);
      assert.deepStrictEqual(re.re, /[a-z]|[0-3]/iv);
    });

    it(`$S.regExp invalid ( /([a-z]/ ) throws an error`, () => {
      assert.throws( () => $S.regExp`
        ([a-z] // only lowercase a-z (a non terminated group)`,
        { name: /^SyntaxError$/,
          message: /^Invalid regular expression:/});
    });

    it(`$S.regExp.escape as expected`, () => {
      assert.strictEqual($S.regExp.escape(' '), `\\x20`);
    });

    it(`$S.uuid4 as expected`, () => {
      const uuid = $S.uuid4;
      const splitted = uuid.split(/-/);
      assert.strictEqual(splitted.length, 5);
      assert.strictEqual(splitted[2].startsWith(`4`), true);
      assert.strictEqual(splitted[0].length, 8);
      assert.strictEqual(splitted[1].length, 4);
      assert.strictEqual(splitted[2].length, 4);
      assert.strictEqual(splitted[3].length, 4);
      assert.strictEqual(splitted[4].length, 12);
      const contentOk = splitted.map(v => /[A-E0-9]/gi.test(v)).filter(v => v);
      assert.strictEqual(contentOk.length, 5);
    });

    it(`$S.randomString as expected`, () => {
      let rs = $S.randomString();
      assert.strictEqual(rs.length, 12, rs + `default len 12` );
      assert.strictEqual(/[a-z]/gi.test(rs), true, rs + `default a-zA-Z`);
      assert.strictEqual(/[0-9]/g.test(rs), false, rs + `default no numbers`);
      assert.strictEqual(/[!?@#$%^&*=+_;]/g.test(rs), false, rs + `default no symbols`);
      rs = $S.randomString({includeNumbers: true});
      assert.strictEqual(/[a-z0-9]/gi.test(rs), true, rs + `numbers`);
      rs = $S.randomString({startAlphabetic: true, includeNumbers: true});
      assert.strictEqual(/^[a-z]/i.test(rs), true, rs + `numbers + startalphabetic`);
      rs = $S.randomString({includeUppercase: false});
      assert.strictEqual(/[A-Z]/g.test(rs), false, rs + `no uppercase`);
      rs = $S.randomString({len: 24});
      assert.strictEqual(rs.length, 24, rs + `length 24`);
      rs = $S.randomString({includeNumbers: true, includeSymbols: true});
      assert.strictEqual(/[!?@#$%^&*=+_;-a-z0-9]/gi.test(rs), true, rs + `number+symbols`);
      rs = $S.randomString({includeSymbols: true});
      assert.strictEqual(!/[0-9]/gi.test(rs), true, rs + `not number but symbols`);
      assert.strictEqual(/[!?@#$%^&*=+_;-a-z]/g.test(rs), true, rs + `symbols yes`);
      rs = $S.randomString({includeSymbols: true, startAlphabetic: true});
      assert.strictEqual(/^[a-z]/i.test(rs), true, rs + `symbols, not numbers, startalphabetic`);
      rs = $S.randomString({includeUppercase: false, includeSymbols: true, startAlphabetic: true});
      assert.strictEqual(/^[a-z]/.test(rs), true, rs + `lowercase only, symbols, startalphabetic`);
    });
  });

  describe(`Miscellaneous`, () => {
    it(`isArrayOf (strings)`, () => {
      const arrOfString = [`a`, `b`];
      assert.strictEqual(isArrayOf(String, arrOfString), true);
    });

    it(`isArrayOf (Map)`, () => {
      const arrOfMaps = [new Map(), new Map()];
      assert.strictEqual(isArrayOf(Map, arrOfMaps), true);
    });

    it(`isArrayOf (numbers)`, () => {
      const arrOfNumbers = [1, 2, 3];
      assert.strictEqual(isArrayOf(Number, arrOfNumbers), true);
    });

    it(`isArrayOf (number, not all numbers)`, () => {
      const arrOfNumbers = [1, 2, `3`];
      assert.strictEqual(isArrayOf(Number, arrOfNumbers), false);
    });

    it(`non enumerable custom getter NOT in instance keys`, () => {
      assert.strictEqual(Object.keys($S``).find(v => v === `lowerQuotSingle`), undefined );
    });

    it(`custom enumerable getter in instance keys`, () => {
      assert.strictEqual(Object.keys($S``).find(v => v === `upperQuoted`), `upperQuoted` );
    });

    it(`quotGetters4Instance with dummy wrapper`, () => {
      const quotes4Instance = quotGetters4Instance($S``);
      assert.strictEqual(quotes4Instance.value.remove, ``);
    })
  });
});

describe(`Instance methods, setters & getters (alphabetically ordered)`, () => {
  it(`append (single string)`, () => {
    const hi = $S`Hello world`.append(` and hello!`);
    assert.strictEqual(hi.value, `Hello world and hello!`);
  });

  it(`append (multiple strings)`, () => {
    const hi = $S`Hello world`.append(` and hello`, ` to you too!`);
    assert.strictEqual(hi.value, `Hello world and hello to you too!`);
  });

  it(`append (no input) does nothing`, () => {
    const hi = $S`Hello world`.append();
    assert.strictEqual(hi.value, `Hello world`);
  });

  describe(`case`, () => {
    it(`camelCase`, () => {
      const hello = $S`Hello World`.camelCase;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`camelCase from dashed`, () => {
      const hello = $S`hello-world`.camelCase;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`camelCase /w multiple spaces`, () => {
      const hello = $S` hello    world   `.camelCase;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`camelCase /w multiple dashes`, () => {
      const hello = $S`-hello---world   `.camelCase;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`kebabCase regular`, () => {
      const hello = $S`helloWorld`.kebabCase;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebabCase /w numbers`, () => {
      const hello = $S`hello42World`.kebabCase;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebabCase /w spaces`, () => {
      const hello = $S`hello   World`.kebabCase;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebabCase /w diacriticals`, () => {
      const hello = $S`hello   Woërld`.kebabCase;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebabCase /w non alphabetic`, () => {
      const hello = $S`hello $#!  World!`.kebabCase;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`snakeCase regular`, () => {
      const hello = $S`helloWorld`.snakeCase;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snakeCase /w numbers`, () => {
      const hello = $S`hello42World`.snakeCase;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snakeCase /w spaces`, () => {
      const hello = $S`hello   World`.snakeCase;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snakeCase /w diacriticals`, () => {
      const hello = $S`hello   Woërld`.snakeCase;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snakeCase /w non alphabetic`, () => {
      const hello = $S`hello $#!  World!`.snakeCase;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`firstUp`, () => {
      const hello = $S`hello world`.firstUp;
      assert.strictEqual(hello.value, `Hello world`);
    });

    it(`wordsUCFirst`, () => {
      const hello = $S`hello world What a day 't is`.wordsUCFirst;
      assert.strictEqual(hello.value, `Hello World What A Day 't Is`);
    });
  });

  describe(`capitalize`, () => {
    it(`camel`, () => {
      const hello = $S`Hello World`.capitalize.camel;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`camel from dashed`, () => {
      const hello = $S`hello-world`.capitalize.camel;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`dashed from camel`, () => {
      const hello = $S`hello-world`.capitalize.camel;
      assert.strictEqual(hello.capitalize.dashed.value, `hello-world`);
    });

    it(`camel /w multiple spaces`, () => {
      const hello = $S` hello    world   `.capitalize.camel;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`camel /w multiple dashes`, () => {
      const hello = $S`-hello---world   `.capitalize.camel;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`kebab regular`, () => {
      const hello = $S`helloWorld`.capitalize.kebab;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebab /w numbers`, () => {
      const hello = $S`hello42World`.capitalize.kebab;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebab /w spaces`, () => {
      const hello = $S`hello   World`.capitalize.kebab;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebab /w diacriticals`, () => {
      const hello = $S`hello   Woërld`.capitalize.kebab;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`kebab /w non alphabetic`, () => {
      const hello = $S`hello $#!  World!`.capitalize.kebab;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`dashed === kebab`, () => {
      const hello = $S`hello $#!  World!`.capitalize.dashed;
      assert.strictEqual(hello.value, `hello-world`);
    });

    it(`snake regular`, () => {
      const hello = $S`helloWorld`.capitalize.snake;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snake /w numbers`, () => {
      const hello = $S`hello42World`.capitalize.snake;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snake /w spaces`, () => {
      const hello = $S`hello   World`.capitalize.snake;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snake /w diacriticals`, () => {
      const hello = $S`hello   Woërld`.capitalize.snake;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`snake /w non alphabetic`, () => {
      const hello = $S`hello $#!  World!`.capitalize.snake;
      assert.strictEqual(hello.value, `hello_world`);
    });

    it(`first`, () => {
      const hello = $S`hello world`.capitalize.first;
      assert.strictEqual(hello.value, `Hello world`);
    });

    it(`words`, () => {
      const hello = $S`hello world What a day 't is`.capitalize.words;
      assert.strictEqual(hello.value, `Hello World What A Day 't Is`);
    });

    it(`full`, () => {
      const hello = $S`hello world What a day 't is`.capitalize.full;
      assert.strictEqual(hello.value, `HELLO WORLD WHAT A DAY 'T IS`);
    });

    it(`none`, () => {
      const hello = $S`HELLO WORLD WHAT A DAY 'T IS`.capitalize.none;
      assert.strictEqual(hello.value, `hello world what a day 't is`);
    });
  });

  it(`clone as expected`, () => {
    const x = $S`Hi`;
    const y = x.clone;
    assert.strictEqual(x.value, y.value);
    x.prefix(`>>`);
    assert.notStrictEqual(x.value, y.value);
    assert.strictEqual(x.value, `>>Hi`);
    assert.strictEqual(y.value, `Hi`);
  });

  it(`[instance].constructor is CustomStringConstructor`, () => {
    assert.deepStrictEqual($S``.constructor, CustomStringConstructor);
    assert.strictEqual($S``.constructor.name, `CustomStringConstructor`);
  });

  describe(`enclose`, () => {
    it(`enclose without values does nothing`, () => {
      assert.strictEqual($S`Hello world`.enclose().value, `Hello world`);
    });

    it(`enclose with start value only as expected`, () => {
      assert.strictEqual($S`Hello world`.enclose(`**`).value, `**Hello world**`);
    });

    it(`enclose with start and end value only as expected`, () => {
      assert.strictEqual($S`Hello world`.enclose(`**`, "<").value, `**Hello world<`);
    });

    describe(`.empty as expected`, () => {
        it(`parameter null`, () => {
          assert.strictEqual($S(null).empty, true);
        });

        it(`no parameter`, () => {
          assert.strictEqual($S().empty, true);
        });

        it(`parameter string 1`, () => {
          assert.strictEqual($S`{a:1, b: 2}`.empty, false);
        });

        it(`parameter string 2`, () => {
          assert.strictEqual($S("hello world").empty, false);
        });
    });

    it(`enclose with start value === instance as expected`, () => {
      assert.strictEqual($S`Hello world`.enclose($S`**`).value, `**Hello world**`);
    });

    it(`enclose with start/end value === instance as expected`, () => {
      assert.strictEqual($S`Hello world`.enclose($S`**`, $S`<`).value, `**Hello world<`);
    });

    it(`enclose with start value === instance, end value === string as expected`, () => {
      assert.strictEqual($S`Hello world`.enclose($S`**`, `<`).value, `**Hello world<`);
    });

    it(`enclose with start value === string, end value === instance as expected`, () => {
      assert.strictEqual($S`Hello world`.enclose(`**`, $S`<`).value, `**Hello world<`);
    });

    it(`enclose with start value !== string, end value === instance does nothing`, () => {
      assert.strictEqual($S`Hello world`.enclose([1, 2, 4], $S`<`).value, `Hello world`);
    });
  })

  it(`format as expected`, () => {
    // alias: interpolate
    const hi = $S`- hello dear {wrld}`.format({wrld: `you `}, {wrld: `world`});
    assert.strictEqual(hi.value, `- hello dear you - hello dear world`);
    assert.strictEqual($S``.format({hi: `there`}).value, ``, `empty input string`);
  });

  it(`history as expected`, () => {
    // see also: undo[All/Last]
    const hi = $S`- hello dear {wrld}`.format({wrld: `you `}, {wrld: `world`});
    assert.deepStrictEqual(hi.history, ['- hello dear {wrld}', '- hello dear you - hello dear world']);
  });

  describe(`insert`, () => {
    it(`insert (values array) as expected`, () => {
      const hi = $S`oh dear world`.insert({values: [`Hello `]});
      assert.strictEqual(hi.value, `Hello oh dear world`);
    });

    it(`insert (single value) as expected`, () => {
      const hi = $S`oh dear world`.insert({value: `Hello `});
      assert.strictEqual(hi.value, `Hello oh dear world`);
    });

    it(`insert with empty input string as expected`, () => {
      assert.strictEqual($S``.insert({values: [`hello`, ` `, `world`]}).value, `hello world`);
    });

    it(`insert with single string as values as expected`, () => {
      assert.strictEqual($S`world`.insert({values: `hello `}).value, `hello world`);
    });

    it(`insert at only as expected`, () => {
      const hi = $S`oh dear world`.insert({at: 5});
      assert.strictEqual(hi.value, `oh dear world`);
    });

    it(`insert impossible at-value as expected`, () => {
      const hi = $S`oh dear world`.insert({value: `Hello`, at: 25});
      assert.strictEqual(hi.value, `oh dear worldHello`);
    });

    it(`insert negative at-value as expected`, () => {
      const hi = $S`oh dear world`.insert({values: [` `, `Hello`], at: -6});
      assert.strictEqual(hi.value, `oh dear Hello world`);
    });

    it(`insert no parameters as expected`, () => {
      const hi = $S`oh dear world`.insert();
      assert.strictEqual(hi.value, `oh dear world`);
    });
  });

  describe(`interpolate`, () => {
    it(`interpolate empty inputstring as expected`, () => {
      const hi = $S``.interpolate({dr: `dear`});
      assert.strictEqual(hi.value, ``);
    });

    it(`interpolate single template as expected`, () => {
      const hi = $S`oh {dr} world`.interpolate({dr: `dear`});
      assert.strictEqual(hi.value, `oh dear world`);
    });

    it(`interpolate multiple templates as expected`, () => {
      const hi = $S`- hello dear {wrld}`.interpolate({wrld: `you `}, {wrld: `world`});
      assert.strictEqual(hi.value, `- hello dear you - hello dear world`);
    });

    it(`interpolate no arguments as expected`, () => {
      const hi = $S`- hello dear {wrld}`.interpolate();
      assert.strictEqual(hi.value, `- hello dear {wrld}`);
    });
  });

  it(`indexof (override) as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.indexOf(`o`), 4);
  });

  it(`indexof (override, nothing found => undefined) as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.indexOf(`z`), undefined);
  });

  it(`lastIndexof (override) as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.lastIndexOf(`o`), 7);
  });

  it(`lastIndexof (override, nothing found => undefined) as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.lastIndexOf(`z`), undefined);
  });

  describe(`.notEmpty as expected`, () => {
    it(`instance empty string value as expected`, () => {
      assert.strictEqual(($S()
        .notEmpty?.append(`hello!`) ?? $S()).value, "");
    });
    it(`instance string value as expected`, () => {
      assert.strictEqual(($S("hithere and ")
        .notEmpty?.append(`hello!`) ?? $S()).value, "hithere and hello!");
    });
  });

  describe(`prefix/prepend`, () => {
    it(`prefix no arguments as expected`, () => {
      const hi = $S`Hi`.prefix();
      assert.strictEqual(hi.value, `Hi`);
    });

    it(`prefix single as expected`, () => {
      const hi = $S`Hi`.prefix(`>>`);
      assert.strictEqual(hi.value, `>>Hi`);
    });

    it(`prefix multiple as expected`, () => {
      const hi = $S`Hi`.prefix(`01`, ` >> `);
      assert.strictEqual(hi.value, `01 >> Hi`);
    });

    it(`prefix empty input string as expected`, () => {
      const hi = $S``.prefix(`HI`, ` `, `THERE`);
      assert.strictEqual(hi.value, `HI THERE`);
    });

    it(`prefix (one of) input not a string as expected`, () => {
      const hi = $S`HI`.prefix(`there`, [42]);
      assert.strictEqual(hi.value, `HI`);
    });
  });

  describe(`replaceWords`, () => {
    it(`no parameters as expected`, () => {
      const noParams = $S`hello world!`.replaceWords();
      assert.strictEqual(noParams.value, `hello world!`);
    });

    it(`invalid replacement (null) as expected`, () => {
      const noParams = $S`hello world!`.replaceWords({replacements: null});
      assert.strictEqual(noParams.value, `hello world!`);
    });

    it(`invalid replacement (undefined) as expected`, () => {
      const noParams = $S`hello world!`.replaceWords({replacements: undefined});
      assert.strictEqual(noParams.value, `hello world!`);
    });

    it(`invalid replacement (new Set()) as expected`, () => {
      const noParams = $S`hello world!`.replaceWords({replacements: new Set()});
      assert.strictEqual(noParams.value, `hello world!`);
    });

    it(`invalid replacement (RegExp) as expected`, () => {
      const noParams = $S`hello world!`.replaceWords({replacements: /[a-z]/i});
      assert.strictEqual(noParams.value, `hello world!`);
    });

    it (`case sensitive multiple replacements`, () => {
      const ccs = $S`hello world!`.replaceWords({replacements: {hello: `hi`, World: `universe`}, caseSensitive: true});
      assert.strictEqual(ccs.value, `hi world!`);
    });

    it(`case insensitive multiple replacements`, () => {
      const cci = $S`hello world!`.replaceWords({replacements: {hello: `hi`, World: `universe`}});
      assert.strictEqual(cci.value, `hi universe!`);
    });

    it(`single replacement as expected`, () => {
      const cci = $S`hello world!`.replaceWords({ replacements: {hello: `hi`} });
      assert.strictEqual(cci.value, `hi world!`);
    });

    it(`single replacement case sensitive as expected`, () => {
      const ccs = $S`hello world!`.replaceWords({replacements: {HELLO: `hi`}, caseSensitive: true});
      assert.strictEqual(ccs.value, `hello world!`);
    });

    it(`invalid nr of replacement parameters as expected`, () => {
      const ccs = $S`hello world!`.replaceWords({replacements: {HELLO: `hi`}});
      assert.strictEqual(ccs.value, `hi world!`);
    });

    it(`keys with regexp reserved characters work as expected`,() => {
      const ccs = $S("replace /.+me\\").replaceWords({
        replacements: {replace: "Hello", "/.+me\\": $S`world`}});
      assert.strictEqual(ccs.value, `Hello world`);
    })

    it(`empty input string as expected`, () => {
      const ccs = $S``.replaceWords({replacements: {}});
      assert.strictEqual(ccs.value, ``);
    });
  });

  describe(`quoting`, () => {
    it(`[instance].quote[quotingStyle] for all possibilities as expected`, () => {
      const testme =  Object.keys($S.create.quote).map((key) => {
        if (key === "remove") { return $S`${key}: ` + $S(`quoting`).quote.double.quote.remove; }
        if (key === "custom") { return $S`${key}: ` + $S(`quoting`).quote[key](`!!`); }
        return $S`${key}: ` + $S(`quoting`).quote[key];
      }).filter(k => k);

      assert.deepStrictEqual(testme, [
        "backtick: `quoting`",
        "bracket: {quoting}",
        "curlyDouble: “quoting”",
        "curlyDoubleInward: ”quoting“",
        "curlyDoubleEqual: “quoting“",
        "curlyLHDoubleInward: „quoting“",
        "curlyLHSingle: ‚quoting’",
        "curlyLHSingleInward: ‚quoting‘",
        "curlySingle: ‛quoting’",
        "curlySingleEqual: ‛quoting‛",
        "curlySingleInward: ’quoting‛",
        "custom: !!quoting!!",
        "double: \"quoting\"",
        "guillemets: «quoting»",
        "guillemetsInward: »quoting«",
        "guillemetsSingle: ‹quoting›",
        "guillemetsSingleInward: ›quoting‹",
        "remove: quoting",
        "single: 'quoting'",
        "squareBrackets: [quoting]"
      ]);
    });

    it(`quotingStyles.re is what we expect`, () => {
      assert.deepStrictEqual(
        quotingStyles.re,
        /^[\`\{\}\”\“\„\‚\’\‘\‛\"\«\»\‹\›\'\[\]]|[\`\{\}\”\“\„\‚\’\‘\‛\"\«\»\‹\›\'\[\]]$/g);
    });

    it(`[instance.quote.remove for all possibilities as expected]`, () => {
      const testme =  Object.keys($S.create.quote).map((key) => {
        if (/^remove|^custom$/.test(key)) { return {[key]: false}; }
        return {[key]: $S(`quoting`).quote[key]};
      })
      .filter(v => Object.values(v)[0])
      .map(v => {
        const [key, value] = Object.entries(v)[0];
        return $S`${key}: ` + value.quote.remove
      });
      assert.deepStrictEqual(testme, [
        "backtick: quoting",
        "bracket: quoting",
        "curlyDouble: quoting",
        "curlyDoubleInward: quoting",
        "curlyDoubleEqual: quoting",
        "curlyLHDoubleInward: quoting",
        "curlyLHSingle: quoting",
        "curlyLHSingleInward: quoting",
        "curlySingle: quoting",
        "curlySingleEqual: quoting",
        "curlySingleInward: quoting",
        "double: quoting",
        "guillemets: quoting",
        "guillemetsInward: quoting",
        "guillemetsSingle: quoting",
        "guillemetsSingleInward: quoting",
        "single: quoting",
        "squareBrackets: quoting"
      ]);
    });

    it(`[instance.quote.custom as expected]`, () => {
      const hi = $S`quoting`.quote.custom(`!!`, `!!`);
      assert.strictEqual(hi.value, `!!quoting!!`);
    });
  });

  it(`toString as expected`, () => {
    const hi = $S`stringified`;
    assert.strictEqual(hi.constructor, CustomStringConstructor);
    assert.notStrictEqual(hi.toString().constructor, CustomStringConstructor);
    assert.strictEqual(hi.toString(), `stringified`);
    assert.strictEqual(String(hi), `stringified`);
    assert(`${hi}`, `stringified`);
  });

  describe(`trimAll`, () => {
    it(`trimAll removes all excessive whitespace`, () => {
      // excessive whitespace: all consecutive whitespaces (so 2 or more tabs, spaces, line feeds etc)
      const tooMuch = $S`stringified   with too\nmuch\n\nwhitespace       characters`;
      assert.strictEqual(tooMuch.trimAll.value, "stringified with too\nmuch\nwhitespace characters", String(tooMuch));
    });

    it(`trimAllKeepLF removes all excessive whitespace but keeps single line feeds if applicable`, () => {
      const tooMuch = $S`stringified   with too\nmuch\n\nwhitespace       characters`;
      assert.strictEqual(tooMuch.trimAllKeepLF.value, "stringified with too\nmuch\n\nwhitespace characters");
    });

    it(`trimAll empty input string as expected`, () => {
      assert.strictEqual($S``.trimAll.value, ``);
    });

    it(`trimAllKeppLF empty input string as expected`, () => {
      assert.strictEqual($S``.trimAllKeepLF.value, ``);
    });
  });

  describe(`truncate`, () => {
    it(`truncate (not html entity, no wordBoundary) as expected`, () => {
      const hi = $S`Hello universe`;
      assert.strictEqual(hi.truncate({at: 8}).value, `Hello u...`);
    });

    it(`truncate (not html entity, wordBoundary true) as expected`, () => {
      const hi = $S`Hello, (universe) say no more`;
      assert.strictEqual(hi.truncate({at: 8, wordBoundary: true}).value, `Hello,...`);
    });

    it(`truncate (no wordBoundaries, wordBoundary true) as expected`, () => {
      const hi = $S`Hellouniversesaynomore`;
      assert.strictEqual(hi.truncate({at: 8, wordBoundary: true}).value, `Helloun...`);
    });

    it(`truncate (html entity) as expected`, () => {
      const hi = $S`Hello universe say no more`;
      assert.strictEqual(hi.truncate({at: 8, html: true}).value, `Hello u&hellip;`);
    });

    it(`truncate (html entity, wordBoundary true) as expected`, () => {
      const hi = $S`Hello universe: say no more`;
      assert.strictEqual(hi.truncate({at: 18, html: true, wordBoundary: true}).value, `Hello universe:&hellip;`);
    });

    it(`truncate at >= input length as expected`, () => {
      const hi = $S`Hello universe say no more`;
      assert.strictEqual(hi.truncate({at: 26}).value, `Hello universe say no more`);
    });

    it(`truncate empty input string as expected`, () => {
      const hi = $S``;
      assert.strictEqual(hi.truncate({at: 16, html: true, wordBoundary: true}).value, ``);
    });
  });

  describe(`undo`, () => {
    it(`undo as expected`, () => {
      const hi = $S`Hello`;
      hi.append(` World`, ` how are you?`);
      assert.strictEqual(hi.value, `Hello World how are you?`);
      assert.strictEqual(hi.undo.value, `Hello`);
      hi.prefix(`>>`).prefix(`<<`);
      assert.strictEqual(hi.undo.value, `>>Hello`);
    });

    it(`undoAll as expected`, () => {
      const hi = $S`Hello`;
      hi.append(` World`, ` how are you?`).prefix(`>>`).prefix(`<<`);
      assert.strictEqual(hi.value, `<<>>Hello World how are you?`);
      assert.strictEqual(hi.undoAll.value, `Hello`);
    });

    it(`undoLast as expected`, () => {
      const hi = $S`Hello`;
      hi.append(` World`, ` how are you?`).prefix(`>>`).prefix(`<<`);
      assert.strictEqual(hi.value, `<<>>Hello World how are you?`);
      assert.strictEqual(hi.undoLast(2).value, `Hello World how are you?`);
    });

    it(`undo with [instance].history.length == 1 as expected`, () => {
      const hi = $S`Hello`;
      assert.strictEqual(hi.value, `Hello`);
      assert.strictEqual(hi.history.length, 1);
      assert.strictEqual(hi.clone.undo.value, `Hello`);
    });

    it(`undoLast with non numeric parameter as expected`, () => {
      const hi = $S`Hello`;
      hi.append(` World`, ` how are you?`).prefix(`>>`).prefix(`<<`);
      assert.strictEqual(hi.value, `<<>>Hello World how are you?`);
      assert.strictEqual(hi.undoLast('NO').value, `<<>>Hello World how are you?`);
    });

    it(`undoLast with n > history.length as expected (equals undoAll)`, () => {
      const hi = $S`Hello`;
      hi.append(` World`, ` how are you?`).prefix(`>>`).prefix(`<<`);
      assert.strictEqual(hi.value, `<<>>Hello World how are you?`);
      assert.strictEqual(hi.clone.undoLast(15).value, `Hello`);
      assert.strictEqual(hi.clone.undoLast(15).value, hi.clone.undoAll.value);
    });
  });

  describe(`value setter`, () => {
    it(`value set as expected`, () => {
      const hi = $S`Hello`;
      hi.value = `hello world`;
      assert.strictEqual(hi.value, `hello world`);
    });

    it(`value += as expected`, () => {
      const hi = $S`Hello`;
      hi.value += ` world`;
      assert.strictEqual(hi.value, `Hello world`);
    });

    it(`value set with no string type as expected`, () => {
      const hi = $S`hello`;
      hi.value = {hello: 1};
      assert.strictEqual(hi.value, `hello`);
      // note: += will *always* stringify the value to add
      hi.value += 42;
      assert.strictEqual(hi.value, `hello42`);
      hi.value += {hello: 1};
      assert.strictEqual(hi.value, `hello42[object Object]`);
    });

    it(`value set with empty string type as expected`, () => {
      const hi = $S`hello`;
      hi.value = ``;
      assert.strictEqual(hi.value, `hello`);
    });
  });
});

describe(`Native String methods are wrapped and usable`, () => {
  it(`includes as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.includes(`world`), true);
  });

  it(`codePointAt as expected`, () => {
    const hi = $S`😎hello world`;
    assert.strictEqual(hi.codePointAt(0), 128526);
  });

  it(`length as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.length, 11);
  });

  it(`slice as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.slice(0, 5).value, `hello`);
    assert.strictEqual(hi.undo.slice(-5).value, `world`);
  });

  it(`slice chainable`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.slice(0, 5).append(`WORLD`).value, `helloWORLD`);
  });

  it(`slice w/indexOf as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.slice(hi.indexOf(`w`)).value, `world`);
  });

  it(`startsWith as expected`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.startsWith(`h`), true);
  });

  it(`toUpperCase is chainable`, () => {
    const hi = $S`hello world`;
    assert.strictEqual(hi.toUpperCase().quote.double.value, `"HELLO WORLD"`);
  });
});
