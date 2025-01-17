import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Badge} from '#/main/app/components/badge'
import {constants} from '#/main/evaluation/constants'
import {LinkButton} from '#/main/app/buttons'

const EvaluationShortcut = (props) => {
  let status = props.status
  if (!status) {
    status = constants.EVALUATION_STATUS_UNKNOWN
  }

  let statusText = constants.EVALUATION_STATUSES_SHORT[status]
  if (constants.EVALUATION_STATUS_INCOMPLETE === status && (props.progression || 0 === props.progression)) {
    statusText = Math.round(props.progression)+'%'
  }

  return (
    <LinkButton
      target={props.target} className={classes('focus-ring rounded-1', `focus-ring-${constants.EVALUATION_STATUS_COLOR[status]}`, props.className)}
    >
      <Badge
        className={classes('fs-sm lh-base py-1', props.className)}
        variant={constants.EVALUATION_STATUS_COLOR[status]}
      >
        {statusText}
      </Badge>
    </LinkButton>
  )
}

EvaluationShortcut.propTypes = {
  className: T.string,
  status: T.string,
  progression: T.number,
  target: T.string.isRequired
}

export {
  EvaluationShortcut
}
