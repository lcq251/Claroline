import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {number, trans} from '#/main/app/intl'
import {LinkButton} from '#/main/app/buttons'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

import {EvaluationScore} from '#/main/evaluation/components/score'
import {constants} from '#/main/evaluation/constants'
import {ResourceEvaluation as ResourceEvaluationTypes} from '#/main/evaluation/resource/prop-types'
import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'
import {flattenSteps, getNumbering} from '#/main/evaluation/sequence/utils'

const PathSummary = (props) => {
  if (isEmpty(props.sequence.steps)) {
    return (
      <ContentPlaceholder
        size="lg"
        title={trans('no_step', {}, 'path')}
      />
    )
  }

  const steps = flattenSteps(props.sequence.steps)

  return (
    <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
      {steps.map((step, index) => {
        const numbering = getNumbering(props.sequence.display.numbering, props.sequence.steps, step)
        let resourceEvaluation
        if (!isEmpty(step.primaryResource) && !isEmpty(props.resourceEvaluations)) {
          resourceEvaluation = props.resourceEvaluations.find(evaluation => get(evaluation, 'resourceNode.id') === get(step, 'primaryResource.id'))
        }

        return (
          <li key={step.id}>
            <LinkButton target={`${props.path}/play/${step.slug}`} className={classes('d-flex flex-row text-reset px-4 py-3 fw-normal rounded-2 focus-ring', {
              'bg-body-tertiary': 0 === index % 2
            })}>
              {numbering &&
                <span className="text-body-tertiary fw-bold me-2" role="presentation">
                  {numbering}
                </span>
              }

              {step.title}

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
                        score={get(props.sequence, 'evaluation.scoreTotal') ? (resourceEvaluation.score / resourceEvaluation.scoreMax) * get(props.sequence, 'evaluation.scoreTotal') : resourceEvaluation.score}
                        scoreMax={get(props.sequence, 'evaluation.scoreTotal') ? get(props.sequence, 'evaluation.scoreTotal') : resourceEvaluation.scoreMax}
                        size="sm"
                      />
                    }

                    {!resourceEvaluation.scoreMax && [constants.EVALUATION_STATUS_INCOMPLETE].includes(resourceEvaluation.status) &&
                      <span className="step-progression">{number(resourceEvaluation.progression) || '0'} %</span>
                    }

                    <span className={classes('fa fa-fw icon-with-text-left', {
                      // status for steps with a required resource
                      'far fa-circle not_started': constants.EVALUATION_STATUS_NOT_ATTEMPTED === resourceEvaluation.status,
                      'fa-circle-notch fa-spin': constants.EVALUATION_STATUS_INCOMPLETE === resourceEvaluation.status,
                      'fa-circle-check': [constants.EVALUATION_STATUS_COMPLETED, constants.EVALUATION_STATUS_PASSED].includes(resourceEvaluation.status),
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
  )
}

PathSummary.propTypes = {
  path: T.string.isRequired,
  sequence: T.shape(
    SequenceTypes.propTypes
  ).isRequired,
  stepsProgression: T.object,
  resourceEvaluations: T.arrayOf(T.shape(
    ResourceEvaluationTypes.propTypes
  ))
}

export {
  PathSummary
}
