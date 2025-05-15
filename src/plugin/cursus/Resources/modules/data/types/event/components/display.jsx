import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Event as EventTypes} from '#/plugin/cursus/prop-types'

const EventDisplay = (props) =>
  <EntityDisplay
    placeholder={trans('no_event', {}, 'cursus')}
    {...props}
  />

EventDisplay.propTypes = {
  data: T.shape(
    EventTypes.propTypes
  )
}

export {
  EventDisplay
}
