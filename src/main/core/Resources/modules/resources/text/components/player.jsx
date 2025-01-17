import React from 'react'
import {useSelector} from 'react-redux'

import {ContentHtml} from '#/main/app/content/components/html'
import {ResourcePage} from '#/main/core/resource'

import {selectors} from '#/main/core/resources/text/store'
import {PageContent} from '#/main/app/page'

const TextPlayer = () => {
  const text = useSelector(selectors.text)

  return (
    <ResourcePage>
      <PageContent>
        <ContentHtml>
          {text.content}
        </ContentHtml>
      </PageContent>
    </ResourcePage>
  )
}

export {
  TextPlayer
}
