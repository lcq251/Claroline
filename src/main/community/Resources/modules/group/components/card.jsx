import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {DataCard} from '#/main/app/data/components/card'

import {Group as GroupTypes} from '#/main/community/group/prop-types'

const GroupCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail}
    title={props.data.name}
    name={props.data.name}
    icon="fa fa-users"
    contentText={get(props.data, 'meta.description')}
    asIcon={true}
  />

GroupCard.propTypes = {
  data: T.shape(
    GroupTypes.propTypes
  ).isRequired
}

export {
  GroupCard
}
