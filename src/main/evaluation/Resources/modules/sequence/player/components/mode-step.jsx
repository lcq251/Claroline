import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {Stepper} from '#/main/app/components/stepper'
import {PageContent, PagePoster} from '#/main/app/page'

import {getNext, getPrevious} from '#/main/evaluation/sequence/utils'
import {Step} from '#/main/evaluation/sequence/player/components/step'
import {Step as StepTypes} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/sequence/store'
import {PlayerNext} from '#/main/evaluation/sequence/player/components/next'
import {PlayerPrevious} from '#/main/evaluation/sequence/player/components/previous'

/**
 * Sequence player when "all" (One step per page) pagination is enabled.
 */
const PlayerModeStep = (props) => {
  const totalSteps = useSelector(selectors.totalSteps)
  const navigationEnabled = useSelector(selectors.navigationEnabled)

  const step = useSelector(selectors.currentStep)
  const stepIndex = useSelector(selectors.currentStepIndex)

  const previous = getPrevious(props.steps, step)
  const next = getNext(props.steps, step)

  return (
    <PageContent className="d-flex flex-column">
      <PlayerPrevious
        className="rounded-0 px-0 shadow-none fs-lg"
        path={props.path}
        previous={previous}
      />

      <div id={'step-'+step.id} role="presentation" className="h-100 flex-shrink-0 d-flex flex-column">
        {step.poster &&
          <PagePoster poster={step.poster} />
        }
        <Stepper className="mx-auto mt-4 mb-n4" current={stepIndex} total={totalSteps} />
        <Step
          level={0}
          poster={false}
          title={true}
          step={step}
          updateProgression={props.updateProgression}
          enableNavigation={props.enableNavigation}
          disableNavigation={props.disableNavigation}
        />

        {navigationEnabled &&
          <PlayerNext
            className="rounded-0 px-0 shadow-none fs-lg"
            path={props.path}
            next={next}
          />
        }
      </div>
    </PageContent>
  )
}

PlayerModeStep.propTypes = {
  path: T.string.isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )).isRequired,
  updateProgression: T.func.isRequired,
  enableNavigation: T.func.isRequired,
  disableNavigation: T.func.isRequired
}

export {
  PlayerModeStep
}
