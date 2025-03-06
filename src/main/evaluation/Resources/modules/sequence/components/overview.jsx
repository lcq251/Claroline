import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {toKey} from '#/main/app/utils/text'
import {Toolbar} from '#/main/app/action'
import {ASYNC_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {Html} from '#/main/app/components/html'
import {Alert} from '#/main/app/components/alert'
import {PageContent} from '#/main/app/page'
import {ResourceEmbedded} from '#/main/core/resource/containers/embedded'

import {PathSummary} from '#/main/evaluation/sequence/components/summary'
import {PageSection} from '#/main/app/page/components/section'
import {SequencePage} from '#/main/evaluation/sequence/components/page'

import {EvaluationProgression} from '#/main/evaluation/components/progression'
import {EvaluationFeedback} from '#/main/evaluation/components/feedback'

import {selectors} from '#/main/evaluation/sequence/store'
import {constants} from '#/main/evaluation/constants'

const SequenceOverviewContent = (props) => {
  const description = get(props.sequence, 'meta.descriptionHtml', null)

  return (
    <>
      {(props.userEvaluation || description) &&
        <PageSection size="md" className="pt-5">
          {props.userEvaluation &&
            <EvaluationProgression
              {...props.userEvaluation}
              target={props.path+'/progression'}
            />
          }

          {props.actions &&
            <Toolbar
              className="d-flex gap-1 mb-5"
              buttonName="btn"
              primaryName="btn-primary"
              defaultName="btn-link"
              actions={props.actions}
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

const SequenceOverview = () => {
  const sequence = useSelector(selectors.sequence)
  const sequencePath = useSelector(selectors.path)
  const userEvaluation = useSelector(selectors.evaluation)
  const progression = useSelector(selectors.progression)

  const actions = [
    {
      name: 'start',
      type: LINK_BUTTON,
      label: trans('start', {}, 'actions'),
      target: `${sequencePath}/play`,
      primary: true,
      disabled: isEmpty(sequence.steps),
      displayed: !userEvaluation || [constants.EVALUATION_STATUS_UNKNOWN, constants.EVALUATION_STATUS_NOT_ATTEMPTED].includes(userEvaluation.status)
    }, {
      name: 'continue',
      type: LINK_BUTTON,
      label: trans('continue', {}, 'actions'),
      target: `${sequencePath}/play`,
      primary: true,
      disabled: isEmpty(sequence.steps),
      displayed: !!userEvaluation && constants.EVALUATION_STATUS_INCOMPLETE === userEvaluation.status
    }, {
      name: 'restart',
      type: LINK_BUTTON,
      label: trans('restart', {}, 'actions'),
      target: `${sequencePath}/play`,
      primary: true,
      disabled: isEmpty(sequence.steps),
      displayed: !!userEvaluation && [constants.EVALUATION_STATUS_PASSED, constants.EVALUATION_STATUS_FAILED, constants.EVALUATION_STATUS_COMPLETED].includes(userEvaluation.status)
    }, {
      name: 'download-certificate',
      type: ASYNC_BUTTON,
      label: trans('download_certificate', {}, 'actions'),
      request: {
        url: ['apiv2_sequence_download_certificate'],
        request: {
          method: 'POST',
          body: JSON.stringify([userEvaluation ? userEvaluation.id : null])
        }
      },
      displayed: !!userEvaluation && !!userEvaluation.certified && [constants.EVALUATION_STATUS_PASSED, constants.EVALUATION_STATUS_COMPLETED].includes(userEvaluation.status)
    }
  ]

  return (
    <SequencePage>
      <PageContent poster={get(sequence, 'poster')}>
        <SequenceOverviewContent
          path={sequencePath}
          sequence={sequence}
          actions={actions}
          userEvaluation={userEvaluation}
          display={{
            score: get(sequence, 'display.showScore'),
            scoreMax: get(sequence, 'evaluation.scoreTotal'),
            feedback: !!get(sequence, 'evaluation.successMessage') || !!get(sequence, 'evaluation.failureMessage')
          }}
          feedbacks={{
            success: get(sequence, 'evaluation.successMessage'),
            failure: get(sequence, 'evaluation.failureMessage')
          }}
        >
          {!isEmpty(get(sequence, 'overview.resource')) &&
            <PageSection size="md" className="mb-5">
              <ResourceEmbedded
                resourceNode={get(sequence, 'overview.resource')}
                showHeader={false}
              />
            </PageSection>
          }

          <PageSection
            size="md"
            className="mb-5"
            title={trans('content')}
          >
            {!isEmpty(sequence.steps) ?
              <PathSummary
                path={sequencePath}
                sequence={sequence}
                progression={progression}
              /> :
              <ContentPlaceholder
                size="lg"
                title={trans('no_step', {}, 'path')}
              />
            }
          </PageSection>
        </SequenceOverviewContent>
      </PageContent>
    </SequencePage>
  )
}

export {
  SequenceOverview
}
