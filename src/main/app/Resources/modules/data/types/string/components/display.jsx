import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {Text} from '#/main/app/components/text'

const StringDisplay = (props) => {
  if (isEmpty(props.value)) {
    return (
      <em className="text-body-tertiary" role="presentation">{props.placeholder || trans('empty_value')}</em>
    )
  }

  if (props.long) {
    return (
      <Text className="mb-0" nl2br={true}>
        {props.value}
      </Text>
    )
  }

  return (
    <p className="mb-0">
      {props.value}
    </p>
  )
}

StringDisplay.propTypes = {
  value: T.string,
  placeholder: T.string,
  long: T.bool
}

export {
  StringDisplay
}
