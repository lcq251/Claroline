import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'

const ResourceCell = props =>
  <EntityCell
    {...props}
  />

ResourceCell.propTypes = {
  data: T.oneOfType([
    T.shape(
      ResourceNodeTypes.propTypes
    ),
    T.arrayOf(T.shape(
      ResourceNodeTypes.propTypes
    ))
  ])
}

export {
  ResourceCell
}
