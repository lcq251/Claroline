import React from 'react'

import {trans} from '#/main/app/intl'
import {ToolDashboard} from '#/main/core/tool'

import {EvaluationDashboardOverview} from '#/main/evaluation/tools/evaluation/dashboard/components/overview'

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
