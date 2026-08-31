import React, {useState, Suspense} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

const MdPreview = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdPreview})))
const MdCatalog = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdCatalog})))

const MarkdownWidget = (props) => {
  const content = props.content || ''
  const [id] = useState('mindme-markdown-widget-' + (props.instanceId || 'default'))

  if (!content) {
    return (
      <ContentPlaceholder
        size="lg"
        icon="fa fa-file-text"
        title={trans('no_content')}
      />
    )
  }

  return (
    <Suspense fallback={<div className="text-center p-3"><span className="fa fa-spinner fa-spin" /></div>}>
      <div className="markdown-widget-layout d-flex" style={{
        minHeight: '300px',
        border: '1px solid var(--bs-border-color)',
        borderRadius: 'var(--bs-border-radius)',
        backgroundColor: 'var(--bs-body-bg)',
        overflow: 'hidden'
      }}>
        <aside className="markdown-widget-toc" style={{
          width: '220px',
          minWidth: '220px',
          borderRight: '1px solid var(--bs-border-color)',
          overflowY: 'auto',
          position: 'sticky',
          top: 0,
          maxHeight: 'calc(100vh - 200px)',
          fontSize: '0.875rem'
        }}>
          <div className="p-2">
            <h6 className="text-muted text-uppercase small fw-bold mb-2 px-2">
              {trans('table_of_contents', {}, 'widget')}
            </h6>
            <MdCatalog editorId={id} scrollElement=".markdown-widget-content" />
          </div>
        </aside>
        <main className="markdown-widget-content flex-fill overflow-auto p-3">
          <MdPreview
            id={id}
            language="zh-CN"
            modelValue={content}
          />
        </main>
      </div>
    </Suspense>
  )
}

MarkdownWidget.propTypes = {
  content: T.string,
  instanceId: T.string
}

export {
  MarkdownWidget
}