import React, {useState, Suspense} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {PageContent, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

const MdPreview = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdPreview})))
const MdCatalog = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdCatalog})))

const MindmeMarkdownPlayer = () => {
  const resource = useSelector(resourceSelectors.resource)

  const content = get(resource, 'content', '')
  const [id] = useState('mindme-markdown-preview')

  return (
    <ResourcePage>
      <Suspense fallback={<div className="text-center p-5"><span className="fa fa-spinner fa-spin" /></div>}>
        <PageSimple>
          <PageContent>
            <div className="markdown-layout d-flex" style={{minHeight: 'calc(100vh - 200px)'}}>
              <aside className="markdown-toc-sidebar" style={{
                width: '260px',
                minWidth: '260px',
                borderRight: '1px solid var(--bs-border-color)',
                overflowY: 'auto',
                position: 'sticky',
                top: 0,
                maxHeight: 'calc(100vh - 120px)'
              }}>
                <div className="p-3">
                  <h6 className="text-muted text-uppercase small fw-bold mb-3">目录</h6>
                  <MdCatalog editorId={id} scrollElement=".markdown-content" />
                </div>
              </aside>
              <main className="markdown-content flex-fill overflow-auto p-4">
                <MdPreview
                  id={id}
                  modelValue={content}
                />
              </main>
            </div>
          </PageContent>
        </PageSimple>
      </Suspense>
    </ResourcePage>
  )
}

export {
  MindmeMarkdownPlayer
}