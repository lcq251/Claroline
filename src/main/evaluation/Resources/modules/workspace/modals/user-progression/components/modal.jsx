import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {displayDate, trans} from '#/main/app/intl'
import {precision} from '#/main/app/intl/number'
import {EmptyState} from '#/main/app/components/empty-state'
import {Badge} from '#/main/app/components/badge'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {UserProgressionModal as BaseProgressionModal} from '#/main/evaluation/modals/user-progression/containers/modal'

import {route} from '#/main/evaluation/workspace/routing'
import {getEvaluationActions} from '#/main/evaluation/workspace/utils'
import {WorkspaceEvaluation} from '#/main/evaluation/workspace/prop-types'
import {SequenceEvaluation} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/modals/user-progression/store'
import {EvaluationScore} from '#/main/evaluation/components/score'
import {EvaluationStatus} from '#/main/evaluation/components/status'
import {constants} from '#/main/evaluation/constants'

const UserProgressionSequence = ({evaluation}) => {
  return (
    <>
      <div role="presentation">
        <b>{get(evaluation, 'sequence.name')}</b>
        <div className={classes('d-flex gap-2 text-body-secondary fs-sm mt-2')} role="presentation">
          <div role="presentation">
            <span className="fa fa-clock me-2" aria-hidden={true} />
            280min
          </div>
          <span aria-hidden={true}>-</span>

          <div role="presentation">
            <span className="fa fa-calendar me-2" aria-hidden={true} />
            {displayDate(get(evaluation, 'lastActivityAt'), true, true)}
          </div>
        </div>
      </div>

      <div className="ms-auto d-flex flex-column text-end" style={{minWidth: '8rem'}}>
        <span className="fs-sm text-body-tertiary  d-block mb-1">Score</span>
        <EvaluationScore
          className="ms-auto"
          condensed={false}
          size="lg"
          score={get(evaluation, 'displayScore.current')}
          scoreMax={get(evaluation, 'displayScore.total')}
        />
      </div>

      <div className=" d-flex flex-column" style={{minWidth: '8rem'}}>
        <span className="fs-sm text-body-tertiary  d-block mb-1">Statut</span>

        {constants.EVALUATION_STATUS_INCOMPLETE === evaluation.status ?
          <Badge className="fs-base me-auto" variant="info" subtle={true}>
            {precision(evaluation.progression || 0, 1)}%
          </Badge> :
          <EvaluationStatus className="fs-base me-auto" status={evaluation.status} subtle={true} />
        }
      </div>

      <span className="fa fa-fw fa-chevron-right text-body-tertiary align-self-center" aria-hidden={true} />
    </>
  )
}

UserProgressionSequence.propTypes = {
  evaluation: T.shape(SequenceEvaluation.propTypes).isRequired
}

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const progression = useSelector(selectors.progression)

  return (
    <BaseProgressionModal
      {...omit(props)}
      evaluation={props.evaluation}
      url={['apiv2_workspace_evaluation_get', {workspace: get(props.evaluation, 'workspace.id'), user: get(props.evaluation, 'user.id')}]}
      actions={getEvaluationActions([props.evaluation], {}, route(props.evaluation), currentUser)}
    >
      {isEmpty(progression) &&
        <EmptyState
          title={trans('L\'utilisateur n\'a commencé aucune activité pour le moment')}
        />
      }

      <ul className="list-unstyled mb-0">
        {progression.map((sequenceEvaluation, index) =>
          <li key={sequenceEvaluation.id} className={classes('py-3 d-flex flex-row gap-4', 0 !== index && 'border-top')}>
            <UserProgressionSequence evaluation={sequenceEvaluation} />
          </li>
        )}
      </ul>
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
