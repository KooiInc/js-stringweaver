export default initStyling;

function initStyling($, $S) {
  $.fn("showOnTop", me => {
    return window.scroll({ top: document.body.scrollTop + me.dimensions.y - 10, });
  });

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
    `#top { position: absolute; top: 0; margin: 0;}`,
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
        font-style: normal;
        font-weight: normal;
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
       margin: 3px auto;
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
    `h4.between { margin: 0.4em 0 0.2em 0; }`,
    `h1.head { line-height: 1.4em; }`,
    `#log2screen li:not(.head) { 
      line-height: 1.4em; 
      list-style: none;
     }`,
    `#log2screen li div.normal li {
      list-style: none;
      margin-left: -3em;
    }`,
    `#log2screen li:last-child {
      margin-bottom: 100vh;
    }`,
    `details {
        summary { cursor: pointer; }
    }`,
    `details.in-content {
      scroll-margin-top: 20px;
  
      summary {
        cursor: pointer;
        
        h3.summary {
        cursor: pointer: !important;
        font-family: monospace;
        color: rgb(98 109 147);
        font-size: 1.1em;
        display: inline;
        z-index: 100;
      }
      }
    }`,
    `details.in-content:not(:open) + .chapterContent {
      position: absolute;
      left: -200vw;
      height: 0;
      opacity: 0;
    }`,
    `details.in-content[open] summary h3 { color: green; }`,
    `details.in-content[open] + .chapterContent {
      margin: 0.3em 1em auto 1em;
      height: revert;
      position: relative;
      transition: margin 0.8s ease-in, opacity 0.6s ease-in;
      opacity: 1;
      pre {
        margin-top: 0.1rem;
      }
    }`,
    `a.ExternalLink {
      background-color: transparent;
      font-style: normal;
    }`,
    `a.ExternalLink.arrow:hover::after, .toc:hover::after, .internalLink:hover::after { 
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
    `.toc:hover::after {
      margin: -0.3rem 0px 0px -6rem;
    }`,
    `a.ExternalLink[data-backto].arrow:hover::after {
      content: ' navigates back to 'attr(data-backto);
    }`,
    `a.ExternalLink[data-internal].arrow:hover::after {
      content: ' navigate to 'attr(data-internal);
    }`,
    `.internalLink:hover::after {
      content: ' navigate to 'attr(data-internal);
    }`,
    `a.ExternalLink[target="_top"]:not([data-backto], [data-internal]).arrow:hover::after {
      content: ' navigates back to 'attr(href);
    }`,
    `a.ExternalLink[target="_blank"].arrow:hover::after {
      content: ' Opens in new tab/window';
    }`,
    `div.lemma {
      cursor: pointer;
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
        color: green;
      }
    }`,
    `.internalLink {
        color: blue;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        font-style: normal;
        &:hover {
          text-decoration: underline;
        }
        &:before {
          color: rgba(0, 0, 238, 0.7);
          font-size: 1.1rem;
          padding-right: 2px;
          vertical-align: baseline;
          content: "↺"
        }
      }`,
    `.back-to-top {
      position: fixed;
      scroll-margin-top: 10px;
      top: 1rem;
      cursor: pointer;
      z-index: 5;
      &:before {
        content: "\\2630";
        font-size: 1.6em;
        font-weight: bold;
        color: #8f5536;
      }
      &:hover::after {
        content: 'Close all/back to index';
        fontSize: 0.7rem;
        position: absolute;
        zIndex: 2;
        display: inline-block;
        padding: 2px 6px;
        border: 1px solid #777;
        box-shadow: 1px 1px 5px #777;
        margin: 0 0 0 -11.5rem;
        color: #444;
        background-color: #FFF;
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
    `.spin {
      display: block;
      animation: spinner 1.5s linear infinite;
      color: red;
      text-align: center;
    }`,
    `span.quoted {
      color: #555;
      font-size: 1.2em;
      font-weight: bold;
      font-family: serif;
    }`,
    `@keyframes spinner  {
      from {
        -moz-transform: rotateY(0deg);
        -ms-transform: rotateY(0deg);
        transform: rotateY(0deg);
      }
      to {
        -moz-transform: rotateY(-360deg);
        -ms-transform: rotateY(-360deg);
        transform: rotateY(-360deg);
      }
    }`
  );
}
