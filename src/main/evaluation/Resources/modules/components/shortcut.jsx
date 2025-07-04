import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Badge} from '#/main/app/components/badge'
import {constants} from '#/main/evaluation/constants'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {UserEvaluation} from '#/main/evaluation/prop-types'

const EvaluationShortcut = ({evaluation, modal, className}) => {
  let status = evaluation.status
  if (!status) {
    status = constants.EVALUATION_STATUS_UNKNOWN
  }

  let statusText = constants.EVALUATION_STATUSES_SHORT[status]
  if (constants.EVALUATION_STATUS_INCOMPLETE === status && (evaluation.progression || 0 === evaluation.progression)) {
    statusText = Math.round(evaluation.progression)+'%'
  }

  return (
    <Button
      type={MODAL_BUTTON}
      label={trans('show_my_progression', {}, 'actions')}
      className={classes('focus-ring rounded-1', `focus-ring-${constants.EVALUATION_STATUS_COLOR[status]}`, className)}
      tooltip="bottom"
      modal={[modal, {evaluation: evaluation}]}
    >
      <Badge
        className={classes('fs-sm lh-base py-1', className)}
        variant={constants.EVALUATION_STATUS_COLOR[status]}
      >
        {statusText}
      </Badge>
    </Button>
  )
}

EvaluationShortcut.propTypes = {
  evaluation: T.shape(UserEvaluation.propTypes),
  modal: T.string.isRequired,
  className: T.string
}

export {
  EvaluationShortcut
}
