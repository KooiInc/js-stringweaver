const defaultInterpolator = interpolateFactory();
export {defaultInterpolator as default, interpolateFactory};

/**
 * Factory function to create an interpolate function with a default replacer.
 * @param {string} defaultReplacer - Default value to use for missing tokens.
 * @returns {Function} - The interpolation function.
 */
function interpolateFactory(defaultReplacer = "") {
  defaultReplacer = defaultReplacer?.constructor === String ? defaultReplacer : "";

  /**
   * Main interpolation function.
   * @param {string} str - The string with placeholders.
   * @param {...object} tokens - Objects containing replacement values.
   * @returns {string} - The interpolated string.
   */
  return function(str, ...tokens) {
    return interpolate(str, processTokens(tokens));
  }

  /**
   * Handle invalid keys by returning the default replacer or the key in braces.
   * @param {string} key - The placeholder key.
   * @param {boolean} keyExists - Flag indicating if the key exists in the token.
   * @returns {string} - The replacement value.
   */
  function invalidate(key, keyExists) {
    if (keyExists && defaultReplacer.length > 0) {
      return String(defaultReplacer);
    }

    return `{${key}}`;
  }

  /**
   * determine if [value] is a String or Number
   * @param {any} value
   * @returns {boolean}
   */
  function isStringOrNumber(value ) {
    return value?.constructor === String || value?.constructor === Number && !Number.isNaN(value);
  }

  /**
   * Get the replacement value for a key from the token.
   * @param {string} key - The placeholder key.
   * @param {object} token - The token object containing replacement values.
   * @returns {string} - The replacement value.
   */
  function replacement(key, token) {
    const isValid = key in token;
    return isValid && isStringOrNumber(token[key]) ? String(token[key]) : invalidate(key, isValid);
  }

  /**
   * Create a lambda function for replacing placeholders in the string.
   * @param {object<string, string>} token - The token object containing replacement values.
   * @returns {Function} - The replacer lambda function.
   */
  function getReplacerLambda(token) {
    return (...args) => {
      const replacementObject = args.find(a => a.key);
      return replacement((replacementObject ? replacementObject.key : `_`), token);
    };
  }

  /**
   * Replace placeholders in the string with values from the token.
   * @param {string} str - The string with placeholders.
   * @param {object} token - The token object containing replacement values.
   * @returns {string} - The interpolated string.
   */
  function replace(str, token) {
    return str.replace(/\{(?<key>[a-z_\d]+)}/gim, getReplacerLambda(token));
  }

  /**
   * Convert token object to array of token Objects
   * when it's values are arrays of values.
   * @param {object} tokenObject - The token object containing arrays of values.
   * @returns {object[]} - Array of token objects.
   */
  /* node:coverage disable (internal method, not covered by tests)*/
  function convertTokensFromArrayValues(tokenObject) {
    const converted = [];

    Object.entries(tokenObject).forEach(([key, value]) => {
      value.forEach((v, i) => (converted[i] ??= {}, converted[i][key] = v));
    });

    return converted;
  }

  /**
   * Check if single token and its values are arrays.
   * @param {object[]} tokens - The tokens to check.
   * @returns {boolean} - True if tokens contains one Object
   *  and all it's values are of type Array.
   */
  function isMultiLineWithArrays(tokens) {
    return tokens.length === 1 && Object.values(tokens[0]).every(Array.isArray);
  }

  /**
   * Process tokens to handle multi-line formats.
   * @param {object[]} tokens - The tokens to process.
   * @returns {object[]} - Processed tokens.
   */
  function processTokens(tokens) {
    return isMultiLineWithArrays(tokens) ? convertTokensFromArrayValues(tokens[0]) : tokens;
  }

  /**
   * Determine [value] is a real Object and contains keys and values
   * @param {any} value
   * @returns {boolean}
   */
  function isKeyValueObject(value) {
    return !Array.isArray(value) && value?.constructor === Object && Object.entries(value)?.length > 0;
  }

  /**
   * Interpolate the string with the given tokens.
   * @param {string} str - The string with placeholders.
   * @param {object[]} tokens - The tokens containing replacement values.
   * @returns {string} - The interpolated string.
   */
  function interpolate(str, tokens) {
    return !tokens?.length ? str : tokens
      .filter(token => token)
      .map((token, i) => isKeyValueObject(token) ? replace(str, {...token, index: i+1}) : ``)
      .join(``);
  }
}
