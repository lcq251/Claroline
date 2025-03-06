import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {number} from '#/main/app/intl'
import {constants} from '#/main/evaluation/constants'
import {EvaluationScore} from '#/main/evaluation/components/score'

const StepStatus = ({
  progression,
  totalScore
}) => {
  return (
    <span className="ms-auto">
      {!isEmpty(progression.displayScore)
        && [constants.EVALUATION_STATUS_COMPLETED, constants.EVALUATION_STATUS_PASSED, constants.EVALUATION_STATUS_FAILED].includes(progression.status) &&
        <EvaluationScore
          score={get(progression, 'displayScore.current')}
          scoreMax={get(progression, 'displayScore.total')}
          display={totalScore}
          size="sm"
        />
      }

      {constants.EVALUATION_STATUS_INCOMPLETE === progression.status &&
        <span className="text-learning fw-bolder fs-sm">{number(progression.progression) || '0'} %</span>
      }

      <span className={classes('fa fa-fw icon-with-text-left', {
        'far fa-circle text-body-tertiary': !progression.status || constants.EVALUATION_STATUS_NOT_ATTEMPTED === progression.status,
        'far fa-circle-dot text-learning': constants.EVALUATION_STATUS_INCOMPLETE === progression.status,
        'fa-circle-check text-learning': [constants.EVALUATION_STATUS_COMPLETED, constants.EVALUATION_STATUS_PASSED].includes(progression.status),
        'fa-circle-xmark text-learning': constants.EVALUATION_STATUS_FAILED === progression.status
      })} />
    </span>
  )
}

StepStatus.propTypes = {
  progression: T.shape({
    status: T.string,
    progression: T.number,
    displayScore: T.shape({
      current: T.number,
      total: T.number.isRequired
    })
  }),
  totalScore: T.number
}

export {
  StepStatus
}
