import React from 'react'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {actions, ResourceEditorOverview} from '#/main/core/resource/editor'

const AudioEditorOverview = () => {
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
                types: ['audio/*'],
                uploadUrl: ['claro_resource_check_file', {resourceType: 'audio'}]
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

export {
  AudioEditorOverview
}
