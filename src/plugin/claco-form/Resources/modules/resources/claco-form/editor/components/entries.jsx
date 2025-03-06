import React from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'

const ClacoFormEditorEntries = () => {
  return (
    <EditorPage
      title={trans('entries', {}, 'clacoform')}
      dataPart="resource"
      definition={[
        {
          id: 'fields',
          icon: 'fa fa-fw fa-table-list',
          title: trans('fields'),
          primary: true,
          fields: [
            {
              name: 'fields',
              type: 'fields',
              label: trans('fields_list'),
              required: true,
              options: {
                placeholder: trans('no_field', {}, 'clacoform')
              },
              calculated: (data) => []
                .concat(data.fields || [])
                .sort((a, b) => {
                  if (get(a, 'display.order') < get(b, 'display.order')) {
                    return -1
                  }

                  if (get(a, 'display.order') > get(b, 'display.order')) {
                    return 1
                  }

                  return 0
                })
            }
          ]
        }, {
          id: 'help',
          icon: 'fa fa-fw fa-circle-question',
          title: trans('help'),
          fields: [
            {
              name: 'details.helpMessage',
              label: trans('help_message', {}, 'clacoform'),
              type: 'html',
              help: trans('help_message_help', {}, 'clacoform')
            }
          ]
        }
      ]}
    />
  )
}

export {
  ClacoFormEditorEntries
}
