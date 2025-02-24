import React from 'react'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {FormGroup} from '#/main/app/content/form/components/group'
import {FormHelp} from '#/main/app/content/form/components/help'

/**
 * Overrides default form group because in this case
 * the label is added on the checkbox. So we don't need it twice.
 */
const BooleanGroup = props =>
  <FormGroup
    id={props.id}
    className={classes('', props.className)}
    error={props.error}
  >
    {props.children}

    {!isEmpty(props.help) &&
      <FormHelp help={props.help} className="mb-0" />
    }
  </FormGroup>

BooleanGroup.propTypes = FormGroup.propTypes

export {
  BooleanGroup
}
