import React from 'react'

import {trans} from '#/main/app/intl'
import {BadgeForm} from '#/plugin/open-badge/badge/components/form'

import {selectors} from '#/plugin/open-badge/tools/badges/store/selectors'
import {ToolPage} from '#/main/core/tool'
import {PageContent} from '#/main/app/page'

const BadgeEdit = () =>
  <ToolPage
    title={trans('edit_badge', {}, 'badge')}
  >
    <PageContent className="py-5">
      <BadgeForm
        name={selectors.FORM_NAME}
      />
    </PageContent>
  </ToolPage>

export {
  BadgeEdit
}
