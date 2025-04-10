import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {PageContent} from '#/main/app/page'

import {LocationForm} from '#/main/core/tools/locations//containers/form'

const LocationNew = () =>
  <ToolPage
    title={trans('new_location', {}, 'location')}
  >
    <PageContent>
      <LocationForm />
    </PageContent>
  </ToolPage>

export {
  LocationNew
}
