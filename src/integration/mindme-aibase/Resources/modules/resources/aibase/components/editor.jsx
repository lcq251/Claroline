import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor, ResourceEditorOverview} from '#/main/core/resource/editor'
import {selectors as resourceSelectors} from '#/main/core/resource'

/**
 * Aibase is now an "AI model resource": the editor is a plain
 * resource configuration form (model name / API key / expiry / default).
 *
 * The API key is never sent back by the API — the form only receives
 * hasKey + apiKeyMask. Leaving the key input empty keeps the stored key.
 */
const AibaseEditorOverview = () => {
  const resource = useSelector(resourceSelectors.resource)
  const hasKey = get(resource, 'hasKey', false)
  const mask = get(resource, 'apiKeyMask', '')
  const restrictionType = get(resource, 'restrictionType', 'none')

  const baseFields = [
    {
      name: 'modelName',
      label: trans('model_name', {}, 'resource'),
      type: 'string',
      options: {
        placeholder: trans('model_name_placeholder', {}, 'resource')
      }
    },
    {
      name: 'apiKey',
      label: trans('api_key', {}, 'resource'),
      type: 'password',
      options: {
        disablePasswordCheck: true
      },
      help: hasKey
        ? trans('api_key_help_set', {mask}, 'resource')
        : trans('api_key_help_empty', {}, 'resource')
    },
    {
      name: 'restrictionType',
      label: trans('restriction_type', {}, 'resource'),
      type: 'choice',
      options: {
        choices: [
          {value: 'none', label: trans('restriction_none', {}, 'resource')},
          {value: 'time', label: trans('restriction_time', {}, 'resource')},
          {value: 'count', label: trans('restriction_count', {}, 'resource')}
        ]
      },
      help: trans('restriction_type_help', {}, 'resource')
    }
  ]

  // fields shown only for the selected restriction mode (D4-A: mutually exclusive)
  const modeFields = []
  if ('time' === restrictionType) {
    modeFields.push(
      {
        name: 'startAt',
        label: trans('access_start_at', {}, 'resource'),
        type: 'date',
        options: {time: true},
        help: trans('access_start_at_help', {}, 'resource')
      },
      {
        name: 'expiresAt',
        label: trans('access_end_at', {}, 'resource'),
        type: 'date',
        options: {time: true},
        help: trans('access_end_at_help', {}, 'resource')
      }
    )
  } else if ('count' === restrictionType) {
    modeFields.push(
      {
        name: 'usageLimit',
        label: trans('usage_limit', {}, 'resource'),
        type: 'number',
        help: trans('usage_limit_help', {}, 'resource')
      }
    )
  }

  return (
    <ResourceEditorOverview
      definition={[
        {
          title: trans('ai_model_resource', {}, 'resource'),
          primary: true,
          hideTitle: true,
          fields: [...baseFields, ...modeFields, {
            name: 'isDefault',
            label: trans('is_default', {}, 'resource'),
            type: 'boolean',
            help: trans('is_default_help', {}, 'resource')
          }]
        }
      ]}
    />
  )
}

const AibaseEditor = () =>
  <ResourceEditor
    overviewPage={AibaseEditorOverview}
  />

export {
  AibaseEditor
}
