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

import {route} from '#/main/evaluation/workspace/routing'
import {getEvaluationActions} from '#/main/evaluation/workspace/utils'
import {WorkspaceEvaluation} from '#/main/evaluation/workspace/prop-types'
import {SequenceEvaluation} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/modals/user-progression/store'
import {EvaluationListItem} from '#/main/evaluation/components/list-item'
import {MODAL_USER_PROGRESSION} from '#/main/evaluation/sequence/modals/user-progression'
import {MODAL_BUTTON} from '#/main/app/buttons'

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const progression = useSelector(selectors.progression)

  return (
    <BaseProgressionModal
      {...omit(props)}
      evaluation={props.evaluation}
      title={get(props.evaluation, 'workspace.name')}
      url={['apiv2_workspace_evaluation_get', {workspace: get(props.evaluation, 'workspace.id'), user: get(props.evaluation, 'user.id')}]}
      actions={getEvaluationActions([props.evaluation], {}, route(props.evaluation), currentUser)}
    >
      {isEmpty(progression) &&
        <EmptyState
          title={trans('L\'utilisateur n\'a commencé aucune activité pour le moment')}
        />
      }

      {!isEmpty(progression) &&
        <ul className="list-unstyled mb-0">
          {progression.map((sequenceEvaluation, index) =>
            <li key={sequenceEvaluation.id} className={classes(0 !== index && 'border-top')}>
              <EvaluationListItem
                title={get(sequenceEvaluation, 'sequence.name')}
                evaluation={sequenceEvaluation}
                primaryAction={{
                  type: MODAL_BUTTON,
                  modal: [MODAL_USER_PROGRESSION, {
                    evaluation: sequenceEvaluation
                  }]
                }}
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
    WorkspaceEvaluation.propTypes
  ).isRequired,
  progression: T.arrayOf(T.shape(
    SequenceEvaluation.propTypes
  )),
  fadeModal: T.func.isRequired
}

export {
  UserProgressionModal
}
