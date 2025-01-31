import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {DataCard} from '#/main/app/data/components/card'

const CrudCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    icon="fa fa-ghost"
    poster={props.data.thumbnail}
    name={props.data.name}
    title={props.data.name}
    contentText={get(props.data, 'meta.description')}
  />

CrudCard.propTypes = {
  data: T.shape({
    id: T.string,
    name: T.string,
    thumbnail: T.string
  }).isRequired
}

export {
  CrudCard
}
