import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {ProgressBar} from '#/main/app/components/progress-bar'
import {Datetime} from '#/main/app/components/date'
import {LinkButton} from '#/main/app/buttons'

import {constants} from '#/main/evaluation/constants'
import {EvaluationScore} from '#/main/evaluation/components/score'

const EvaluationProgression = (props) => {
  let statusText = trans('completion', {current: props.progression}, 'evaluation')
  if (props.progression >= 100) {
    statusText = constants.EVALUATION_STATUSES_SHORT[props.status]
  }

  return (
    <div className={classes('d-flex flex-row align-items-center gap-4 bg-body-tertiary rounded-3 py-3 px-4', props.className)}>
      {props.displayScore &&
        <EvaluationScore
          score={props.displayScore.current}
          scoreMax={props.displayScore.total}
          condensed={false}
          size="lg"
        />
      }

      <div className="flex-fill" role="presentation">
        <ProgressBar value={props.progression} size="xs" variant="learning" />

        <div className="d-flex flex-row gap-3 flex-wrap align-items-center mt-2" role="presentation">
          <div className="" role="presentation">
            <b className="d-block ">{statusText}</b>
            <small className="text-body-secondary" role="presentation">
              {props.lastActivityAt ?
                (<>{trans('last_activity_at')} <Datetime value={props.lastActivityAt} time={true} long={true} /></>)
                : trans('no_user_activity', {}, 'evaluation')
              }
            </small>
          </div>

          {props.status && ![constants.EVALUATION_STATUS_NOT_ATTEMPTED, constants.EVALUATION_STATUS_UNKNOWN].includes(props.status) &&
            <LinkButton target={props.target} className="btn btn-link ms-auto">
              Voir le détail
              <span className="ms-2 fa fa-arrow-right" aria-hidden={true} />
            </LinkButton>
          }
        </div>
      </div>
    </div>
  )
}

EvaluationProgression.propTypes = {
  className: T.string,
  progression: T.number,
  status: T.string,
  lastActivity: T.string,
  displayScore: T.shape({
    current: T.number,
    total: T.number.isRequired
  }),
  target: T.string.isRequired
}

export {
  EvaluationProgression
}
