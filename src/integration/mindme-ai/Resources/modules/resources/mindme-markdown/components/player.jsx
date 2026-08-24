import React, {useState, useEffect, Suspense} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {asset} from '#/main/app/config/asset'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

const MdPreview = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdPreview})))
const MdCatalog = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdCatalog})))

const MindmeMarkdownPlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const content = get(resource, 'content', '')
  const [id] = useState('mindme-markdown-preview')
  const [catalogVisible, setCatalogVisible] = useState(true)

  return (
    <ResourcePage>
      <Suspense fallback={<div className="text-center p-5"><span className="fa fa-spinner fa-spin" /></div>}>
        <PageSimple>
          <PageContent>
            <PageSection>
              <div className="markdown-preview p-4">
                <MdPreview
                  id={id}
                  modelValue={content}
                  catalogVisible={catalogVisible}
                />
              </div>
              {catalogVisible && (
                <div className="markdown-toc">
                  <MdCatalog editorId={id} scrollElement=".markdown-preview" />
                </div>
              )}
            </PageSection>
          </PageContent>
        </PageSimple>
      </Suspense>
    </ResourcePage>
  )
}

export {
  MindmeMarkdownPlayer
}
