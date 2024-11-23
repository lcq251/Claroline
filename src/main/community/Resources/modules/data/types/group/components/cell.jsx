import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'

import {Group as GroupTypes} from '#/main/community/group/prop-types'

const GroupCell = props =>
  <EntityCell
    {...props}
  />

GroupCell.propTypes = {
  data: T.oneOfType([
    T.shape(
      GroupTypes.propTypes
    ),
    T.arrayOf(T.shape(
      GroupTypes.propTypes
    ))
  ])
}

export {
  GroupCell
}
