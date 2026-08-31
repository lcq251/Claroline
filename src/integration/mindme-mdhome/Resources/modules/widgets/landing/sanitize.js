/**
 * Shared href sanitizer for the landing widgets.
 *
 * Widget parameters are admin-provided, but we still refuse
 * javascript:/data:/vbscript: URLs as a defense-in-depth measure
 * (matches the platform's URL handling conventions).
 *
 * @param {string|undefined} href
 * @return {string|undefined} the safe href, or undefined when unsafe/empty
 */
function sanitizeHref(href) {
  if (typeof href !== 'string') {
    return undefined
  }

  const value = href.trim()
  if (0 === value.length) {
    return undefined
  }

  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/)
  if (schemeMatch) {
    const protocol = schemeMatch[1].toLowerCase()
    if (-1 === ['http', 'https', 'mailto', 'tel'].indexOf(protocol)) {
      return undefined
    }
  }

  return value
}

export {
  sanitizeHref
}
