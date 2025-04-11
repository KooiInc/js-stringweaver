import {logFactory, $} from "./DOMhelpers.js";
// ↳ see https://github.com/KooiInc/SBHelpers 
import {default as $S} from "../index.js";
const exampleCode = await fetchTemplates();
initStyling();
window.$S = $S; // try it out in the console
const {log, logTop} = logFactory();

demonstrate();

// An alternative for .trimAll
function trimAllAlternative(string) {
  return string
    .trim()
    .split(/\n/)
    .map( l => l.replace(/\s{2,}/g, ` `).trim() )
    .filter(l => l.length)
    .map( l => l
      .replace(/(\p{Ps})\s/gu, a => a.trim())
      .replace(/\s(\p{Pe})/gu, (_,b) => b.trim())
      .replace(/(\p{S})\s/gu, a => a.trim())
      .replace(/\s(\p{S})/gu, (_,b) => b.trim())
      .replace(/\s(\p{Po})/gu, (_,b) => b.trim())
      .replace(/([;,.:])(\S)/g, (a,b,c) => b + ` ` + c) )
    .join(`\n`);
}

function demonstrate() {
  createCodeElement().then(_ => Promise.resolve(`ok`));
  addCustomized();
  printInitializationExamples();
  printStaticConstructorFunctionExamples();
  printGetterExamples();
  printMethodExamples();
  printHeader();
  Prism.highlightAll();
}

function printInitializationExamples() {
  log(
    $S`Initialization`
      .toTag(`h2`, `head`)
      .append($S`js-stringweaver 'constructor' was imported as <code>$S</code>`.asNote.toTag(`div`, `normal`))
      .value,
    
    $S`✓ As tagged template:`
      .append($S`${exampleCode.asTaggedTemplateExample}`
        .append(`=> `)
        .append($S`hello world`.qcd))
      .value,
    
    $S`✓ As function call: `
      .append(`<br>`, $S`$S("hello world")`.toCode)
      .append($S(`hello world`).qcd.prefix(` => `)).value,
    
    $S`Instance methods are chainable`
      .toTag(`h3`, `head`)
      .append($S`$S("hello").append(" ", "world").firstUp.enclose("&amp;lt;", "&amp;gt;")`.toCode)
      .append(`<br> => `)
      .append($S("hello").append(" ", "world").firstUp.enclose("&lt;", "&gt;").qcd)
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
    
    $S`$S.constructor`.toTag(`h3`, `head`)
      .append($S`Result: `.prefix(`=> `).toTag(`b`))
      .append($S`function ${$S.constructor.name}(str, ...args) {...}`.toCode)
      .toTag(`div`, `normal`)
      .value,
  );
  regExpEx();
  addCustomEx();
  randomStringEx();
}

function regExpEx() {
  const reDemo = $S.regExp`
      ^[\p{L}]              //=> always start with a letter
      [\p{L}_\.#\-\d+~=!]+  //=> followed by letters including _ . # - 0-9 ~ = or !
      ${[...'gui']}         //=> flags ([g]lobal, case [i]nsensitive, [u]nicode)`;
  log(
    $S`$S.regExp`.toTag(`h3`, `head`)
    .append($S(exampleCode.regExpExample).asCodeblock)
    .append($S`Result`.toTag(`b`).prefix(`=> `)
      .append(`: `, $S(reDemo.toString()).toCode).toTag(`div`, `normal`))
    .value,
  );
}

function addCustomEx() {
  log(
    $S`$S.addCustom`
      .toTag(`h3`, `head`)
      .append(
        $S`Using `
          .append($S`$S.addCustom`.toCode, ` one can add ones own getters or methods`)
          .toTag(`div`, `normal`))
      .append(
        $S`Syntax`.toTag(`i`)
          .append(`: `, exampleCode.customGetterSyntax))
    .toTag(`div`, `normal`)
    .value,
    
    $S`Examples`.toTag(`h3`, `head`)
    .append($S`<b>User defined <i>getter</i> <code>.festive</code></b>`.asDiv).value,
    
    $S`${exampleCode.festiveExample}`
    .append($S`=&gt; `
      .append($S`result`.toCode, `: `, $S("Hurray!").festive.qcd).asDiv)
    .asDiv
    .value,
    
    $S`<b>User defined <i>method</i> <code>.toTag</code></b>`.asDiv.value,
    
    $S`${exampleCode.toTagExample}`
      .append(
        $S`result`.toCode.prefix(`=> `).append(
          ` `,
          $S`Hurray!`.toTag("i", "green").toTag("b").qcd).asDiv)
    .asDiv
    .value,
  );
}

function randomStringEx() {
  log(
    $S`$S.randomString`.toTag(`h3`, `head`)
    .append($S`Syntax: `.toTag(`i`))
    .append($S`${exampleCode.randomStringSyntax}`)
    .append($S`Examples`.toTag(`h3`, `head`).value,)
    .append(
      $S`$S.randomString()`.toCode
      .append(
        `<br>=> `,
         $S.randomString().qcd)
        .toTag(`div`, `normal b5`)
      )
      .append(
        $S`$S.randomString({len: 24})`.toCode
        .append(
          `<br>=> `,
          $S.randomString({len: 24}).qcd)
        .toTag(`div`, `normal b5`) 
      )
      .append(
         $S`$S.randomString({len: 16, includeNumbers: true})`.toCode
         .append(
           `<br>=> `,
           $S.randomString({
            len: 16,
            includeNumbers: true
           }).qcd)
         .toTag(`div`, `normal b5`) 
      )
      .append(
        $S`$S.randomString({includeNumbers: true, includeSymbols: true})`.toCode
          .append(
            `<br>=> `,
            $S.randomString({
              includeNumbers: true,
              includeSymbols: true
            }).qcd)
          .toTag(`div`, `normal b5`)
      )
      .append(
        $S`$S.randomString({len: 32, includeUppercase: false})`.toCode
        .append(
          `<br>=> `,
          $S.randomString({
              len: 32,
              includeUppercase: false
          }).qcd)
        .toTag(`div`, `normal b5`)
      )
      .value );
}

function camelCaseEx() {
  log(
    $S("✓ [instance].camelCase").toTag(`h3`, `head`)
      .append( $S`Tries converting the instance string 
          to <a target="_blank" class="ExternalLink arrow"
            href="https://developer.mozilla.org/en-US/docs/Glossary/Camel_case"
            >Camel case</a>`.toTag("div", "normal b5") )
      .append(
        $S("$S`convert-me`.camelCase").toCode
          .append( $S`convert-me`
            .camelCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`convert me please`.camelCase").toCode
          .append( $S`convert me please`
            .camelCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("you -- should convert &nbsp;&nbsp;&nbsp;-me &nbsp;&nbsp;&nbsp;too.camelCase").toCode
          .append( $S`you -- should convert    -me    too`
            .camelCase.qcd.prefix(" => ")).asDiv )
      .value,
  );
}

function cloneEx() {
  const toClone = $S("I shall be cloned");
  const cloned = toClone.clone.replace("shall be", "was").append(", yeah!");
  
  log(
    $S("✓ [instance].clone").toTag(`h3`, `head`)
      .append( $S`Clone an instance`.toTag("div", "normal b5") )
      .append( exampleCode.cloneExample )
      .append(
        $S`cloned`.toCode.append(cloned.qcd.prefix("=>")).asDiv,
        $S`toClone`.toCode.append(toClone.qcd.prefix("=>")).asDiv
      ).value,
  );
}

function firstUpEx() {
  log(
    $S("✓ [instance].firstUp").toTag(`h3`, `head`)
      .append( $S`Converts the first letter of the instance string to upper case`
        .toTag("div", "normal b5") )
      .append(
        $S("$S`hello world`.firstUp").toCode,
        $S`hello world`.firstUp.qcd.prefix(" => ")).asDiv
      .append(
        $S("$S`   hello world`.trim().firstUp").toCode,
        $S`hello world`.trim().firstUp.qcd.prefix(" => ")).asDiv
      .value,
  );
}

function historyEx() {
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
}

function snakeCaseEx() {
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
          .append( $S`convertMe`
            .snakeCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert-Me Please`.snakeCase").toCode
          .append( $S`Convert Me Please`
            .snakeCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert Me _&nbsp;&nbsp;&nbsp;&nbsp;Please__`.snakeCase").toCode
          .append( $S`Convert Me _    Please`
            .snakeCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert Me, pl<b class='red'>Ë</b>ase  $#!`.snakeCase").toCode
          .append( $S`Convert Me, PlËase $#!`.snakeCase
            .replace("plase", "<b class='red'>plase</b>")
            .qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`42 Convert Me, please`.snakeCase").toCode
          .append( $S`42 Convert Me, Please`
            .snakeCase.qcd.prefix(" => ")).asDiv )
      .value,
  );
}

function kebabCaseEx() {
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
          .append( $S`ConvertMe`.kebabCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert-Me Please`.kebabCase").toCode
          .append( $S`Convert Me Please`
            .kebabCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert Me --&nbsp;&nbsp;&nbsp;&nbsp;Please`.kebabCase").toCode
          .append( $S`Convert Me --    Please`
            .kebabCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert Me, pl<b class='red'>ë</b>ase  $#!`.kebabCase").toCode
          .append( $S`Convert Me, Plëase $#!`.kebabCase
            .replace("plase", "<b class='red'>plase</b>")
            .qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`42 Convert Me, please`.kebabCase").toCode
          .append( $S`42 Convert Me, Please`
            .kebabCase.qcd.prefix(" => ")).asDiv )
      .value,
  );
}

function trimAllEx() {
  const [cleanupStr1, cleanupStr2] = [
    `<pre><code>$S\`clean me
            
            
            please! \`.trimAll</code></pre>`,
    `clean me
        
      up    ,
        
        ( please ! )   
      {  ok  ? }
    `];
  
  log(
    $S("✓ [instance].trimAll").toTag(`h3`, `head`)
      .append($S`Tries to trim all superfluous white space from the instance string. 
          So multiple spaces, tabs, linefeeds are reduced to single white space or no
          white space if after a line feed. This is a fairly simple and certainly not
          a failsafe method (see second example)`.toTag("div", "normal b5") )
      .append(
        $S`Example 1`.toTag(`h3`, `head between`),
        cleanupStr1,
        $S`<pre>${$S`clean    me
          
             please!   `.trimAll.qcd.prefix(`=> `)}</pre>`.asDiv)
      .append(
        $S`Example 2`.toTag(`h3`, `head between`),
        $S`<pre><code>$S\`clean me
        
            up    ,
        
            ( please !  )   
          {  ok  ? }
          \`.trimAll</code></pre>`
          .append( `<pre>${$S`${cleanupStr2}`.trimAll.qcd.prefix(" => ")}</pre>`).asDiv )
      .append(
        $S`Example 2a`.toTag(`h3`, `head between`),
        $S("We created a custom getter called <code>trimEverything</code> with a " +
          "different approach to this").asDiv,
        $S`(go to the <a href="#top">page top</a>, click 'Show code' and scroll to line 11).
            It's pretty convoluted and<br>still not perfect, but hey, it's an idea ...`.asDiv,
        $S`<pre><code>$S\`clean me
        
            up    ,
        
            ( please !  )   
          {  ok  ? }
          \`.trimEverything</code></pre>`
          .append( `<pre>${$S`${cleanupStr2}`.trimEverything.qcd.prefix(" => ")}</pre>`).asDiv )
      .value,
  );
}

function trimAllKeepLFEx() {
  const cleanupStr = `<pre><code>$S\`clean me
            
            
            please! \`.trimAllKeepLF</code></pre>`;
  log(
    $S("✓ [instance].trimAllKeepLF").toTag(`h3`, `head`)
    .append(
      $S`Tries to trim all superfluous white space <i>except line feeds</i> 
        from the instance string. So multiple whitespace are reduced to single 
        white space or no white space if after a line feed. 
        As stated and demonstrated for <code>.trimAll</code>: this is a
        fairly simple and certainly not a failsafe method.`
      .toTag("div", "normal b5") )
    .append(
      $S(cleanupStr)
      .append(
        $S`<pre>${$S`clean    me
            
               please!   `.trimAllKeepLF.qcd.prefix(`=> `)}</pre>`
        .asDiv
      )
    ).value
  );
}

function undoEx() {
  const initial = $S` `.append('World').prefix('Hello').toLowerCase(); 
  
  log(
    $S("✓ [instance].undo").toTag(`h3`, `head`)
    .append(
      $S`Sets the instance string value to the previous string value 
          (from the history, see <code>$S.history</code>`
        .toTag("div", "normal b5") )
    .append(
      $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase()")
        .toCode
        .append(` => `, $S(initial.value).qcd).asDiv ) 
    .append(
      $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase().undo")
      .toCode
      .append(` => `, $S(initial.undo.value).qcd).asDiv ) 
    .value
  );
}

function undoAllEx() {
  const initial = $S` `.append('World').prefix('Hello').toLowerCase();
  
  log(
    $S("✓ [instance].undoAll").toTag(`h3`, `head`)
      .append(
        $S`Sets the instance string value to the initial string value 
          (from the history, see <code>$S.history</code>`
          .toTag("div", "normal b5") )
      .append(
        $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase()")
          .toCode
          .append(` => `, $S(initial.value).qcd).asDiv )
      .append(
        $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase().undoAll")
          .toCode
          .append(` => `, $S(initial.undoAll.value).qcd).asDiv )
      .value
  );
}

function valueEx() {
  const empty = $S("");
  empty.value = 'hello world';
  const empty2 = $S("");
  empty2.value = 'hello ';
  empty2.value += 'world';
  const emptyClone = empty2.clone;
  emptyClone.value += {hello: 1, world: 2}; // stringified

  log(
    $S("✓ [instance].value").toTag(`h3`, `head`)
    .append(
      `<br>`,
      $S`<code>[instance].value</code> is a getter and a setter for the instance string value.`,
      `<br>`,
      $S`if the given value is not a string, setting it will do nothing`.asNote )
    .toTag("div", "normal b5")
    .append(exampleCode.valueExample1) 
    .append(`<code>empty.value</code> => `, $S(empty.value).qcd).asDiv
    .append(
      `<br>`,
      $S`<code>.value</code> may also be set using <code>+=</code>.<br>`
      .append($S`be aware that non string values will be stringified here`.asNote)
      .asDiv
    )
    .append(exampleCode.valueExample2)
    .append(`<code>empty.value</code> => `, $S(empty2.value).qcd).asDiv
    .append(`<code>emptyClone.value</code> => `, $S(emptyClone.value).qcd).asDiv
    .value
  );
}

function printGetterExamples() {
  log($S("Instance getters").toTag(`h2`, `head`).value);
  log($S`&hellip; Work in Progress &hellip;`.asNote.asDiv.toTag(`h3`, `head`).value);
  camelCaseEx();
  cloneEx();
  firstUpEx();
  historyEx();
  kebabCaseEx();
  snakeCaseEx();
  trimAllEx();
  trimAllKeepLFEx();
  undoEx();
  undoAllEx();
  valueEx();
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
    `<a id="top"></a>`,
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
  $S.addCustom({name: `qcd`, method(me) { return me.quote.curlyDouble; }, isGetter: true});
  $S.addCustom({name: `asDiv`, method(me) { return me.toTag("div", "normal"); }, isGetter: true});
  $S.addCustom({name: `toCode`, method: me => me.trimAll.toTag(`code`), isGetter: true});
  $S.addCustom({
    name: `asNote`, method: me =>
      me.trim().toTag(`i`).prefix($S`Note`.toTag(`b`, `note`).append(`: `)), isGetter: true
  });
  $S.addCustom({name: `trimEverything`, method: me =>
      me.constructor(trimAllAlternative(me.value)), isGetter: true});
}

function toCodeBlock(str) {
  return `<pre class="line-numbers language-javascript"><code class="language-javascript">${
    str}</code></pre>`;
}

function getCodeblocks(templates) {
  const exampleBlocks = templates.find(`template`);
  
  return [...exampleBlocks].reduce( (acc, block) => {
    const codeTemplate = 
      $S`<pre class="language-javascript line-numbers"><code class="language-javascript">{code}</code></pre>`;
    return { 
      ...acc, 
      [block.id]: `${codeTemplate.clone.format({code: block.content.textContent.trim()})}` };
  }, {});
}

async function fetchTemplates() {
  $.allowTag(`template`);
  return getCodeblocks($.virtual(`<div>${await fetch(`./codeTemplates.txt`).then(r => r.text())}</div>`));
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
        padding: 0 4px;
        display: inline-block;
        border-radius: 4px;
      }`,
    `code.codeblock { 
        background-color: rgb(227, 230, 232);
        color: rgb(12, 13, 14);
        border: none;
        border-radius: 4px;
        max-width: 80vw;
        padding: 4px;
      }`,
    `h2 {font-size: 1.3rem; line-height: 1.4rem}`,
    `pre:not(.language-javascript) {
        font-weight: normal;
        max-width: 400px;
        margin: 0.3rem 0px 0.5rem;;
        code {
          padding: 5px;
        }
    }`,
    `pre:not(.language-javascript).syntax {
      margin-top: 0.2rem;
    }`,
    `pre.language-javascript {
      max-height: 500px;
    }`,
    `b.note { color: red; }`,
    `.normal {
       font-family: system-ui, sans-serif;
       color: var(--grey-default);
       margin: 3px;
     }`,
    `.b5 { margin-bottom: 0.5rem; }`,
    `h1.head, h2.head, h3.head {
      color: var(--grey-default);
      font-family: system-ui, sans-serif;
      margin-bottom: 0.4rem;
    }`,
    `h3.head { 
      font-size: 1.1rem;
     }`,
    `h3.head.between { 
        margin-top: 0.4rem;
     }`,
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
      background-color: transparent;
    }`,
    `a.ExternalLink.arrow:hover::after { 
        fontSize: 0.7rem;
        position: absolute;
        zIndex: 2;
        display: inline-block;
        padding: 1px 6px;
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
  );
}
