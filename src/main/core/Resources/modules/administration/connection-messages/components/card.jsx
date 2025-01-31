import React from 'react'
import {PropTypes as T} from 'prop-types'

import {DataCard} from '#/main/app/data/components/card'

import {constants} from '#/main/core/administration/connection-messages/constants'
import {ConnectionMessage as ConnectionMessageTypes} from '#/main/core/administration/connection-messages/prop-types'

const ConnectionMessageCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    icon="fa fa-comment-dots"
    name={props.data.title}
    title={props.data.title}
    subtitle={constants.MESSAGE_TYPES[props.data.type]}
  />

ConnectionMessageCard.propTypes = {
  data: T.shape(
    ConnectionMessageTypes.propTypes
  ).isRequired
}

export {
  ConnectionMessageCard
}
