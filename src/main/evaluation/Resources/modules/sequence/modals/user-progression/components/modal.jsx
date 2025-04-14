import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {selectors as securitySelectors} from '#/main/app/security/store'
import {UserProgressionModal as BaseProgressionModal} from '#/main/evaluation/modals/user-progression/components/modal'

import {route} from '#/main/evaluation/sequence'
import {getEvaluationActions} from '#/main/evaluation/sequence/utils'
import {SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)

  return (
    <BaseProgressionModal
      {...omit(props, 'basePath', 'evaluation', 'path', 'stepsProgression', 'fetchUserStepsProgression', 'resetUserStepsProgression')}
      evaluation={props.evaluation}
      actions={getEvaluationActions([props.evaluation], {}, route(get(props.evaluation, 'sequence')), currentUser)}
    />
  )
}

UserProgressionModal.propTypes = {
  evaluation: T.shape(
    SequenceEvaluationTypes.propTypes
  ).isRequired,
  fadeModal: T.func.isRequired
}

export {
  UserProgressionModal
}
