import React from 'react'
import {useSelector} from 'react-redux'

import {PageContent} from '#/main/app/page'
import {selectors as resourceSelectors} from '#/main/core/resource/store'

const ResourceDashboardOverview = () => {
  const resourceId = useSelector(resourceSelectors.id)

  return (
    <PageContent>

    </PageContent>
  )
}

export {
  ResourceDashboardOverview
}
