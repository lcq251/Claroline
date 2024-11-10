import React from 'react'
import {PropTypes as T} from 'prop-types'
import moment from 'moment'
import classes from 'classnames'

const MessageDate = (props) => {
  const date = moment(props.value)

  let formattedDate
  if (date.isSame(new Date(), 'day')) {
    formattedDate = date.format('HH:mm')
  } else {
    formattedDate = date.format('DD MMM')
  }

  return (
    <time
      className={classes('text-nowrap', props.className)}
      dateTime={props.value}
    >
      {formattedDate}
    </time>
  )
}

MessageDate.propTypes = {
  className: T.string,
  value: T.string.isRequired
}

export {
  MessageDate
}
