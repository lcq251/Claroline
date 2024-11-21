import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {ProgressBar} from '#/main/app/components/progress-bar'
import {Datetime} from '#/main/app/components/date'

const EvaluationProgression = (props) =>
  <div className={classes('bg-body-tertiary rounded-3 p-3 mb-4', props.className)}>
    <ProgressBar value={props.progression} size="xs" variant="learning"/>

    <b className="d-block mt-2">{props.progression || '0'}% Complete</b>

    {props.date ?
      <small className="text-body-secondary">Dernière activité le <Datetime value={props.date} time={true}/></small> :
      trans('no_activity')
    }
  </div>

EvaluationProgression.propTypes = {
  className: T.string,
  progression: T.number,
  status: T.string,
  lastActivity: T.string
}

export {
  EvaluationProgression
}
