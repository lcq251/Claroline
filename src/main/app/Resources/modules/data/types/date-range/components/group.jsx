import React from 'react'
import classes from 'classnames'

import {FormGroup} from '#/main/app/content/form/components/group'
import isEmpty from 'lodash/isEmpty'
import {FormError} from '#/main/app/content/form/components/error'
import {FormHelp} from '#/main/app/content/form/components/help'
import {trans} from '#/main/app/intl'
import {getValidationClassName} from '#/main/app/content/form/validator'

/**
 * Overrides default form group to let each range part render its own errors
 */
const DateRangeGroup = props => {
  const error = typeof props.error === 'string' ? props.error : undefined

  return (
    <fieldset className={classes('data-range-group form-group mb-4', props.className, getValidationClassName(props.error, props.validating))}>
      {props.label &&
        <legend
          className={classes('form-label d-flex align-items-baseline gap-2', {
            'visually-hidden': props.hideLabel
          })}
        >
          {props.icon &&
            <span className={classes('', props.icon)} aria-hidden={true} />
          }

          {props.label}

          {props.optional &&
            <small className="text-secondary fw-normal text-lowercase">({trans('optional')})</small>
          }
        </legend>
      }

      {!isEmpty(props.help) &&
        <FormHelp help={props.help} className={classes('mb-2', {'mt-n1': !!props.label && !props.hideLabel})} />
      }

      {props.children}

      {!isEmpty(error) &&
        <FormError error={error} warnOnly={!props.validating} />
      }
    </fieldset>
  )
}

DateRangeGroup.propTypes = FormGroup.propTypes

export {
  DateRangeGroup
}
