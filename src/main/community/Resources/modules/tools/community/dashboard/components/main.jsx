import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {ToolDashboard} from '#/main/core/tool'

import {DashboardActivity} from '#/main/community/tools/community/dashboard/components/activity'

const CommunityDashboard = () =>
  <ToolDashboard
    pages={[
      {
        name: 'overview',
        icon: 'fa fa-temperature-half',
        title: trans('overview'),
        render: () => <></>
      }, {
        name: 'stats',
        icon: 'fa fa-pie-chart',
        title: trans('statistics'),
        render: () => <></>
      }, {
        name: 'activity',
        icon: 'fa fa-line-chart',
        title: trans('activity'),
        component: DashboardActivity
      }
    ]}
  />

export {
  CommunityDashboard
}
