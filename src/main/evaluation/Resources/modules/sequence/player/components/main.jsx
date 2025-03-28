import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {LinkButton} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'

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
    <SequencePage>
      <PageAside closable={true}>
        <PlayerSummary
          path={route(props.sequence, null, props.path)}
          sequence={props.sequence}
          userEvaluation={props.evaluation}
          progression={props.progression}
        />
      </PageAside>

      <Routes
        path={basePath+'/play'}
        redirect={[
          {from: '/', to: `/${props.steps[0].slug}`}
        ]}
        routes={[
          {
            path: '/end',
            component: PlayerEnd
          }, {
            path: '/:slug',
            onEnter: (params) => {
              const step = props.steps.find(step => params.slug === step.slug)

              if (step && props.currentUser) {
                props.updateProgression(step.id)
              }
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
                  <PageContent className="d-flex flex-column">
                    <LinkButton
                      className="btn text-secondary-emphasis bg-secondary-subtle w-100 py-3 rounded-0 px-0 focus-ring focus-ring-secondary shadow-none"
                      size="lg"
                      target={classes({
                        [`${basePath}`]: !previous,
                        [`${basePath}/play/${previous && previous.slug}`]: !!previous
                      })}
                      exact={true}
                    >
                      <div className="content-md px-4 text-truncate" role="presentation">
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

                    <div role="presentation" className="h-100 flex-shrink-0 d-flex flex-column">
                      <Step
                        {...step}
                        subtitle={trans('sequence_step_count', {current: stepIndex+1, total: props.steps.length}, 'evaluation')}
                        currentUser={props.currentUser}
                        numbering={getNumbering(props.sequence.display.numbering, props.sequence.steps, step)}
                        updateProgression={props.updateProgression}
                        enableNavigation={props.enableNavigation}
                        disableNavigation={props.disableNavigation}
                        secondaryResourcesTarget={props.sequence.opening.secondaryResources}
                      />

                      {props.navigationEnabled &&
                        <LinkButton
                          className="btn btn-primary w-100 py-3 rounded-0 px-0 focus-ring focus-ring-secondary shadow-none mt-auto"
                          size="lg"
                          target={classes({
                            [`${basePath}/play/end`]: !next,
                            [`${basePath}/play/${next && next.slug}`]: !!next
                          })}
                          exact={true}
                        >
                          <div className="content-md px-4 text-truncate" role="presentation">
                            {next &&
                              <span className="fa fa-fw fa-arrow-down icon-with-text-right" aria-hidden={true} />
                            }

                            {!next ?
                              trans('finish_sequence', {}, 'actions') :
                              (getNumbering(props.sequence.display.numbering, props.sequence.steps, next) ?
                                  getNumbering(props.sequence.display.numbering, props.sequence.steps, next) + ' ' + next.title :
                                  next.title
                              )
                            }
                          </div>
                        </LinkButton>
                      }
                    </div>
                  </PageContent>
                )
              }

              routeProps.history.push(basePath)

              return null
            }
          }
        ]}
      />
    </SequencePage>
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
  progression: T.object,
  evaluation: T.shape(
    SequenceEvaluationTypes.propTypes
  ),
  updateProgression: T.func.isRequired,
  enableNavigation: T.func.isRequired,
  disableNavigation: T.func.isRequired
}

export {
  SequencePlayer
}
