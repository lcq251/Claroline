import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {ProgressBar} from '#/main/app/components/progress-bar'
import {Datetime} from '#/main/app/components/date'
import {LinkButton} from '#/main/app/buttons'

import {constants} from '#/main/evaluation/constants'

const EvaluationProgression = (props) =>
  <div className={classes('bg-body-tertiary rounded-3 p-3 mb-4', props.className)}>
    <ProgressBar value={props.progression} size="xs" variant="learning" />

    <div className="d-flex flex-row gap-3 flex-wrap align-items-center mt-2" role="presentation">
      <div className="" role="presentation">
        <b className="d-block ">{trans('completion', {current: props.progression}, 'evaluation')}</b>
        <small className="text-body-secondary" role="presentation">
          {props.date ?
            (<>{trans('last_activity_at')} <Datetime value={props.date} time={true} long={true} /></>)
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

EvaluationProgression.propTypes = {
  className: T.string,
  progression: T.number,
  status: T.string,
  lastActivity: T.string,
  target: T.string.isRequired
}

export {
  EvaluationProgression
}
