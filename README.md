<div align="center">
  <a href="https://bundlephobia.com/package/stringweaver" rel="nofollow">
  <img src="https://badgen.net/bundlephobia/min/stringweaver"></a>
  <a target="_blank" href="https://www.npmjs.com/package/stringweaver"><img src="https://img.shields.io/npm/v/stringweaver.svg?labelColor=cb3837&logo=npm&color=dcfdd9"></a>
</div>


## js-stringweaver

A JS "stringbuilder" module

A constructor to create *mutable* strings.

- small footprint
- extendable with custom getters/methods
- retains history of changes
- no external dependencies
- instances can use/chain native String getters/methods (e.g. `length`, `split`)

**<a target="_blank" href="https://kooiinc.github.io/js-stringweaver/Examples">Demonstration / Documentation</a>**

### Install module
Use `npm install stringweaver` to install the module locally.

### In browser
In html
```html
  <script type="module" src="[location of index.js or index.min.js]"></script>
  <!-- OR load minified directly from unpkg -->
  <script
      type="module"
      src="https://app.unpkg.com/stringweaver@latest/files/Bundle/index.min.js">
  </script>
```
### Import/use (NodeJS or browser client file)
```javascript
// note: for NodeJS, make sure the project is of type "module"
// import as $S
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
