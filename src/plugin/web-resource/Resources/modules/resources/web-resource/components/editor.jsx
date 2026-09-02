import React from 'react'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {actions, ResourceEditor, ResourceEditorOverview} from '#/main/core/resource/editor'

const WebResourceEditorOverview = () => {
  const dispatch = useDispatch()

  return (
    <ResourceEditorOverview
      definition={[
        {
          title: trans('file'),
          primary: true,
          hideTitle: false,
          fields: [
            {
              name: '_file',
              label: trans('file'),
              type: 'file',
              required: true,
              options: {
                types: ['application/zip', 'application/x-zip-compressed'],
                uploadUrl: ['claro_resource_check_file', {resourceType: 'claroline_web_resource'}]
              },
              onChange: (file) => {
                dispatch(actions.updateResource(get(file, 'url'), 'url'))
              },
              calculated: (formData) => {
                if (formData._file) {
                  return formData._file
                }
                if (formData.resource.url) {
                  return {
                    name: formData.resourceNode.name,
                    mimeType: formData.resourceNode.meta.mimeType,
                    url: formData.resource.url
                  }
                }
                return null
              }
            }
          ]
        }
      ]}
    />
  )
}

const WebResourceEditor = () =>
  <ResourceEditor
    overviewPage={WebResourceEditorOverview}
  />

export {
  WebResourceEditor
}