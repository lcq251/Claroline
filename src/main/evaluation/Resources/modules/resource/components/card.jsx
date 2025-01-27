import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ResourceEvaluation as ResourceEvaluationTypes} from '#/main/evaluation/resource/prop-types'
import isEmpty from 'lodash/isEmpty'
import {URL_BUTTON} from '#/main/app/buttons'
import {route} from '#/main/core/resource/routing'
import get from 'lodash/get'
import {EvaluationContentCard} from '#/main/evaluation/components/card'

const ResourceCard = (props) =>
  <EvaluationContentCard
    {...props}
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
