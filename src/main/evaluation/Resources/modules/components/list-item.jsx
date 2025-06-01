import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {displayDate, trans} from '#/main/app/intl'
import {precision} from '#/main/app/intl/number'
import {Badge} from '#/main/app/components/badge'

import {EvaluationScore} from '#/main/evaluation/components/score'
import {EvaluationStatus} from '#/main/evaluation/components/status'
import {constants} from '#/main/evaluation/constants'
import {UserEvaluation} from '#/main/evaluation/prop-types'

const EvaluationListItem = ({evaluation}) => {
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
        <span className="fs-sm text-body-tertiary  d-block mb-1">{trans('score')}</span>
        <EvaluationScore
          className="ms-auto"
          condensed={false}
          size="lg"
          score={get(evaluation, 'displayScore.current')}
          scoreMax={get(evaluation, 'displayScore.total')}
        />
      </div>

      <div className=" d-flex flex-column" style={{minWidth: '8rem'}}>
        <span className="fs-sm text-body-tertiary  d-block mb-1">{trans('status')}</span>

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

EvaluationListItem.propTypes = {
  evaluation: T.shape(UserEvaluation.propTypes).isRequired
}

export {
  EvaluationListItem
}
