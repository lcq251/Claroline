import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'

import {nl2br} from '#/main/app/utils/text'

/**
 * Displays a multiline text content.
 */
const Text = props => {
  if (isEmpty(props.children)) {
    return null
  }

  let content = props.children
  if (props.nl2br) {
    content = nl2br(props.children)
  }

  return (
    <p
      {...omit(props, 'children', 'align', 'nl2br')}
      className={classes('content-html', `text-${props.align}`, props.className)}
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

Text.defaultProps = {
  align: 'start',
  nl2br: false
}

export {
  Text
}
