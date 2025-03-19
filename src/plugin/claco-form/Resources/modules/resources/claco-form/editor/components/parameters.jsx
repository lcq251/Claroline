import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'

import {constants} from '#/plugin/claco-form/resources/claco-form/constants'

const EditorParameters = () => {
  return (
    <EditorPage
      title={trans('parameters')}
      dataPart="resource"
      definition={[
        {
          id: 'display',
          icon: 'fa fa-fw fa-desktop',
          title: trans('display_parameters'),
          fields: [
            {
              name: 'details.title_field_label',
              type: 'string',
              label: trans('title_field_label', {}, 'clacoform')
            }
          ]
        }, {
          icon: 'fa fa-fw fa-key',
          title: trans('access_restrictions'),
          fields: [
            {
              name: 'details.display_metadata',
              type: 'choice',
              label: trans('label_display_metadata', {}, 'clacoform'),
              help: trans('help_display_metadata', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                condensed: true,
                choices: constants.DISPLAY_METADATA_CHOICES
              }
            }, {
              name: 'details.max_entries',
              type: 'number',
              label: trans('label_max_entries', {}, 'clacoform'),
              required: true,
              options: {
                min: 0
              }
            }
          ]
        }
      ]}
    />
  )
}

export {
  EditorParameters
}
