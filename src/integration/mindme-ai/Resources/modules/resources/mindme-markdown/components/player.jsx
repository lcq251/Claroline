import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {asset} from '#/main/app/config/asset'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

const MdPreview = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdPreview})))

const MindmeMarkdownPlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const content = get(resource, 'content', '')

  return (
    <ResourcePage>
      <React.Suspense fallback={<div className="text-center p-5"><span className="fa fa-spinner fa-spin" /></div>}>
        <PageSimple>
          <PageContent>
            <PageSection>
              <div className="markdown-preview p-4">
                <MdPreview
                  editorId="mindme-markdown-preview"
                  modelValue={content}
                  // previewTheme="github"
                  // codeTheme="github"
                />
              </div>
            </PageSection>
          </PageContent>
        </PageSimple>
      </React.Suspense>
    </ResourcePage>
  )
}

export {
  MindmeMarkdownPlayer
}