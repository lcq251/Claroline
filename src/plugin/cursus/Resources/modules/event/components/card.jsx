import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/app/config/asset'
import {displayDateRange} from '#/main/app/intl'
import {DataCard} from '#/main/app/data/components/card'

import {EventStatus} from '#/plugin/cursus/components/event-status'
import {Event as EventTypes} from '#/plugin/cursus/prop-types'

const EventCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
    icon={!props.data.thumbnail ? 'fa fa-clock' : null}
    title={
      <>
        <EventStatus className="me-2" startDate={props.data.start} endDate={props.data.end} subtle={true} />

        {props.data.name}
      </>
    }
    contentText={displayDateRange(props.data.start, props.data.end)}
  />

EventCard.propTypes = {
  data: T.shape(
    EventTypes.propTypes
  ).isRequired
}

export {
  EventCard
}
