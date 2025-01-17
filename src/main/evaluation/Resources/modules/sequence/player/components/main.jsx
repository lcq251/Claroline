import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {scrollTo} from '#/main/app/dom/scroll'
import {LinkButton} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {ResourceEvaluation as ResourceEvaluationTypes} from '#/main/evaluation/resource/prop-types'

import {Sequence as SequenceTypes, Step as StepTypes} from '#/main/evaluation/sequence/prop-types'
import {Step} from '#/main/evaluation/sequence/player/components/step'
import {PlayerEnd} from '#/main/evaluation/sequence/player/components/end'
import {getNext, getNumbering, getPrevious} from '#/main/evaluation/sequence/utils'
import {SequencePage} from '#/main/evaluation/sequence/components/page'
import {route} from '#/main/evaluation/sequence/routing'

import {PlayerSummary} from '#/main/evaluation/sequence/player/components/summary'
import {PageAside, PageContent} from '#/main/app/page/components/body'

const SequencePlayer = props => {
  if (0 === props.steps.length) {
    return (
      <ContentPlaceholder
        size="lg"
        title={trans('no_step', {}, 'path')}
      />
    )
  }

  const basePath = route(props.sequence, null, props.path)

  return (
    <Routes
      path={basePath}
      redirect={[
        {from: '/play', to: `/play/${props.steps[0].slug}`}
      ]}
      routes={[
        {
          path: '/play/end',
          disabled: !get(props.sequence, 'end.display'),
          render: () => (
            <PlayerEnd
              basePath={basePath}
              path={props.sequence}
              currentUser={props.currentUser}
              evaluation={props.evaluation}
              resourceEvaluations={props.resourceEvaluations}
              stepsProgression={props.stepsProgression}
            />
          )
        }, {
          path: '/play/:slug',
          onEnter: (params) => {
            const step = props.steps.find(step => params.slug === step.slug)

            if (step && props.currentUser) {
              props.updateProgression(step.id)
            }

            scrollTo('.app-page-heading')
          },
          // force navigation in case the user as navigated with the summary without finishing an opened resource
          onLeave: () => props.enableNavigation(),
          render: (routeProps) => {
            const stepIndex = props.steps.findIndex(step => routeProps.match.params.slug === step.slug)
            const step = props.steps.find(step => routeProps.match.params.slug === step.slug)

            if (step) {
              const previous = getPrevious(props.steps, step)
              const next = getNext(props.steps, step)

              return (
                <SequencePage
                  sequence={props.sequence}
                  title={step.title}
                  description={step.description}
                >
                  <PageAside closable={true}>
                    <PlayerSummary
                      path={route(props.sequence, null, props.path)}
                      sequence={props.sequence}
                      userEvaluation={props.evaluation}
                      resourceEvaluations={props.resourceEvaluations}
                      stepsProgression={props.stepsProgression}
                    />
                  </PageAside>

                  <PageContent className="d-flex flex-column">
                    <LinkButton
                      className="btn btn-secondary w-100 py-3 rounded-0 px-0 focus-ring focus-ring-secondary shadow-none"
                      size="lg"
                      target={classes({
                        [`${basePath}`]: !previous,
                        [`${basePath}/play/${previous && previous.slug}`]: !!previous
                      })}
                      exact={true}
                    >
                      <div className="content-md px-4" role="presentation">
                        <span className="fa fa-fw fa-arrow-up icon-with-text-right" aria-hidden={true} />
                        {!previous ?
                          trans('home') :
                          (getNumbering(props.sequence.display.numbering, props.sequence.steps, previous) ?
                            getNumbering(props.sequence.display.numbering, props.sequence.steps, previous) + ' ' + previous.title :
                            previous.title
                          )
                        }
                      </div>
                    </LinkButton>

                    <Step
                      {...step}
                      subtitle={trans('sequence_step_count', {current: stepIndex+1, total: props.steps.length}, 'evaluation')}
                      currentUser={props.currentUser}
                      numbering={getNumbering(props.sequence.display.numbering, props.sequence.steps, step)}
                      progression={props.stepsProgression[step.id]}
                      manualProgressionAllowed={props.sequence.display.manualProgressionAllowed}
                      updateProgression={props.updateProgression}
                      enableNavigation={props.enableNavigation}
                      disableNavigation={props.disableNavigation}
                      secondaryResourcesTarget={props.sequence.opening.secondaryResources}
                    />

                    {props.navigationEnabled &&
                      <div className="content-md mb-5 px-4 mt-auto" role="presentation">
                        <LinkButton
                          className="btn btn-primary w-100"
                          size="lg"
                          target={classes({
                            [`${basePath}/play/end`]: !next && get(props.sequence, 'end.display'),
                            [`${basePath}`]: !next && !get(props.sequence, 'end.display'),
                            [`${basePath}/play/${next && next.slug}`]: !!next
                          })}
                          exact={true}
                        >
                          {trans(next ? 'continue' : 'finish', {}, 'actions')}
                        </LinkButton>
                      </div>
                    }
                  </PageContent>
                </SequencePage>
              )
            }

            routeProps.history.push(basePath)

            return null
          }
        }
      ]}
    />
  )
}

SequencePlayer.propTypes = {
  path: T.string.isRequired,
  currentUser: T.object,
  navigationEnabled: T.bool.isRequired,
  sequence: T.shape(
    SequenceTypes.propTypes
  ).isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )),
  stepsProgression: T.object,
  evaluation: T.shape({
    // SequenceEvaluation types
  }),
  resourceEvaluations: T.arrayOf(T.shape(
    ResourceEvaluationTypes.propTypes
  )),
  updateProgression: T.func.isRequired,
  enableNavigation: T.func.isRequired,
  disableNavigation: T.func.isRequired
}

export {
  SequencePlayer
}
