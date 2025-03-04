import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'

import {Badge} from '#/main/app/components/badge'

const FormLabel = props =>
  <label
    className={classes('form-label d-flex align-items-baseline gap-2', {
      'visually-hidden': !props.displayed
    })}
    htmlFor={props.fieldId}
  >
    {props.icon &&
      <span className={classes('', props.icon)} aria-hidden={true} />
    }

    {props.label}

    {props.optional &&
      <Badge variant={props.recommended ? 'primary' : 'secondary'} subtle={true} className="fw-normal text-lowercase fs-sm">
        {props.recommended ? trans('recommended') : trans('optional')}
      </Badge>
    }
  </label>

FormLabel.propTypes = {
  fieldId: T.string.isRequired,
  icon: T.string,
  label: T.string.isRequired,
  displayed: T.bool,
  required: T.bool,
  optional: T.bool,
  recommended: T.bool,
}

FormLabel.defaultProps = {
  displayed: true,
  optional: false,
  recommended: false,
  required: true
}

export {
  FormLabel
}
