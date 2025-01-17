import React from 'react'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Button} from '#/main/app/action/components/button'
import {MENU_BUTTON, CALLBACK_BUTTON, URL_BUTTON} from '#/main/app/buttons'
import {Html} from '#/main/app/components/html'
import {PageHeading, PageSection} from '#/main/app/page'
import {ResourceCard} from '#/main/core/resource/components/card'
import {ResourceEmbedded} from '#/main/core/resource/containers/embedded'
import {route as resourceRoute} from '#/main/core/resource/routing'

import {Step as StepTypes} from '#/main/evaluation/sequence/prop-types'
import {constants} from '#/main/evaluation/sequence/constants'

const ManualProgression = props =>
  <div className="text-body-tertiary d-flex align-items-baseline mb-1" role="presentation">
    {trans('user_progression', {}, 'path')}

    <Button
      id="step-progression"
      className="btn btn-link fw-bold"
      type={MENU_BUTTON}
      label={constants.STEP_STATUS[props.status]}
      menu={{
        align: 'right',
        items: Object.keys(constants.STEP_MANUAL_STATUS).map((status) => ({
          type: CALLBACK_BUTTON,
          label: constants.STEP_MANUAL_STATUS[status],
          callback: () => props.updateProgression(props.stepId, status, false)
        }))
      }}
    >
      <span className="ms-2 fa fa-caret-down" aria-hidden={true} />
    </Button>
  </div>

ManualProgression.propTypes = {
  status: T.string.isRequired,
  stepId: T.string.isRequired,
  updateProgression: T.func.isRequired
}

const SecondaryResources = props =>
  <PageSection
    size="md"
    className={classes('mb-5', props.className)}
    title={trans('useful_links')}
  >
    {props.resources.map(resource =>
      <ResourceCard
        key={resource.id}
        size="xs"
        orientation="row"
        primaryAction={{
          type: URL_BUTTON,
          label: trans('open', {}, 'actions'),
          target: '#'+resourceRoute(resource),
          open: props.target
        }}
        data={resource}
      />
    )}
  </PageSection>

SecondaryResources.propTypes = {
  className: T.string,
  target: T.oneOf(['_self', '_blank']),
  resources: T.arrayOf(T.shape({
    // resource node type
  })).isRequired
}

/**
 * Renders step content.
 */
const Step = props =>
  <>
    <PageHeading
      size="md"
      poster={props.poster}
      title={props.numbering ?
        props.numbering + ' ' + props.title :
        props.title
      }
      subtitle={props.subtitle}
    />

    {props.children}

    {((props.manualProgressionAllowed && props.currentUser) || props.description) &&
      <PageSection size="md">
        {props.manualProgressionAllowed && props.currentUser &&
          <ManualProgression
            status={props.progression}
            stepId={props.id}
            updateProgression={props.updateProgression}
          />
        }

        {props.description &&
          <Html className="content-text mb-5">{props.description}</Html>
        }

        {(props.description && props.primaryResource) &&
          <hr className="content-md mt-0 mb-5" aria-hidden={true} />
        }
      </PageSection>
    }

    {props.primaryResource &&
      <PageSection size="md" className="mb-5">
        <ResourceEmbedded
          resourceNode={props.primaryResource}
          showHeader={props.showResourceHeader}
          lifecycle={{
            play: props.disableNavigation,
            end: () => {
              props.enableNavigation()
              // get updated path progression
              props.updateProgression(props.id)
            }
          }}
        />
      </PageSection>
    }

    {0 !== props.secondaryResources.length &&
      <SecondaryResources
        className="mb-5"
        resources={props.secondaryResources}
        target={props.secondaryResourcesTarget}
      />
    }
  </>

implementPropTypes(Step, StepTypes, {
  subtitle: T.string,
  currentUser: T.object,
  progression: T.string,
  numbering: T.string,
  showResourceHeader: T.bool.isRequired,
  manualProgressionAllowed: T.bool.isRequired,
  secondaryResourcesTarget: T.oneOf(['_self', '_blank']),
  updateProgression: T.func.isRequired,
  enableNavigation: T.func.isRequired,
  disableNavigation: T.func.isRequired
})

export {
  Step
}
