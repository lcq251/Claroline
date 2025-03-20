import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'

import {selectors} from '#/plugin/open-badge/tools/badges/store'
import {BadgeForm} from '#/plugin/open-badge/badge/components/form'
import {PageContent} from '#/main/app/page'

const BadgeCreate = () =>
  <ToolPage
    title={trans('new_badge', {}, 'badge')}
  >
    <PageContent className="py-5">
      <BadgeForm name={selectors.FORM_NAME} />
    </PageContent>
  </ToolPage>

export {
  BadgeCreate
}
