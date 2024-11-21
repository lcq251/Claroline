import React from 'react'
import {PropTypes as T} from 'prop-types'

import {number} from '#/main/app/intl/number'
import {ProgressBar} from '#/main/app/components/progress-bar'

const ProgressionCell = (props) => {
  const value = number(props.data || 0)

  return (
    <div className="d-flex align-items-center gap-2" role="presentation">
      <ProgressBar
        id={props.id}
        variant={props.type}
        value={value}
        size="xs"
        className="flex-fill"
      />
      <span className="fs-sm w-25 text-end" role="presentation">
        {value+'%'}
      </span>
    </div>
  )
}

ProgressionCell.propTypes = {
  id: T.string.isRequired,
  data: T.number,
  type: T.oneOf(['success', 'info', 'warning', 'danger', 'learning'])
}

ProgressionCell.defaultProps = {
  type: 'learning'
}

export {
  ProgressionCell
}
