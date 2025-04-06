import assert from 'node:assert';
import {describe, it} from 'node:test';
import {default as $S, CustomStringConstructor} from "../index.js";
import {defineQuotingStyles} from "../src/instanceMethods.js";

describe(`Basics constructor`, () => {
  describe(`Instantiation`, () => {
    it(`constructor can be used as regular function`, () => {
      const hi = $S(`Hello world`);
      assert.strictEqual(String(hi), `Hello world`);
    });
    
    it(`constructor can be used as tagged template function`, () => {
      const wrld = `world`;
      const hi = $S`Hello ${wrld}`;
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
  });
  
  describe(`Constructor static methods`, () => {
    it(`$S.keys delivers all keys`, () => {
      const keysShouldbe = [
        'append',
        'camelCase',
        'clone',
        'constructor',
        'dashed',
        'enclose',
        'extract',
        'find',
        'firstUp',
        'format',
        'history',
        'indexOf',
        'insert',
        'interpolate',
        'lastIndexOf',
        'prefix',
        'prepend',
        'quote',
        'replaceWords',
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
        'constructor (method, String override)',
        'dashed (chainable getter)',
        'enclose (chainable method)',
        'extract (chainable method)',
        'find (method)',
        'firstUp (chainable getter)',
        'format (chainable method)',
        'history (getter)',
        'indexOf (method, String override)',
        'insert (chainable method)',
        'interpolate (chainable method)',
        'lastIndexOf (method, String override)',
        'prefix (chainable method)',
        'prepend (chainable method)',
        'quote (Object. Use [constructor].quoteInfo for keys)',
        'replaceWords (chainable method)',
        'toString (method, String override)',
        'trimAll (chainable getter)',
        'trimAllKeepLF (chainable getter)',
        'truncate (chainable method)',
        'undo (chainable getter)',
        'undoAll (chainable getter)',
        'undoLast (chainable method)',
        'value (getter)',
        'valueOf (method, String override)',
        'wordsUCFirst (chainable getter)'
      ];
      const info = $S.info;
      // the first lines may vary and is not relevant for the test
      assert.deepStrictEqual(info.slice(info.findIndex(v => v.startsWith(`append`))), keysShouldbe);
    });
    
    it(`$S.keys.quoteInfo as expected`, () => {
      const shouldBe = [
        '[instance].quote.backtick (` [instance value] `)',
        '[instance].quote.bracket ({ [instance value] })',
        '[instance].quote.curlyDouble (“ [instance value] ”)',
        '[instance].quote.curlyDoubleEqual (“ [instance value] “)',
        '[instance].quote.curlyDoubleInward (” [instance value] “)',
        '[instance].quote.curlyLHDouble („ [instance value] ”)',
        '[instance].quote.curlyLHDoubleInward („ [instance value] “)',
        '[instance].quote.curlyLHSingle (‚ [instance value] ’)',
        '[instance].quote.curlyLHSingleInward (‚ [instance value] ‘)',
        '[instance].quote.curlySingle (‛ [instance value] ’)',
        '[instance].quote.curlySingleEqual (‛ [instance value] ‛)',
        '[instance].quote.curlySingleInward (’ [instance value] ‛)',
        '[instance].quote.double (" [instance value] ")',
        '[instance].quote.guillemets (« [instance value] »)',
        '[instance].quote.guillemetsInward (» [instance value] «)',
        '[instance].quote.guillemetsSingle (‹ [instance value] ›)',
        '[instance].quote.guillemetsSingleInward (› [instance value] ‹)',
        "[instance].quote.single (' [instance value] ')",
        '[instance].quote.squareBrackets ([ [instance value] ])'
      ];
      assert.deepStrictEqual($S.quoteInfo, shouldBe);
    })
    
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
      $S.addCustom({name: `surroundWithInvertedArrows`, method: (me, add) => { return me.prepend(`->`).append(add); }, enumerable: false});
      assert.strictEqual($S`HELLO WORLD`.surroundWithInvertedArrows(`<-`).value, `->HELLO WORLD<-`);
    });
    
    it(`custom getter in $S.keys`, () => {
      assert.strictEqual($S.keys.find(v => v === `lowerQuotSingle`), `lowerQuotSingle` );
    });
    
    it(`custom method in $S.keys`, () => {
      assert.strictEqual($S.keys.find(v => v === `surroundWithInvertedArrows`), `surroundWithInvertedArrows` );
    })
    
    it(`$S.format works as expected`, () => {
      const mymy = $S.format(`hello {wrld}`, {wrld: `there - `}, {wrld: `world`});
      assert.strictEqual(mymy.value, `hello there - hello world`);
    });
    
    it(`$S.regExp (tagged template) as expected`, () => {
      const re = $S.regExp`
        [a-z] // only lowercase a-z
        | [0-3] // or numbers 0-3
        ${["g", "i"]} // globally`;
      assert.strictEqual(re.constructor, RegExp);
      assert.deepStrictEqual(re, /[a-z]|[0-3]/gi);
    });
    
    it(`$S.regExp (function call) as expected`, () => {
      const re = $S.regExp(`
        [a-z] // only lowercase a-z
        | [0-3] // or numbers 0-3`,
        `g`,
        `im`);
      assert.strictEqual(re.constructor, RegExp);
      assert.deepStrictEqual(re, /[a-z]|[0-3]/gim);
    });
    
    it(`$S.regExp invalid returns string with error message`, () => {
      const re = $S.regExp(`
        ([a-z] // only lowercase a-z (a non terminated group)`,
        `g`,
        `im`);
      assert.strictEqual(/Error creating/.test(re), true);
      assert.strictEqual(/error message/.test(re), true);
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
  
  describe(`case`, () => {
    it(`camelCase`, () => {
      const hello = $S`Hello World`.camelCase;
      assert.strictEqual(hello.value, `helloWorld`);
    });

    it(`dashed`, () => {
      const hello = $S`helloWorld`.dashed;
      assert.strictEqual(hello.value, `hello-world`);
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
  
  it(`clone as expected`, () => {
    const x = $S`Hi`;
    const y = x.clone;
    assert.strictEqual(x.value, y.value);
    x.prefix(`>>`);
    assert.notStrictEqual(x.value, y.value);
    assert.strictEqual(x.value, `>>Hi`);
    assert.strictEqual(y.value, `Hi`);
  });
  
  it(`find as expected (multiple paths)`, () => {
    const myStr = $S`Hello, here we are, aren't we?`;
    
    assert.deepStrictEqual(myStr.find({terms: `we`}), {
      "searched4": "we",
      "caseSensitive": "no",
      "foundAny": true,
        "hits": 2,
        "result": {
          "we": {
            "at": [
              12,
              27
            ]
          }
        }
      }, "{terms: `we`} cs undefined" );
    
    assert.deepStrictEqual(myStr.find({terms: [`here`, `we`]}), {
        "searched4": "here, we",
        "caseSensitive": "no",
        "foundAny": true,
        "hits": 3,
        "result": {
          "here": {
            "at": [
              7
            ]
          },
          "we": {
            "at": [
              12,
              27
            ]
          }
        }
      }, "{terms: [`here`, `we`]} cs undefined");
    
    assert.deepStrictEqual(myStr.find({terms: [`here`, `WE`], caseSensitive: true}), {
      "searched4": "here, WE",
      "caseSensitive": "YES",
      "foundAny": true,
      "hits": 1,
      "result": {
        "here": {
          "at": [
            7
          ]
        }
      }
    }, "{terms: [`here`, `WE`], caseSensitive: true}  cs true" );
    
    assert.deepStrictEqual(myStr.find({terms: /we/g}), {
      "searched4": "/we/g",
      "caseSensitive": "YES",
      "foundAny": true,
      "hits": 2,
      "result": {
        "we": {
          "at": [
            12,
            27
          ]
        }
      }
    }, "{terms: /we/g}  cs from RE" );
    
    assert.deepStrictEqual(myStr.find({terms: /we|HERE/g}), {
      "searched4": "/we|HERE/g",
      "caseSensitive": "YES",
      "foundAny": true,
      "hits": 2,
      "result": {
        "we": {
          "at": [
            12,
            27
          ]
        }
      }
    }, "{terms: /we|HERE/g} cs from RE" );
        
    assert.deepStrictEqual(myStr.find({terms: /we|HERE|hello/gi}), {
      "searched4": "/we|HERE|hello/gi",
      "caseSensitive": "no",
      "foundAny": true,
      "hits": 4,
      "result": {
        "Hello": {
          "at": [
            0
          ]
        },
        "here": {
          "at": [
            7
          ]
        },
        "we": {
          "at": [
            12,
            27
          ]
        }
      }
    }, "{terms: /we|HERE|hello/gi}  cs from RE /i" );
    
    assert.deepStrictEqual($S``.find({terms: /we|HERE|hello/gi}), {hits: `n/a`, result: `input is empty`}, "empty input" );
  });
  
  it(`[instance].constructor is CustomStringConstructor`, () => {
    assert.deepStrictEqual($S``.constructor, CustomStringConstructor);
    assert.strictEqual($S``.constructor.name, `CustomStringConstructor`);
  });
  
  it(`extract as expected`, () => {
    const hi = $S`I said hello world didn't I?`;
    assert.strictEqual(hi.extract(7, 18).value, `hello world`);
    assert.strictEqual($S``.extract(7, 18).value, ``, `empty string`);
  });
    
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
    it(`insert as expected`, () => {
      const hi = $S`oh dear world`.insert({values:`Hello `});
      assert.strictEqual(hi.value, `Hello oh dear world`);
    });
    
    it(`insert with empty input string as expected`, () => {
      assert.strictEqual($S``.insert({values: [`hello`, ` `, `world`]}).value, `hello world`, `empty input string`);
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
    
    it(`prepend no arguments as expected`, () => {
      const hi = $S`Hi`.prepend();
      assert.strictEqual(hi.value, `Hi`);
    });
    
    it(`prepend single as expected`, () => {
      const hi = $S`Hi`.prepend(`>>`);
      assert.strictEqual(hi.value, `>>Hi`);
    });
    
    it(`prepend empty input string as expected`, () => {
      const hi = $S``.prepend(`HI`, ` `, `THERE`);
      assert.strictEqual(hi.value, `HI THERE`);
    });
    
    it(`prepend multiple as expected`, () => {
      const hi = $S`Hi`.prepend(`01`, ` >> `);
      assert.strictEqual(hi.value, `01 >> Hi`);
    });
  });
  
  describe(`replaceWords`, () => {
    it(`no parameters as expected`, () => {
      const noParams = $S`hello world!`.replaceWords();
      assert.strictEqual(noParams.value, `hello world!`);  
    });
    
    it (`case sensitive multiple replacements`, () => {
      const ccs = $S`hello world!`.replaceWords({replacements: [`hello`, `hi`, `World`, `universe`], caseSensitive: true});
      assert.strictEqual(ccs.value, `hi world!`);
    });
    
    it(`case sensitive multiple replacements`, () => {
      const cci = $S`hello world!`.replaceWords({replacements: [`hello`, `hi`, `World`, `universe`]});
      assert.strictEqual(cci.value, `hi universe!`);
    });
    
    it(`single replacement as expected`, () => {
      const cci = $S`hello world!`.replaceWords({replacements: [`hello`, `hi`]});
      assert.strictEqual(cci.value, `hi world!`);
    });
    
    it(`single replacement case sensitive as expected`, () => {
      const ccs = $S`hello world!`.replaceWords({replacements: [`HELLO`, `hi`], caseSensitive: true});
      assert.strictEqual(ccs.value, `hello world!`);
    });
    
    it(`invalid nr of replacement parameters as expected`, () => {
      const ccs = $S`hello world!`.replaceWords({replacements: [`HELLO`, `hi`, `hello`]});
      assert.strictEqual(ccs.value, `hi world!`);
    });
    
    it(`empty input string as expected`, () => {
      const ccs = $S``.replaceWords({replacements: [`HELLO`, `hi`, `hello`]});
      assert.strictEqual(ccs.value, ``);
    });
  });
  
  describe(`quoting`, () => {
    it(`[instance].quote[quotingStyle] for all possibilities as expected`, () => {
      Object.entries(defineQuotingStyles).forEach(([key, quots]) => {
        if (key === `re`) { return; }
        const hi = $S`quoting`.quote[key];
        const [start, end] = quots.length < 2 ? [quots[0], quots[0]] : quots;
        assert.strictEqual(hi.value, `${start}quoting${end}`, `${key} ${hi}`);
      });
    });
    
    it(`[instance.quote.remove for all possibilities as expected]`, () => {
      Object.entries(defineQuotingStyles).forEach(([key, quots]) => {
        if (key === `re`) { return; }
        const hi = $S`quoting`.quote[key];
        const [start, end] = quots.length < 2 ? [quots[0], quots[0]] : quots;
        assert.strictEqual(hi.value, `${start}quoting${end}`, `${key} ${hi}`);
        assert.strictEqual(hi.quote.remove.value, `quoting`, `${key} ${hi}`);
      });
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
    
    if (`trimAll empty input string as expected`, () => {
      assert.strictEqual($S``.trimAll.value, ``);
    });
    
    if (`trimAllKeppLF empty input string as expected`, () => {
      assert.strictEqual($S``.trimAllKeepLF.value, ``);
    });
  });
    
  describe(`truncate`, () => {
    it(`truncate (not html entity, no wordBoundary) as expected`, () => {
      const hi = $S`Hello universe`;
      assert.strictEqual(hi.truncate({at: 8}).value, `Hello u...`);
    });
    
    it(`truncate (not html entity, wordBoundary true) as expected`, () => {
      const hi = $S`Hello universe say no more`;
      assert.strictEqual(hi.truncate({at: 8, wordBoundary: true}).value, `Hello...`);
    });
    
    it(`truncate (html entity) as expected`, () => {
      const hi = $S`Hello universe say no more`;
      assert.strictEqual(hi.truncate({at: 8, html: true}).value, `Hello u&hellip;`);
    });
    
    it(`truncate (html entity, wordBoundary true) as expected`, () => {
      const hi = $S`Hello universe say no more`;
      assert.strictEqual(hi.truncate({at: 16, html: true, wordBoundary: true}).value, `Hello universe&hellip;`);
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
  
  it(`instance can be spreaded as Array`, () => {
    assert.deepStrictEqual([...$S`hello world`], ["h","e","l","l","o"," ","w","o","r","l","d"]);
  });
});
