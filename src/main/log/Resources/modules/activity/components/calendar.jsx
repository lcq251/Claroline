import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import moment from 'moment/moment'
import times from 'lodash/times'
import random from 'lodash/random'

import {trans} from '#/main/app/intl/translation'

const ActivityCalendar = (props) => {
  const endRange = moment()
  const startRange = moment().subtract(1, 'year')


  const diff = moment.duration(endRange.diff(startRange))

  return (
    <div className={classes('activity-calendar-container', props.className)}>
      <table className="activity-calendar">
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">{trans('days')}</span>
            </th>
            {times(12, (monthNum) => {
              //const date = moment(startRange).set('month', monthNum)
              return (
                <th key={monthNum} scope="col" colSpan={4}>{moment.monthsShort(monthNum)}</th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {times(7, (dayNum) =>
            <tr key={dayNum}>
              <th className="activity-calendar-day-label" scope="row">{moment.weekdaysShort(dayNum)}</th>

              {times(diff.asWeeks(), (week) =>
                <td key={week} className={classes('activity-calendar-day', `activity-calendar-day-`+random(0, 4))}>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      <div className="activity-calendar-legend">
        <span className="">{trans('Moins')}</span>

        <span className="activity-calendar-day-legend activity-calendar-day activity-calendar-day-0">
          <span className="visually-hidden">{trans('No activity')}</span>
        </span>

        <span className="activity-calendar-day-legend activity-calendar-day activity-calendar-day-1">
          <span className="visually-hidden">{trans('Low activity')}</span>
        </span>

        <span className="activity-calendar-day-legend activity-calendar-day activity-calendar-day-2">
          <span className="visually-hidden">{trans('Medium-low activity')}</span>
        </span>

        <span className="activity-calendar-day-legend activity-calendar-day activity-calendar-day-3">
          <span className="visually-hidden">{trans('Medium-high activity')}</span>
        </span>

        <span className="activity-calendar-day-legend activity-calendar-day activity-calendar-day-4">
          <span className="visually-hidden">{trans('High activity')}</span>
        </span>

        <span className="">{trans('Plus')}</span>
      </div>
    </div>
  )
}

ActivityCalendar.propTypes = {
  className: T.string
}

export {
  ActivityCalendar
}
