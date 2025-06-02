import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import {arc} from 'd3-shape'
import {scaleLinear} from 'd3-scale'

import {constants} from '#/main/evaluation/constants'
import {EvaluationStatus} from '#/main/evaluation/components/status'
import {GaugeContainer} from '#/main/core/layout/gauge/components/gauge'
import {precision} from '#/main/app/intl/number'
import {EvaluationScore} from '#/main/evaluation/components/score'

const EvaluationProgress = (props) => {
  const radius = 80

  const circleX = scaleLinear().range([-(2 * Math.PI) / 3, (2 * Math.PI) / 3]).domain([0, 100])
  const circleY = scaleLinear().range([0, radius]).domain([0, radius])

  const outerRadius = circleY(radius)
  const innerRadius = circleY(radius - (0.08 * radius))

  const gutter = arc()
    .startAngle(circleX(0))
    .endAngle(circleX(100))
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)

  const progress = arc()
    .startAngle(circleX(0))
    .endAngle(circleX(props.progression))
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)

  return (
    <GaugeContainer className={classes('mx-auto')} type={props.type} width={radius * 2} height={radius * 2} radius={radius} >
      <g transform={`translate(${radius}, ${radius})`}>
        <path
          className="bg"
          d={gutter()}
          strokeLinecap="round"
          strokeMiterlimit="round"
        />

        {props.progression &&
          <path
            className="meter"
            d={progress()}
            strokeLinecap="round"
            strokeMiterlimit="round"
          />
        }
        <span className="fa fa-check h1" />
      </g>
    </GaugeContainer>
  )
}

EvaluationProgress.propTypes = {
  size: T.string,
  progression: T.number,
  type: T.string
}

const EvaluationText = ({
  status,
  displayScore,
  progression
}) => {
  if (![constants.EVALUATION_STATUS_COMPLETED, constants.EVALUATION_STATUS_PASSED, constants.EVALUATION_STATUS_FAILED].includes(status)) {
    return (
      <div className={classes('evaluation-text fw-bold d-flex flex-column justify-content-center')}>
        {`${precision(progression, 1)}%`}
      </div>
    )
  }

  if (displayScore) {
    return (
      <EvaluationScore className="evaluation-text" score={displayScore.current} scoreMax={displayScore.total} condensed={false} />
    )
  }

  if ([constants.EVALUATION_STATUS_COMPLETED, constants.EVALUATION_STATUS_PASSED].includes(status)) {
    return (
      <span className={classes('evaluation-text fa fa-check d-flex flex-column justify-content-center')} />
    )
  }

  return (
    <span className={classes('evaluation-text fa fa-times d-flex flex-column justify-content-center')} />
  )
}

const EvaluationGauge = (props) =>
  <div className={classes('evaluation-gauge', props.size && `evaluation-gauge-${props.size}`, props.className, constants.EVALUATION_STATUS_COLOR[props.status])}>
    <EvaluationProgress
      size={props.size}
      progression={props.progression}
      type={constants.EVALUATION_STATUS_COLOR[props.status]}
    />
    <EvaluationText progression={props.progression} status={props.status} displayScore={props.displayScore} />
    <EvaluationStatus className="py-2 px-3" status={props.status} />
  </div>

EvaluationGauge.propTypes = {
  className: T.string,
  status: T.string,
  progression: T.number,
  displayScore: T.shape({
    current: T.number,
    total: T.number,
  }),

  size: T.oneOf(['md', 'lg', 'xl'])
}

EvaluationGauge.defaultProps = {
  status: constants.EVALUATION_STATUS_NOT_ATTEMPTED,
  progression: 0
}

export {
  EvaluationGauge
}
