import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'

import {Badge as BadgeTypes} from '#/plugin/open-badge/prop-types'

const BadgeCard = props =>
  <DataCard
    id={get(props.data, 'id')}
    poster={get(props.data, 'image')}
    color={get(props.data, 'color')}
    icon="fa fa-trophy"
    name={get(props.data, 'name')}
    title={get(props.data, 'name')}
    contentText={get(props.data, 'meta.description') || <em className="text-body-tertiary">{trans('no_description')}</em>}
    meta={get(props.data, 'meta.archived', false) &&
      <span className="badge bg-secondary-subtle text-secondary-emphasis text-capitalize">{trans('disabled')}</span>
    }
    asIcon={true}
    {...props}
  />

BadgeCard.propTypes = {
  className: T.string,
  data: T.shape(
    BadgeTypes.propTypes
  ).isRequired
}

export {
  BadgeCard
}
