import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {PageContent, PageSection} from '#/main/app/page'

import {selectors as resourceSelectors} from '#/main/core/resource/store'
import {ResourceCard} from '#/main/evaluation/resource/components/card'
import {selectors} from '#/main/evaluation/resource/evaluation/store'

import {EvaluationList} from '#/main/evaluation/components/list'
import {getActions} from '#/main/evaluation/resource/utils'
import {actions as listActions} from '#/main/app/content/list'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as toolSelectors} from '#/main/core/tool'

const ResourceDashboardEvaluations = () => {
  const dispatch = useDispatch()

  const currentUser = useSelector(securitySelectors.currentUser)
  const contextType = useSelector(toolSelectors.contextType)
  const contextId = useSelector(toolSelectors.contextId)

  const resourcePath = useSelector(resourceSelectors.path)
  const resourceId = useSelector(resourceSelectors.id)
  const hasScore = useSelector(resourceSelectors.hasScore)
  const totalScore = useSelector(resourceSelectors.totalScore)

  const invalidateList = useCallback(() => {
    dispatch(listActions.invalidateData(selectors.STORE_NAME))
  }, [selectors.STORE_NAME])

  const evaluationsRefresher = {
    add:    invalidateList,
    update: invalidateList,
    delete: invalidateList
  }

  return (
    <PageContent className="py-4">
      <PageSection size="full" className="d-flex flex-fill">
        <EvaluationList
          name={selectors.STORE_NAME}
          contextType={contextType}
          contextId={contextId}
          url={['apiv2_resource_evaluation_list', {nodeId: resourceId}]}
          primaryAction="open"
          actions={(rows) => getActions(rows, evaluationsRefresher, resourcePath, currentUser, true)}
          card={ResourceCard}
          hasScore={hasScore}
          totalScore={totalScore}
        />
      </PageSection>
    </PageContent>
  )
}

export {
  ResourceDashboardEvaluations
}
