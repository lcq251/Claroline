import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataCell as DataCellTypes} from '#/main/app/data/types/prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'
import {Session as SessionTypes} from '#/plugin/cursus/prop-types'

const SessionCell = props =>
  <EntityCell
    {...props}
  />

implementPropTypes(SessionCell, DataCellTypes, {
  data: T.oneOfType([
    T.shape(
      SessionTypes.propTypes
    ),
    T.arrayOf(T.shape(
      SessionTypes.propTypes
    ))
  ])
})

export {
  SessionCell
}
