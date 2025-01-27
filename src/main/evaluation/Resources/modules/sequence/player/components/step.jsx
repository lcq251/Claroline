import React from 'react'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {URL_BUTTON} from '#/main/app/buttons'
import {Html} from '#/main/app/components/html'
import {PageHeading, PageSection} from '#/main/app/page'
import {ResourceCard} from '#/main/core/resource/components/card'
import {ResourceEmbedded} from '#/main/core/resource/containers/embedded'
import {route as resourceRoute} from '#/main/core/resource/routing'

import {Step as StepTypes} from '#/main/evaluation/sequence/prop-types'

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

    {props.description &&
      <PageSection size="md">
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
  numbering: T.string,
  showResourceHeader: T.bool.isRequired,
  secondaryResourcesTarget: T.oneOf(['_self', '_blank']),
  updateProgression: T.func.isRequired,
  enableNavigation: T.func.isRequired,
  disableNavigation: T.func.isRequired
})

export {
  Step
}
