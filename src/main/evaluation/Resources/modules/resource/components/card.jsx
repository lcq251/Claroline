import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {URL_BUTTON} from '#/main/app/buttons'
import {route} from '#/main/core/resource/routing'

import {ResourceIcon} from '#/main/core/resource/components/icon'
import {EvaluationContentCard} from '#/main/evaluation/components/card'
import {ResourceEvaluation as ResourceEvaluationTypes} from '#/main/evaluation/resource/prop-types'

const ResourceCard = (props) =>
  <EvaluationContentCard
    {...props}
    icon={
      <ResourceIcon
        mimeType={get(props.data.resourceNode, 'meta.mimeType')}
        size={props.size}
      />
    }
    primaryAction={!isEmpty(props.primaryAction) ? props.primaryAction : {
      type: URL_BUTTON,
      target: '#'+route(props.data.resourceNode)
    }}
    content={get(props.data, 'resourceNode')}
  />

ResourceCard.propTypes = {
  size: T.string,
  display: T.array, // from list
  data: T.shape(
    ResourceEvaluationTypes.propTypes
  )
}

export {
  ResourceCard
}
