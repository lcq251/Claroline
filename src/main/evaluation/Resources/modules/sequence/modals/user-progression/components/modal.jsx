import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {EmptyState} from '#/main/app/components/empty-state'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {UserProgressionModal as BaseProgressionModal} from '#/main/evaluation/modals/user-progression/components/modal'

import {route} from '#/main/evaluation/sequence'
import {getEvaluationActions} from '#/main/evaluation/sequence/utils'
import {SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/modals/user-progression/store'
import {EvaluationListItem} from '#/main/evaluation/components/list-item'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USER_PROGRESSION} from '#/main/evaluation/resource/modals/user-progression'
import {UserProgressionOverview} from '#/main/evaluation/sequence/modals/user-progression/components/overview'

const STORE_NAME = 'userSequenceEvaluation'

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)

  return (
    <BaseProgressionModal
      {...omit(props, 'evaluation', 'path', 'fetchUserStepsProgression', 'resetUserStepsProgression')}
      evaluation={props.evaluation}
      name={STORE_NAME}
      title={trans('sequence_name', {name: get(props.evaluation, 'sequence.name')}, 'evaluation')}
      url={['apiv2_sequence_evaluation_get', {sequence: get(props.evaluation, 'sequence.id'), user: get(props.evaluation, 'user.id')}]}
      actions={getEvaluationActions([props.evaluation], {}, route(get(props.evaluation, 'sequence')), currentUser)}
      overview={UserProgressionOverview}
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
