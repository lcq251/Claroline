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
import {PageContent, PageSection} from '#/main/app/page'
import {ResourceEmbedded} from '#/main/core/resource/containers/embedded'

import {SequenceSummary} from '#/main/evaluation/sequence/components/summary'
import {SequencePage} from '#/main/evaluation/sequence/components/page'
import {EvaluationProgression} from '#/main/evaluation/components/progression'
import {EvaluationFeedback} from '#/main/evaluation/components/feedback'

import {selectors} from '#/main/evaluation/sequence/store'
import {constants} from '#/main/evaluation/constants'

const SequenceOverviewContent = (props) => {
  const description = get(props.sequence, 'meta.descriptionHtml', null)
  const overviewResource = get(props.sequence, 'overview.resource')

  return (
    <>
      {props.userEvaluation &&
        <PageSection
          size="md"
          className="pt-5 mb-5"
          title={trans('my_progression')}
          showTitle={false}
        >
          <EvaluationProgression
            {...props.userEvaluation}
            target={props.path+'/progression'}
          />

          {(get(props, 'display.feedback', false) || !isEmpty(get(props.feedbacks, 'closed'))) &&
            <div className="mt-4" role="presentation">
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
            </div>
          }

          {props.actions &&
            <Toolbar
              className="d-flex gap-1 mt-4"
              buttonName="btn"
              primaryName="btn-primary"
              defaultName="btn-link"
              actions={props.actions}
            />
          }
        </PageSection>
      }

      {(description || overviewResource) &&
        <PageSection
          size="md"
          title={trans('about')}
          showTitle={false}
        >
          {description &&
            <Html className="content-text mb-5">{description}</Html>
          }

          {overviewResource &&
            <ResourceEmbedded
              className="mb-5"
              resourceNode={overviewResource}
              showHeader={false}
            />
          }
        </PageSection>
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
          <PageSection
            size="md"
            className="mb-5"
            title={trans('content')}
          >
            {!isEmpty(sequence.steps) ?
              <SequenceSummary
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
