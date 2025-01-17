import React from 'react'

import {ToolPage} from '#/main/core/tool'
import {PageContent, PageSection} from '#/main/app/page'
import {trans} from '#/main/app/intl'

const AgendaOverview = () =>
  <ToolPage>
    <PageContent>
      <PageSection size="md" className="mt-5" title={trans('Evènements à venir')}>

      </PageSection>

      <PageSection size="md" className="mt-5 mb-5" title={trans('Mes invitations')}>

      </PageSection>
    </PageContent>
  </ToolPage>

export {
  AgendaOverview
}
