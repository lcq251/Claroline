import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Location as LocationTypes} from '#/main/community/prop-types'

const LocationDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_location', {}, 'location')}
  />

LocationDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(
      LocationTypes.propTypes
    ),
    T.arrayOf(T.shape(
      LocationTypes.propTypes
    ))
  ])
}

export {
  LocationDisplay
}
