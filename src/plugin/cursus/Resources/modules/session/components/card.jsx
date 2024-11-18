import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {asset} from '#/main/app/config/asset'
import {trans, displayDateRange, transChoice} from '#/main/app/intl'
import {DataCard} from '#/main/app/data/components/card'

import {Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {EventStatus} from '#/plugin/cursus/components/event-status'
import {Badge} from '#/main/app/components/badge'
import {getAvailableSeats} from '#/plugin/cursus/utils'

/**
 * A session card focused on the session data.
 */
const SessionCourseCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={props.data.name}
    contentText={displayDateRange(props.data.restrictions.dates[0], props.data.restrictions.dates[1])}
  />

/**
 * A session card focused on the dates and planing data.
 */
const SessionDateCard = (props) => {
  const availableSeats = getAvailableSeats(props.data)

  let SeatsBadge
  if (0 === availableSeats) {
    SeatsBadge = <Badge className="ms-auto" subtle={true} variant="warning">{trans('full', {}, 'cursus')}</Badge>
  } else if (null === availableSeats) {
    SeatsBadge = <Badge className="ms-auto" subtle={true} variant="primary">{trans('available_seats', {}, 'cursus')}</Badge>
  } else {
    SeatsBadge = <Badge className="ms-auto" subtle={true} variant="primary">{transChoice('available_seats_count', availableSeats, {count: availableSeats}, 'cursus')}</Badge>
  }

  return (
    <DataCard
      {...props}
      id={props.data.id}
      poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
      icon={!props.data.thumbnail ? 'fa fa-calendar-week' : null}
      title={
        <div className="d-flex flex-row gap-2 align-items-baseline">
          {displayDateRange(props.data.restrictions.dates[0], props.data.restrictions.dates[1])}

          {'row' === props.orientation &&
            SeatsBadge
          }
        </div>
      }
      contentText={get(props.data, 'location.name') || trans('online_session', {}, 'cursus')}
      meta={
        <>
          {get(props.data, 'registration.selfRegistration') &&
            <Badge variant="secondary" subtle={true}>{trans('public_registration')}</Badge>
          }
        </>
      }
    />
  )
}

/**
 * A session card focused on the session data.
 */
const SessionCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    className={classes(props.className, {
      'data-card-muted': get(props.data, 'restrictions.hidden', false)
    })}
    poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={
      <div className="d-flex flex-row gap-2 align-items-baseline">
        {props.data.name}
        {'row' === props.orientation &&
          <EventStatus className="ms-auto" startDate={props.data.restrictions.dates[0]} endDate={props.data.restrictions.dates[1]} subtle={true}/>
        }
      </div>
    }
    contentText={displayDateRange(props.data.restrictions.dates[0], props.data.restrictions.dates[1])}
    meta={
      <>
        {(get(props.data, 'registration.selfRegistration') || get(props.data, 'registration.autoRegistration')) &&
          <Badge variant="secondary" subtle={true}>{trans('public_registration')}</Badge>
        }
      </>
    }
  />

SessionCard.propTypes = {
  className: T.string,
  data: T.shape(
    SessionTypes.propTypes
  ).isRequired
}

export {
  SessionCourseCard,
  SessionDateCard,
  SessionCard
}
