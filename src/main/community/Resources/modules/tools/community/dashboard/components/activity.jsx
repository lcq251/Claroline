import React from 'react'
import {useSelector} from 'react-redux'

import {PageSection} from '#/main/app/page'
import {DashboardPage} from '#/main/app/dashboard'
import {selectors as toolSelectors} from '#/main/core/tool'

import {Activity} from '#/main/log/activity/components/main'
import {selectors} from '#/main/community/tools/community/dashboard/store'

const DashboardActivity = () => {
  const contextId = useSelector(toolSelectors.contextId)

  return (
    <DashboardPage className="d-flex">
      <PageSection size="md" className="mx-auto">
        <Activity
          name={selectors.STORE_NAME + '.logs'}
          url={['apiv2_community_functional_logs', {contextId: contextId}]}
        />
      </PageSection>
    </DashboardPage>
  )
}

export {
  DashboardActivity
}
