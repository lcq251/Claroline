import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {toKey} from '#/main/app/utils/text'

const FormError = (props) => {
  const errors = Array.isArray(props.error) && 1 === props.error.length ? props.error[0] : props.error

  if (Array.isArray(errors)) {
    return (
      <ul className="list-unstyled mb-0" role="alert">
        {errors.map(error =>
          <li key={toKey(error)} className="invalid-feedback">
            {error}
          </li>
        )}
      </ul>
    )
  }

  return (
    <div className="invalid-feedback" role="alert">
      {errors}
    </div>
  )
}

FormError.propTypes = {
  error: T.oneOfType([
    T.string,           // a single error message
    T.arrayOf(T.string) // a list of error messages
  ]).isRequired
}

export {
  FormError
}
