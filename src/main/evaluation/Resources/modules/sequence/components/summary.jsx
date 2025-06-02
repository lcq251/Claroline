import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {LinkButton} from '#/main/app/buttons'

import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'
import {flattenSteps, getNumbering} from '#/main/evaluation/sequence/utils'
import {StepStatus} from '#/main/evaluation/sequence/components/step-status'

const SequenceSummary = (props) => {
  const steps = flattenSteps(props.sequence.steps)

  return (
    <ul className={classes('list-unstyled d-flex flex-column gap-1 mb-0', props.className)}>
      {steps.map((step, index) => {
        const numbering = getNumbering(props.sequence.display.numbering, props.sequence.steps, step)
        const stepProgression = props.progression.find(e => get(e, 'step.id') === step.id) || {}

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

              <StepStatus
                progression={stepProgression}
                totalScore={get(props.sequence, 'evaluation.scoreTotal')}
              />
            </LinkButton>
          </li>
        )
      })}
    </ul>
  )
}

SequenceSummary.propTypes = {
  className: T.string,
  path: T.string.isRequired,
  sequence: T.shape(
    SequenceTypes.propTypes
  ).isRequired,
  progression: T.array
}

export {
  SequenceSummary
}
