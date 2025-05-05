import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {PageContent, PageSection} from '#/main/app/page'

import {Step} from '#/main/evaluation/sequence/player/components/step'
import {Step as StepTypes} from '#/main/evaluation/sequence/prop-types'
import {PlayerNext} from '#/main/evaluation/sequence/player/components/next'

/**
 * Sequence player when "none" (all steps one after the other) pagination is enabled.
 */
const PlayerModeInline = (props) => {
  return (
    <PageContent className="d-flex flex-column">
      {props.steps.map((step, stepIndex) =>
        <Fragment key={step.id}>
          {0 !== stepIndex && 0 === step.level &&
            <hr className="m-0" />
          }

          <div id={'step-'+step.id} className="d-flex flex-column flex-fill" role="presentation">
            <Step
              title={0 === step.level}
              poster={true}
              step={step}
              level={step.level}
              updateProgression={props.updateProgression}
              enableNavigation={props.enableNavigation}
              disableNavigation={props.disableNavigation}
            />
          </div>
        </Fragment>
      )}

      <PageSection className="mb-5">
        <PlayerNext
          path={props.path}
        />
      </PageSection>
    </PageContent>
  )
}

PlayerModeInline.propTypes = {
  path: T.string.isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )).isRequired,
  updateProgression: T.func.isRequired,
  enableNavigation: T.func.isRequired,
  disableNavigation: T.func.isRequired
}

export {
  PlayerModeInline
}
