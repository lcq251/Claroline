import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {ResourceEmbedded} from '#/main/core/resource/containers/embedded'
import {ResourceEvaluation as ResourceEvaluationTypes} from '#/main/evaluation/resource/prop-types'

import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'
import {PathSummary} from '#/main/evaluation/sequence/containers/summary'
import {PageSection} from '#/main/app/page/components/section'
import {SequencePage} from '#/main/evaluation/sequence/components/page'
import {PageAffix} from '#/main/app/page/components/affix'
import {EvaluationStatus} from '#/main/evaluation/components/status'
import {Toolbar} from '#/main/app/action'
import {EvaluationProgression} from '#/main/evaluation/components/progression'
import {Html} from '#/main/app/components/html'
import {EvaluationFeedback} from '#/main/evaluation/components/feedback'
import {Alert} from '#/main/app/components/alert'
import {toKey} from '#/main/app/utils/text'

const ResourceOverviewContent = (props) => {
  const description = get(props.sequence, 'meta.descriptionHtml', null) /*|| get(resourceNode, 'meta.description', null)*/
  const estimatedDuration = get(props.sequence, 'evaluation.estimatedDuration')

  return (
    <>
      {(props.userEvaluation || description || estimatedDuration) &&
        <PageSection size="md" className="pt-5">
          {props.userEvaluation &&
            <EvaluationProgression
              {...props.userEvaluation}
            />
          }

          {description &&
            <Html className="content-text mb-5">{description}</Html>
          }
        </PageSection>
      }

      {props.userEvaluation &&
        <>
          {((!isEmpty(props.userEvaluation) && get(props, 'display.feedback', false)) || !isEmpty(get(props.feedbacks, 'closed'))) &&
            <PageSection size="md" className="resource-feedbacks py-3">
              {!isEmpty(props.userEvaluation) && get(props, 'display.feedback', false) &&
                <EvaluationFeedback
                  status={props.userEvaluation.status}
                  {...props.feedbacks}
                />
              }

              {!isEmpty(get(props.feedbacks, 'closed')) && props.feedbacks.closed.map(closedMessage =>
                <Alert key={toKey(closedMessage[0])} type="warning" title={closedMessage[0]}>
                  <Html>{closedMessage[1]}</Html>
                </Alert>
              )}
            </PageSection>
          }
        </>
      }

      {props.children}
    </>
  )
}

const ResourceOverviewAffix = (props) => {
  return (
    <div className="p-4 border rounded-3 shadow bg-body">
      {props.evaluationStatus &&
        <EvaluationStatus
          status={props.evaluationStatus}
          subtle={true}
          className="fs-base lh-base mb-2 d-block w-100 py-2 px-3"
        />
      }
      <Toolbar
        className="d-grid gap-1"
        buttonName="btn"
        primaryName="btn-primary"
        defaultName="btn-body"
        actions={props.actions}
      />

      <>
        <h3 className="page-section-title h6 my-3">Parcours</h3>
        <ul className="list-unstyled fw-bolder mb-0 text-body-secondary">
          <li className="py-1">
            <span className="me-2 fa far fa-fw fa-clock " />
            Durée estimée : 30min
          </li>
          <li className="py-1">
            <span className="me-2 fa fa-fw fa-list " />
            5 étapes
          </li>
          <li className="py-1">
            <span className="me-2 fa fa-fw fa-pen-ruler" />
            2 activités
          </li>
          <li className="py-1">
            <span className="me-2 fa fa-fw fa-calendar " />
            2 évènements
          </li>
        </ul>
      </>
    </div>
  )
}

ResourceOverviewAffix.propTypes = {
  evaluationStatus: T.string
}

const PathOverview = (props) => {
  console.log('sequence')
  if (!props.sequence) {
    return null
  }

  return (
    <SequencePage sequence={props.sequence}>
      <PageAffix
        affix={
          <ResourceOverviewAffix
            actions={[
              {
                name: 'start',
                type: LINK_BUTTON,
                label: trans('start', {}, 'actions'),
                target: `${props.path}/play`,
                primary: true,
                disabled: isEmpty(props.sequence.steps)
              }
            ]}
            evaluationStatus={get(props.userEvaluation, 'status')}
          />
        }
      >
        <ResourceOverviewContent
          sequence={props.sequence}
          userEvaluation={props.userEvaluation}
          display={{
            score: get(props.sequence, 'display.showScore'),
            scoreMax: get(props.sequence, 'score.total'),
            successScore: get(props.sequence, 'score.success'),
            feedback: !!get(props.sequence, 'evaluation.successMessage') || !!get(props.sequence, 'evaluation.failureMessage')
          }}
          feedbacks={{
            success: get(props.sequence, 'evaluation.successMessage'),
            failure: get(props.sequence, 'evaluation.failureMessage')
          }}
        >
          {!isEmpty(get(props.sequence, 'overview.resource')) &&
            <PageSection size="md">
              <ResourceEmbedded
                className="step-primary-resource"
                resourceNode={get(props.sequence, 'overview.resource')}
                showHeader={false}
              />
            </PageSection>
          }

          <PageSection
            size="md"
            className="mb-5"
            title={trans('summary')}
          >
            {!isEmpty(props.sequence.steps) ?
              <PathSummary
                path={props.path}
                sequence={props.sequence}
                resourceEvaluations={props.resourceEvaluations}
                stepsProgression={props.stepsProgression}
              /> :
              <ContentPlaceholder
                size="lg"
                title={trans('no_step', {}, 'path')}
              />
            }
          </PageSection>
        </ResourceOverviewContent>
      </PageAffix>
    </SequencePage>
  )
}

PathOverview.propTypes = {
  path: T.string.isRequired,
  sequence: T.shape(
    SequenceTypes.propTypes
  ).isRequired,
  userEvaluation: T.shape(
    ResourceEvaluationTypes.propTypes
  ),
  resourceEvaluations: T.arrayOf(T.shape(
    ResourceEvaluationTypes.propTypes
  )),
  stepsProgression: T.object
}

export {
  PathOverview
}
