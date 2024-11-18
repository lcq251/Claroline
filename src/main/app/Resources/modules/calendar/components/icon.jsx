import React from 'react'
import {PropTypes as T} from 'prop-types'
import moment from 'moment/moment'

const CalendarIcon = (props) => {
  const calendarDate = moment(props.date)

  return (
    <div className="event-icon event-icon-xl">
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
  square: T.bool,
  size: T.string,
  date: T.string.isRequired
}

CalendarIcon.defaultProps = {
  square: true
}

export {
  CalendarIcon
}