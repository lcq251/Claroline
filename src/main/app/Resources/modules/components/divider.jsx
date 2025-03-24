import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const Divider = ({
  className,
  label,
  align = 'center'
}) =>
  <div className={classes('position-relative my-5', `text-${align}`, className)} role="presentation">
    <hr className="position-absolute w-100 bottom-50 m-0 z-n1" aria-hidden={true} />
    <span className={classes('fw-bolder bg-body', {
      'pe-3': 'start' === align,
      'ps-3': 'end' === align,
      'px-3': 'center' === align
    })} role="presentation">
      {label}
    </span>
  </div>

Divider.propTypes = {
  className: T.string,
  label: T.string,
  align: T.oneOf(['start', 'center', 'end'])
}

export {
  Divider
}
