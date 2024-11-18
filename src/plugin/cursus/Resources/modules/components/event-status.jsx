import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {Badge} from '#/main/app/components/badge'

import {getPeriodStatus} from '#/plugin/cursus/utils'

const EventStatus = (props) => {
  const status = getPeriodStatus(props.startDate, props.endDate)

  return (
    <Badge
      className={props.className}
      variant={classes({
        'secondary': 'not_started' === status,
        'success': 'in_progress' === status,
        'danger': 'ended' === status
      })}
     subtle={props.subtle}
    >
      {trans('session_'+status, {}, 'cursus')}
    </Badge>
  )
}

EventStatus.propTypes = {
  className: T.string,
  startDate: T.string,
  endDate: T.string,
  subtle: T.bool
}

export {
  EventStatus
}
