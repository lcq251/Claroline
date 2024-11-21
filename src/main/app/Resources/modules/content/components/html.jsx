import React from 'react'

import {Html} from '#/main/app/components/html'

/**
 * Interprets and displays HTML content.
 *
 * @deprecated use `import {Html} from '#/main/app/components/html'`
 */
const ContentHtml = props =>
  <Html {...props}>
    {props.children}
  </Html>

ContentHtml.propTypes = Html.propTypes

ContentHtml.defaultProps = Html.defaultProps

export {
  ContentHtml
}
