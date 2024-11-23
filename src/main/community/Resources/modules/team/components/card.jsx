import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {DataCard} from '#/main/app/data/components/card'

import {Team as TeamTypes} from '#/main/community/team/prop-types'

const TeamCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={props.data.name}
    contentText={get(props.data, 'meta.description') || <em className="text-body-tertiary">{trans('no_description')}</em>}
    asIcon={true}
  />

TeamCard.propTypes = {
  data: T.shape(
    TeamTypes.propTypes
  ).isRequired
}

export {
  TeamCard
}
