import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {Event as EventTypes} from '#/plugin/cursus/prop-types'
import {MODAL_TRAINING_EVENTS} from '#/plugin/cursus/modals/events'

const EventInput = props =>
  <EntityInput
    {...props}
    pickerType={MODAL_TRAINING_EVENTS}
    add={trans(props.multiple ? 'add_training_events' : 'add_training_event', {}, 'actions')}
  />

implementPropTypes(EventInput, EntityInput.propTypes, {
  value: T.oneOfType([
    T.shape(
      EventTypes.propTypes
    ),
    T.arrayOf(T.shape(
      EventTypes.propTypes
    ))
  ])
})

export {
  EventInput
}
