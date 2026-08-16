import React, {useState, useRef, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {actions, ResourceEditor, ResourceEditorOverview} from '#/main/core/resource/editor'
import {selectors as resourceSelectors} from '#/main/core/resource'

const MdEditor = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdEditor})))

const MindmeMarkdownEditorOverview = () => {
  const dispatch = useDispatch()
  const resource = useSelector(resourceSelectors.resource)
  const editorRef = useRef(null)

  const [content, setContent] = useState(get(resource, 'content', ''))

  const handleChange = useCallback((value) => {
    setContent(value)
    dispatch(actions.updateResource(value, 'content'))
  }, [dispatch])

  return (
    <ResourceEditorOverview
      definition={[
        {
          title: trans('content'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: '_markdown',
              label: trans('content'),
              type: 'html',
              hideLabel: true,
              calculated: () => ({content})
            }
          ]
        }
      ]}
    >
      <div className="markdown-editor-wrapper" style={{minHeight: 400}}>
        <React.Suspense fallback={<div className="text-center p-5"><span className="fa fa-spinner fa-spin" /></div>}>
          <MdEditor
            ref={editorRef}
            modelValue={content}
            onChange={handleChange}
            toolbarsExclude={['htmlPreview']}
            previewTheme="github"
            codeTheme="github"
            style={{minHeight: 400}}
          />
        </React.Suspense>
      </div>
    </ResourceEditorOverview>
  )
}

const MindmeMarkdownEditor = () =>
  <ResourceEditor
    overviewPage={MindmeMarkdownEditorOverview}
  />

export {
  MindmeMarkdownEditor
}