import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {PageContent, PageSection} from '#/main/app/page'

import {EvaluationWorkspaceCard} from '#/main/evaluation/workspace/components/card'
import {getActions, getDefaultAction} from '#/main/evaluation/workspace/utils'

import {selectors} from '#/main/evaluation/tools/evaluation/dashboard/store/selectors'
import {EvaluationList} from '#/main/evaluation/components/list'

const EvaluationDashboardEvaluations = (props) => {
  const evaluationsRefresher = {
    add:    () => props.invalidate(),
    update: () => props.invalidate(),
    delete: () => props.invalidate()
  }

  return (
    <PageContent
      className="d-flex"
      title={trans('evaluation')}
    >
      <PageSection size="full" className="d-flex flex-fill">
        <EvaluationList
          className="mb-5"
          name={selectors.STORE_NAME + '.workspaceEvaluations'}
          url={['apiv2_workspace_evaluation_list', {workspace: props.contextId}]}
          primaryAction={(row) => getDefaultAction(row, evaluationsRefresher, props.path, props.currentUser)}
          actions={(rows) => getActions(rows, evaluationsRefresher, props.path, props.currentUser)}
          customDefinition={[
            {
              name: 'workspace',
              type: 'workspace',
              label: trans('workspace'),
              displayable: !props.contextId,
              displayed: !props.contextId,
              filterable: false
            }
          ]}
          card={EvaluationWorkspaceCard}
          hasScore={props.hasScore}
          totalScore={props.totalScore}
        />
      </PageSection>
    </PageContent>
  )
}

EvaluationDashboardEvaluations.propTypes = {
  path: T.string.isRequired,
  currentUser: T.object,
  contextId: T.string,
  hasScore: T.bool.isRequired,
  totalScore: T.number,
  invalidate: T.func.isRequired
}

export {
  EvaluationDashboardEvaluations
}
