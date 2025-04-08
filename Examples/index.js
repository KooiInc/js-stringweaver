import {logFactory, $} from "./index.browser.js";
import {default as $S} from "../index.js";

initStyling();
window.$S = $S; // try it out in the console
const {log, logTop} = logFactory();
let prismDone = false;
await createCodeElement();
demonstrate();

function demonstrate() {
  addCustomized();
  const reDemo = $S.regExp`
      ^[\p{L}]              //=> always start with a letter
      [\p{L}_\.#\-\d+~=!]+  //=> followed by letters including _ . # - 0-9 ~ = or !
      ${[...'gui']}         //=> flags ([g]lobal, case [i]nsensitive, [u]nicode)`;
  
  printInitializationExamples();
  printStaticConstructorFunctionExamples();
  printGetterExamples();
  printMethodExamples();
  
  function printInitializationExamples() {
    
    log(
      $S`Initialization`
        .toTag(`h2`, `head`)
        .append($S`js-stringweaver 'constructor' was imported as <code>$S</code>`.asNote.toTag(`div`, `normal`))
        .value,
      
      $S`✓ As tagged template:`
        .append($S`
        const wrld = "world";
        $S\`hello \${wrld}\``
          .asCodeblock
          .append(`=> `)
          .append($S`hello world`.quote.curlyDouble))
        .value,
      
      $S`✓ As function call: `
        .append(`<br>`, $S`$S("hello world")`.toCode)
        .append($S(`hello world`).quote.curlyDouble.prefix(` => `)).value,
      
      $S`Instance methods are chainable`
        .toTag(`h3`, `head`)
        .append($S`$S("hello").append(" ", "world").firstUp.enclose("&amp;lt;", "&amp;gt;")`.toCode)
        .append(`<br> => `)
        .append($S("hello").append(" ", "world").firstUp.enclose("&lt;", "&gt;").quote.curlyDouble)
        .value,
      
      $S`Native string function results are chainable`
        .toTag(`h3`, `head`)
        .append(
          $S`$S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").quote.guillemetsInward`.toCode,
          `<br>=> `,
          $S("hello world").toUpperCase().replace(/world/i, `UNIVERSE`).quote.guillemetsInward)
        .value,
    );
  }
  
  function printStaticConstructorFunctionExamples() {
    log(
      $S`$S static stringweaver constructor properties/methods`.toTag(`h2`, `head`).value,
      
      $S`$S.keys`.toTag(`h3`, `head`).toTag(`summary`)
        .append($S`includes user defined custom property/method keys`.asNote.toTag(`div`, `normal`))
        .append($S(JSON.stringify($S.keys, null, 2)).toTag(`pre`))
        .toTag(`details`)
        .toTag(`div`, `normal`)
        .value,
      
      $S`$S.info`.toTag(`h3`, `head`).toTag(`summary`)
        .append($S`includes user defined custom properties/methods`.asNote.toTag(`div`, `normal`))
        .append($S(JSON.stringify($S.info, null, 2)).toTag(`pre`))
        .toTag(`details`)
        .toTag(`div`, `normal`)
        .value,
      
      $S`$S.quoteInfo`.toTag(`h3`, `head`).toTag(`summary`)
        .append($S(JSON.stringify($S.quoteInfo, null, 2)).toTag(`pre`))
        .toTag(`details`)
        .toTag(`div`, `normal`)
        .value,
      
      $S`$S.regExp`.toTag(`h3`, `head`)
        .append($S`$S.regExp\`
        &nbsp;&nbsp;^[\\p{L}]  <span class="cmmt">//=> always start with a letter</span>
        &nbsp;&nbsp;[\\p{L}_\\.#\\-\\d+~=!]+  <span class="cmmt">//=> followed by letters including _ . # - 0-9 ~ = or !</span>
        &nbsp;&nbsp;\${[...\`gui\`]} <span class="cmmt">//=> flags ([g]lobal, case [i]nsensitive, [u]nicode)</span>\`;`
          .asCodeblock)
        .append($S`Result`.toTag(`b`).prefix(`=> `)
          .append(`: `, $S(reDemo.toString()).toCode).toTag(`div`, `normal`))
        .value,
      
      $S`$S.constructor`.toTag(`h3`, `head`)
        .append($S`Result: `.prefix(`=> `).toTag(`b`))
        .append($S`function ${$S.constructor.name}(str, ...args) {...}`.toCode)
        .toTag(`div`, `normal`)
        .value,
      
      $S`$S.addCustom`
        .toTag(`h3`, `head`)
        .append(
          $S`Using `
            .append($S`$S.addCustom`.toCode, ` one can add ones own getters or methods`)
            .toTag(`div`, `normal`))
        .append(
          $S`Syntax`.toTag(`i`)
            .append(`: `, $S`$S.addCustom({
          &nbsp;&nbsp;name:string, 
          &nbsp;&nbsp;method:function (me:the current stringweaver instance, ...args) => {...}, 
          &nbsp;&nbsp;isGetter:boolean = false, 
          &nbsp;&nbsp;enumerable:boolean = false
          &nbsp;&nbsp;<span class="cmmt">// ↳ true: visible in Object.keys([instance])</span>})`.asCodeblock))
        .toTag(`div`, `normal`)
        .value,
      
      $S`Examples`.toTag(`h3`, `head`).value,
      
      $S`
        <span class="cmmt">// a user defined getter</span>
        $S.addCustom({name: "festive", me => me.enclose("\\u{1F389}"), isGetter: true});
        const result = $S\`Hurray!\`.festive; `
        .asCodeblock
        .append($S`=&gt; `
          .append($S`result`.toCode, `: `, $S("Hurray!").festive.quote.curlyDouble))
        .toTag(`div`, `normal`)
        .value,
      
      $S`
         <span class="cmmt">// a user defined method</span>
         $S.addCustom({ name: "toTag", method: (me, tagName, className) => {
          &nbsp;&nbsp;className = className?.length ? $S(className).quote.double.prefix($S(" class=")) : "";
          &nbsp;&nbsp;return me
          &nbsp;&nbsp;&nbsp;&nbsp;.enclose( 
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$S(tagName).append(className).enclose("&lt;", ">"),
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$S(tagName).enclose("&lt;/", ">") );
          &nbsp;}
         });
         const result = $S\`Hurray!\`.toTag("i", "green").toTag("b");`.asCodeblock
        .append(
          $S`result`.toCode.prefix(`=> `), ` `,
          $S`Hurray!`.toTag("i", "green").toTag("b").quote.curlyDouble)
        .toTag(`div`, `normal`)
        .value,
      
      $S`$S.randomString`.toTag(`h3`, `head`)
        .append($S`Syntax: `.toTag(`i`))
        .append($S`$S.randomString({
         &nbsp;&nbsp;len:number = 12,
         &nbsp;&nbsp;includeUppercase:boolean = true,
         &nbsp;&nbsp;includeNumbers:boolean,
         &nbsp;&nbsp;includeSymbols:boolean,
         &nbsp;&nbsp;startAlphabetic:boolean})`.asCodeblock)
        .append($S`Examples`.toTag(`h3`, `head`).value,)
        .append(
          $S`$S.randomString()`.toCode, `<br>=> `,
          $S.randomString().quote.curlyDouble).toTag(`div`, `normal b5`)
        .append($S`$S.randomString({len: 24})`.toCode,
          `<br>=> `,
          $S.randomString({len: 24}).quote.curlyDouble).toTag(`div`, `normal b5`)
        .append(
          $S`$S.randomString({len: 16, includeNumbers: true})`.toCode, `<br>=> `,
          $S.randomString({
            len: 16,
            includeNumbers: true
          }).quote.curlyDouble).toTag(`div`, `normal b5`)
        .append(
          $S`$S.randomString({includeNumbers: true, includeSymbols: true})`.toCode, `<br>=> `,
          $S.randomString({
            includeNumbers: true,
            includeSymbols: true
          }).quote.curlyDouble).toTag(`div`, `normal b5`)
        .append(
          $S`$S.randomString({len: 32, includeUppercase: false})`.toCode, `<br>=> `,
          $S.randomString({
            len: 32,
            includeUppercase: false
          }).quote.curlyDouble).toTag(`div`, `normal b5`)
        .value,
    );
  }
  
  function printGetterExamples() {
    log($S("Instance getters").toTag(`h2`, `head`).value)
    log(
      $S("✓ [instance].camelCase").toTag(`h3`, `head`)
        .append( $S`Tries converting the instance string 
          to <a target="_blank" class="ExternalLink arrow"
            href="https://developer.mozilla.org/en-US/docs/Glossary/Camel_case"
            >Camel case</a>`.toTag("div", "normal b5") )
        .append(
          $S("$S`convert-me`.camelCase").toCode
          .append( $S`convert-me`.camelCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`convert me please`.camelCase").toCode
          .append( $S`convert me please`.camelCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("you -- should convert &nbsp;&nbsp;&nbsp;-me &nbsp;&nbsp;&nbsp;too.camelCase").toCode
          .append( $S`you -- should convert    -me    too`.camelCase.quote.curlyDouble.prefix(" => ")).asDiv )
      .value,
    );
    
    const toClone = $S("I shall be cloned");
    const cloned = toClone.clone.replace("shall be", "was").append(", yeah!");
    
    log(
      $S("✓ [instance].clone").toTag(`h3`, `head`)
        .append( $S`Clone an instance`.toTag("div", "normal b5") )
        .append($S`
            const toClone = $S("I shall be cloned");
            const cloned = toClone.clone.replace("shall be", "was").append(", yeah!");`.asCodeblock)
        .append( 
          $S`cloned`.toCode.append(cloned.quote.curlyDouble.prefix("=>")).asDiv,
          $S`toClone`.toCode.append(toClone.quote.curlyDouble.prefix("=>")).asDiv
        ).value,
    );
    
    log(
      $S("✓ [instance].firstUp").toTag(`h3`, `head`)
        .append( $S`Converts the first letter of the instance string to upper case`.toTag("div", "normal b5") )
        .append(
          $S("$S`hello world`.firstUp").toCode,
          $S`hello world`.firstUp.quote.curlyDouble.prefix(" => ")).asDiv
        .append(
          $S("$S`   hello world`.trim().firstUp").toCode,
          $S`hello world`.trim().firstUp.quote.curlyDouble.prefix(" => ")).asDiv
        .value,
    );
    
    
    const historyEx = JSON.stringify($S``.prefix("hello").append(` `, `world`).history);
    log(
      $S("✓ [instance].history").toTag(`h3`, `head`)
        .append( $S`Every instance records its history, which may be retrieved using 
            <code>.history</code>.`.asDiv
          .append(`The history enables undoing things for an instance 
            (see <code>undo/undoLast/undoAll</code>).`).toTag("div", "normal b5") )
        .append(
          $S("$S``.prefix('hello').append(` `, `world`).history").toCode,
          $S` => `.append(historyEx)).asDiv 
        .value,
    );
    
    log($S`... Work in Progress ...`.asNote.asDiv.value);
    
    log(
      $S("✓ [instance].kebabCase").toTag(`h3`, `head`)
        .append( $S`Tries converting 
            the instance string to <a target="_blank" class="ExternalLink arrow"
            href="https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case"
            >Kebab case</a> (aka 'dashed notation'), 
            meaning that all words of a string 
            will be converted to lower case, all non-letters/-numbers 
            (all not a-z <i>including diacriticals</i>) 
            will be removed and the converted words will be concatenated 
            with hyphens. May be useful for css- or data-attributes.`
            .toTag("div", "normal b5") )
        .append(
          $S("$S`ConvertMe`.kebabCase").toCode
            .append( $S`ConvertMe`.kebabCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`Convert-Me Please`.kebabCase").toCode
            .append( $S`Convert Me Please`.kebabCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`Convert Me --&nbsp;&nbsp;&nbsp;&nbsp;Please`.kebabCase").toCode
            .append( $S`Convert Me --    Please`.kebabCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`Convert Me, pl<b class='red'>ë</b>ase  $#!`.kebabCase").toCode
            .append( $S`Convert Me, Plëase $#!`.kebabCase
              .replace("plase", "<b class='red'>plase</b>").quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`42 Convert Me, please`.kebabCase").toCode
            .append( $S`42 Convert Me, Please`.kebabCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .value,
    );
    
    log(
      $S("✓ [instance].snakeCase").toTag(`h3`, `head`)
        .append( $S`Tries converting 
            the instance string to <a target="_blank" class="ExternalLink arrow"
            href="https://developer.mozilla.org/en-US/docs/Glossary/Snake_case"
            >Snake case</a>, meaning that all words of a string 
            will be converted to lower case, all non-letters/-numbers 
            (all not a-z <i>including diacriticals</i>) 
            will be removed and the converted words will be concatenated 
            with underscore ('_'). May be useful for cleaning up property names.`
          .toTag("div", "normal b5") )
        .append(
          $S("$S`convertMe`.snakeCase").toCode
            .append( $S`convertMe`.snakeCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`Convert-Me Please`.snakeCase").toCode
            .append( $S`Convert Me Please`.snakeCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`Convert Me _&nbsp;&nbsp;&nbsp;&nbsp;Please__`.snakeCase").toCode
            .append( $S`Convert Me _    Please`.snakeCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`Convert Me, pl<b class='red'>Ë</b>ase  $#!`.snakeCase").toCode
            .append( $S`Convert Me, PlËase $#!`.snakeCase
              .replace("plase", "<b class='red'>plase</b>").quote.curlyDouble.prefix(" => ")).asDiv )
        .append(
          $S("$S`42 Convert Me, please`.snakeCase").toCode
            .append( $S`42 Convert Me, Please`.snakeCase.quote.curlyDouble.prefix(" => ")).asDiv )
        .value,
    );
  }
  
  function printMethodExamples() {
    log($S("Instance methods").toTag(`h2`, `head`).value,)
    log(
      $S("indexOf/lastIndexOf").toTag(`h3`, `head`)
        .append(
          $S("indexOf").toCode,
          " and ",
          $S("lastIndexOf").toCode,
          " override the native ",
          $S("String.prototype").toCode,
          " methods. ").asDiv
        .append(
          $S("They return "),
          $S("undefined").toCode,
          " if the string to search was not found, instead of ",
          $S("-1").toCode,
          ".").asDiv
        .value
    );
  }
  
  printHeader();
}

function printHeader() {
  logTop(
    $S`<button id="codeVwr" data-code-visible="hidden"></button> used in this page`
      .toTag(`div`, `normal`).value,
    $S`js-stringweaver: a stringbuilder utility`.toTag(`h1`, `head`)
      .append($S`
      In many other languages, a programmer can choose to explicitly use a string view or a
      string builder where they really need them. But JS has the programmer either hoping the
      engine is smart enough, or using black magic to force it to do what they want.`.toTag(`div`, `q`),
        String($S`Cited from
        <a target="_blank" class="ExternalLink arrow" 
          href="https://iliazeus.github.io/articles/js-string-optimizations-en/"
        >Exploring V8's strings: implementation and optimizations</a>.`.toTag(`p`, `normal`)),
        $S`Consider the code here the aforementioned <i>black magic</i>. It delivers a way to build a string
        (actually a <i>wrapped <b>String</b> instance</i> making its internal string value <i>mutable</i>).
        Instances can use native String methods and a number of custom methods.
        <b>js-stringweaver</b> is programmed as a <a target="_blank"
          class="ExternalLink arrow"
          href="https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming"
        >class free object oriented</a> module.`.toTag(`p`, `normal`) )
      .value,
    $S`<a class="ExternalLink arrow" data-backto="GitHub repository" 
        target="_top" href="https://github.com/KooiInc/js-stringweaver">GitHub repository</a>`
    .value,
  );
}

async function createCodeElement() {
  const code = await(fetch("./index.js"))
    .then(res => res.text());
  const codeOverlay = $.div_jql(
    {id: "codeOverlay", data: {magDat: "42"}},
    $.pre({class: "language-javascript line-numbers"},
      $.code({class: "language-javascript"}, code) ) )
    .hide();
  
  $.delegate(`click`, `#codeVwr`, evt => {
    const bttn = evt.target;
    const parentLi = bttn.closest(`li`);
    const isVisible = bttn.dataset.codeVisible === `visible`;
    
    if (isVisible) {
      codeOverlay.hide();
      return bttn.dataset.codeVisible = `hidden`;
    }
    
    if (!parentLi.querySelector(`#codeOverlay`)) {
      codeOverlay.toDOM(parentLi);
      Prism.highlightAll();
      prismDone = true;
    }
    
    codeOverlay.show();
    return bttn.dataset.codeVisible = `visible`;
  });
}

function addCustomized() {
  $S.addCustom({name: `enclose`, method: (me, start, end) => me.enclose(start, end)});
  /* ↳ this will do nothing. It displays an error in the console
     because 'enclose' is already an instance method */
  $S.addCustom({name: "festive", method: me => me.enclose("\u{1F389}"), isGetter: true});
  $S.addCustom({
    name: "toTag", method: (me, tagName, className) => {
      className = className?.length ? $S(className).quote.double.prefix($S(" class=")) : "";
      return me.enclose($S(tagName).append(className).enclose("<", ">"), $S(tagName).enclose("<\/", ">"));
    }
  });
  $S.addCustom({name: `asDiv`, method(me) {return me.toTag("div", "normal"); }, isGetter: true});
  $S.addCustom({name: `toCode`, method: me => me.trimAll.toTag(`code`), isGetter: true});
  $S.addCustom({
    name: `asNote`, method: me =>
      me.trim().toTag(`i`).prefix($S`Note`.toTag(`b`, `note`).append(`: `)), isGetter: true
  });
  $S.addCustom({name: `asCodeblock`, method: me => me.trimAll.toTag(`code`).toTag(`pre`), isGetter: true});
}

function initStyling() {
  // style rules are stored in the JQL style element (head)style#JQLStylesheet
  $.editCssRules(
    `:root {
      --grey-default: rgb(112, 92, 92);
      --code-color: rgb(12, 13, 14);
    }`,
    `body {
      margin: 2rem;
    }`,
    `#log2screen {
      margin: 0px auto;
      width: 900px;
    }`,
    `.green { 
        color: green; 
    }`,
    `.red { 
        color: red; 
    }`,
    `button[data-code-visible="hidden"]:before {
      content: 'Show code';
    }`,
    `button[data-code-visible="visible"]:before {
      content: 'Hide code';
    }`,
    `div.q { display: inline-block;
      padding: 0 6rem 0px 2rem;
      font-family: Georgia, verdana;
      font-style: italic;
      color: #777; }`,
    `div.q:before {
      font-family: Georgia, verdana;
      content: '\\201C';
      position: absolute;
      font-size: 2rem;
      color: #c0c0c0;
      margin-left: -2rem;
      margin-top: 0.5rem;
     }`,
    `div.q::after {
      font-family: Georgia, verdana;
      content: '\\201D';
      margin-left: 1rem;
      font-size: 2rem;
      margin-top: 0.5rem;
      position: absolute;
      display: inline-block;
      color: #c0c0c0; }`,
    `code {
      color: revert;
      background-color: revert;
      padding: revert;
      font-family: revert;
    }`,
    `code:not(.codeblock, .language-javascript) {
        background-color: rgb(227, 230, 232);
        color: var(--code-color);
        padding: 2px 4px;
        display: inline-block;
        border-radius: 4px;
        margin: 2px 0px;
      }`,
    `code.codeblock { 
        background-color: rgb(227, 230, 232);
        margin: 0.3rem 0px 0.3rem;
        color: rgb(12, 13, 14);
        border: none;
        border-radius: 4px;
        max-width: 80vw;
      }`,
    `h2 {font-size: 1.3rem; line-height: 1.4rem}`,
    `pre:not(.language-javascript) {
        font-weight: normal;
        max-width: 400px;
        margin: 0.3rem 0;
    }`,
    `pre.language-javascript {
      max-height: 50vh;
    }`,
    `b.note {color: red; }`,
    `.normal {
       font-family: system-ui, sans-serif;
       color: var(--grey-default);
     }`,
    `.b5 { margin-bottom: 0.5rem; }`,
    `h1.head, h2.head, h3.head {
      color: var(--grey-default);
      font-family: system-ui, sans-serif;
      margin-bottom: 0.4rem;
    }`,
    `h3.head { font-size: 1.1rem; }`,
    `h2.head, h1.head { 
       border: 1px dotted var(--grey-default);
       padding: 0.3rem; 
       text-align: center;
     }`,
     `h1.head { line-height: 1.4em; }`,
    `#log2screen li:not(.head) { 
      line-height: 1.4em; 
      list-style: none;
     }`,
    `#log2screen li div.normal li {
        list-style: none;
        margin-left: -3em;
      }`,
    `details {
      summary {
        cursor: pointer;
        .head { 
          display: inline-block;
          margin: 0; 
        }
      }
    }`,
    `a.ExternalLink {
        background-color: #FFF;
    }`,
    `a.ExternalLink.arrow:hover::after { 
        fontSize: 0.7rem;
        position: absolute;
        zIndex: 2;
        display: inline-block;
        padding: 3px 6px;
        border: 1px solid #777;
        box-shadow: 1px 1px 5px #777;
        margin: 1rem 0 0 -1rem;
        color: #444;
        background-color: #FFF;
    }`,
    `a.ExternalLink[data-backto].arrow:hover::after {
      content: ' navigates back to 'attr(data-backto);
    }`,
    `a.ExternalLink[target="_top"]:not([data-backto]).arrow:hover::after {
      content: ' navigates back to 'attr(href);
    }`,
    `a.ExternalLink[target="_blank"].arrow:hover::after {
      content: ' Opens in new tab/window';
    }`,
    `#showNwYear i { 
        color: #b34b44;
        font-weight: bold;
        margin-top: 1rem;
        display: inline-block;
        padding: 5px;
        background-color: #FFFFAA;
      }`,
    `#showNwYear:before { 
        content: 'Sure! Until next new year\\1F389 lasts:';
        color: #777;
        display: block;
      }`,
    `[data-should] {
        margin-top: 0.3rem;
      }`,
    `[data-should]:before { 
        content: attr(data-should);
      }`,
  );
}
