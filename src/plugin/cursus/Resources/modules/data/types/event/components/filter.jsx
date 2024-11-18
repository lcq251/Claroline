import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'
import {MODAL_TRAINING_EVENTS} from '#/plugin/cursus/modals/events'

const EventFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-calendar-day"
    pickerType={MODAL_TRAINING_EVENTS}
  />

EventFilter.propTypes = EntityFilter.propTypes

export {
  EventFilter
}
