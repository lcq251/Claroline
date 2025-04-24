import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'


import {PageContent, PageSection} from '#/main/app/page'
import {actions as listActions} from '#/main/app/content/list'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {EvaluationList} from '#/main/evaluation/components/list'

import {EvaluationSequenceCard} from '#/main/evaluation/sequence/components/card'
import {getEvaluationActions, getEvaluationDefaultAction} from '#/main/evaluation/sequence/utils'
import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store'

import {selectors} from '#/main/evaluation/sequence/dashboard/store'

const SequenceDashboardEvaluations = () => {
  const dispatch = useDispatch()

  const currentUser = useSelector(securitySelectors.currentUser)
  const sequencePath = useSelector(sequenceSelectors.path)
  const sequenceId = useSelector(sequenceSelectors.id)
  const hasScore = useSelector(sequenceSelectors.hasScore)
  const totalScore = useSelector(sequenceSelectors.totalScore)

  const invalidateList = useCallback(() => {
    dispatch(listActions.invalidateData(selectors.STORE_NAME + '.evaluations'))
  }, [selectors.STORE_NAME + '.evaluations'])

  const evaluationsRefresher = {
    add:    invalidateList,
    update: invalidateList,
    delete: invalidateList
  }

  return (
    <PageContent className="d-flex">
      <PageSection size="full" className="d-flex flex-fill mt-4">
        <EvaluationList
          name={selectors.STORE_NAME+'.evaluations'}
          url={['apiv2_sequence_evaluation_list', {sequenceId: sequenceId}]}
          primaryAction={(row) => getEvaluationDefaultAction(row, evaluationsRefresher, sequencePath, currentUser)}
          actions={(rows) => getEvaluationActions(rows, evaluationsRefresher, sequencePath, currentUser)}
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
