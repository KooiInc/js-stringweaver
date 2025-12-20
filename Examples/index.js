// noinspection JSValidateTypes
const {
  $, $S, codeOverlay, exampleCode, SB,
  print2Document, useBundle, load} = await initialize({useBundle: true});
main();

function main() {
  window.$S = $S; // try out in console
  printExamples();
  finish();
}

function printExamples() {
  printHeader();
  printInitializationExamples();
  printStaticConstructorFunctionExamples();
  printGetterExamples();
  printMethodExamples();
}

function printInitializationExamples() {
  const ex1 = `hello world`[Symbol.toSB].wordsUCFirst;
  const ex2 = "hello world"[SB].append(`!`).firstUp;
  const wrld = `world`;
  const ex3 = `hello ${wrld}`[SB].firstUp.quote.custom(`¡`, `!`);
  const allExamples = [
       $S.create
      .append($S`js-stringweaver 'constructor' was imported as <code>$S</code>`.asNote.asDiv)
      .append($S`output string values in this document are intentionally `
        .append($S`quoted`.qcd)
        .append(` where applicable`)
        .asNote
        .asDiv
      ).value,

    createChapter(
      $S`Initialize using tagged template function`.toTag("h3", "summary"),
      $S`${exampleCode.asTaggedTemplateExample}`
        .append($S`hello world`.qcd.prefix(`=> `).asSpacedDiv),
      "initialization-astt"
    ),

    createChapter(
      $S`Initialize using function call`.toTag("h3", "summary"),
      $S`$S("hello world")`.toCode
        .append($S(`hello world`).qcd.prefix(` => `).asSpacedDiv),
      "initialization-asfn"
    ),

    createChapter(
      $S`Initialize using the predefined [Symbol.toSB] String getter extension`.toTag("h3", "summary"),
      $S`The StringWeaver module contains a symbolic getter extension (<code>Symbol.toSB</code>) for <code>String.prototype</code>.`
        .asDiv
        .append($S`With it, one can create a StringWeaver instance from a plain JS string.`.asDiv)
        .append(exampleCode.SymbolicExtensionExample)
        .append("ex1"[SB].toCode.append(ex1.qcd.prefix(` => `)).asSpacedDiv)
        .append("ex2"[SB].toCode.append(ex2.qcd.prefix(` => `)).asSpacedDiv)
        .append("ex3"[SB].toCode.append(ex3.qcd.prefix(` => `)).asSpacedDiv),
      "initialization-symbolic"
    ),

    createChapter(
      $S`Instantiation always returns an instance with a string`.toTag("h3", "summary"),
      $S`Everything one throws at the constructor will result in an instance with a string value. If the parameter
        is not a string or template string, the instance value will be an empty string`.toTag("div", "normal b5")
        .append($S`$S()`.toCode.append($S().qcd.prefix(` => `)).asSpacedDiv)
        .append($S`$S("hello world")`.toCode.append($S(`hello world`).qcd.prefix(` => `)).asSpacedDiv)
        .append($S`$S([1,2,3])`.toCode.append($S([1,2,3]).qcd.prefix(` => `)).asSpacedDiv),
      "initialization-alwaysstring"
    ),

    createChapter(
      $S`Instance methods are chainable`.toTag("h3", "summary"),
      $S`\$S("hello").append(" ", "world").firstUp.enclose("&amp;lt;", "&amp;gt;")`.toCode
        .append($S("hello").append(" ", "world").firstUp.enclose("&lt;", "&gt;").qcd.prefix(`=> `).asSpacedDiv),
      "initialization-instance-chainable"
    ),

    createChapter(
      $S`Native string function results are chainable`.toTag("h3", "summary"),
      $S`<code>\$S("hello world").<i class="red">toUpperCase</i>().<i class="red">replace</i>(/world/i, "UNIVERSE")
        .quote.guillemetsInward</code>`
        .append($S("hello world").toUpperCase().replace(/world/i, `UNIVERSE`)
          .quote.guillemetsInward.prefix(`=> `).asSpacedDiv),
      "initialization-native-chainable"
    ),

    createChapter(
      $S`Native .toString/.valueOf are overridden`.toTag("h3", "summary"),
      $S`To retrieve the instance string value one can use its <code>value</code> property
          or use the <code>[string].toString</code> or <code>[string].valueOf</code> overrides.
          `.toTag("div", "normal b5")

      .append($S`$S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").value`.toCode
        .append(
          $S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").qcd.prefix(`=> `).asSpacedDiv
        ).asDiv
      )

      .appendDiv(``,
        $S`$S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").toString()`.toCode
          .appendDiv(`b5`, `=> `,
            $S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").qcd.toString())
      )

      .appendDiv(``,
        $S`$S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").valueOf()`.toCode
          .appendDiv(`b5`, `=> `,
            $S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").qcd.valueOf())
      )

      .appendDiv(`b5`, $S`implicit <code>toString/valueOf</code>`.asNote)

      .appendDiv(``,
        $S`String( $S("hello world").toUpperCase().replace(/world/i, "galaxy") )`.toCode
        .appendDiv(`b5`, `=> `, String($S("hello world").toUpperCase().replace(/world/i, "galaxy").qcd))
      )

      .appendDiv(``,
        $S`\`\${ $S("hello world").toUpperCase().replace(/world/i, "UNIVERSE") }\``.toCode
        .appendDiv( `b5`, `=> `, $S("hello world").toUpperCase().replace(/world/i, "UNIVERSE").qcd )
      )

      .appendDiv(``,
        $S("$S([ $S(\"hello\"), $S(\"world\") ].join(\" \")).firstUp.append(\"!\")").toCode
        .appendDiv(`b5`, `=> `, $S([$S("hello"), $S("world")].join(" ")).firstUp.append("!").qcd )
      )

      .appendDiv(``,
        $S("$S($S(\"hello\") + \" \" + $S(\"world\")).wordsUCFirst.append(\"!\")").toCode
          .appendDiv(`b5`, `=> `, $S($S("hello") + " " + $S("world")).wordsUCFirst.append("!").qcd )
      ),
      "initialization-native-tostringvalueof"
    )];

  print2Document(
    chapterHeader("Initialization", "chapter-initialization"),
    ...allExamples);
  $(`#chapter-initialization`).data.set({chapterTop: "1"});
}

function printStaticConstructorFunctionExamples() {
  print2Document(
    chapterHeader(`Static constructor properties/methods`, "chapter-static"),
    addCustomEx(),
    constructorEx(),
    createEx(),
    infoEx(),
    keysEx(),
    quoteInfoEx(),
    randomStringEx(),
    regExpEx(),
    uuid4Ex(),
  );
}

function printGetterExamples() {
  print2Document(
    chapterHeader("Instance getters", "chapter-getter"),
    camelCaseEx(),
    capitalizeEx(),
    cloneEx(),
    emptyEx(),
    firstUpEx(),
    historyEx(),
    kebabCaseEx(),
    notEmptyEx(),
    quoteEx(),
    snakeCaseEx(),
    trimAllEx(),
    trimAllKeepLFEx(),
    undoEx(),
    undoAllEx(),
    valueEx(),
    wordsUCFirst()
  );
}

function printMethodExamples() {
  print2Document(
    chapterHeader("Instance methods", "chapter-method"),
    appendEx(),
    encloseEx(),
    formatEx(),
    indexOfEx(),
    insertEx(),
    interpolateEx(),
    lastIndexOfEx(),
    prefixEx(),
    replaceWordsEx(),
    trimEx(),
    truncateEx(),
    undoLastEx(),
  );
}

/* region static constructor function examples */
function createEx() {
  return createChapter(
    itemHeader("$S.create"),
    $S`<code>$S.create</code> delivers an instance with an empty string value`.asDiv
      .append($S`$S.create.append("world").prefix("Hello ")`.toCode.asDiv)
      .append($S.create.append("world").prefix("Hello ").prefix(`=> `).asDiv),
    "static-create"
  );
}

function keysEx() {
  return createChapter(
    $S`${itemHeader("$S.keys")}`,
    $S`includes user defined custom property/method keys (denoted as *custom*)`.asNote
      .append($S(JSON.stringify($S.keys, null, 2)).toTag(`pre`)).asDiv,
    "static-keys"
  );
}

function constructorEx() {
  const constructorLine = $S`function ${$S.constructor.name}(str, ...args) {...}`.toCode;

  return createChapter(
    $S` $S.constructor`.toTag("h3", "summary"),
    $S`Result: `.prefix(`=> `).toTag(`b`)
      .append(constructorLine.prefix($S`${
        useBundle ? $S`this is the constructor from the bundled code => `.asNote : ``}`)),
    "static-constructor"
  );
}

function infoEx() {
  return createChapter(
    $S`${itemHeader("$S.info")}`,
    $S`includes user defined custom properties/methods (denoted as *custom*)`.asNote
      .append($S(JSON.stringify($S.info, null, 2)).toTag(`pre`)).asDiv,
    "static-info"
  );
}

function quoteInfoEx() {
  return createChapter(
    $S`${itemHeader("$S.quoteInfo")}`,
    $S(JSON.stringify($S.quoteInfo, null, 2)).toTag(`pre`).asDiv,
    "static-quoteinfo"
  );
}

function regExpEx() {
  const reDemo = $S.regExp`
      ^[\p{L}]              //=> always start with a letter
      [\p{L}_\.#\-\d+~=!]+  //=> followed by letters including _ . # - 0-9 ~ = or !
      ${[...'gui']}         //=> flags ([g]lobal, case [i]nsensitive, [u]nicode)`;
  const replacerRE = $S.regExp`
    /* find 'hi'or 'universe' */
    hi
    |
    universe`;
  const currentReplacer = () => $S`replacerRE`.toCode.append(` now ${$S(String(replacerRE)).toCode}`);
  const replacements = {hi: `Hello`, universe: `world!`};
  const example1 = `HI universe`.replace(replacerRE.flags(`g`), a => replacements[a.toLowerCase()]);
  const re1 = currentReplacer();
  const example2 = `HI universe`.replace(replacerRE.flags(`i`), a => replacements[a.toLowerCase()]);
  const re2 = currentReplacer();
  const example3 = `HI Universe`.replace(replacerRE.flags(`-r`).flags(`g`), a => replacements[a.toLowerCase()]);
  const re3 = currentReplacer();
  return createChapter(
    itemHeader(`$S.regExp`),
    (`$S.regExp`[SB].toCode + ` enables creating a regular expression from a
      multiline (template) string, including comments.
      <a target="_blank" href="https://github.com/KooiInc/RegexHelper">See also</a>`)[SB].asDiv
    .appendDiv(`b5`, $S` can <b>only</b> be used as tagged template [function]`.asNote)
    .appendDiv(`b5`, $S` you have to check the input.
      Invalid input (e.g. "([a-z]") will throw a <code>SyntaxError</code>.
      <br>Flags on the other hand will be automatically sanitized.`.asNote)
    .appendDiv(``,
      $S(exampleCode.regExpExample)
        .append($S`Result`.toTag(`b`).prefix(`=> `)
        .append(`: `, $S(reDemo.toString()).toCode))
      )
      .appendDiv(`b5`, $S`<h3 class="head">[string].replace example</h3>`)
      .appendDiv(``, $S(exampleCode.regExpExample2)
        .append($S`Example1`.toCode, ` => `, $S(example1).qcd, ` (${$S(re1)})`)
        .appendDiv(``, $S`Example2`.toCode, ` => `, $S(example2).qcd, ` (${$S(re2)})`)
        .appendDiv(``, $S`Example3`.toCode, ` => `, $S(example3).qcd, ` (${$S(re3)})`)
    ),
    "static-regexp"
  );
}

function addCustomEx() {
  return createChapter(
     itemHeader(` $S.addCustom({name, method, isGetter, enumerable})`),
     $S.create
     .append(`Use ${"$S.addCustom"[SB].toCode} to define custom instance getters and/or methods`[SB].asDiv)
     .appendDiv(``, $S`Syntax`.toTag(`i`).append(`: `, exampleCode.customGetterSyntax))
     .append(
        $S`Examples`.toTag(`h3`, `head`)
        .appendDiv(`b5`,
          $S`<b>User defined <i>getter</i> <code>.festive</code></b>`,
          $S`${exampleCode.festiveExample}`
          .append($S`=&gt; `,
            $S`result`.toCode, `: `, $S("Hurray!").festive.qcd)
        )
        .appendDiv(`b5`,
          $S`<b>User defined <i>method</i> <code>.toTag</code></b>`,
          $S`${exampleCode.toTagExample}`
          .appendDiv(``,
            $S`result`.toCode.prefix(`=> `).append(` `,
            $S`Hurray!`.toTag("i", "green").toTag("b").qcd)
        ))
     ),
    "static-addcustom"
  );
}

function uuid4Ex() {
  return createChapter(
    $S` $S.uuid4`.toTag("h3", "summary"),
    $S`$S.uuid4`.toCode
      .append(
        ` => `,
        $S.uuid4.qcd
      ).asDiv,
    "static-uuid4"
  );
}

function randomStringEx() {
  return createChapter(
      $S` $S.randomString({len, includeNumbers, includeSymbols, includeUppercase})`.toTag("h3", "summary"),
      $S`Syntax: `.toTag(`i`)
      .appendDiv(`b5`, $S`${exampleCode.randomStringSyntax}`)
      .append($S`Examples`.toTag(`h3`, `head`).value,)
      .appendDiv(`b5`,
        $S`$S.randomString()`.toCode
        .appendDiv(`b5`, `=> `, $S.randomString().qcd)
      )
      .appendDiv(`b5`,
        $S`$S.randomString({len: 24})`.toCode
        .appendDiv(`b5`, `=> `, $S.randomString({len: 24}).qcd)
      )
      .appendDiv(`b5`,
        $S`$S.randomString({len: 16, includeNumbers: true})`.toCode
          .appendDiv(`b5`, `=> `, $S.randomString({
              len: 16,
              includeNumbers: true
            }).qcd)
      )
      .appendDiv(`b5`,
        $S`$S.randomString({includeNumbers: true, includeSymbols: true})`.toCode
        .appendDiv(`b5`,
            `=> `, $S.randomString({
              includeNumbers: true,
              includeSymbols: true
            }).qcd)
      )
      .appendDiv(`b5`,
        $S`$S.randomString({len: 32, includeUppercase: false})`.toCode
          .appendDiv(`b5`, `=> `, $S.randomString({
              len: 32,
              includeUppercase: false
            }).qcd)
      ),
      "static-randomstring"
  );
}
/* endregion static constructor function examples */

/* region getter examples */
function camelCaseEx() {
  return createChapter(
      $S(".camelCase").toTag("h3", "summary"),
      $S`Tries converting the instance string
          to <a target="_blank" class="ExternalLink arrow"
            href="https://developer.mozilla.org/en-US/docs/Glossary/Camel_case"
            >Camel case</a>`.toTag("div", "normal b5")
      .appendDiv(`b5`,
        $S("$S`convert-me`.camelCase").toCode
          .append( $S`convert-me`
            .camelCase.qcd.prefix(" => ")) )
      .appendDiv(`b5`,
        $S("$S`convert me please`.camelCase").toCode
          .append( $S`convert me please`
            .camelCase.qcd.prefix(" => ")) )
      .appendDiv(`b5`,
        $S("you -- should convert &nbsp;&nbsp;&nbsp;-me &nbsp;&nbsp;&nbsp;too.camelCase").toCode
          .append( $S`you -- should convert    -me    too`
            .camelCase.qcd.prefix(" => ")) ),
      "getter-camelcase",
    );
}

function createInternalLink(linkTo, linkToText, isCode) {
  const link = $S`<span
    class="internalLink"
    data-link-to="#${linkTo}">${linkToText}</span>`;
  return isCode ? link.enclose(`<code>`, `</code>`) : link;
}

function getCapitalizeExamples() {
  const examplesObj = Object.keys($S.create.capitalize).sort((a, b) => a.localeCompare(b))
    .reduce((acc, capitalizer) =>
      [...acc, $S`<code>$S("hello World").capitalize.${capitalizer}</code> => ${
          $S`hello world`.capitalize[capitalizer].qcd}`.enclose(`<li>`, `</li>`)], [])
    .join(``);
  const examples = $S(examplesObj).enclose(`<ul>`, `</ul>`);
  const capitalizers = Object.entries({
      full: `equivalent of <code>String.toUpperCase()</code>`,
      none: `equivalent of <code>String.toLowerCase()</code>`,
      camel: `equivalent of ${createInternalLink(`getter-camelCase`, `[instance].camelCase`, true)}`,
      snake: `equivalent of ${createInternalLink(`getter-snakeCase`, `[instance].snakeCase`, true)}`,
      first: `equivalent of ${createInternalLink(`getter-firstUp`, `[instance].firstUp`, true)}`,
      kebab: `equivalent of ${createInternalLink(`getter-kebabCase`, `[instance].kebabCase`, true)}`,
      words: `equivalent of ${createInternalLink(`getter-wordsUCFirst`, `[instance].wordUCFirst`, true)}`,
      dashed: `alias of <code>capitalize.kebab</code>`})
    .sort(([k1,], [k2,]) => k1.localeCompare(k2))
    .reduce((acc, [key, value]) => acc.concat(`<li><code>capitalize.${key}</code>: ${value}</li>`), ``);
  return {examples, capitalizers};
}

function capitalizeEx() {
  const {capitalizers, examples} = getCapitalizeExamples();

  return createChapter(
    $S(".capitalize").toTag("h3", "summary"),
    $S`The different ways of 'capitalizing' instance values (e.g. <code>[instance].snakeCase</code>)
        can also be accomplished using <code>[instance].capitalize</code>.
        <div class="b5">It returns an object with
        properties to capitalize the instance value in different ways.</div>`
      .toTag("div", "normal b5")
    .append($S`<h4 class="between">The available properties are:</h4>`)
    .append($S`<div class="normal"><ul>`.append(capitalizers).append(`</ul></div>`))
    .append($S`<h4 class="between">Example</h4>`)
    .append(exampleCode.capitalizerExample)
    .append($S`<h4 class="between"><code>examples</code> =></h4>`)
    .append(`<div class="normal">${examples}</div>`),
    "getter-capitalize");
}

function cloneEx() {
  const toClone = $S("I shall be ").append("cloned");
  const cloned = toClone.clone.replace("shall be", "was").append(", yeah!");
  return createChapter(
    $S(" .clone").toTag("h3", "summary"),
    $S`Clone the instance.`.toTag("div", "normal b5")

    .appendDiv(`b5`, $S("the history of the originating instance is also cloned").asNote )

    .append( exampleCode.cloneExample )

    .append(
      $S``
      .appendDiv(`b5`, $S`toClone.history`.toCode.append($S`${JSON.stringify(toClone.history)}`.prefix("=>")))
      .appendDiv(`b5`, $S`cloned.history`.toCode.append($S`${JSON.stringify(cloned.history)}`.prefix("=>")))
      .appendDiv(`b5`, $S`cloned`.toCode.append(cloned.qcd.prefix("=>")))
      .appendDiv(`b5`, $S`toClone`.toCode.append(toClone.qcd.prefix("=>")))
    ),
    "getter-clone",
  );
}

function firstUpEx() {
  return createChapter(
    itemHeader(" .firstUp"),
    $S`Converts the first letter of the instance string to upper case`
      .toTag("div", "normal b5")
    .appendDiv(`b5`,
      $S("$S`hello world`.firstUp").toCode,
      $S`hello world`.firstUp.qcd.prefix(" => "))
    .appendDiv(`b5`,
      $S("$S`   hello world`.trim().firstUp").toCode,
      $S`hello world`.trim().firstUp.qcd.prefix(" => ")),
    "getter-firstup"
  );
}

function historyEx() {
  const historyEx = JSON.stringify($S``.prefix("hello").append(` `, `world`).history);
  return createChapter(
    itemHeader(" .history"),
    $S`Every instance records its history, which may be retrieved using
          <code>.history</code>.`
    .appendDiv(`b5`, `The history enables undoing things for an instance
          (see <code>undo/undoLast/undoAll</code>).`)
    .append(
      ("$S``.prefix('hello').append(` `, `world`).history"[SB].toCode +
       " => " + historyEx)[SB].asDiv),
    "getter-history"
  );
}

function emptyEx() {
  return createChapter(
    itemHeader($S`.empty`),

    $S`Check if the instance string value is an empty string`.toTag("div", "normal b5")

    .appendDiv(`b5`,
      $S`$S(null).empty`.toCode,
      ` => `,
      $S`${$S(null).empty}`
    )

    .appendDiv(`b5`,
      $S`$S().empty`.toCode,
      ` => `,
      $S`${$S(null).empty}`
    )

    .appendDiv(`b5`,
      $S`$S(new String()).empty`.toCode,
      ` => `,
      $S`${$S(new String()).empty}`
    )

    .appendDiv(`b5`,
      $S`$S(new String("hello!")).empty`.toCode,
      ` => `,
      $S`${$S(new String("hello!")).empty}`
    )

    .appendDiv(`b5`,
      $S`$S("hello!").empty`.toCode,
      ` => `,
      $S`${$S("hello!").empty}`
    ),
    "getter-empty"
  );
}

function notEmptyEx() {
  return createChapter(
    itemHeader(`.notEmpty`),
    $S`Using <code>.notEmpty</code> one can modify the instance value <i>only</i>
        if that value is not empty (not "")`.asDiv

    .appendDiv(`b5`,
      `In other words, <code>.notEmpty</code> returns <code>undefined</code> if the
      instance value is an empty string, the instance if not.`)

    .appendDiv(`b5`,
      `This means one can use <a target="_blank" class="ExternalLink arrow"
      href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining"
      >optional chaining</a> in combination with the <a target="_blank" class="ExternalLink arrow"
      href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing"
      >nullish coalescing operator</a><br>to modify the instance value conditionally.`)

    .appendDiv(`b5`,
        `See the <span class="internalLink" data-internal="[constructor].addCustom"
          data-link-to="#static-addcustom"> .addCustom</span> user defined
        <code>toTag</code> method for a use case`)

    .appendDiv(`b5`,
        $S`$S(null).notEmpty?.append("hello!") ?? $S("hithere!")`.toCode,
      ` => `,
      ($S(null).notEmpty?.append("hello!") ?? $S("hithere!")).qcd
    )

    .appendDiv(`b5`,
        $S(`$S\`hello\`.notEmpty?.append(" ", "world!") ?? $S()`).toCode,
      ` => `,
      ($S`hello`.notEmpty?.append(" ", "world!") ?? $S()).qcd
    ),
    "getter-notempty"
  );
}

function quoteEx() {
  const quotingStyleExamples = Object.keys($S``.quote)
    .reduce((acc, v) => {
      return !/re|custom|^_/.test(v)
        ? [...acc, $S`<code>$S(" Hello ").quote.${v}</code> => <span class="quoted">${
          " Hello "[SB].quote[v]}</span>`.toTag("div", "normal b5")]
        : acc;
    }, [])
    .concat(
      $S`<code>$S(" Hello ").quote.custom("**")</code> => <span class="quoted">${
        $S(" Hello ").quote.custom("**")}</span>`.toTag("div", "normal b5"),
      $S`<code>$S(" Hello ").quote.curlyDoubleEqual.quote.remove</code> => <span class="quoted">${
        $S(" Hello ").quote.curlyDoubleEqual.quote.remove}</span>`.toTag("div", "normal b5")
    );

  return createChapter(
    itemHeader(" .quote[...]"),
    `Apply a quoting style to the instance string value.`[SB].asDiv
      .append(`The module includes a number of
      <span class="internalLink" data-internal="[constructor].quoteInfo"
        data-link-to="#static-quoteinfo"> predefined quoting styles</span>
      one can use to quote the instance string value.`[SB].asDiv)
      .append(`The <code>quote</code> getter returns an Object.
      One of the properties of this object is the <code>[instance].quote.custom</code>
      method that can be called to apply custom quotes to the instance string value.
      The other properties are getters (e.g. <code>$S("hi").quote.singleQuote</code>).`.asDiv)
      .append(`The <code>quote.remove</code> special getter can be used to remove
      <i>predefined</i> quoting styles from the instance string value. It will not work
      on custom quotes.`.asDiv)
      .append($S`The <code>[instance].quote.custom</code> method works exactly like
        <span class="internalLink"
          data-internal="[instance].enclose"
          data-link-to="#method-enclose"> [instance].enclose</span>`
        .asNote.asDiv)
      .append($S`<h4 class="between">Here are examples for all predefined- and special
      <code>quote</code> fields</h4>`.asDiv)
      .append(``, quotingStyleExamples.join(``)),
    "getter-quote");
}

function snakeCaseEx() {
  return createChapter(
    itemHeader(" .snakeCase"),
    $S`Tries converting
          the instance string to <a target="_blank" class="ExternalLink arrow"
          href="https://developer.mozilla.org/en-US/docs/Glossary/Snake_case"
          >Snake case</a>, meaning that all words of a string
          will be converted to lower case, all non-letters/-numbers
          (all not a-z <i>including diacriticals</i>)
          will be removed and the converted words will be concatenated
          with underscore ('_'). May be useful for cleaning up property names.`
    .toTag("div", "normal b5")
    .appendDiv(`b5`,
        $S("$S`convertMe`.snakeCase").toCode
        .append( $S`convertMe`
          .snakeCase.qcd.prefix(" => ")) )

    .appendDiv(`b5`,
      $S("$S`Convert-Me Please`.snakeCase").toCode
        .append( $S`Convert Me Please`
          .snakeCase.qcd.prefix(" => ")) )

    .appendDiv(`b5`,
      $S("$S`Convert Me _&nbsp;&nbsp;&nbsp;&nbsp;Please__`.snakeCase").toCode
        .append( $S`Convert Me _    Please`
          .snakeCase.qcd.prefix(" => ")) )

    .appendDiv(`b5`,
      $S("$S`Convert Me, pl<b class='red'>Ë</b>ase  $#!`.snakeCase").toCode
        .append( $S`Convert Me, PlËase $#!`.snakeCase
          .replace("plase", "<b class='red'>plase</b>")
          .qcd.prefix(" => ")))

    .appendDiv(`b5`,
      $S("$S`42 Convert Me, please`.snakeCase").toCode
        .append( $S`42 Convert Me, Please`
          .snakeCase.qcd.prefix(" => ")) ),
    "getter-snakecase"
  );
}

function kebabCaseEx() {
  return createChapter(
    itemHeader(" .kebabCase"),
    $S`Tries converting
          the instance string to <a target="_blank" class="ExternalLink arrow"
          href="https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case"
          >Kebab case</a> (aka 'dashed notation'),
          meaning that all words of a string
          will be converted to lower case. All non-letters/-numbers
          (<b>not</b> a-z, A-Z <i>including diacriticals</i>)
          will be removed and the converted words will be concatenated
          with hyphens. May be useful for css- or data-attributes.`
    .toTag("div", "normal b5")

    .appendDiv(`b5`,
      $S("$S`ConvertMe`.kebabCase").toCode
        .append( $S`ConvertMe`.kebabCase.qcd.prefix(" => ")) )

    .appendDiv(`b5`,
      $S("$S`Convert-Me _Please`.kebabCase").toCode
        .append( $S`Convert Me _Please`
          .kebabCase.qcd.prefix(" => ")) )

    .appendDiv(`b5`,
      $S("$S`Convert Me --&nbsp;&nbsp;&nbsp;&nbsp;Please`.kebabCase").toCode
        .append( $S`Convert Me --    Please`
          .kebabCase.qcd.prefix(" => ")) )

    .appendDiv(`b5`,
      $S("$S`Convert Me, _pl<b class='red'>ë</b>ase  $#!`.kebabCase").toCode
        .append( $S`Convert Me, _Plëase $#!`.kebabCase
          .replace("plase", "<b class='red'>plase</b>")
          .qcd.prefix(" => ")) )

    .appendDiv(`b5`,
      $S("$S`42 Convert Me, &Please`.kebabCase").toCode
        .append( $S`42 Convert Me, &Please`
          .kebabCase.qcd.prefix(" => ")) ),
    "getter-kebabcase"
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

  return createChapter(
    itemHeader(" .trimAll"),
    $S`Tries to trim all superfluous white space from the instance string.
        So multiple spaces, tabs, linefeeds are reduced to single white space or no
        white space if after a line feed. This is a fairly simple and certainly not
        a failsafe method (see second example)`
    .toTag("div", "normal b5")
    .appendDiv(`b5`,$S`for clarity the spaces in the result are marked as ${spaceIndicator()}`.asNote)

    .appendDiv(`b5`,
      $S`Example 1`.toTag(`h3`, `head between`),
      cleanupStr1,
      $S`<pre>${$S`clean    me

           please!   `.trimAll.qcd.replace(/ /g, spaceIndicator).prefix(`=> `)}</pre>`)
    .appendDiv(`b5`,
      $S`Example 2`.toTag(`h3`, `head between`),
      $S`<pre class="codebox"><code>$S\`clean me

          up    ,

          ( please !  )
        {  ok  ? }
        \`.trimAll</code></pre>`
      .append( `<pre>${$S`${cleanupStr2}`.trimAll.replace(/ /g, spaceIndicator).qcd.prefix(" => ")}</pre>`) )

    .appendDiv(`b5`,
      $S`Example 2a`.toTag(`h3`, `head between`),
      $S`we created a custom getter called <code>trimEverything</code> with a
        different approach to this. (go to the <a href="#top">page top</a>, click 'Display code' and scroll to
        <code>function trimAllAlternative</code>...).
        It's pretty convoluted and not perfect, but hey, it's an idea ...`.asNote)

      .append($S`<pre class="codebox"><code>$S\`clean me

          up    ,

          ( please !  )
        {  ok  ? }
        \`.trimEverything</code></pre>`
        .append( `<pre>${$S`${cleanupStr2}`.trimEverything.replace(/ /g, spaceIndicator).qcd.prefix(" => ")}</pre>`).asDiv ),
    "getter-trimall"
  );
}

function trimAllKeepLFEx() {
  const spceIndicator = spaceIndicator();
  const lfIndicator = spceIndicator.replace(/space/g, "\\n");
  const cleanupStr = `<pre class="codebox"><code>$S\`clean me




            please! \`.trimAllKeepLF</code></pre>`;
  return createChapter(
    $S(" .trimAllKeepLF").toTag("h3", "summary"),
    $S`Tries to trim all superfluous white space <i>except line feeds</i>
        from the instance string. So multiple whitespace are reduced to single
        white space or no white space if after a line feed.
        As stated and demonstrated for <code>.trimAll</code>: this is a
        fairly simple and certainly not a failsafe method.`
    .toTag("div", "normal b5")
    .appendDiv(`b5`,$S`for clarity the line feeds in the result are marked as ${lfIndicator}
      and spaces as ${spceIndicator}`.asNote)

    .appendDiv(`b5`,
      $S(cleanupStr)
      .append($S`<pre>${$S`clean    me




               please!   `
        .trimAllKeepLF
        .replace(/[\t\v\f ]/g, spceIndicator)
        .replace(/\n/g, `\n${lfIndicator}`)
        .qcd.prefix(`=> `)}</pre>`.asDiv )
      ),
    "getter-trimallkeeplf"
  );
}

function undoEx() {
  const initial = $S` `.append('World').prefix('Hello').toLowerCase();

  return createChapter(
    itemHeader(" .undo"),
    $S`Sets the instance string value to the previous string value
        (from the history, see <code>$S.history</code>`
      .toTag("div", "normal b5")
    .append(
      $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase()")
        .toCode
        .append(` => `, $S(initial.value).qcd) )
    .append(
      $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase().undo")
      .toCode
      .append(` => `, $S(initial.undo.value).qcd) ),
    "getter-undo"
  );
}

function undoAllEx() {
  const initial = $S` `.append('World').prefix('Hello').toLowerCase();

  return createChapter(
    itemHeader(" .undoAll"),
    $S`Sets the instance string value to the initial string value
        (from the history, see <code>$S.history</code>`
    .toTag("div", "normal b5")
    .appendDiv(`b5`,
      $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase()")
      .toCode
      .append(` => `, $S(initial.value).qcd))

    .appendDiv(`b5`,
      $S("$S``.append('World').prefix(' ').prefix('Hello').toLowerCase().undoAll")
      .toCode
      .append(` => `, $S(initial.undoAll.value).qcd) ),
    "getter-undoall"
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

  return createChapter(
    itemHeader(" .value"),
    $S`<code>.value</code> is a getter and a setter for the instance string value.`
    .appendDiv(`b5`,
      $S`if the given value is not a string, setting it will do nothing`.asNote)

    .append(exampleCode.valueExample1)

    .appendDiv(`b5`,`<code>empty.value</code> => `, $S(empty.value).qcd)

    .appendDiv(`b5`,
      $S`<code>.value</code> may also be set using <code>+=</code>.<br>`
      .append($S`be aware that non string values will be stringified here`.asNote)
    )

    .append(exampleCode.valueExample2)

    .appendDiv(`b5`,`<code>empty.value</code> => `, $S(empty2.value).qcd)

    .appendDiv(`b5`,`<code>emptyClone.value</code> => `, $S(emptyClone.value).qcd),
    "getter-value"
  );
}

function wordsUCFirst() {
  return createChapter(
    itemHeader(" .wordsUCFirst"),
    $S`Converts the first letter of every word of the instance string to upper case.`
      .toTag("div", "normal b5")

    .appendDiv(`b5`,
      $S("$S`hello world`.wordsUCFirst").toCode,
      $S`hello world`.wordsUCFirst.qcd.prefix(" => "))

    .appendDiv(`b5`,
      $S("$S`   hello world and whatNOT`.trim().wordsUCFirst").toCode,
      $S`   hello world and whatNOT`.trim().wordsUCFirst.qcd.prefix(" => ")),
    "getter-wordsucfirst"
  );
}
/* endregion getter examples */

/* region method examples */
function appendEx() {
  return createChapter(
    itemHeader(".append(...values:[string|instance])"),
    $S`Append one or more strings/instances to the instance string value`.toTag("div", "normal b5")
    .appendDiv(`b5`,
      $S('$S`Hello`.append(" ","world.", " ", "Here is a random string: ", $S.randomString())').toCode
      .appendDiv(`b5`,
        `=> `,
        $S`Hello`.append(" ", "world.", " ", "Here is a random string: ", $S.randomString()).qcd
      )
    ),
    "method-append"
  );
}

function encloseEx() {
  return createChapter(
    itemHeader(" .enclose(start:string|instance[, end:string|instance])"),
    $S("Surround instance string with <code>[start]</code> and/or <code>[end]</code>" +
      ". If <code>end</code> is not given, <code>start</code> is used as <code>end</code> value.")
    .toTag("div", "normal b5")

    .appendDiv(`b5`,
      $S('$S`Hello world`.enclose("--- ", "  ---")').toCode
        .append(
          ` => `,
          $S`Hello world`.enclose("--- ", "  ---").qcd
        )
    )

    .appendDiv(`b5`,
      $S('$S`Hello world`.enclose("**")').toCode
        .append(
          ` => `,
          $S`Hello world`.enclose("**").qcd
        )
    )

    .appendDiv(`b5`,
      $S('$S`Hello world`.enclose($S("=&gt;"), "&lt;=")').toCode
        .append(
          ` => `,
          $S`Hello world`.enclose($S("=&gt;"), "&lt;=").qcd)
    )

    .appendDiv(`b5`,
      $S('$S`Hello world`.enclose("=&gt;", $S("&lt;=")').toCode
        .append(
          ` => `,
          $S`Hello world`.enclose("=&gt;", $S("&lt;=")).qcd)
    )

    .appendDiv(`b5`,
      $S`if one of the values is not a string or instance,
      the instance value will not change`.asNote
    )

    .appendDiv(`b5`,
      $S('$S`Hello world`.enclose([1,2,3], "&lt;")').toCode
        .append(
          ` => `,
          $S`Hello world`.enclose([1,2,3]).qcd)
    )

    .appendDiv(`b5`,
      $S('$S`Hello world`.enclose("hithere", {hi: 1})').toCode
        .append(
          ` => `,
          $S`Hello world`.enclose("hithere", {hi: 1}).qcd)
    ),
    "method-enclose"
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

  const tableRows = $S("<tr><td>{index}</td><td>{pre}</td><td>{last}</td></tr>").format(...theNames);

  const tableTemplate = $S(
    "<table>\
      <caption>{caption}</caption>\
      <thead>\
      <tr>\
        <th>#</th>\
        <th>prename</th>\
        <th>surname</th>\
      </tr>\
      </thead>\
      <tbody>{rows}</tbody>\
    </table>");

  const exampleTable = tableTemplate.format({
    caption: `<code>tableRowTemplate.format(...)</code> using <code>theNames</code>`,
    rows: tableRows.value } );

  return createChapter(
    itemHeader(".format(...token:object&lt;string, string>)"),
    $S`Fills the instance string value (formatted as a string containing template placeholder(s)
      <code>{[key]}</code>) with values from the <code>token</code>(s) given.`.toTag("div", "normal b5")

      .appendDiv(`b5`,
        $S`Visit the <a target="_blank" class="externalLink arrow" href="https://github.com/KooiInc/StringInterpolator"
      >StringInterpolator</a>  module to learn more.`)

      .append(exampleCode.formatExample)

      .appendDiv(`b5`,
        $S`exampleTable`.toCode.append(` =>`)
      )

      .append(exampleTable),
    "method-format"
  );

}

function indexOfEx() {
  const initial = $S`hello world`;
  const word2Universe = instance =>
    instance.indexOf("rld")
      ? instance.replace("world", "universe").firstUp
      : instance;
  word2Universe(initial);

  return createChapter(
    itemHeader(" .indexOf(str2Find:string,[ fromIndex:number])"),
    $S``.append(
      $S("indexOf").toCode,
      " (as well as ",
      $S("lastIndexOf").toCode,
      ") overrides the native ",
      $S("String.prototype.indexOf").toCode,
      $S` method`
      .append(
        ` (see <a target="_blank"
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf"
        >MDN</a>).`
      )
    .toTag("div", "normal b5")

    .appendDiv(``,
      $S("The override returns "),
      $S("undefined").toCode,
      " if the string to search was not found, instead of ",
      $S("-1").toCode,
      ".",
      $S(exampleCode.indexOfExample)))

    .appendDiv(``,
      $S`String(initial)`.toCode,
      " (see code above) => ",
      initial.qcd
    ),
    "method-indexof"
  );
}

function insertEx() {
  return createChapter(
    itemHeader(".insert({value:string|instance, values:string|instance|[string|instance], at:number=0})"),

    $S`Inserts either <code>[value]</code> or <code>[values]</code> into the instance string value
       at position <code>[at]</code>. <code>at</code> may be negative. For an <code>at</code>-value
        exceeding the instance string length, the value(s) will be appended.
        If <code>at</code> is not given, the value(s) will be prefixed to the instance value.
        if <code>value</code> or one of the <code>values</code> is not a string or instance,
        will do nothing.`
    .toTag("div", "normal b5")

    .appendDiv(``,
      $S('$S("hello world").insert({values: "dear ", at: 6})')
        .toCode
        .append(` => `, $S("hello world").insert({values: "dear ", at: 6}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert({values: ["oh", " ", "dear", " "] , at: 6})')
        .toCode
        .append(` => `, $S("hello world").insert({values: ["oh", " ", "dear", " "], at: 6}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert({values: ["oh", " ", $S`dear`.festive, " "] , at: 6})')
        .toCode
        .append(` => `, $S("hello world").insert({values: ["oh", " ", $S`dear`.festive, " "], at: 6}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert({value: $S("I say").festive})')
        .toCode
        .append(` => `, $S("hello world").insert({value: $S("I say").festive}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert({values: "So, i said: "' +
        '<span class="cmmt">// Note: valueS may also be single string</span>"})')
        .toCode
        .append(` => `, $S("hello world").insert({values: "So, i said: "}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert({values: ["42"], at: 100})')
        .toCode
        .append(` => `, $S("hello world").insert({values: [" 42"], at: 100}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert({values: [42]})')
        .toCode
        .append(` => `, $S("hello world").insert({values: [42]}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert({value: {value: 1}})')
        .toCode
        .append(` => `, $S("hello world").insert({value: 1}).qcd.value)
    )

    .appendDiv(``,
      $S('$S("hello world").insert()')
        .toCode
        .append(` => `, $S("hello world").insert().qcd.value)
    ),
    "method-insert"
  );
}

function interpolateEx() {
  return createChapter(
    itemHeader(" .interpolate(...token:object&lt;string, string>)"),
    $S`Alias for <code><span
      class="internalLink"
      data-internal="[instance].format example"
      data-link-to="#method-format">[instance].format</span></code>`
    .toTag("div", "normal b5"),
    "method-interpolate"
  );
}

function lastIndexOfEx() {
  const initial = $S`hello world world`;
  const lastWord2Universe = instance =>
    instance.slice(0, instance.lastIndexOf("world") ?? instance.length)
      .append(" and universe");
  lastWord2Universe(initial);

  return createChapter(
    itemHeader(" .lastIndexOf(lastStr2Find:string[, beforeIndex:number])"),

    $S(exampleCode.lastIndexOfExample).append(
      $S("lastIndexOf").toCode,
      " (as well as ",
      $S("indexOf").toCode,
      ") overrides the native ",
      $S("String.prototype.lastIndexOf").toCode,
      $S` method`
        .append(
        ` (see <a target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf"
          >MDN</a>).`
        )
   ).toTag("div", "normal b5")

  .appendDiv(`b5`,
    $S("The override returns "),
    $S("undefined").toCode,
    " if the string to search was not found, instead of ",
    $S("-1").toCode, ".")

    .appendDiv(`b5`,
      $S`initial.value`.toCode,
      " (see code above) => ",
      initial.qcd.value
    ),
    "method-lastindexof"
  );
}

function prefixEx() {
  return createChapter(
    itemHeader(" .prefix(...strings2Prefix:[string])"),

    $S`Prefixes <code>[strings2Prefix]</code> to the instance string value in the
        order of the strings from <code>strings2Prefix</code>.
        Will do nothing if one of the given <code>strings2Prefix</code> is not a string or instance.`
    .toTag("div", "normal b5")

    .appendDiv(`b5`,
      $S`$S("world").prefix("hello", " ")`.toCode
        .append(` => `, $S("world").prefix("hello", " ").qcd.value)
    )

    .appendDiv(`b5`,
      $S`$S("world").prefix("hello", " and", " ", "then again ... bye ")`.toCode
        .append(` => `, $S("world").prefix("hello", " and", " ", "then again ... bye ").qcd.value)
    )

    .appendDiv(`b5`,
      $S`$S("world").prefix()`.toCode
        .append(` => `, $S("world").prefix().qcd.value)
    )

    .appendDiv(`b5`,
      $S`$S("world").prefix(42, "Hello ")`.toCode
        .append(` => `, $S("world").prefix(42, "Hello ").qcd.value)
    )

    .appendDiv(`b5`,
      $S`$S("world").prefix($S\`Hello! \`.toTag("b").toTag("i", "green"), "hello ").festive`.toCode
        .append(` => `, $S("world").prefix($S`Hello! `.toTag(`b`).toTag(`i`, `green`), "hello ").festive.value)
    ),

    "method-prefix"
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

  return createChapter(
    itemHeader(" .replaceWords({replacements:object, caseSensitive:boolean=false})"),

    $S`Replaces <code>replacements</code> keys with <code>replacements</code> values.`
    .toTag("div", "normal b5")

    .append(exampleCode.replaceWordsExample)

    .appendDiv(`b5`,
        $S`ex1`.toCode.append(` => `, ex1.qcd.value)
    )

    .appendDiv(`b5`,
      $S`ex2`.toCode.append(` => `, ex2.qcd.value)
    )

    .appendDiv(`b5`,
      $S`ex2a`.toCode.append(` => `, ex2a.qcd.value)
    )

    .appendDiv(`b5`,
      $S`ex3`.toCode.append(` => `, ex3.qcd.value)
    )

    .appendDiv(`b5`,
      $S`ex4`.toCode.append(` => `, ex4.qcd.value)
    )

    .appendDiv(`b5`,
      $S`ex5`.toCode.append(` => `, ex5.qcd.value)
    ),
    "method-replacewords"
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

  const allInOne =
     $S`Truncates the instance string value at position <code>[at]</code> and append
        either three dots ("..." <code>html: false</code>) or "&amp;hellip; (&hellip;)" <code>html: true</code>.
        If <code>wordBoundary</code> is true truncation is done at the nearest possible word boundary (of the
        the truncated string). Word boundaries are for example ;, ), }, &lt;space>, &lt;tab> ... etc.`
    .toTag("div", "normal b5")
    .append(exampleCode.truncateExample);


  const exLen = Object.keys(examples).length + 1;

  for (let i = 1; i < exLen; i += 1) {
    allInOne.appendDiv(`b5`,
      $S`ex${i}`.toCode.append(` => `, examples[`ex${i}`].qcd));
  }

  return createChapter(
    itemHeader(" .truncate({at:number, html:boolean=false, wordBoundary:boolean=false})"),
    allInOne,
    "method-truncate"
  );
}

function trimEx() {
  const str2Trim = "  *Hello world!**  ";
  const [ex1, ex2, ex3, ex4] = [
    $S(str2Trim).trim(),
    $S(str2Trim).trim().trim(`*`),
    $S(str2Trim).trim().trim(`*`, `!**`),
    $S(str2Trim).trim().trim(null, `*`),
  ];

  return createChapter(
    itemHeader(" .trim(start:string, end:string)"),
    $S`Override of <code>String.prototype.trim</code>.
      Trims the instance string value with or without parameters.`
    .toTag(`div`, `b5 normal`)
    .append($S`
      Without parameters it will behave like the usual <code>[someString].trim</code>
      (so remove all <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#white_space"
        >whitespace</a> from the start and end of the instance string).`
      .toTag("div", "normal")
      .append($S`When [start] (a character or string) is given, all values of <code>start</code>
        will be removed from the start and end of the instance string`.toTag("div", "normal"))
      .append($S`When [start] and [end] are given, all values of <code>start</code> will be
        removed from the start of the instance string, the values of <code>end</code>
        from its end`.toTag("div", "normal"))
      .append($S`When [start] has no value and [end] is given, all values of <code>end</code>
        will be removed from the end of the instance string`.toTag("div", "normal"))
    )
    .append(`<h4 class="between">Example</h4>`)
    .append(exampleCode.trimExample)
    .append($S`<div class="normal b5"><ul>
      <li><code>str2Trim</code> => ${$S(str2Trim).qcd}</li>
      <li><code>ex1</code> => ${ex1.qcd}</li>
      <li><code>ex2</code> => ${ex2.qcd}</li>
      <li><code>ex3</code> => ${ex3.qcd}</li>
      <li><code>ex4</code> => ${ex4.qcd}</li></ul></div>`),
    "method-trim"
  );
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
  // noinspection JSUnusedGlobalSymbols
  const examples = {
    get example1() { return undoExample; },
    get example2() { return undoExample.undoLast(1); },
    get example3() { return undoExample.undoLast(2); },
    get example4() { return undoExample.undoLast(10); },
    get example5() { return cloned.undoLast(1); },
    get example6() { return cloned.undoLast(-3); },
    get example7() { return $S`undoExample.history`.toCode.append(` now: `) + JSON.stringify(undoExample.history); },
    get example8() { return $S`clone.history`.toCode.append(` now: `) + JSON.stringify(cloned.history); }
  };

  const chapterContent =
    $S`Sets the instance value back <code>nSteps</code> from its history.`
    .toTag("div", "normal b5")
    .appendDiv(`b5`, `the first instance value will always be retained`[SB].asNote)

    .append(exampleCode.undoLastExample)

    .appendDiv(`b5`,
      $S`undoExample.history`.toCode.append(" => ", `[${undoExample.history.join(`, `)}]`) )

      .appendDiv(`b5`,
        $S`cloned.history`.toCode.append(" => ", `[${cloned.history.join(`, `)}]`) );

  for (let i = 1; i < Object.keys(examples).length + 1; i += 1) {
    chapterContent.appendDiv(`b5`, $S`example${i}`
      .toCode
      .append(` => `, $S`${examples[`example${i}`]}`.qcd));
  }

  return createChapter(
    itemHeader(".undoLast(nSsteps:number)"),
    chapterContent,
    "method-undolast"
  );
}
/* endregion method examples */

function createChapter(header, content, id) {
  return $S(`
      <details class="in-content" id="${id}">
        <summary>${header}</summary>
      </details>
      <div class="chapterContent">${content}</div>`)
  .value;
}

function printHeader() {
  const href = location.href;
  $.link({rel: `icon`, href: /github/i.test(href) ? "https://github.githubassets.com/favicons/favicon.png" : "./codebergicon.ico"})
    .render.appendTo($(`head`));
  const backLink =
    /localhost/i.test(href)
      ? $S`[Local test, no backlink ...]`
    : /codeberg/i.test(href)
      ? $S`<a class="ExternalLink arrow" data-backto="Codeberg repository"
          target="_top" href="https://codeberg.org/KooiInc/js-stringweaver">Codeberg repository</a>`
      : $S`<a class="ExternalLink arrow" data-backto="GitHub repository"
          target="_top" href="https://github.com/KooiInc/js-stringweaver">GitHub repository</a>`;
  print2Document(
    backLink.value,
    $S`js-stringweaver: a stringbuilder utility`.toTag(`h1`, `head`).value,
    createHeaderText(),
    createThisDocumentChapter(),
  );

  $(`#log2screen`).beforeMe($.div({id: `top`}));
  createTopMenuElement();
}

function createHeaderText() {
  return $S.create
    .append($S`
      In many other languages, a programmer can choose to explicitly use a string view or a
      string builder where they really need them. But JS has the programmer either hoping the
      engine is smart enough, or using black magic to force it to do what they want.`.toTag(`div`, `q`))
    .append($S`Cited from
        <a target="_blank" class="ExternalLink arrow"
          href="https://iliazeus.github.io/articles/js-string-optimizations-en/"
        >Exploring V8's strings: implementation and optimizations</a>.`.toTag(`p`, `normal`))
    .append(
      $S`Consider the code here the aforementioned <i>black magic</i>. It delivers a way to build a string
      (actually a <i>wrapped <b>String</b> instance</i> making its internal string value <i>mutable</i>).
      Instances can use native String methods and a number of custom methods.
      <b>js-stringweaver</b> is programmed as a <a target="_blank"
          class="ExternalLink arrow"
          href="https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming"
          >class free object oriented</a> module (<a class="ExternalLink arrow"
          href="https://www.researchgate.net/publication/347727033_How_JavaScript_Works#pf83"
          >See also</a> (chapter 17))`
        .toTag(`div`, `normal`) )
    .value;
}

function createThisDocumentChapter() {
  return $S(chapterHeader("This document"))
    .append($S`<button id="performance">Performance</button>
        &nbsp;<button id="codeVwr" data-code-visible="hidden"></button> used in this page`
      .append($S`&nbsp;`).toTag(`p`, `normal b5`)
    )
    .append(
      $S`Click the 'Performance' button to check the page load performance and
       run a small performance test for ${(100_000).toLocaleString()} instances.`
      .toTag(`div`, `normal b5`)
      .append($S`The code used for this document makes extensive use of the StringWeaver module in a number of
      different ways. Click the 'Display code' button to examine that.`.toTag(`div`, `normal b5 lastHeaderElement`))
    )
    .value;
}

function createTopMenuElement() {
  const back2TopElem = $.div(
    {class: "back-to-top"},
    $.div({class: "menu"},
      $.div({data:{action: "top"}}, "Page top"),
      $.div({data:{action: "content"}}, "Content"),
      $.div({data:{action: "open-all"}}, "Open all examples"),
      $.div({data:{action: "close-and-content"}}, "Close all examples"),
      $.div({data:{action: "close-and-top"}}, "Close all <i>and</i> to top")
    )
  ).appendTo($(`body`));
  const logUlDims = $(`#log2screen`).first$(`li:first-child`).dimensions;
  back2TopElem.style({right: `${document.body.scrollWidth - (logUlDims.left + logUlDims.width) - 5}px`});
}

async function createCodeElement($) {
  const code = await(fetch("./index.js")).then(res => res.text());
  return $.div(
    {id: "codeOverlay"},
    $.pre({class: "codebox", id: "overlayed"},
      $.code({class: "hljs language-javascript"},
        code
          .replace(/&lt;/g, `&amp;lt;`)
          .replace(/&gt;/g, `&amp;gt;`)
          .replace(/>/g, `&gt;`)
          .replace(/</g, `&lt;`)
      )
    )
  ).hide();
}

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

function addCustomized($S) {
  $S.addCustom({name: `enclose`, method: (me, start, end) => me.enclose(start, end)});
  /* ↳ this will display an error in the console
       because 'enclose' is already an instance method */
  $S.addCustom({name: "festive", method: me => me.enclose("\u{1F389}"), isGetter: true});
  $S.addCustom({
    name: "toTag", method: (me, tagName, className) => {
      className = $S(className).notEmpty?.quote.double.prefix($S(" class=")) ?? ``;
      return me.enclose($S(tagName).append(className).enclose("<", ">"), $S(tagName).enclose("</", ">"));
    }
  });
  $S.addCustom({
    name: "toIdTag", method: (me, {tag, id, className} = {}) => {
      if (tag?.value || (tag?.constructor === String && tag)) {
        className = $S(className).notEmpty?.quote.double.prefix($S(" class=")) ?? ``;
        id = $S(id).notEmpty?.quote.double.prefix(" id=") ?? ``;
        return me.enclose($S(tag).append(className, id).enclose("<", ">"), $S(tag).enclose("<\/", ">"));
      }

      return me;
    }
  });
  $S.addCustom({name: `qcd`, method(me) { return me.quote.curlyDouble; }, isGetter: true});
  $S.addCustom({name: `asDiv`, method(me) { return me.toTag("div", "normal"); }, isGetter: true});
  $S.addCustom({name: `asSpacedDiv`, method(me) { return me.toTag("div", "normal b5"); }, isGetter: true});
  $S.addCustom({name: `appendDiv`, method: (me, classNames, ...strings) =>
    me.append($S(strings.join(``)).toTag("div", `normal${classNames ? ` ${classNames} ` : ``}`))});
  $S.addCustom({name: `toCode`, method: me => me.trimAll.toTag(`code`), isGetter: true});
  $S.addCustom({
    name: `asNote`, method: me =>
      me.trim().toTag(`i`).prefix($S`Note`.toTag(`b`, `note`).append(`: `)), isGetter: true
  });
  $S.addCustom({name: `trimEverything`, method: me =>
    me.value = me.constructor(trimAllAlternative(String(me))), isGetter: true});
}

function itemHeader(text) {
  return `<h3 class="summary">${text}</h3>`;
}

function chapterHeader(text, id) {
  return $S(text).toIdTag({tag: "h2", id, className: "head"}).value;
}

function getCodeblocks(templates, $S) {
  const exampleBlocks = templates.find(`template[id]`);

  return [...exampleBlocks].reduce( (acc, block) => {
    const codeTemplate = $S`<pre class="codebox"><code>{code}</code></pre>`;
    return {
      ...acc,
      [block.id]: `${codeTemplate.clone.format({code: block.content.textContent.trim()})}`
    };
  }, {});
}

function spaceIndicator() {
  return `<span style="color:#AAA">&lt;space&gt;</span>`;
}

async function fetchTemplates($S, $) {
  $.allowTag(`template`);
  return getCodeblocks(
    $.div(
      await fetch(`./codeTemplates.html`)
        .then(r => $.escHtml(r.text())) ),
    $S );
}

function setDelegates($) {
  $.handle({type: `click`, selector: `#codeVwr, #performance`, handler: codeViewerAndPerformanceClickHandler});
  $.delegate(`click`, `.back-to-top .menu [data-action]`, topMenuHandler);
  $.delegate(`click`, `[data-link-to]`, linkToLinkHandler);
}


function topMenuHandler({evt}) {
  switch(evt.target.dataset.action) {
    case `content`: return $.node(`#TOCElem`).scrollIntoView({behavior: "smooth"});
    case `top`: return $.node(`#top`).scrollIntoView({behavior: "smooth"});
    case `open-all`: {
      openAllContentDetails();
      return $.node(`[data-chapter-top]`).scrollIntoView({behavior: "smooth"});
    }
    case `close-and-content`: {
      closeAllContentDetails();
      return $.node(`#TOCElem`).scrollIntoView({behavior: "smooth"});
    }
    default: {
      closeAllContentDetails();
      return $.node(`#top`).scrollIntoView({behavior: "smooth"}); }
  }
}

function codeViewerAndPerformanceClickHandler({me}) {
    if (me.node.id === "performance") {
      me.HTML.set(`<b class="spin">Working</b>`);
      //setTimeout($.Popup.show({content: `<b class="spin">Working</b>`, modal: true}));
      setTimeout(runAndReportPerformance);
      return;
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
}

function linkToLinkHandler({me}) {
  const linkElement = $(me.data.get(`link-to`));

  if (!me.closest(`.lemma`).is.empty) {
    $(`[data-active='1']`).data.set({active: "0"});
    me.data.set({active: "1"});
  }

  linkElement.first().open = true;
  return linkElement.showOnTop();
}

function checkScrollPositionBeyondLastExample() {
  const lastExample = $(`li:last-child`);
  if (lastExample.dimensions.top < 0) {
    $.node(`h2#chapter-method`).scrollIntoView({behavior: "smooth"});
  }
}

function closeAllContentDetails() {
  $(`details.in-content[open]`).each(el => el.removeAttribute(`open`));
  checkScrollPositionBeyondLastExample();
}

function openAllContentDetails() {
  $(`details.in-content`).each(el => el.open = true);
}

async function initialize({useBundle = false} = {}) {
  const load = pageLoadDurationFactory();
  // DOMhelpers update 20250710
  const {$, logFactory} = await import("./DOMhelpers.min.js")
    .then(r => ({$: r.$, logFactory: r.logFactory}))
    .then(r => r);
  /* ▲ libraries used for DOM manipulation
     ⇒ $: https://github.com/KooiInc/JQL
     ⇒ logFactory: https://github.com/KooiInc/SBHelpers */
  const initStyling = (await import("./dynamicStyling.js")).default;
  const $S = (await import(useBundle ? `../Bundle/index.min.js` : `../index.js`)).default;
  const {log} = logFactory();
  const codeOverlay = await createCodeElement($);
  initStyling($, $S);
  setDelegates($);
  addCustomized($S);
  const exampleCode = await fetchTemplates($S, $);
  return {$, $S, codeOverlay, exampleCode, SB: Symbol.toSB, print2Document: log, useBundle, load};
}

function finish() {
  hljs.highlightAll(`javascript`);
  const chapters = $.nodes(`[id^=chapter]`);
  const toc = [];
  chapters.forEach((chapter) => {
    const lemmaX = chapter.id.split(`-`).pop();
    const detailElem = $.details(
      {data: {toc: 1}},
      $.summary(chapter.textContent)
    );

    $.nodes(`details[id^=${lemmaX}]`)
      .forEach( lemma => {
        let text = $.node(`summary h3`, lemma).textContent;
        text = /\(/.test(text) ? text.slice(0, text.indexOf(`(`)+1).trim() + `...)` : text;
        detailElem.append($.div({class: "lemma", textContent: text, data: {linkTo: `#${lemma.id}`}}));
      });

    toc.push(detailElem);
  });

  const tocElem = $($.node(`.lastHeaderElement`)).append($.h2({id: "TOCElem", class: `head`}, `Content`));
  toc.forEach(chapter => tocElem.append(chapter));
  load.done();
}

function singlePerformanceTest() {
  let i = 10_000;
  let me = $S`hello`;
  const now = performance.now();
  while (i--) { me.clone.append(` world!`); }
  return ((performance.now() - now)/10_000);
}

function runAndReportPerformance() {
  const testResults = [...Array(10)].map(_ => singlePerformanceTest());
  const mean = testResults.reduce((acc, val) => acc + val, 0) / 10;
  const sd = Math.sqrt(testResults.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0));
  const perSecond = Math.round(1000/mean);
  $(`#performance`).text(`Performance`);
  return $.Popup.show({ content:
    $S.create
      .append($S`Page load`.toTag(`h3`, `head between`))
      .append($S`This examples page used the StringWeaver module to create the bulk of the html.`.asDiv)
      .append($S`Importing modules, creating, styling, handling and rendering the whole of the page in total took <b>${
        +((load.duration/1000).toFixed(2)).toLocaleString()}</b> seconds.`
      .toTag(`div`, `normal h5`))
    .append($S`Performance test`.toTag(`h3`, `head between`))
    .append(
      $S`Created 10 * ${10_000..toLocaleString()} StringWeaver instance <code>clone</code>s,
        <code>append</code>ing a string to each (\u03A3 ${100_000..toLocaleString()} instances).`.asDiv
      .append($S`Average time per iteration was <b>${+(mean.toFixed(5)).toLocaleString()}</b>
          <i><b>milli</b></i>seconds (\u00B1 ${(+(sd.toFixed(5)).toLocaleString())}).`).asDiv
      .append($S`That is an average of <b>${perSecond.toLocaleString()}</b> instances per second.`)
    )
    .toTag(`div`, `normal b5`)
    .append($S`the values above may vary according to the hardware/JS engine used.
      Reloading the page may lower the page load time because of the browser/JS engine cache.`.asNote.asDiv)
    .append(
        $S`using StringWeaver instances for string manipulation for sure will be slower
        than using native Strings. This is mainly due to the fact that every StringWeaver
        instance is a  <a target="_blank" class="ExternalLink arrow"
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"
          >Proxy</a>.
        Proxies are <a target="_blank" class="ExternalLink arrow"
            href="https://thecodebarbarian.com/thoughts-on-es6-proxies-performance">notoriously slow</a>.
        Still, if one does't need to manipulate hundreds of thousands of strings,
        StringWeaver's performance should not get in the way`.asNote.asDiv).value,
  });
}

function debug(...things2Log) {
  if (/localhost/i.test(location.href)) {
    things2Log.forEach(thing => console.warn(thing));
  }
}

function pageLoadDurationFactory() {
  let startTime = performance.now();
  let pageDuration = 0;
  return {
    get duration() {return pageDuration;},
    done() { pageDuration = performance.now() - startTime; },
  };
}
