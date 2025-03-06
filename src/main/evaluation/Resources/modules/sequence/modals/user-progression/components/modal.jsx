import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'

import {UserProgressionModal as BaseProgressionModal} from '#/main/evaluation/modals/user-progression/components/modal'
import {getEvaluationActions} from '#/main/evaluation/sequence/utils'
import {useSelector} from 'react-redux'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store'

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const sequencePath = useSelector(sequenceSelectors.path)

  return (
    <BaseProgressionModal
      {...omit(props, 'basePath', 'evaluation', 'path', 'stepsProgression', 'fetchUserStepsProgression', 'resetUserStepsProgression')}
      evaluation={props.evaluation}
      actions={getEvaluationActions([props.evaluation], {}, sequencePath, currentUser)}
    />
  )
}

UserProgressionModal.propTypes = {
  evaluation: T.shape(
    SequenceEvaluationTypes.propTypes
  ).isRequired,
  fadeModal: T.func.isRequired
}

UserProgressionModal.defaultProps = {
  resourceEvaluations: []
}

export {
  UserProgressionModal
}
