import React from 'react'
import {useSelector} from 'react-redux'

import {PageSection} from '#/main/app/page'
import {DashboardPage} from '#/main/app/dashboard'

import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store'
import {Activity} from '#/main/log/activity/components/main'
import {selectors} from '#/main/evaluation/sequence/dashboard/store'

const SequenceDashboardActivity = () => {
  const sequenceId = useSelector(sequenceSelectors.id)

  return (
    <DashboardPage className="d-flex">
      <PageSection size="md" className="mx-auto">
        <Activity
          name={selectors.STORE_NAME + '.logs'}
          url={['apiv2_sequence_functional_logs', {id: sequenceId}]}
        />
      </PageSection>
    </DashboardPage>
  )
}

export {
  SequenceDashboardActivity
}
