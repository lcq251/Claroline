import React from 'react'

import {ToolPage} from '#/main/core/tool'
import {PageSection} from '#/main/app/page'
import {trans} from '#/main/app/intl'

const AgendaOverview = () =>
  <ToolPage>
    <PageSection size="md" title={trans('Evènements à venir')}>

    </PageSection>
  </ToolPage>

export {
  AgendaOverview
}
