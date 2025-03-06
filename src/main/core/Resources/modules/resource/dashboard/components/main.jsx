import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Dashboard} from '#/main/app/dashboard'

import {ResourcePage} from '#/main/core/resource/components/page'
import {selectors} from '#/main/core/resource/store'
import {ResourceDashboardActivity} from '#/main/core/resource/dashboard/components/activity'
import {ResourceDashboardEvaluations} from '#/main/evaluation/resource/evaluation'
import {ResourceDashboardOverview} from '#/main/core/resource/dashboard/components/overview'
import {ResourceDashboardStats} from '#/main/core/resource/dashboard/components/stats'
import {ResourceDashboardActions} from '#/main/core/resource/dashboard/components/actions'

const ResourceDashboard = (props) => {
  const resourcePath = useSelector(selectors.path)
  const hasEvaluation = useSelector(selectors.hasEvaluation)

  return (
    <ResourcePage
      title={trans('dashboard')}
    >
      <Dashboard
        path={resourcePath+'/dashboard'}
        pages={[
          {
            name: 'overview',
            icon: 'fa fa-temperature-half',
            title: trans('overview'),
            component: props.overviewPage || ResourceDashboardOverview
          }, {
            name: 'results',
            icon: 'fa fa-award',
            title: trans('evaluation'),
            component: ResourceDashboardEvaluations,
            disabled: !hasEvaluation
          }, {
            name: 'stats',
            icon: 'fa fa-pie-chart',
            title: trans('statistics'),
            component: props.statsPage || ResourceDashboardStats
          }, {
            name: 'activity',
            icon: 'fa fa-line-chart',
            title: trans('activity'),
            component: ResourceDashboardActivity
          }
        ]}
        actionsPage={props.actionsPage || ResourceDashboardActions}
      />
    </ResourcePage>
  )
}

ResourceDashboard.propTypes = {
  overviewPage: T.elementType,
  statsPage: T.elementType,
  // standard pages
  actionsPage: T.elementType
}

export {
  ResourceDashboard
}
