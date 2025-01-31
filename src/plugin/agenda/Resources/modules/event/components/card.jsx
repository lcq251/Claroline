import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {displayDateRange} from '#/main/app/intl/date'
import {asset} from '#/main/app/config/asset'
import {getPlainText} from '#/main/app/data/types/html/utils'
import {DataCard} from '#/main/app/data/components/card'

import {Event as EventTypes} from '#/plugin/agenda/prop-types'
import {EventIcon} from '#/plugin/agenda/event/components/icon'

const EventCard = (props) =>
  <DataCard
    {...props}
    icon={<EventIcon type={get(props.data, 'meta.type')} />}
    name={props.data.name}
    title={props.data.name}
    subtitle={displayDateRange(props.data.start, props.data.end)}
    poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
    contentText={getPlainText(props.data.description)}
  />

EventCard.propTypes = {
  data: T.shape(
    EventTypes.propTypes
  ).isRequired
}

export {
  EventCard
}
