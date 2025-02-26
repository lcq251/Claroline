import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Alert} from '#/main/app/components/alert'
import {Html} from '#/main/app/components/html'

import {constants} from '#/main/evaluation/constants'

/**
 * Display a custom message based on the status of an evaluation.
 */
const EvaluationFeedback = props => {
  const displayed = [
    constants.EVALUATION_STATUS_PASSED,
    constants.EVALUATION_STATUS_FAILED,
    constants.EVALUATION_STATUS_COMPLETED
  ].indexOf(props.status) > -1 // Evaluation is finished

  if (displayed) {
    let alertTitle
    let alertMessage
    switch (props.status) {
      case constants.EVALUATION_STATUS_PASSED:
        alertTitle = trans('evaluation_passed_feedback', {}, 'evaluation')
        alertMessage = props.success || trans('evaluation_passed_feedback_msg', {}, 'evaluation')
        break
      case constants.EVALUATION_STATUS_FAILED:
        alertTitle = trans('evaluation_failed_feedback', {}, 'evaluation')
        alertMessage = props.failure || trans('evaluation_failed_feedback_msg', {}, 'evaluation')
        break
      case constants.EVALUATION_STATUS_COMPLETED:
      default:
        alertTitle = trans('evaluation_completed_feedback', {}, 'evaluation')
        alertMessage = trans('evaluation_completed_feedback_msg', {}, 'evaluation')
        break
    }

    return (
      <Alert
        type={constants.EVALUATION_STATUS_COLOR[props.status]}
        title={alertTitle}
      >
        <Html>{alertMessage}</Html>
      </Alert>
    )
  }

  return null // feedback not available
}

EvaluationFeedback.propTypes = {
  status: T.string,
  success: T.string,
  failure: T.string
}

EvaluationFeedback.defaultProps = {
  status: constants.EVALUATION_STATUS_NOT_ATTEMPTED
}

export {
  EvaluationFeedback
}
