import React from 'react'

import {trans} from '#/main/app/intl'
import {ToolDashboard} from '#/main/core/tool'

import {TrainingsDashboardOverview} from '#/plugin/cursus/tools/trainings/dashboard/components/overview'

const TrainingsDashboard = () => {
  return (
    <ToolDashboard
      pages={[
        {
          name: 'overview',
          icon: 'fa fa-temperature-half',
          title: trans('overview'),
          component: TrainingsDashboardOverview
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
  TrainingsDashboard
}
