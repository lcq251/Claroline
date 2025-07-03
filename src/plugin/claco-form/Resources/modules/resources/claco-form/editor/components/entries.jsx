import React from 'react'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'
import {actions} from '#/main/core/resource/editor'

const ClacoFormEditorEntries = () => {
  const dispatch = useDispatch()

  return (
    <EditorPage
      title={trans('entries', {}, 'clacoform')}
      dataPart="resource"
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'details.title_field_label',
              type: 'string',
              label: trans('title_field_label', {}, 'clacoform')
            }, {
              name: 'details.helpMessage',
              label: trans('help_message', {}, 'clacoform'),
              type: 'html',
              help: trans('help_message_help', {}, 'clacoform')
            }
          ],
        }, {
          title: trans('fields_list'),
          description: trans('Ajoutez des champs à afficher/remplir sur chacune des fiches de la base de données.'),
          primary: true,
          fields: [
            {
              name: 'fields',
              type: 'fields',
              label: trans('fields_list'),
              hideLabel: true,
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
          title: trans('Ajout de fiches'),
          primary: true,
          hideTitle: true,
          fields: [
            {
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
            }, {
              name: '_enableMaxEntries',
              type: 'boolean',
              label: trans('enable_max_entries', {}, 'clacoform'),
              calculated: (formData) => !!formData._enableMaxEntries || 0 < get(formData, 'details.max_entries', 0),
              onChange: (enabled) => {
                if (!enabled) {
                  dispatch(actions.updateResource(0, 'details.max_entries'))
                }
              },
              linked: [
                {
                  name: 'details.max_entries',
                  type: 'number',
                  label: trans('label_max_entries', {}, 'clacoform'),
                  required: true,
                  displayed: (formData) => !!formData._enableMaxEntries || 0 < get(formData, 'details.max_entries', 0),
                  options: {
                    min: 0
                  }
                }
              ]
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
