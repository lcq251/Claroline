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
import {UserProgressionModal as BaseProgressionModal} from '#/main/evaluation/modals/user-progression/containers/modal'

import {route} from '#/main/evaluation/sequence'
import {getEvaluationActions} from '#/main/evaluation/sequence/utils'
import {SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/modals/user-progression/store'
import {EvaluationListItem} from '#/main/evaluation/components/list-item'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USER_PROGRESSION} from '#/main/evaluation/resource/modals/user-progression'

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const progression = useSelector(selectors.progression)

  return (
    <BaseProgressionModal
      {...omit(props, 'evaluation', 'path', 'fetchUserStepsProgression', 'resetUserStepsProgression')}
      evaluation={props.evaluation}
      title={get(props.evaluation, 'sequence.name')}
      url={['apiv2_sequence_evaluation_get', {sequence: get(props.evaluation, 'sequence.id'), user: get(props.evaluation, 'user.id')}]}
      actions={getEvaluationActions([props.evaluation], {}, route(get(props.evaluation, 'sequence')), currentUser)}
    >
      {isEmpty(progression) &&
        <EmptyState
          title={trans('L\'utilisateur n\'a commencé aucune activité pour le moment')}
        />
      }

      {!isEmpty(progression) &&
        <ul className="list-unstyled mb-0">
          {progression.map((stepEvaluation, index) =>
            <li key={get(stepEvaluation, 'step.id')} className={classes(0 !== index && 'border-top')}>
              <EvaluationListItem
                title={get(stepEvaluation, 'step.name')}
                evaluation={stepEvaluation}
                primaryAction={stepEvaluation.resourceNode ? {
                  type: MODAL_BUTTON,
                  modal: [MODAL_USER_PROGRESSION, {
                    evaluation: stepEvaluation
                  }]
                } : undefined}
              />
            </li>
          )}
        </ul>
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
