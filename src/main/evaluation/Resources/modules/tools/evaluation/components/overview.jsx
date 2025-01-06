import React from 'react'
import {useSelector} from 'react-redux'

import {Alert} from '#/main/app/components/alert'
import {ContentLoader} from '#/main/app/content/components/loader'
import {selectors as toolSelectors, ToolOverview} from '#/main/core/tool'

import {WorkspaceEvaluation} from '#/main/evaluation/workspace/components/evaluation'
import {selectors} from '#/main/evaluation/tools/evaluation/store'

const EvaluationOverview = () => {

  const toolLoaded = useSelector(toolSelectors.loaded)
  const workspaceEvaluation = useSelector(selectors.currentWorkspaceEvaluation)
  const resourceEvaluations = useSelector(selectors.currentResourceEvaluations)

  return (
    <ToolOverview>
      {!toolLoaded &&
        <ContentLoader
          size="lg"
          description="Nous chargeons la progression..."
        />
      }

      {toolLoaded && !workspaceEvaluation &&
        <Alert type="warning">
          Vous n'avez pas de progression pour cet espace.
        </Alert>
      }

      {toolLoaded && workspaceEvaluation &&
        <WorkspaceEvaluation
          workspaceEvaluation={workspaceEvaluation}
          resourceEvaluations={resourceEvaluations}
        />
      }
    </ToolOverview>
  )
}

export {
  EvaluationOverview
}
