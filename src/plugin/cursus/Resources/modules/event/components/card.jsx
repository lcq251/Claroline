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
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={
      <div className="d-flex flex-row gap-2 align-items-baseline">
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
