import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

/**
 * A visual separator between page sections.
 */
const PageSeparator = ({className, flush = false, size = 'lg'}) =>
  <hr className={classes(className, `content-${size} mx-auto`, {
    'px-4': !flush
  })} />

PageSeparator.propTypes = {
  className: T.string,
  flush: T.bool,
  size: T.oneOf(['sm', 'md', 'lg', 'xl', 'full'])
}

export {
  PageSeparator
}
