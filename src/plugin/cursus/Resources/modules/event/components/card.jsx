import React from 'react'
import {PropTypes as T} from 'prop-types'

import {displayDateRange} from '#/main/app/intl'
import {DataCard} from '#/main/app/data/components/card'

import {EventStatus} from '#/plugin/cursus/components/event-status'
import {Event as EventTypes} from '#/plugin/cursus/prop-types'

const EventCard = props =>
  <DataCard
    {...props}
    poster={props.data.thumbnail}
    name={props.data.name}
    icon="fa fa-calendar-day"
    title={
      <div className="d-flex flex-row gap-2 align-items-baseline" role="presentation">
        {props.data.name}
        {'row' === props.orientation &&
          <EventStatus className="ms-auto" startDate={props.data.start} endDate={props.data.end} subtle={true} />
        }
      </div>
    }
    contentText={displayDateRange(props.data.start, props.data.end)}
    meta={
      <EventStatus startDate={props.data.start} endDate={props.data.end} subtle={true} />
    }
  />

EventCard.propTypes = {
  data: T.shape(
    EventTypes.propTypes
  ).isRequired
}

export {
  EventCard
}
