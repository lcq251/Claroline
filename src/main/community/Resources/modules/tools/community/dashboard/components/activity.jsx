import React from 'react'
import {useSelector} from 'react-redux'

import {PageContent, PageSection} from '#/main/app/page'
import {selectors as toolSelectors} from '#/main/core/tool'

import {Activity} from '#/main/log/activity/components/main'
import {selectors} from '#/main/community/tools/community/dashboard/store'

const DashboardActivity = () => {
  const contextId = useSelector(toolSelectors.contextId)

  return (
    <PageContent className="d-flex">
      <PageSection className="mx-auto">
        <Activity
          name={selectors.STORE_NAME + '.logs'}
          url={['apiv2_community_functional_logs', {contextId: contextId}]}
        />
      </PageSection>
    </PageContent>
  )
}

export {
  DashboardActivity
}
