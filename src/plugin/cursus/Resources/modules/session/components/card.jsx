import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {asset} from '#/main/app/config/asset'
import {trans, displayDateRange} from '#/main/app/intl'
import {DataCard} from '#/main/app/data/components/card'

import {Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {AvailableSeats} from '#/plugin/cursus/session/components/available-seats'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'
import {getAddressString} from '#/main/app/data/types/address/utils'

/**
 * A session card focused on the course data.
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
const SessionDateCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={
      <div className="d-flex flex-row gap-2 align-items-baseline">
        {displayDateRange(props.data.restrictions.dates[0], props.data.restrictions.dates[1])}

        {'row' === props.orientation &&
          <AvailableSeats session={props.data} className="ms-auto" />
        }
      </div>
    }
    contentText={
      <>
        <span className="fa fa-fw fa-map-marker-alt me-2" aria-hidden={true} />
        {props.data.location ?
          (getAddressString(get(props.data, 'location.address'), true) || get(props.data, 'location.name')) :
          trans('online_session', {}, 'cursus')
        }
      </>
    }
    meta={
      <AvailableSeats session={props.data} />
    }
  />

/**
 * A session card focused on the session data.
 */
const SessionCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={
      <div className="d-flex flex-row gap-2 align-items-baseline" role="presentation">
        {(get(props.data, 'registration.selfRegistration') || get(props.data, 'registration.autoRegistration')) &&
          <TooltipOverlay
            id={'session-type'+props.data.id}
            position="top"
            tip={trans('public_registration')}
          >
            <span className="fa fa-fw fa-globe" aria-hidden={true} />
          </TooltipOverlay>
        }

        {props.data.name}

        {'row' === props.orientation &&
          <AvailableSeats session={props.data} className="ms-auto" />
        }
      </div>
    }
    contentText={displayDateRange(props.data.restrictions.dates[0], props.data.restrictions.dates[1])}
    meta={
      <>
        <AvailableSeats session={props.data} />
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
