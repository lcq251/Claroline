import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {EmptyState} from '#/main/app/components/empty-state'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {UserProgressionModal as BaseProgressionModal} from '#/main/evaluation/modals/user-progression/containers/modal'

import {route} from '#/main/evaluation/sequence'
import {getEvaluationActions} from '#/main/evaluation/sequence/utils'
import {SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/modals/user-progression/store'

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const progression = useSelector(selectors.progression)

  return (
    <BaseProgressionModal
      {...omit(props, 'evaluation', 'path', 'fetchUserStepsProgression', 'resetUserStepsProgression')}
      evaluation={props.evaluation}
      url={['apiv2_sequence_evaluation_get', {sequence: get(props.evaluation, 'sequence.id'), user: get(props.evaluation, 'user.id')}]}
      actions={getEvaluationActions([props.evaluation], {}, route(get(props.evaluation, 'sequence')), currentUser)}
    >
      {isEmpty(progression) &&
        <EmptyState
          title={trans('L\'utilisateur n\'a commencé aucune activité pour le moment')}
        />
      }

    </BaseProgressionModal>
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
