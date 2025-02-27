import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {selectors} from '#/main/core/resource/dashboard/store'

import {Routes} from '#/main/app/router'
import {ResourceEvaluationList} from '#/main/evaluation/resource/evaluation/components/list'


const ResourceEvaluations = () => {
  const dashboardPath = useSelector(selectors.path)

  return (
    <Routes
      path={dashboardPath+'/evaluations'}
      routes={[
        {
          path: '/',
          exact: true,
          component: ResourceEvaluationList
        }
      ]}
    />
  )
}

ResourceEvaluations.propTypes = {
  nodeId: T.string.isRequired
}

export {
  ResourceEvaluations
}
