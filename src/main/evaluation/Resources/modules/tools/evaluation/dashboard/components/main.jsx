import React from 'react'

import {trans} from '#/main/app/intl'
import {ToolDashboard} from '#/main/core/tool'

import {EvaluationDashboardOverview} from '#/main/evaluation/tools/evaluation/dashboard/components/overview'
import {EvaluationDashboardEvaluations} from '#/main/evaluation/tools/evaluation/dashboard/containers/evaluations'

const EvaluationDashboard = () => {
  return (
    <ToolDashboard
      pages={[
        {
          name: 'overview',
          icon: 'fa fa-temperature-half',
          title: trans('overview'),
          component: EvaluationDashboardOverview
        }, {
          name: 'results',
          icon: 'fa fa-award',
          title: trans('evaluation'),
          component: EvaluationDashboardEvaluations
        }, {
          name: 'stats',
          icon: 'fa fa-pie-chart',
          title: trans('statistics'),
          render: () => <></>
        }, {
          name: 'activity',
          icon: 'fa fa-line-chart',
          title: trans('activity'),
          render: () => <></>
        }
      ]}
    />
  )
}

export {
  EvaluationDashboard
}
