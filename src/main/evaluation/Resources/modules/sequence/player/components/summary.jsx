import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {number, trans} from '#/main/app/intl'
import {LinkButton} from '#/main/app/buttons'

import {EvaluationScore} from '#/main/evaluation/components/score'
import {constants} from '#/main/evaluation/constants'
import {ResourceEvaluation as ResourceEvaluationTypes} from '#/main/evaluation/resource/prop-types'
import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'
import {flattenSteps, getNumbering} from '#/main/evaluation/sequence/utils'
import {ProgressBar} from '#/main/app/components/progress-bar'

const PlayerSummary = (props) => {
  const steps = flattenSteps(props.sequence.steps)

  return (
    <>
      <LinkButton target={props.path} exact={true} className="btn btn-text-body focus-ring mb-3 ms-n2" size="sm">
        <span className="fa fa-arrow-left icon-with-text-right" aria-hidden={true} />
        {trans('back_home', {}, 'actions')}
      </LinkButton>

      <h2 className="app-page-aside-title">
        {props.sequence.name}
      </h2>

      {props.userEvaluation &&
        <>
          <b className="d-block mb-2 text-uppercase fs-sm text-body-secondary text-nowrap">
            {trans('completion', {current: get(props.userEvaluation, 'progression', 0)}, 'evaluation')}
          </b>
          <ProgressBar value={get(props.userEvaluation, 'progression', 0)} size="xs" variant="learning"/>
        </>
      }

      <ul className="list-unstyled mb-0 mx-n3 mt-4">
        {steps.map((step, index) => {
          const numbering = getNumbering(props.sequence.display.numbering, props.sequence.steps, step)
          let resourceEvaluation
          if (!isEmpty(step.primaryResource) && !isEmpty(props.resourceEvaluations)) {
            resourceEvaluation = props.resourceEvaluations.find(evaluation => get(evaluation, 'resourceNode.id') === get(step, 'primaryResource.id'))
          }

          return (
            <li key={step.id}>
              <LinkButton target={`${props.path}/play/${step.slug}`} className="d-flex flex-row text-reset py-3 px-3 fw-normal rounded-2 focus-ring gap-2 text-nowrap">
                <div className="text-truncate" role="presentation">
                  {numbering &&
                    <span className="text-body-tertiary fw-bold me-2" role="presentation">
                      {numbering}
                    </span>
                  }

                  {step.title}
                </div>

                <span className="step-status">
                  {!resourceEvaluation &&
                    <span className={classes('fa fa-fw', {
                      // status for steps without required resource
                      'far fa-circle not_started': !props.stepsProgression[step.id] || ['unseen', 'to_do'].includes(props.stepsProgression[step.id]),
                      'fa-circle-check': ['seen', 'done'].includes(props.stepsProgression[step.id]),
                      'fa-circle-xmark': ['to_review'].includes(props.stepsProgression[step.id])
                    })} />
                  }

                  {resourceEvaluation &&
                    <>
                      {get(props.sequence, 'display.showScore') && resourceEvaluation.scoreMax &&
                        <EvaluationScore
                          score={get(props.sequence, 'score.total') ? (resourceEvaluation.score / resourceEvaluation.scoreMax) * get(props.sequence, 'score.total') : resourceEvaluation.score}
                          scoreMax={get(props.sequence, 'score.total') ? get(props.sequence, 'score.total') : resourceEvaluation.scoreMax}
                          size="sm"
                        />
                      }

                      {!resourceEvaluation.scoreMax && [constants.EVALUATION_STATUS_INCOMPLETE].includes(resourceEvaluation.status) &&
                        <span className="step-progression">{number(resourceEvaluation.progression) || '0'} %</span>
                      }

                      <span className={classes('fa fa-fw icon-with-text-left', {
                        // status for steps with a required resource
                        'far fa-circle not_started': [constants.EVALUATION_STATUS_NOT_ATTEMPTED, constants.EVALUATION_STATUS_TODO, constants.EVALUATION_STATUS_OPENED].includes(resourceEvaluation.status),
                        'fa-circle-notch fa-spin': [constants.EVALUATION_STATUS_INCOMPLETE].includes(resourceEvaluation.status),
                        'fa-circle-check': [constants.EVALUATION_STATUS_COMPLETED, constants.EVALUATION_STATUS_PARTICIPATED, constants.EVALUATION_STATUS_PASSED].includes(resourceEvaluation.status),
                        'fa-circle-xmark': constants.EVALUATION_STATUS_FAILED === resourceEvaluation.status
                      })} />
                    </>
                  }
                </span>
              </LinkButton>
            </li>
          )
        })}
      </ul>
    </>
  )
}

PlayerSummary.propTypes = {
  className: T.string,
  path: T.string.isRequired,
  sequence: T.shape(
    SequenceTypes.propTypes
  ).isRequired,
  userEvaluation: T.shape(
    ResourceEvaluationTypes.propTypes
  ),
  stepsProgression: T.object,
  resourceEvaluations: T.arrayOf(T.shape(
    ResourceEvaluationTypes.propTypes
  ))
}

export {
  PlayerSummary
}
