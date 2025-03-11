import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Badge} from '#/main/app/components/badge'
import {constants} from '#/main/evaluation/constants'
import {LINK_BUTTON, LinkButton} from '#/main/app/buttons'
import {Button} from '#/main/app/action'
import {trans} from '#/main/app/intl'

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
    <Button
      type={LINK_BUTTON}
      label={trans('show_my_progression', {}, 'actions')}
      target={props.target} className={classes('focus-ring rounded-1', `focus-ring-${constants.EVALUATION_STATUS_COLOR[status]}`, props.className)}
      tooltip="bottom"
    >
      <Badge
        className={classes('fs-sm lh-base py-1', props.className)}
        variant={constants.EVALUATION_STATUS_COLOR[status]}
      >
        {statusText}
      </Badge>
    </Button>
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
