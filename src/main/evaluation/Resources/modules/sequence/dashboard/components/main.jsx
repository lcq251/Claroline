import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Dashboard} from '#/main/app/dashboard'

import {selectors} from '#/main/evaluation/sequence/store'
import {SequencePage} from '#/main/evaluation/sequence/components/page'
import {SequenceDashboardActivity} from '#/main/evaluation/sequence/dashboard/components/activity'
import {SequenceDashboardEvaluations} from '#/main/evaluation/sequence/dashboard/components/evaluations'

const SequenceDashboard = () => {
  const sequencePath = useSelector(selectors.path)

  return (
    <SequencePage title={trans('dashboard')}>
      <Dashboard
        path={sequencePath+'/dashboard'}
        pages={[
          {
            name: 'overview',
            icon: 'fa fa-temperature-half',
            title: trans('overview'),
            render: () => <></>
          }, {
            name: 'results',
            icon: 'fa fa-award',
            title: trans('evaluation'),
            component: SequenceDashboardEvaluations
          }, {
            name: 'stats',
            icon: 'fa fa-pie-chart',
            title: trans('statistics'),
            render: () => <></>
          }, {
            name: 'activity',
            icon: 'fa fa-line-chart',
            title: trans('activity'),
            component: SequenceDashboardActivity
          }
        ]}
      />
    </SequencePage>
  )
}

export {
  SequenceDashboard
}
