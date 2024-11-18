import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {Event as EventTypes} from '#/plugin/cursus/prop-types'
import {MODAL_TRAINING_EVENTS} from '#/plugin/cursus/modals/events'
import {EventCard} from '#/plugin/cursus/event/components/card'

const EventInput = props =>
  <EntityInput
    {...props}
    placeholder={trans('no_event', {}, 'cursus')}
    card={EventCard}
    pickerType={MODAL_TRAINING_EVENTS}
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
