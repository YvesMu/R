const _ = require("lodash");
const Return = require("./return");

class Helpers {
  /**
   * Checks if the given object contains all the specified properties
   *
   * For every missing property, the Return object will have it added to its `errors` array
   *
   * @param {object} object The object to check
   * @param {string[]} paramsToCheck An array of property names to check for - to check nested properties, use dot notation (e.g. "user.name")
   *
   * @returns {Return} An instance of the Return class containing the result of the check
   */
  static checkProps(object, paramsToCheck = []) {
    const result = new Return(200, {});
    paramsToCheck.forEach((param) => {
      if (_.has(object, param)) {
        result.data[param] = object[param];
      } else {
        result.code = 400;
        result.setError({ message: `Missing parameter : ${param}`, code: 400 });
      }
    });
    return result;
  }

  /**
   * Transforms a string into a slug by keeping only url-friendly characters
   *
   * @param {string?} value
   * @param {{ remove?: RegExp, replacement?: string }} options defaults to `{ remove: /[^-_\w]/g, replacement: "-" }`
   *
   * @returns {string}
   */
  static slugify(value = "", options = { remove: /[^-_\w]/g, replacement: "-" }) {
    if (!value) return "";
    return value
      .trim() // remove leading and trailing spaces
      .normalize("NFD") // split an accented letter in the base letter and the accent
      .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
      .toLowerCase()
      .replace(options.remove, options.replacement) // remove unwanted characters with the replacement char
      .replace(new RegExp(`${options.replacement}+`, "g"), options.replacement) // replace multiple replace chars with a single replace char
      .replace(new RegExp(`^${options.replacement}+|${options.replacement}+$`, "g"), ""); // remove leading and trailing replace chars
  }
}

module.exports = Helpers;
