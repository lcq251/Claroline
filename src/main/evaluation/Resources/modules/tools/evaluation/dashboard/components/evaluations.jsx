import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {PageContent, PageSection} from '#/main/app/page'

import {EvaluationWorkspaceCard} from '#/main/evaluation/workspace/components/card'
import {getActions} from '#/main/evaluation/workspace/utils'

import {selectors as dashboardSelectors} from '#/main/evaluation/tools/evaluation/dashboard/store/selectors'
import {EvaluationList} from '#/main/evaluation/components/list'
import {selectors as toolSelectors} from '#/main/core/tool'
import {selectors as securitySelectors} from '#/main/app/security'
import {selectors} from '#/main/evaluation/tools/evaluation/store'
import {actions as listActions} from '#/main/app/content/list'

const EvaluationDashboardEvaluations = () => {
  const dispatch = useDispatch()

  const path = useSelector(toolSelectors.path)
  const currentUser = useSelector(securitySelectors.currentUser)
  const contextType = useSelector(toolSelectors.contextType)
  const contextId = useSelector(toolSelectors.contextId)
  const hasScore = useSelector(selectors.hasScore)
  const totalScore = useSelector(selectors.totalScore)

  const invalidateList = useCallback(() => {
    dispatch(listActions.invalidateData(dashboardSelectors.STORE_NAME + '.workspaceEvaluations'))
  }, [selectors.STORE_NAME + '.workspaceEvaluations'])

  const evaluationsRefresher = {
    add:    invalidateList,
    update: invalidateList,
    delete: invalidateList
  }

  return (
    <PageContent className="py-4">
      <PageSection size="full" className="d-flex flex-fill">
        <EvaluationList
          name={dashboardSelectors.STORE_NAME + '.workspaceEvaluations'}
          url={['apiv2_workspace_evaluation_list', {workspace: contextId}]}
          primaryAction="open"
          actions={(rows) => getActions(rows, evaluationsRefresher, path, currentUser, true)}
          customDefinition={'desktop' === contextType ? [
            {
              name: 'workspace',
              type: 'workspace',
              label: trans('workspace'),
              displayable: true,
              displayed: true,
              filterable: true,
              sortable: true,
              order: 2
            }
          ] : []}
          card={EvaluationWorkspaceCard}
          hasScore={hasScore}
          totalScore={totalScore}
        />
      </PageSection>
    </PageContent>
  )
}

export {
  EvaluationDashboardEvaluations
}
