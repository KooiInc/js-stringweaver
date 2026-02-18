<div align="center">

<!--
  bundlephobia is probably a lost case
  [![](https://badgen.net/bundlephobia/min/stringweaver)](https://bundlephobia.com/package/stringweaver)
-->
[![](https://deno.bundlejs.com/?q=stringweaver@latest&badge)](https://bundlejs.com/?q=stringweaver)
[![](https://img.shields.io/npm/v/stringweaver.svg?labelColor=cb3837&logo=npm&color=dcfdd9)](https://www.npmjs.com/package/stringweaver)
[![](https://depx.co/api/badge/stringweaver)](https://depx.co/pkg/stringweaver)

</div>

> [!IMPORTANT]
> This repository is moved to [Codeberg.org](https://codeberg.org/KooiInc/js-stringweaver).
>
> For now it is kept in sync with the original repository @[Github](https://github.com/KooiInc/js-stringweaver).
>
> Depending on future USA/Microsoft/Github policies the Github version maybe discontinued later.
>
> In other words, *starting july 10 2025 the Codeberg repository is ***authorative****.

## js-stringweaver

An ES/JS "stringbuilder" utility module. The module delivers a constructor to create *mutable* strings.

### Highlights
- [x] small footprint
- [x] extendable with custom getters/methods
- [x] retains history of changes
- [x] no external dependencies
- [x] instances can use and/or chain native String getters/methods (e.g. `replace`, `split`, `length`)
- [x] 100% test coverage

### Documentation
**<a href="https://kooiinc.codeberg.page/js-stringweaver/Examples/">Demonstration / Documentation</a>**.
**Idem [@Github](https://kooiinc.github.io/js-stringweaver/Examples)**

### Install module
Use `npm install stringweaver` to install the module locally.

### Import/use (NodeJS or browser client file)
```javascript
/* notes:
   - make sure the script/node project is of type "module"
   - the bundled module can be found @ https://unpkg.com/stringweaver/Bundle/index.min.js
   - the module is imported as $S here */
import $S from "[location of index.js or Bundle/index.min.js]";

// assign the symbolic string extension
const SB = Symbol.toSB;
const myBrandNewString = $S`Hello`.append(" world");
const myNextString = "** "[SB].append(myBrandNewString).toUpperCase().append(`!`);
// myBrandNewString => "Hello world"
// myNextString => "** HELLO WORLD!"
```

### Unit testing
Use `npm test` to run all tests (with coverage report)
