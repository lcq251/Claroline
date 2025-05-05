import React from 'react'
import {PropTypes as T} from 'prop-types'

const BooleanDisplay = (props) =>
  <>
    <input
      id={props.id}
      className="form-check-input"
      type="checkbox"
      checked={props.value}
      readOnly={true}
      role="switch"
    />

    <label
      className="form-check-label"
      htmlFor={props.id}
    >
      {props.label}
    </label>
  </>

BooleanDisplay.propTypes = {
  id: T.string.isRequired,
  value: T.bool,
  label: T.string.isRequired
}

BooleanDisplay.defaultProps = {
  value: false
}

export {
  BooleanDisplay
}
