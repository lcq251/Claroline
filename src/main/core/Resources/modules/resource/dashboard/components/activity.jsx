import React from 'react'
import {useSelector} from 'react-redux'

import {PageContent, PageSection} from '#/main/app/page'
import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {Activity} from '#/main/log/activity/components/main'
import {selectors} from '#/main/core/resource/dashboard/store'

const ResourceDashboardActivity = () => {
  const resourceId = useSelector(resourceSelectors.id)

  return (
    <PageContent>
      <PageSection className="mx-auto">
        <Activity
          name={selectors.STORE_NAME + '.logs'}
          url={['apiv2_resource_functional_logs', {id: resourceId}]}
        />
      </PageSection>
    </PageContent>
  )
}

export {
  ResourceDashboardActivity
}
