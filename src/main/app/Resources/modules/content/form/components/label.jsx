import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {Badge} from '#/main/app/components/badge'

const FormLabel = ({
  fieldId,
  icon,
  label,
  displayed = true,
  required = true,
  recommended = false
}) =>
  <label
    className={classes('form-label d-flex align-items-baseline gap-2', {
      'visually-hidden': !displayed
    })}
    htmlFor={fieldId}
  >
    {icon &&
      <span className={icon} aria-hidden={true} />
    }

    {label}

    {!required &&
      <Badge variant={recommended ? 'primary' : 'secondary'} subtle={true} className="fw-normal text-lowercase fs-sm">
        {recommended ? trans('recommended') : trans('optional')}
      </Badge>
    }
  </label>

FormLabel.propTypes = {
  fieldId: T.string.isRequired,
  icon: T.string,
  label: T.string.isRequired,
  displayed: T.bool,
  required: T.bool,
  recommended: T.bool
}

export {
  FormLabel
}
