import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const Stepper = ({
  className,
  total,
  orientation = 'row',
  current = 0
}) =>
  <div className={classes('d-flex gap-1 ', `flex-${orientation}`, className)} role="presentation">
    {(new Array(total)).fill(1).map((v, i) =>
      <div className={classes('bg-primary p-1 rounded-3 opacity-25', {
        'opacity-75': i === current,
        'opacity-25': i !== current,
        'px-2': i === current && 'row' === orientation,
        'py-2': i === current && 'column' === orientation
      })} role="presentation" />
    )}
  </div>

Stepper.propTypes = {
  className: T.string,
  orientation: T.oneOf(['column', 'row']),
  total: T.number.isRequired,
  current: T.number
}

export {
  Stepper
}
