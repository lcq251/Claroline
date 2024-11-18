import React from 'react'

import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'
import {EntityFilter} from '#/main/app/data/types/entity'

const SessionFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-calendar-week"
    pickerType={MODAL_TRAINING_SESSIONS}
  />

SessionFilter.propTypes = EntityFilter.propTypes

export {
  SessionFilter
}
