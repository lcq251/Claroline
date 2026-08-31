import React, {Suspense} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

const MdEditor = React.lazy(() => import('md-editor-rt').then(m => ({default: m.MdEditor})))

const MarkdownEditorField = (props) => {
  const value = get(props.data, 'parameters.content', '') || ''

  return (
    <Suspense fallback={<div className="text-center p-3"><span className="fa fa-spinner fa-spin" /></div>}>
      <MdEditor
        language="zh-CN"
        modelValue={value}
        onChange={(val) => props.updateProp('parameters.content', val)}
        style={{height: '400px'}}
        toolbarsExclude={['github', 'htmlPreview', 'previewOnly', 'katex', 'mermaid', 'save', 'sub', 'sup', 'pageFullscreen', 'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough']}
      />
    </Suspense>
  )
}

MarkdownEditorField.propTypes = {
  data: T.object.isRequired,
  updateProp: T.func.isRequired
}

const MarkdownWidgetParameters = (props) =>
  <FormContent
    level={5}
    flush={true}
    name={props.name}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'parameters.content',
            label: trans('content'),
            type: 'string',
            required: true,
            hideLabel: true,
            component: MarkdownEditorField
          }
        ]
      }
    ]}
  />

MarkdownWidgetParameters.propTypes = {
  name: T.string.isRequired
}

export {
  MarkdownWidgetParameters
}