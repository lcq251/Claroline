
const DEFAULT_DOMAIN = 'platform'

// We reuse BazingaJsTranslation Translator object which has been loaded through another script tag in index.html
// (Translator is not bundled by webpack)

/**
 * Exposes standard Translator `trans` function.
 *
 * @param {string} key
 * @param {object} placeholders
 * @param {string} domain
 *
 * @returns {string}
 */
function trans(key, placeholders = {}, domain = DEFAULT_DOMAIN) {
  return window.Translator.trans(key, placeholders, domain)
}

/**
 * Exposes standard Translator `transChoice` function.
 *
 * @param {string} key
 * @param {number} count
 * @param {object} placeholders
 * @param {string} domain
 *
 * @returns {string}
 */
function transChoice(key, count, placeholders = {}, domain= DEFAULT_DOMAIN) {
  return window.Translator.transChoice(key, count, placeholders, domain)
}

export {
  trans,
  transChoice
}
