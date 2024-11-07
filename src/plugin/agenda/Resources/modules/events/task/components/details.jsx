import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EventPage} from '#/plugin/agenda/event/containers/page'
import {Event as EventTypes} from '#/plugin/agenda/prop-types'

import {TaskMain} from '#/plugin/agenda/events/task/containers/main'

const TaskDetails = (props) =>
  <TaskMain eventId={props.event.id}>
    <EventPage
      event={props.task}
      reload={(event) => {
        props.reload(event)
        props.open(event.id)
      }}
    />
  </TaskMain>

TaskDetails.propTypes = {
  // from agenda
  path: T.string.isRequired,
  event: T.shape(
    EventTypes.propTypes
  ).isRequired,
  reload: T.func.isRequired,

  // from store
  task: T.object,
  open: T.func.isRequired
}

export {
  TaskDetails
}
