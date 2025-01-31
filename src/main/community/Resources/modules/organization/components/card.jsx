import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'

import {Organization as OrganizationTypes} from '#/main/community/organization/prop-types'

const OrganizationCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail}
    icon="fa fa-building"
    name={props.data.name}
    title={props.data.name}
    contentText={get(props.data, 'meta.description') || <em className="text-body-tertiary">{trans('no_description')}</em>}
    asIcon={true}
  />

OrganizationCard.propTypes = {
  data: T.shape(
    OrganizationTypes.propTypes
  ).isRequired
}

export {
  OrganizationCard
}
