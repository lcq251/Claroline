import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/app/config/asset'
import {DataCard} from '#/main/app/data/components/card'

import {getAddressString} from '#/main/app/data/types/address/utils'
import {Location as LocationTypes} from '#/main/community/prop-types'

const LocationCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail ? asset(props.data.thumbnail) : null}
    icon={!props.data.thumbnail ? <>{props.data.name.charAt(0)}</> : null}
    title={props.data.name}
    contentText={getAddressString(props.data.address)}
  />

LocationCard.propTypes = {
  data: T.shape(
    LocationTypes.propTypes
  ).isRequired
}

export {
  LocationCard
}
