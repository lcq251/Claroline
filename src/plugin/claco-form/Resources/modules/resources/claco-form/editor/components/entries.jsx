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
            }, {
              name: 'display.showConfirm',
              label: trans('show_confirm', {}, 'clacoform'),
              type: 'boolean',
              help: trans('show_confirm_help', {}, 'clacoform'),
              linked: [
                {
                  name: 'display.confirmMessage',
                  label: trans('confirm_message', {}, 'clacoform'),
                  type: 'html',
                  displayed: (resource) => get(resource, 'display.showConfirm')
                }
              ]
            }, {
              name: 'details.moderated',
              type: 'boolean',
              label: trans('enable_moderation', {}, 'clacoform'),
              help: trans('enable_moderation_help', {}, 'clacoform')
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
