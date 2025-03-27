import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {trans} from '#/main/app/intl'
import {Email} from '#/main/app/components/email'

const EmailDisplay = (props) => {
  if (isEmpty(props.value)) {
    return (
      <em className="text-body-tertiary">{props.placeholder || trans('empty_value')}</em>
    )
  }

  return (
    <Email email={props.value} className="text-reset" />
  )
}

EmailDisplay.propTypes = {
  placeholder: T.string,
  value: T.string.isRequired
}

export {
  EmailDisplay
}
