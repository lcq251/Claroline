import React, {useId} from 'react'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Badge} from '#/main/app/components/badge'

import {FormGroup} from '#/main/app/content/form/components/group'
import {FormError} from '#/main/app/content/form/components/error'
import {FormHelp} from '#/main/app/content/form/components/help'
import {getValidationClassName} from '#/main/app/content/form/validator'

const ChoiceGroup = props => {
  const labelId = useId()

  if (props.condensed) {
    return (
      <FormGroup {...props} />
    )
  }

  return (
    <div
      className={classes('form-group', props.className, getValidationClassName(props.error))}
      role={props.multiple ? 'group' : 'radiogroup'}
      aria-labelledby={labelId}
    >
      {props.label &&
        <h4
          id={labelId}
          className={classes('form-label d-flex align-items-baseline gap-2', {
            'visually-hidden': props.hideLabel
          })}
        >
          {props.icon &&
            <span className={classes('', props.icon)} aria-hidden={true} />
          }

          {props.label}

          {!props.required &&
            <Badge variant={props.recommended ? 'primary' : 'secondary'} subtle={true} className="fw-normal text-lowercase fs-sm">
              {props.recommended ? trans('recommended') : trans('optional')}
            </Badge>
          }
        </h4>
      }

      {!isEmpty(props.help) &&
        <FormHelp help={props.help} className={classes('mb-2', {'mt-n1': !!props.label && !props.hideLabel})} />
      }

      {props.children}

      {!isEmpty(props.error) &&
        <FormError error={props.error} />
      }
    </div>
  )
}

ChoiceGroup.propTypes = FormGroup.propTypes

export {
  ChoiceGroup
}
