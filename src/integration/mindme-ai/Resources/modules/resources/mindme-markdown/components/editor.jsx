import React, {useState, useRef, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'
import {actions, ResourceEditor} from '#/main/core/resource/editor'
import {selectors as resourceSelectors} from '#/main/core/resource'

const MdEditor = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdEditor})))

const MindmeMarkdownEditorContent = () => {
  const dispatch = useDispatch()
  const resource = useSelector(resourceSelectors.resource)
  const editorRef = useRef(null)

  const [content, setContent] = useState(get(resource, 'content', ''))

  const handleChange = useCallback((value) => {
    setContent(value)
    dispatch(actions.updateResource(value, 'content'))
  }, [dispatch])

  return (
    <EditorPage title={trans('content')}>
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
    </EditorPage>
  )
}

const MindmeMarkdownEditor = () =>
  <ResourceEditor
    pages={[{
      name: 'content',
      title: trans('content'),
      component: MindmeMarkdownEditorContent
    }]}
  />

export {
  MindmeMarkdownEditor
}