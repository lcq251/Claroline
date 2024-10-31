import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import omit from 'lodash/omit'

import {constants} from '#/main/evaluation/constants'
import {Badge} from '#/main/app/components/badge'

const EvaluationStatus = (props) => {
  let status = props.status
  if (!status) {
    status = constants.EVALUATION_STATUS_UNKNOWN
  }

  return (
    <Badge
      {...omit(props, 'className', 'status', 'subtle')}
      className={classes('evaluation-status', props.className)}
      variant={constants.EVALUATION_STATUS_COLOR[status]}
      subtle={props.subtle}
    >
      {constants.EVALUATION_STATUSES_SHORT[status]}
    </Badge>
  )
}

EvaluationStatus.propTypes = {
  className: T.string,
  status: T.string,
  subtle: T.bool
}

export {
  EvaluationStatus
}
