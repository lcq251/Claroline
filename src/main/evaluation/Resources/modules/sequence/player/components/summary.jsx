import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {LinkButton} from '#/main/app/buttons'

import {SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'
import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'
import {flattenSteps, getNumbering} from '#/main/evaluation/sequence/utils'
import {ProgressBar} from '#/main/app/components/progress-bar'
import {StepStatus} from '#/main/evaluation/sequence/components/step-status'

const PlayerSummary = (props) => {
  const steps = flattenSteps(props.sequence.steps)

  return (
    <>
      <LinkButton
        target={props.path}
        exact={true}
        className="btn btn-text-body focus-ring mb-3 ms-n2 me-auto mt-n1"
        size="sm"
        onClick={props.autoClose}
      >
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
        {steps.map((step) => {
          const numbering = getNumbering(props.sequence.display.numbering, props.sequence.steps, step)
          const stepProgression = props.progression[step.id] || {}

          return (
            <li key={step.id}>
              <LinkButton
                className="d-flex flex-row text-reset py-3 px-3 fw-normal rounded-2 focus-ring gap-2 text-nowrap"
                target={`${props.path}/play/${step.slug}`}
                onClick={props.autoClose}
              >
                {numbering &&
                  <span className="text-body-tertiary fw-bold" role="presentation">
                    {numbering}
                  </span>
                }

                <div className="text-wrap" role="presentation">
                  {step.title}
                </div>

                <StepStatus
                  progression={stepProgression}
                  totalScore={get(props.sequence, 'evaluation.scoreTotal')}
                />
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
    SequenceEvaluationTypes.propTypes
  ),
  progression: T.object,
  // from aside
  autoClose: T.func
}

export {
  PlayerSummary
}
