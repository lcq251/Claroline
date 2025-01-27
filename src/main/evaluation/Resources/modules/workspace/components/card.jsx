import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {URL_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/core/workspace/routing'
import {WorkspaceEvaluation as WorkspaceEvaluationTypes} from '#/main/evaluation/workspace/prop-types'
import {EvaluationContentCard} from '#/main/evaluation/components/card'

const EvaluationWorkspaceCard = (props) =>
  <EvaluationContentCard
    {...props}
    primaryAction={!isEmpty(props.primaryAction) ? props.primaryAction : {
      type: URL_BUTTON,
      target: '#'+route(props.data.workspace)
    }}
    content={get(props.data, 'workspace')}
  />

EvaluationWorkspaceCard.propTypes = {
  data: T.shape(
    WorkspaceEvaluationTypes.propTypes
  ),
  primaryAction: T.shape({
    // action types
  })
}

export {
  EvaluationWorkspaceCard
}
