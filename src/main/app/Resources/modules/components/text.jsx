import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {nl2br as nl2brFn} from '#/main/app/utils/text'

/**
 * Displays a multiline text content.
 */
const Text = ({
  children,
  className,
  align = 'start',
  nl2br = false
}) => {
  if (isEmpty(children)) {
    return null
  }

  let content = children
  if (nl2br) {
    content = nl2brFn(children)
  }

  return (
    <p
      className={classes('content-html', `text-${align}`, className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

Text.propTypes = {
  /**
   * HTML content to display.
   */
  children: T.string,

  /**
   * Additional classes to add to the DOM.
   */
  className: T.string,
  align: T.oneOf(['start', 'center', 'end', 'justify']).isRequired,
  nl2br: T.bool
}

export {
  Text
}
