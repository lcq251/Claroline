import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {toKey} from '#/main/app/utils/text'
import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {Alert} from '#/main/app/components/alert'
import {Html} from '#/main/app/components/html'

import {ResourcePage} from '#/main/core/resource/components/page'
import {selectors} from '#/main/core/resource/store'

import {ResourceEvaluation as ResourceEvaluationTypes} from '#/main/evaluation/resource/prop-types'
import {EvaluationFeedback} from '#/main/evaluation/components/feedback'
import {PageSection} from '#/main/app/page/components/section'
import {EvaluationProgression} from '#/main/evaluation/components/progression'
import {Toolbar} from '#/main/app/action'
import {EvaluationStatus} from '#/main/evaluation/components/status'
import {PageAffix} from '#/main/app/page/components/affix'

const ResourceOverviewContent = (props) => {
  const resourceNode = useSelector(selectors.resourceNode)
  const embedded = useSelector(selectors.embedded)

  const description = get(resourceNode, 'meta.descriptionHtml', null) /*|| get(resourceNode, 'meta.description', null)*/
  const estimatedDuration = get(resourceNode, 'evaluation.estimatedDuration')

  return (
    <>
      {(props.evaluation || description || estimatedDuration) &&
        <PageSection size="md" className={classes({
          'pt-5': !embedded
        })}>
          {props.evaluation &&
            <EvaluationProgression
              {...props.evaluation}
            />
          }

          {description &&
            <Html className="content-text mb-5">{description}</Html>
          }
        </PageSection>
      }

      {props.evaluation &&
        <>
          {((!isEmpty(props.evaluation) && get(props, 'display.feedback', false)) || !isEmpty(get(props.feedbacks, 'closed'))) &&
            <PageSection size="md" className="resource-feedbacks py-3">
              {!isEmpty(props.evaluation) && get(props, 'display.feedback', false) &&
                <EvaluationFeedback
                  status={props.evaluation.status}
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

      {props.children}
    </div>
  )
}

ResourceOverviewAffix.propTypes = {
  evaluationStatus: T.string
}

const ResourceOverview = props => {
  const resourceNode = useSelector(selectors.resourceNode)

  return (
    <ResourcePage
      poster={get(resourceNode, 'poster')}
    >
      {!props.affix ?
        <ResourceOverviewContent {...props} /> :
        <PageAffix
          affix={
            <ResourceOverviewAffix actions={props.actions} evaluationStatus={get(props.evaluation, 'status')}>
              {props.affix}
            </ResourceOverviewAffix>
          }
        >
          <ResourceOverviewContent {...props} />
        </PageAffix>
      }
    </ResourcePage>
  )
}

ResourceOverview.propTypes = {
  evaluation: T.shape(
    ResourceEvaluationTypes.propTypes
  ),
  display: T.shape({
    score: T.bool,
    scoreMax: T.number,
    successScore: T.number,
    feedback: T.bool
  }),
  feedbacks: T.shape({
    success: T.string,
    failure: T.string,
    // a list of message to explain why the user can not submit new attempts to the resource (if quiz max attempts are reached, dropzone drop period finished, etc.)
    closed: T.arrayOf(T.array)
  }),
  statusTexts: T.object,

  /**
   * A list of detailed information about the evaluation.
   * Each info to display is an array of 2 elements : the first element is the label and the second is the associated value.
   */
  details: T.arrayOf(
    T.arrayOf(T.string)
  ),
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  children: T.node
}

ResourceOverview.defaultProps = {
  actions: []
}

export {
  ResourceOverview
}
