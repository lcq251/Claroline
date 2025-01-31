import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'

import {DataCard} from '#/main/app/data/components/card'

const ScheduledTaskCard = props =>
  <DataCard
    {...props}
    icon="fa fa-clock"
    name={props.data.name}
    title={props.data.name}
    subtitle={trans(props.data.type)}
    footer={props.data.executionDate &&
      <span>
        {trans('executed_at')} <b>{displayDate(props.data.executionDate, false, true)}</b>
      </span>
    }
  />

ScheduledTaskCard.propTypes = {
  data: T.shape({
    id: T.string.isRequired,
    name: T.string.isRequired,
    type: T.string.isRequired,
    executionDate: T.string
  }).isRequired
}

export {
  ScheduledTaskCard
}
