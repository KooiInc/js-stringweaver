import {resolveTemplateString} from "../genericMethods.js";

export default createRegExp

function createRegExp(str, ...args) {
  args = !str.raw ? [args] : args;
  try {
    return regExp(str, ...args);
  } catch (err) {
    const flags = resolveFlags();
    const raw = str.raw || str; 
    return `Error creating Regular Expression from string "${raw}" with flags ${flags}` +
      `\nRegExp error message: "${err.message}"`;
  }
}

function resolveFlags(...args) {
  return args.length > 0
    ? Array.isArray(args.slice(-1))
      ? args.pop().join(``) : args.join(``) : ``;
}

function regExp(regexStr, ...args) {
  const flags = resolveFlags(...args);
  args = [];
  const raw = regexStr.raw || [regexStr];
  
  return new RegExp(
    (args.length &&
      raw.reduce( (a, v, i ) => a.concat(args[i-1] || ``).concat(v), ``) ||
      raw?.join(``))
      .split(`\n`)
      .map( line => line.replace(/\s|\/\/.*$/g, ``).trim().replace(/(@s!)/g, ` `) )
      .join(``), flags);
}
