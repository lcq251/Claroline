import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {PageContent, PageSection} from '#/main/app/page'

import {selectors as resourceSelectors} from '#/main/core/resource/store'
import {ResourceCard} from '#/main/evaluation/resource/components/card'
import {selectors} from '#/main/evaluation/resource/evaluation/store'

import {EvaluationList} from '#/main/evaluation/components/list'
import {getActions, getDefaultAction} from '#/main/evaluation/resource/utils'
import {actions as listActions} from '#/main/app/content/list'
import {selectors as securitySelectors} from '#/main/app/security/store'

const ResourceDashboardEvaluations = () => {
  const dispatch = useDispatch()

  const currentUser = useSelector(securitySelectors.currentUser)
  const resourceId = useSelector(resourceSelectors.id)
  const resourcePath = useSelector(resourceSelectors.path)

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
          url={['apiv2_resource_evaluation_list', {nodeId: resourceId}]}
          primaryAction={(row) => getDefaultAction(row, evaluationsRefresher, resourcePath, currentUser)}
          actions={(rows) => getActions(rows, evaluationsRefresher, resourcePath, currentUser)}
          card={ResourceCard}
        />
      </PageSection>
    </PageContent>
  )
}

export {
  ResourceDashboardEvaluations
}
