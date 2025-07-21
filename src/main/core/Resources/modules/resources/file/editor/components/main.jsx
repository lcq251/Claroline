import React from 'react'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {actions, ResourceEditor, ResourceEditorOverview} from '#/main/core/resource/editor'

import {FileEditorAppearance} from '#/main/core/resources/file/editor/components/appearance'

const FileEditorOverview = () => {
  const dispatch = useDispatch()

  return (
    <ResourceEditorOverview
      definition={[
        {
          title: trans('file'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: '_file',
              label: trans('file'),
              type: 'file',
              required: true,
              options: {
                uploadUrl: ['claro_resource_check_file', {resourceType: 'file'}]
              },
              onChange: (file) => {
                dispatch(actions.updateResource(get(file, 'url'), 'url'))
              },
              calculated: (formData) => {
                if (formData._file) {
                  // newly uploaded file
                  return formData._file
                }

                if (formData.resource.url) {
                  return ({
                    name: formData.resourceNode.name,
                    mimeType: formData.resourceNode.meta.mimeType,
                    url: formData.resource.url
                  })
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

const FileEditor = () =>
  <ResourceEditor
    overviewPage={FileEditorOverview}
    appearancePage={FileEditorAppearance}
  />

export {
  FileEditor
}
