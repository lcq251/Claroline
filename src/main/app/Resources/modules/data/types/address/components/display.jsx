import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {Address as AddressTypes} from '#/main/app/data/types/address/prop-types'
import {Address} from '#/main/app/components/address'

const AddressDisplay = (props) => {
  const filledAddressParts = Object.keys(props.value || {})
    .map((name) => props.value[name])
    .filter(addressPart => !isEmpty(addressPart))

  if (isEmpty(filledAddressParts)) {
    return (
      <em className="text-body-tertiary">{props.placeholder || trans('empty_value')}</em>
    )
  }

  return (
    <address className="mb-0">
      <Address {...props.value} />
    </address>
  )
}

AddressDisplay.propTypes = {
  placeholder: T.string,
  value: T.shape(
    AddressTypes.propTypes
  )
}

export {
  AddressDisplay
}
