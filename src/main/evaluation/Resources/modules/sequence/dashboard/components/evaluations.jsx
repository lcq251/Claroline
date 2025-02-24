import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {PageContent, PageSection} from '#/main/app/page'

import {MODAL_RESOURCE_EVALUATIONS} from '#/main/evaluation/modals/resource-evaluations'
import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store'

import {selectors} from '#/main/evaluation/sequence/dashboard/store'
import {EvaluationSequenceCard} from '#/main/evaluation/sequence/components/card'
import {EvaluationList} from '#/main/evaluation/components/list'

const SequenceDashboardEvaluations = () => {
  const sequenceId = useSelector(sequenceSelectors.id)
  const hasScore = useSelector(sequenceSelectors.hasScore)
  const totalScore = useSelector(sequenceSelectors.totalScore)

  return (
    <PageContent className="d-flex">
      <PageSection size="full" className="d-flex flex-fill">
        <EvaluationList
          name={selectors.STORE_NAME+'.evaluations'}
          url={['apiv2_sequence_evaluation_list', {sequenceId: sequenceId}]}
          primaryAction={(row) => ({
            name: 'about',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-circle-info',
            label: trans('show-info', {}, 'actions'),
            modal: [MODAL_RESOURCE_EVALUATIONS, {
              userEvaluation: row
            }],
            scope: ['object']
          })}
          card={EvaluationSequenceCard}
          hasScore={hasScore}
          totalScore={totalScore}
        />
      </PageSection>
    </PageContent>
  )
}

export {
  SequenceDashboardEvaluations
}
