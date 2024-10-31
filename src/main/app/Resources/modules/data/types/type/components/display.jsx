import React, {cloneElement} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

const TypeDisplay = props => {
  if (!isEmpty(props.data) || !isEmpty(props.value)) {
    // because Details and Form do not share same api for now
    // remove later
    const value = props.data || props.value

    return (
      <div className="py-2 px-3 gap-3 d-flex align-items-center border rounded-2">
        {value.icon && cloneElement(value.icon, {
          size: 'sm',
          className: classes(value.icon.props.className, 'type-icon')
        })}

        <div role="presentation">
          <b className="mb-1 fw-medium">{value.name}</b>
          <p className="mb-0 text-body-secondary fs-sm">{value.description}</p>
        </div>
      </div>
    )
  }

  return null
}

TypeDisplay.propTypes = {
  // for display
  data: T.shape({
    icon: T.node,
    name: T.string.isRequired,
    description: T.string
  }),
  // for input
  value: T.shape({
    icon: T.node,
    name: T.string.isRequired,
    description: T.string
  })
}

export {
  TypeDisplay
}
