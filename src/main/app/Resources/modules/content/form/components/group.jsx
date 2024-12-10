import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {FormError} from '#/main/app/content/form/components/error'
import {DataGroup as DataGroupTypes} from '#/main/app/data/types/prop-types'

import {getValidationClassName} from '#/main/app/content/form/validator'
import {FormHelp} from '#/main/app/content/form/components/help'
import {FormLabel} from '#/main/app/content/form/components/label'

/**
 * Renders an agnostic form group.
 * It is used to wrap inputs in order to render the associated meta (label, errors, etc.).
 */
const FormGroup = props =>
  <div className={classes('form-group mb-4', props.className, getValidationClassName(props.error))} role="presentation">
    {props.label &&
      <FormLabel
        label={props.label}
        fieldId={props.id}
        icon={props.icon}
        displayed={!props.hideLabel}
        required={props.required}
        recommended={props.recommended}
        optional={props.optional}
      />
    }

    {!isEmpty(props.help) &&
      <FormHelp help={props.help} className={classes('mb-2', {'mt-n1': !!props.label && !props.hideLabel})} />
    }

    {props.children}

    {!isEmpty(props.error) &&
      <FormError error={props.error} />
    }
  </div>

implementPropTypes(FormGroup, DataGroupTypes, {
  children: T.node.isRequired
})

export {
  FormGroup
}
