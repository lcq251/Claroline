import React, {Fragment} from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {toKey} from '#/main/app/utils/text'
import {DataCell as DataCellTypes} from '#/main/app/data/types/prop-types'
import {Badge} from '#/main/app/components/badge'

const TagCell = (props) => {
  if (0 !== props.data.length) {
    return (
      <div className="d-flex flex-row gap-1" role="presentation">
        {props.data.map(tag =>
          <Badge key={toKey(tag)} subtle={true} variant="primary">
            {tag}
          </Badge>
        )}
      </div>
    )
  }

  return '-'
}

implementPropTypes(TagCell, DataCellTypes, {
  data: T.arrayOf(T.string)
}, {
  data: []
})

export {
  TagCell
}
