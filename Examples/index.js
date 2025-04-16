import {logFactory, $} from "./DOMhelpers.js";
// ↳ see https://github.com/KooiInc/SBHelpers 
import $S from "../index.js";
const exampleCode = await fetchTemplates();
let codeOverlay, performanceText;
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
  initStyling();
  setDelegates();
  const startTime = performance.now();
  createCodeElement().then(_ => Promise.resolve(`ok`));
  addCustomized();
  printInitializationExamples();
  printStaticConstructorFunctionExamples();
  printGetterExamples();
  printMethodExamples();
  printHeader();
  createTOC();
  $.div_jql({class: `bottomSpacer`}, `&nbsp;`).toDOM();
  const time = +((performance.now() - startTime)/1000).toFixed(3);
  performanceText = $S`Performance`.toTag(`b`, `b5`)
    .append(
        $S`Nearly all elements on this page were created using <code>StringWeaver</code>
          <br>(click 'Display code' to inspect the code).`.asDiv,
        $S`Creating the page took <b>${time.toLocaleString()}</b> seconds`.asDiv)
    .value;
  hljs.highlightAll(`javascript`);
}

function printInitializationExamples() {
  log(
    $S`Initialization`
      .toIdTag({tag: "h2", id: "chapter-initialization", className: "head code"})
      .append($S`js-stringweaver 'constructor' was imported as <code>$S</code>`.asNote.toTag(`div`, `normal`))
      .value,
    
    $S`As tagged template`.toIdTag({tag: "h3", id: "initialization-astt", className: "head code"})
      .append($S`${exampleCode.asTaggedTemplateExample}`
        .append(`=> `)
        .append($S`hello world`.qcd))
      .value,
    
    $S`As function call`.toIdTag({tag: "h3", id: "initialization-asfn", className: "head code"})
      .append($S`$S("hello world")`.toCode)
      .append($S(`hello world`).qcd.prefix(` => `)).value,
    
    $S`Instance methods are chainable`
      .toIdTag({tag: "h3", id: "initialization-instance-chainable", className: "head code"})
      .append($S`$S("hello").append(" ", "world").firstUp.enclose("&amp;lt;", "&amp;gt;")`.toCode)
      .append(`<br> => `)
      .append($S("hello").append(" ", "world").firstUp.enclose("&lt;", "&gt;").qcd)
      .value,
    
    $S`Native string function results are chainable`
      .toIdTag({tag: "h3", id: "initialization-native-chainable", className: "head code"})
      .append(
        $S`$S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").quote.guillemetsInward`.toCode,
        `<br>=> `,
        $S("hello world").toUpperCase().replace(/world/i, `UNIVERSE`).quote.guillemetsInward)
      .value,
  );
}

function printStaticConstructorFunctionExamples() {
  const isBundled = $S.constructor.name !== `CustomStringConstructor`;
  // when minified from an online source, this is a possibility
  const constructorLine = isBundled
    ? $S`imported from bundle (minified) =&gt;`.asNote.append(`<code>function ${
        $S.constructor.name}(str, ...args) {...}</code>`)
    : $S`function ${$S.constructor.name}(str, ...args) {...}`.toCode;
  const h3 = (text, id) => `<div class="special"><h3 id="${id}" class="head code">${text}</h3></div>`;
  log(
    $S`Static constructor properties/methods`
      .toIdTag({tag: "h2", id: "chapter-static", className: "head code"}).value,
      $S`${h3("$S.keys", "static-keys")}`
      .toTag(`summary`)
      .append($S`includes user defined custom property/method keys`.asNote)
      .append($S(JSON.stringify($S.keys, null, 2)).toTag(`pre`))
      .toTag(`details`, 'in-content')
      .toTag(`div`, `normal`)
      .value,
    
      $S`${h3("$S.info", "static-info")}`
      .toTag(`summary`)
      .append($S`includes user defined custom properties/methods`.asNote)
      .append($S(JSON.stringify($S.info, null, 2)).toTag(`pre`))
      .toTag(`details`, 'in-content')
      .toTag(`div`, `normal`)
      .value,
    
      $S`${h3("$S.quoteInfo", "static-quoteinfo")}`
      .toTag(`summary`)
      .append($S(JSON.stringify($S.quoteInfo, null, 2)).toTag(`pre`))
      .toTag(`details`, 'in-content')
      .toTag(`div`, `normal`)
      .value,
    
    $S` $S.constructor`.toIdTag({tag: "h3", id: "static-constructor", className: "head code"})
      .append($S`Result: `.prefix(`=> `).toTag(`b`))
      .append(constructorLine)
      .toTag(`div`, `normal`)
      .value,
  );
  regExpEx();
  addCustomEx();
  uuid4Ex();
  randomStringEx();
}

function printGetterExamples() {
  log($S("Instance getters").toIdTag({tag: "h2", id: "chapter-getter", className: "head code"}).value);
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
  wordsFirstUpEx();
}

function printMethodExamples() {
  log(
    $S("Instance methods")
      .toIdTag({tag: "h2", id: "chapter-method", className: "head code"})
      .value );
  appendEx();
  encloseEx();
  formatEx();
  indexOfEx();
  insertEx();
  interpolateEx();
  lastIndexOfEx();
  prefixEx();
  replaceWordsEx();
  truncateEx();
  undoLastEx();
}

/* region static constructor function examples */
function regExpEx() {
  const reDemo = $S.regExp`
      ^[\p{L}]              //=> always start with a letter
      [\p{L}_\.#\-\d+~=!]+  //=> followed by letters including _ . # - 0-9 ~ = or !
      ${[...'gui']}         //=> flags ([g]lobal, case [i]nsensitive, [u]nicode)`;
  log(
    $S` $S.regExp`.toIdTag({tag: "h3", id: "static-regexp", className: "head code"})
      .append(exampleCode.regExpExample)
      .append($S`Result`.toTag(`b`).prefix(`=> `)
        .append(`: `, $S(reDemo.toString()).toCode).toTag(`div`, `normal`))
      .value,
  );
}

function addCustomEx() {
  log(
    $S` $S.addCustom`
      .toIdTag({tag: "h3", id: "static-addcustom", className: "head code"})
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

function uuid4Ex() {
  log(
    $S` $S.uuid4`.toIdTag({tag: "h3", id: "static-uuid4", className: "head code"})
    .append(
      $S`$S.uuid4`.toCode,
      ` => `,
      $S`${$S.uuid4}`.qcd
    )
    .asDiv
    .value
  );
}

function randomStringEx() {
  log(
    $S` $S.randomString`.toIdTag({tag: "h3", id: "static-randomstring", className: "head code"})
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
/* endregion static constructor function examples */

/* region getter examples */
function camelCaseEx() {
  log(
    $S(" .camelCase").toIdTag({tag: "h3", id: "getter-camelcase", className: "head code"})
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
  const toClone = $S("I shall be ").append("cloned");
  const cloned = toClone.clone.replace("shall be", "was").append(", yeah!");
  
  log(
    $S(" .clone").toIdTag({tag: "h3", id: "getter-clone", className: "head code"})
      .append( $S`Clone the instance.`.asDiv )
      .append( $S("the history of the originating instance is also cloned")
        .asNote
        .toTag("div", "normal b5"))
      .append( exampleCode.cloneExample )
      .append(
        $S`toClone.history`.toCode.append($S`${JSON.stringify(toClone.history)}`.prefix("=>")).asDiv,
        $S`cloned.history`.toCode.append($S`${JSON.stringify(cloned.history)}`.prefix("=>")).asDiv,
        $S`cloned`.toCode.append(cloned.qcd.prefix("=>")).asDiv,
        $S`toClone`.toCode.append(toClone.qcd.prefix("=>")).asDiv
      ).value,
  );
}

function firstUpEx() {
  log(
    $S(" .firstUp").toIdTag({tag: "h3", id: "getter-firstup", className: "head code"})
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
    $S(" .history").toIdTag({tag: "h3", id: "getter-history", className: "head code"})
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
    $S(" .snakeCase").toIdTag({tag: "h3", id: "getter-snakecase", className: "head code"})
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
    $S(" .kebabCase").toIdTag({tag: "h3", id: "getter-kebabcase", className: "head code"})
      .append( $S`Tries converting 
            the instance string to <a target="_blank" class="ExternalLink arrow"
            href="https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case"
            >Kebab case</a> (aka 'dashed notation'), 
            meaning that all words of a string 
            will be converted to lower case. All non-letters/-numbers 
            (<b>not</b> a-z, A-Z <i>including diacriticals</i>) 
            will be removed and the converted words will be concatenated 
            with hyphens. May be useful for css- or data-attributes.`
        .toTag("div", "normal b5") )
      .append(
        $S("$S`ConvertMe`.kebabCase").toCode
          .append( $S`ConvertMe`.kebabCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert-Me _Please`.kebabCase").toCode
          .append( $S`Convert Me _Please`
            .kebabCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert Me --&nbsp;&nbsp;&nbsp;&nbsp;Please`.kebabCase").toCode
          .append( $S`Convert Me --    Please`
            .kebabCase.qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`Convert Me, _pl<b class='red'>ë</b>ase  $#!`.kebabCase").toCode
          .append( $S`Convert Me, _Plëase $#!`.kebabCase
            .replace("plase", "<b class='red'>plase</b>")
            .qcd.prefix(" => ")).asDiv )
      .append(
        $S("$S`42 Convert Me, &Please`.kebabCase").toCode
          .append( $S`42 Convert Me, &Please`
            .kebabCase.qcd.prefix(" => ")).asDiv )
      .value,
  );
}

function trimAllEx() {
  const [cleanupStr1, cleanupStr2] = [
    `<pre class="codebox"><code>$S\`clean me
            
            
            please! \`.trimAll</code></pre>`,
    `clean me
        
      up    ,
        
        ( please ! )   
      {  ok  ? }
    `];
  
  log(
    $S(" .trimAll").toIdTag({tag: "h3", id: "getter-trimall", className: "head code"})
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
        $S`<pre class="codebox"><code>$S\`clean me
        
            up    ,
        
            ( please !  )   
          {  ok  ? }
          \`.trimAll</code></pre>`
          .append( `<pre>${$S`${cleanupStr2}`.trimAll.qcd.prefix(" => ")}</pre>`).asDiv )
      .append(
        $S`Example 2a`.toTag(`h3`, `head between`),
        $S("We created a custom getter called <code>trimEverything</code> with a " +
          "different approach to this").asDiv,
        $S`(go to the <a href="#top">page top</a>, click 'Display code' and scroll to 
            <code>function trimAllAlternative</code>...).
            It's pretty convoluted and<br>not perfect, but hey, it's an idea ...`.asDiv,
        $S`<pre class="codebox"><code>$S\`clean me
        
            up    ,
        
            ( please !  )   
          {  ok  ? }
          \`.trimEverything</code></pre>`
          .append( `<pre>${$S`${cleanupStr2}`.trimEverything.qcd.prefix(" => ")}</pre>`).asDiv )
      .value,
  );
}

function trimAllKeepLFEx() {
  const cleanupStr = `<pre class="codebox"><code>$S\`clean me
            
            
            please! \`.trimAllKeepLF</code></pre>`;
  log(
    $S(" .trimAllKeepLF").toIdTag({tag: "h3", id: "getter-trimallkeeplf", className: "head code"})
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
    $S(" .undo").toIdTag({tag: "h3", id: "getter-undo", className: "head code"})
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
    $S(" .undoAll").toIdTag({tag: "h3", id: "getter-undoall", className: "head code"})
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
  emptyClone.append({hello: 1, world: 2})   // nothing happens
  emptyClone.value += {hello: 1, world: 2}; // stringified

  log(
    $S(" .value").toIdTag({tag: "h3", id: "getter-value", className: "head code"})
    .append(
      `<br>`,
      $S`<code>.value</code> is a getter and a setter for the instance string value.`,
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

function wordsFirstUpEx() {
  log(
    $S(" .wordsUCFirst").toIdTag({tag: "h3", id: "getter-wordsucfirst", className: "head code"})
      .append( $S`Converts the first letter of every word of the instance string to upper case.`
        .toTag("div", "normal b5") )
      .append(
        $S("$S`hello world`.wordsUCFirst").toCode,
        $S`hello world`.wordsUCFirst.qcd.prefix(" => ")).asDiv
      .append(
        $S("$S`   hello world and whatNOT`.trim().wordsUCFirst").toCode,
        $S`   hello world and whatNOT`.trim().wordsUCFirst.qcd.prefix(" => ")).asDiv
      .value,
  );
}
/* endregion getter examples */

/* region method examples */
function appendEx() {
  log(
    $S(" .append(...values:[string|instance])").toIdTag({tag: "h3", id: "method-append", className: "head code"})
      .append( 
        $S`Append one or more strings/instances to the instance string value`.toTag("div", "normal b5")
        .append(
          $S('$S`Hello`.append(" ","world.", " ", "Here is a random string: ", $S.randomString())').toCode,
          `<br>=> `,
          $S`Hello`.append(" ", "world.", " ", "Here is a random string: ", $S.randomString()).qcd
        )
      )
      .asDiv
      .value
  );
}

function encloseEx() {
  log(
    $S(" .enclose(start:string|instance[, end:string|instance])")
      .toIdTag({tag: "h3", id: "method-enclose", className: "head code"})
      .append(
        $S("Surround instance string with <code>[start]</code> and/or <code>[end]</code>" +
          ". If <code>end</code> is not given, <code>start</code> is used as <code>end</code> value.")
       .toTag("div", "normal b5")
          
        .append(
          $S('$S`Hello world`.enclose("--- ", "  ---")').toCode
            .append(
              ` => `,
              $S`Hello world`.enclose("--- ", "  ---").qcd
            ).asDiv
        )
        .append(
          $S('$S`Hello world`.enclose("**")').toCode
            .append(
              ` => `,
              $S`Hello world`.enclose("**").qcd
            ).asDiv
        )
        .append(
          $S('$S`Hello world`.enclose($S("=&gt;"), "&lt;=")').toCode
            .append(
              ` => `,
              $S`Hello world`.enclose($S("=&gt;"), "&lt;=").qcd)
            .asDiv
        )
        .append(
          $S('$S`Hello world`.enclose("=&gt;", $S("&lt;")').toCode
            .append(
              ` => `,
              $S`Hello world`.enclose("=&gt;", $S("&lt;=")).qcd)
            .asDiv,
          `<br>`
        )
        .append($S`if one of the values is not a string or instance, 
          the instance value will not change`.asNote.asDiv)
        .append(
          $S('$S`Hello world`.enclose([1,2,3], "&lt;")').toCode
            .append(
              ` => `,
              $S`Hello world`.enclose([1,2,3]).qcd)
            .asDiv
        )
        .append(
          $S('$S`Hello world`.enclose("hithere", {hi: 1})').toCode
            .append(
              ` => `,
              $S`Hello world`.enclose("hithere", {hi: 1}).qcd)
            .asDiv
        )
      )
      .asDiv
      .value
  );
}

function formatEx() {
// the tokens used for tableRowTemplate
  const theNames = [
    { pre: "Mary", last: "Peterson" },
    { pre: "Muhammed", last: "Ali" },
    { pre: "Missy", last: "Johnson" },
    { pre: "Hillary", last: "Clinton" },
    { pre: "Foo", last: "Bar" },
    { pre: "Bar", last: "Foo" },
    { pre: "小平", last: "邓" },
    { pre: "Володимир", last: "Зеленський" },
    { pre: "zero (0)", last: 0 },
    { pre: "Row", last: 10 },
    { pre: "replacement {last} is empty string", last: '' },
    { pre: "<i class='notifyHeader'>Non string values: ignored</i>", last: "<span class='largeArrowDown'></span>" },
    { pre: "replacement {last} is array", last: [1, 2, 3] },
    { pre: "replacement {last} is null", last: null },
    { pre: "replacement {last} is object", last: {} },
    { pre: "replacement {last} is undefined", last: undefined },
    { pre: "<i class='notifyHeader'>Missing keys: ignored</i>", last: "<span class='largeArrowDown'></span>" },
    { last: "key {pre} not in token" },
    { pre: "key {last} not in token" },
    { pre: "<i class='notifyHeader'>Empty token ({}), or invalid keys</i>", last: "<span class='largeArrowDown'></span>" },
    {},
    { some: "nothing to replace", name: "nothing" },
    { pre: "<i class='notifyHeader'>invalid token (array): not included</i>", last: "<span class='largeArrowDown'></span>" },
    ["nothing", "nada", "zip", "没有什么",
      "niente", "rien", "ничего"]
  ];
  
  const tableRows = $S("<tr><td>{pre}</td><td>{last}</td></tr>").format(...theNames);
  
  const tableTemplate = $S(
    "<table>\
      <caption>{caption}</caption>\
      <tr>\
        <th>prename</th>\
        <th>surname</th>\
      </tr>\
      <tbody>{rows}</tbody>\
    </table>");
  
  const exampleTable = tableTemplate.format({
    caption: `<code>tableRowTemplate.format(...)</code> using <code>theNames</code>`,
    rows: tableRows.value } );
  
  const allInOne = $S(" .format(...token:object&lt;string, string>)")
    .toIdTag({tag: "h3", id: "method-format", className: "head code"})
    .append(
      $S`Fills the instance string value (formatted as a string containing template placeholder(s) 
        <code>{[key]}</code>) with values from the <code>token</code>(s) given.`.asDiv,
      $S`Visit the <a target="_blank" class="externalLink arrow" href="https://github.com/KooiInc/StringInterpolator"
        >StringInterpolator</a>  module to learn more.`.asDiv
    ).toTag("div", "normal b5")
    .append(exampleCode.formatExample)
    .append($S`exampleTable`.toCode).append(` =>`).toTag("div", "normal b5")
    .append(exampleTable);
  
  log(allInOne.value);
}

function indexOfEx() {
  const initial = $S`hello world`;
  const word2Universe = instance =>
    instance.indexOf("rld")
      ? instance.replace("world", "universe").firstUp
      : instance;
  word2Universe(initial);
  
  log(
    $S(" .indexOf(str2Find:string,[ fromIndex:number])")
      .toIdTag({tag: "h3", id: "method-indexof", className: "head code"})
      .append(
        $S("indexOf").toCode,
        " (as well as ",
        $S("lastIndexOf)").toCode,
        " overrides the native ",
        $S("String.prototype.indexOf").toCode,
        $S` method`
          .append(
            ` (see <a target="_blank"
            href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf"
            >MDN</a>).`
          )
      ).toTag("div", "normal b5")
      
      .append(
        $S("The override returns "),
        $S("undefined").toCode,
        " if the string to search was not found, instead of ",
        $S("-1").toCode,
        ".").asDiv
      .value
  );
  
  log($S(exampleCode.indexOfExample).asDiv
    .append(
      $S`String(initial)`.toCode,
      " => ",
      initial.qcd.value
    ).asDiv.value
  );
}

function insertEx() {
  log(
    $S(" .insert({value:string|instance, values:string|instance|[string|instance], at:number=0})")
      .toIdTag({tag: "h3", id: "method-insert", className: "head code"})
      
    .append(
      $S`Inserts either <code>[value]</code> or <code>[values]</code> into the instance string value
       at position <code>[at]</code>. <code>at</code> may be negative. For an <code>at</code>-value 
        exceeding the instance string length, the value(s) will be appended. 
        If <code>at</code> is not given, the value(s) will be prefixed to the instance value.
        if <code>value</code> or one of the <code>values</code> is not a string or instance,
        will do nothing.` 
    ).toTag("div", "normal b5")

    .append(
      $S('$S("hello world").insert({values: "dear ", at: 6})')
        .toCode
        .append(` => `, $S("hello world").insert({values: "dear ", at: 6}).qcd.value)
    ).asDiv

    .append(
      $S('$S("hello world").insert({values: ["oh", " ", "dear", " "] , at: 6})')
        .toCode
        .append(` => `, $S("hello world").insert({values: ["oh", " ", "dear", " "], at: 6}).qcd.value)
    ).asDiv
    
    .append(
      $S('$S("hello world").insert({values: ["oh", " ", $S`dear`.festive, " "] , at: 6})')
        .toCode
        .append(` => `, $S("hello world").insert({values: ["oh", " ", $S`dear`.festive, " "], at: 6}).qcd.value)
    ).asDiv
      
    .append(
      $S('$S("hello world").insert({value: $S("I say").festive})')
        .toCode
        .append(` => `, $S("hello world").insert({value: $S("I say").festive}).qcd.value)
    ).asDiv
      
    .append(
      $S('$S("hello world").insert({values: "So, i said: "' +
        '<span class="cmmt">// Note: valueS may also be single string</span>"})')
        .toCode
        .append(` => `, $S("hello world").insert({values: "So, i said: "}).qcd.value)
    ).asDiv
      
    .append(
      $S('$S("hello world").insert({values: ["42"], at: 100})')
        .toCode
        .append(` => `, $S("hello world").insert({values: [" 42"], at: 100}).qcd.value)
    ).asDiv
      
    .append(
      $S('$S("hello world").insert({values: [42]})')
        .toCode
        .append(` => `, $S("hello world").insert({values: [42]}).qcd.value)
    ).asDiv
      
    .append(
      $S('$S("hello world").insert({value: {value: 1}})')
        .toCode
        .append(` => `, $S("hello world").insert({value: 1}).qcd.value)
    ).asDiv
      
    .append(
      $S('$S("hello world").insert()')
        .toCode
        .append(` => `, $S("hello world").insert().qcd.value)
    ).asDiv
      
    .value
  );
}

function interpolateEx() {
  log($S(" .interpolate(...token:object&lt;string, string>)")
    .toIdTag({tag: "h3", id: "method-interpolate", className: "head code"})
    .append(
      $S`Alias for <code><a
        class="externalLink arrow"
        target="_top"
        data-internal="[instance].format example" href="#method-format">[instance].format</a></code>`.asDiv
    ).toTag("div", "normal b5").value
  ) 
}

function lastIndexOfEx() {
  const initial = $S`hello world world`;
  const lastWord2Universe = instance =>
    instance.slice(0, instance.lastIndexOf("world") ?? instance.length)
      .append(" and universe");
  lastWord2Universe(initial);
  
  log(
    $S(" .lastIndexOf(lastStr2Find:string[, beforeIndex:number])")
      .toIdTag({tag: "h3", id: "method-lastindexof", className: "head code"})
      .append(
        $S("lastIndexOf").toCode,
        " (as well as ",
        $S("indexOf)").toCode,
        " overrides the native ",
        $S("String.prototype.lastIndexOf").toCode,
        $S` method`
          .append(
          ` (see <a target="_blank"
            href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf"
            >MDN</a>).`
          )
      ).toTag("div", "normal b5")
      .append(
        $S("The override returns "),
        $S("undefined").toCode,
        " if the string to search was not found, instead of ",
        $S("-1").toCode,
        ".").asDiv
      .value
  );
  
  log($S(exampleCode.lastIndexOfExample).asDiv
    .append(
      $S`initial.value`.toCode,
      " => ",
      initial.qcd.value
    ).asDiv.value
  );
}

function prefixEx() {
  log(
    $S(" .prefix(...strings2Prefix:[string])")
      .toIdTag({tag: "h3", id: "method-prefix", className: "head code"})
      
    .append(
      $S`Prefixes <code>[strings2Prefix]</code> to the instance string value in the
          order of the strings from <code>strings2Prefix</code>.
          Will do nothing if one of the given <code>strings2Prefix</code> is not a string or instance.`
    ).toTag("div", "normal b5")
      
    .append(
      $S`$S("world").prefix("hello", " ")`.toCode
        .append(` => `, $S("world").prefix("hello", " ").qcd.value)
    ).asDiv
      
    .append(
      $S`$S("world").prefix("hello", " and", " ", "then again ... bye ")`.toCode
        .append(` => `, $S("world").prefix("hello", " and", " ", "then again ... bye ").qcd.value)
    ).asDiv
      
    .append(
      $S`$S("world").prefix()`.toCode
        .append(` => `, $S("world").prefix().qcd.value)
    ).asDiv
      
    .append(
      $S`$S("world").prefix(42, "Hello ")`.toCode
        .append(` => `, $S("world").prefix(42, "Hello ").qcd.value)
    ).asDiv
      
    .append(
      $S`$S("world").prefix($S\`Hello! \`.toTag("b").toTag("i", "green"), "hello ").festive`.toCode
        .append(` => `, $S("world").prefix($S`Hello! `.toTag(`b`).toTag(`i`, `green`), "hello ").festive.value)
    ).asDiv
   .value
  );
}

function replaceWordsEx() {
  const ex1 = $S("replace me").replaceWords({
    replacements: {replace: "Hello", me: "world"} });
  const ex2 = $S("replace me").replaceWords({
    replacements: {replace: "Hello", ME: "world"},
    caseSensitive: true });
  const ex2a = $S("replace me").replaceWords({
    replacements: {rePLAce: "Hello", ME: "world"} });
  const ex3 = $S("replace /.+me\\").replaceWords({
    replacements: {replace: "Hello", "/.+me\\": $S`world`.quote.squareBrackets}});
  const ex4 = $S("repläce me").replaceWords({
    replacements: {"repläce": "Hello", me: $S`세계`.festive}});
  const ex5 = ex4.clone.replaceWords({
    replacements: {"🎉": "😋"} });
  
  log(
    $S(" .replaceWords({replacements:object, caseSensitive:boolean=false})")
      .toIdTag({tag: "h3", id: "method-replacewords", className: "head code"})
    
    .append(
      $S`Replaces <code>replacements</code> keys with <code>replacements</code> values.`
    ).toTag("div", "normal b5")
      
    .append(exampleCode.replaceWordsExample)
      
    .append(
        $S`ex1`.toCode.append(` => `, ex1.qcd.value)
    ).asDiv
      
    .append(
      $S`ex2`.toCode.append(` => `, ex2.qcd.value)
    ).asDiv
      
    .append(
      $S`ex2a`.toCode.append(` => `, ex2a.qcd.value)
    ).asDiv

    .append(
      $S`ex3`.toCode.append(` => `, ex3.qcd.value)
    ).asDiv
      
    .append(
      $S`ex4`.toCode.append(` => `, ex4.qcd.value)
    ).asDiv
      
    .append(
      $S`ex5`.toCode.append(` => `, ex5.qcd.value)
    ).asDiv
      
    .value
  );
  
}

function truncateEx() {
  const testStr = $S`Lorem ipsum dolor {sit} [a]met, consectetur adipiscing elit, 
   sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
   quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
   Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
   (nulla) pariatur. Excepteur sint occaecat cupidatat non proident, 
   sunt in culpa qui officia deserunt mollit anim id est laborum.`.trimAll;
  const examples = {
     ex1: testStr.clone.truncate({at: 15}),
     ex2: testStr.clone.truncate({at: 35, wordBoundary: true}),
     ex3: testStr.clone.truncate({at: 20, html: true}),
     ex4: testStr.clone.truncate({at: 20, html: true, wordBoundary: true}),
     ex5: testStr.clone.truncate({at: 28, html: true, wordBoundary: true}),
     ex6: testStr.clone.truncate({at: 355, html: true}),
     ex7: testStr.clone.truncate({at: 340, html: true, wordBoundary: true}),
     ex8: testStr.clone.truncate({at: 27, wordBoundary: true})  
  };
  
  const allInOne = $S(" .truncate({at:number, html:boolean=false, wordBoundary:boolean=false})")
    .toIdTag({tag: "h3", id: "method-truncate", className: "head code"})
    .append(
      $S`Truncates the instance string value at position <code>[at]</code> and append 
        either three dots ("..." <code>html: false</code>) or "&amp;hellip; (&hellip;)" <code>html: true</code>.
        If <code>wordBoundary</code> is true truncation is done at the nearest possible word boundary (of the
        the truncated string). Word boundaries are for example ;, ), }, &lt;space>, &lt;tab> ... etc.`
    ).toTag("div", "normal b5")
    .append(exampleCode.truncateExample);
  
  const exLen = Object.keys(examples).length;
  
  for (let i = 0; i < exLen; i += 1) {
    allInOne.append(
      $S`ex${i+1}`
        .toCode
        .append(` => `, examples[`ex${i+1}`].qcd).value).asDiv;
  }
  
  log(allInOne.value);
}

function undoLastEx() {
  const undoExample = $S("START");
  undoExample
    .prefix("Hello")
    .insert({value: " ... ", at: 5})
    .append(" ... ")
    .append("world")
    .festive;
  const cloned = undoExample.clone;
  const examples = {
    get ex1() { return undoExample; },
    get ex2() { return undoExample.undoLast(1); },
    get ex3() { return undoExample.undoLast(2); },
    get ex4() { return undoExample.undoLast(10); },
    get ex5() { return cloned.undoLast(1); },
    get ex6() { return cloned.undoLast(-3); },
  };
  
  const allInOne = $S(" .undoLast(nSsteps:number)")
    .toIdTag({tag: "h3", id: "method-undolast", className: "head code"})
    .append(
      $S`Sets the instance value back to <code>nSteps</code> in its history` )
    .toTag("div", "normal b5")
    
    .append(exampleCode.undoLastExample)
      
    .append($S`<code>undoExample.history</code>`
      .append(" => ", `[${undoExample.history.join(`, `)}]`).asDiv)
    
    .append($S`<code>cloned.history</code>`
      .append(" => ", `[${cloned.history.join(`, `)}]`).asDiv);
  
  const exLen = Object.keys(examples).length;
  
  for (let i = 0; i < exLen; i += 1) {
    allInOne.append(
      $S`ex${i+1}`
        .toCode
        .append(` => `, $S`${examples[`ex${i+1}`]}`.qcd)).asDiv;
  }
  
  log(allInOne.value);
}
/* endregion method examples */

function printHeader() {
  logTop(
    $S`<button id="performance">Page performance</button>
       &nbsp;<button id="codeVwr" data-code-visible="hidden"></button> used in this page`
      .append($S`&nbsp;`).toTag(`div`, `normal`).value,
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
  $(`#log2screen`).beforeMe($.div({id: `top`}));
}

async function createCodeElement() {
  const code = await(fetch("./index.js"))
    .then(res => res.text());
  codeOverlay = $.div_jql(
    {id: "codeOverlay"},
    $.pre({class: "codebox", id: "overlayed"},
      $.code({class: "hljs language-javascript"}, 
        code.replace(/</g, `&lt;`).replace(/>/g, `&gt;`)) ) )
    .hide();
}

function addCustomized() {
  $S.addCustom({name: `enclose`, method: (me, start, end) => me.enclose(start, end)});
  /* ↳ this will do nothing. It displays an error in the console
     because 'enclose' is already an instance method */
  $S.addCustom({name: "festive", method: me => me.enclose("\u{1F389}"), isGetter: true});
  $S.addCustom({
    name: "toTag", method: (me, tagName, className) => {
      className = $S(className);
      className.length && className.quote.double.prefix($S(" class="));
      return me.enclose($S(tagName).append(className).enclose("<", ">"), $S(tagName).enclose("<\/", ">"));
    }
  });
  $S.addCustom({
    name: "toIdTag", method: (me, {tag, id, className} = {}) => {
      tag = getStringValue(tag);
      if (!tag) { return me; }
      className = $S(className);
      id = $S(id);
      className.length && className.quote.double.prefix($S(" class="));
      id.length && id.quote.double.prefix(" id=");
      return me.enclose($S(tag).append(className, id).enclose("<", ">"), $S(tag).enclose("<\/", ">"));
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

function getStringValue(string) {
  return string?.value || (string?.constructor === String && string);
}

function toCodeBlock(str) {
  return `<pre class="codebox"><code>${
    str.trim()}</code></pre>`;
}

function getCodeblocks(templates) {
  const exampleBlocks = templates.find(`template[id]`);
  
  return [...exampleBlocks].reduce( (acc, block) => {
    const codeTemplate = 
      $S`<pre class="codebox"><code class="language-javascript">{code}</code></pre>`;
    return {
      ...acc, 
      [block.id]: `${codeTemplate.clone.format({code: block.content.textContent.trim()})}` };
  }, {});
}

async function fetchTemplates() {
  $.allowTag(`template`);
  return getCodeblocks($.virtual(`<div>${await fetch(`./codeTemplates.txt`).then(r => r.text())}</div>`));
}

function setDelegates() {
  $.delegate(`click`, `#codeVwr, #performance`, evt => {
    if (evt.target.id === "performance") {
      return $.Popup.show({ content: performanceText });
    }
    const bttn = evt.target;
    const parentLi = bttn.closest(`li`);
    const isVisible = bttn.dataset?.codeVisible === `visible`;
    
    if (isVisible) {
      codeOverlay.hide();
      return bttn.dataset.codeVisible = `hidden`;
    }
    
    if (!parentLi.querySelector(`#codeOverlay`)) {
      codeOverlay.toDOM(parentLi).appendTo($(bttn).parent);
      hljs.highlightElement($.node(`#overlayed code`));
    }
    
    codeOverlay.show();
    return bttn.dataset.codeVisible = `visible`;
  });
  $.delegate(`click`, `.toc, details .toc`, evt => {
    const fromDetailsElement = evt.target.closest(`details.in-content`);
    $.node(`#top`).scrollIntoView({behavior: "smooth"});
    
    if (fromDetailsElement) {
      evt.preventDefault();
      $(`.in-content`).each(el => el.open = false);
    }
    setTimeout(_ => document.body.scrollTop = 0, 400);
    return;
  });
  $.delegate(`click`, `.lemma`, (_, me) => {
    $(`.lemma[data-active='1']`).data.set({active: "0"});
    me.data.set({active: "1"});
    setTimeout(_ => document.body.scrollTop -= 16);
  });
}

function createTOC() {
  $.nodes(`h3.head.code`).forEach(head => {
    $(head).append(`<span class='toc'></span>`);
  })
  const chapters = $.nodes(`[id^=chapter]`);
  const toc = [];
  chapters.forEach((chapter) => {
    const lemmaX = chapter.id.split(`-`).pop();
    const detailElem = $.details_jql(
      {data: {toc: 1}},
      $.summary(chapter.textContent)
    );
    
    $.nodes(`h3[id^=${lemmaX}]`)
      .forEach( lemma => {
        let text = lemma.textContent;
        text = /\(/.test(text) ? lemma.textContent.slice(0, text.indexOf(`(`)+1).trim() + `...)` : text;
        detailElem.append($.a_jql({class: "lemma", textContent: text, href: `#${lemma.id}`}))
      });
    
    toc.push(detailElem);
  });
  
  const tocElem = $($.node(`#codeVwr`).closest(`li`).querySelector(`div`))
    .append($.h2({id: "TOCElem", class: `head code`}, `Content`));
  toc.forEach(chapter => tocElem.append(chapter));
}

function initStyling() {
  // style rules are stored in the JQL style element (head)style#JQLStylesheet
  const arrowRepeat = $S` ⬇ `.repeat(5).enclose(`"`);
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
      content: 'Display code';
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
    `pre.codebox {
      box-shadow: 2px 2px 6px #555;
      border-radius: 6px;
      max-height: 500px;
      overflow: auto;
    }`,
    `code.hljs {
      background-color: #343636;
    }`,
    `code {
      color: revert;
      background-color: revert;
      padding: revert;
      font-family: revert;
    }`,
    `code:not(.codeblock, .hljs) {
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
        padding: 4px;
      }`,
    `h2 {font-size: 1.3rem; line-height: 1.4rem}`,
    `pre:not(.codebox).syntax {
      margin-top: 0.2rem;
    }`,
    `b.note { color: red; }`,
    `.normal {
       font-family: system-ui, sans-serif;
       color: var(--grey-default);
       margin: 3px 0;
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
    `h3.head.code {
      font-family: monospace;
      color: rgb(98 109 147);
      padding: 0.2em;
      border-bottom: 1px solid #DDD;
      font-size: 1.1em;
      &:before {
        content: '✓ '; 
      }
    }`,
    `div .toc {
      position: relative;
      display: inline-block;
      float: right;
      cursor: pointer;
      &:before {
        content: "☝";
        font-size: 1.2em;
      }
      &:hover::after {
        content: 'back to top';
        margin: -0.3rem 0px 0px -7rem;
      }
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
        
        div.special {
          display: inline-block;
          width: 98%;
        }
        
        .head {
          margin: 0;
          div {
            display: block;
          } 
        }
      }
    }`,
    `a.ExternalLink {
      background-color: transparent;
    }`,
    `a.ExternalLink.arrow:hover::after, .toc:hover::after { 
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
    `a.ExternalLink[data-internal].arrow:hover::after {
      content: ' navigate to 'attr(data-internal);
    }`,
    `a.ExternalLink[target="_top"]:not([data-backto], [data-internal]).arrow:hover::after {
      content: ' navigates back to 'attr(href);
    }`,
    `a.ExternalLink[target="_blank"].arrow:hover::after {
      content: ' Opens in new tab/window';
    }`,
    `a.lemma {
      text-decoration: none;
      color: #777;
      margin-left: 1rem;
      display: block;
      &:hover {
        text-decoration: underline;
      }
      &:before {
        content: "✓ ";
      }
      &[data-active='1'] {
        background-color: #eee;
        color: red;
      }
    }`,
    `table {
      margin: 1rem 0;
      font-family: verdana;
      font-size: 0.9rem;
      border-collapse: collapse;
      max-width: 100%;
     }`,
    `table caption {
      border: 1px solid #ccc;
      padding: 0.5rem;
      font-size: 14px;
      white-space: nowrap;
     }`,
    `table:not(.hljs-ln) tbody tr:nth-child(even) { background-color: #eee; }`,
    `table:not(.hljs-ln) td, table th { padding: 2px 4px; font-size: 14px; height: 18px}`,
    `table:not(.hljs-ln) th { backgroundColor: #999; color: #FFF; }`,
    `table:not(.hljs-ln) tr td:first-child,
     table:not(.hljs-ln) tr th:first-child {text-align: right; padding-right: 0.5rem; width:50%}`,
    `th { 
      font-weight: bold;
      text-align: left;
      border-bottom: 1px solid #999; 
    }`,
    `.largeArrowDown:before{
      content: ${arrowRepeat};
      color: #555; 
    }`,
    `.notifyHeader { 
      color: #555;
      &:before {
        content: '* ';} 
    }`,
    `.bottomSpacer {
      min-height: 100vh;
    }`,
  );
}
