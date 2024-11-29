import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Badge} from '#/main/app/components/badge'
import {trans, transChoice} from '#/main/app/intl'
import {getAvailableSeats} from '#/plugin/cursus/utils'
import {Session as SessionTypes} from '#/plugin/cursus/prop-types'

const AvailableSeats = (props) => {
  const availableSeats = getAvailableSeats(props.session)

  if (0 === availableSeats) {
    return (
      <Badge className={props.className} subtle={true} variant="warning">
        {trans('full', {}, 'cursus')}
      </Badge>
    )
  }

  if (null === availableSeats) {
    return (
      <Badge className={props.className} subtle={true} variant="primary">
        {trans('available_seats', {}, 'cursus')}
      </Badge>
    )
  }

  return (
    <Badge className={props.className} subtle={true} variant="primary">
      {transChoice('available_seats_count', availableSeats, {count: availableSeats}, 'cursus')}
    </Badge>
  )
}

AvailableSeats.propTypes = {
  className: T.string,
  session: T.shape(
    SessionTypes.propTypes
  )
}

export {
  AvailableSeats
}