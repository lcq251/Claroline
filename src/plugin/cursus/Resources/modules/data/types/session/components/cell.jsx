import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataCell as DataCellTypes} from '#/main/app/data/types/prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'
import {Session as SessionTypes} from '#/plugin/cursus/prop-types'
import isEmpty from 'lodash/isEmpty'
import {displayDateRange, trans} from '#/main/app/intl'
import get from 'lodash/get'

const SessionCell = props => {
  if (isEmpty(props.data)) {
    return <em>{props.placeholders || trans('no_session', {}, 'cursus')}</em>
  }

  return displayDateRange(get(props.data, 'dates[0]'), get(props.data, 'dates[1]'))
}

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
