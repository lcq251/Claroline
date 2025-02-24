import React from 'react'
import {useSelector} from 'react-redux'

import {PageContent, PageSection} from '#/main/app/page'

import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store'
import {Activity} from '#/main/log/activity/components/main'
import {selectors} from '#/main/evaluation/sequence/dashboard/store'

const SequenceDashboardActivity = () => {
  const sequenceId = useSelector(sequenceSelectors.id)

  return (
    <PageContent className="d-flex">
      <PageSection size="md" className="mx-auto">
        <Activity
          name={selectors.STORE_NAME + '.logs'}
          url={['apiv2_sequence_functional_logs', {id: sequenceId}]}
        />
      </PageSection>
    </PageContent>
  )
}

export {
  SequenceDashboardActivity
}
