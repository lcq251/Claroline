import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Phone} from '#/main/app/components/phone'

const PhoneDisplay = (props) => {
  if (isEmpty(props.value)) {
    return (
      <em className="text-body-tertiary">{props.placeholder || trans('empty_value')}</em>
    )
  }

  return (
    <Phone phone={props.data} className="text-reset" />
  )
}

PhoneDisplay.propTypes = {
  placeholder: T.string,
  data: T.string
}

export {
  PhoneDisplay
}
