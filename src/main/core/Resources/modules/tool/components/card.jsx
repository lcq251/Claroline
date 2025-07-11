import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'

const ToolCard = props =>
  <DataCard
    {...props}
    icon={`fa fa-${props.data.icon}`}
    poster={props.data.poster}
    title={trans(props.data.name, {}, 'tools')}
    asIcon={true}
  />

ToolCard.propTypes = {
  className: T.string,
  data: T.shape({
    id: T.string.isRequired,
    name: T.string.isRequired,
    icon: T.string.isRequired,
    thumbnail: T.string
  }).isRequired
}

export {
  ToolCard
}
