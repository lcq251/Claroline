import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataCell as DataCellTypes} from '#/main/app/data/types/prop-types'
import {EntityCell} from '#/main/app/data/types/entity/components/cell'
import {Event as EventTypes} from '#/plugin/cursus/prop-types'

const EventCell = (props) =>
  <EntityCell
    {...props}
  />

implementPropTypes(EventCell, DataCellTypes, {
  data: T.oneOfType([
    T.shape(
      EventTypes.propTypes
    ),
    T.arrayOf(T.shape(
      EventTypes.propTypes
    ))
  ])
})

export {
  EventCell
}
