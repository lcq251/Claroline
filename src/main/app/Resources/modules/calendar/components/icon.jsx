import React from 'react'
import {PropTypes as T} from 'prop-types'
import moment from 'moment/moment'

const CalendarIcon = ({
  date,
  size
}) => {
  const calendarDate = moment(date)

  return (
    <div className={`event-icon event-icon-${size}`}>
      <div className="event-icon-month p-2">
        {calendarDate.format('MMMM')}
      </div>
      <div className="event-icon-day p-2">
        {calendarDate.format('DD')}
      </div>
      <div className="event-icon-weekday">
        {calendarDate.format('dddd')}
      </div>
    </div>
  )
}

CalendarIcon.propTypes = {
  date: T.string.isRequired,
  size: T.string.isRequired
}

export {
  CalendarIcon
}
