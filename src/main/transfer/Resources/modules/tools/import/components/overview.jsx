import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {PageContent, PageSection} from '#/main/app/page'
import {ContentMenu} from '#/main/app/content/components/menu'

import {selectors} from '#/main/transfer/tools/import/store'

const ImportOverview = () => {
  const importers = useSelector(selectors.importExplanation)

  let links = []
  Object.keys(importers).map(importerGroup => {
    links = links.concat(Object.keys(importers[importerGroup]).map(importerName => ({
      id: importerGroup+'_'+importerName,
      /*icon: classes('fa fa-fw', {
        'fa-plus': 'create' === importerName,
        'fa-trash': 'delete' === importerName,
        'fa-pencil': 'update' === importerName
      }),*/
      label: trans(importerName, {}, 'transfer'),
      //description: trans('Lorem ipsum dolor sit amet.'),
      action: {
        type: CALLBACK_BUTTON,
        callback: () => true
      },
      group: trans(importerGroup, {}, 'transfer')
    })))
  })

  return (
    <ToolPage>
      <PageContent>
        <PageSection size="md" className="mb-5">
          <ContentMenu
            items={links}
          />
        </PageSection>
      </PageContent>
    </ToolPage>
  )
}

export {
  ImportOverview
}
