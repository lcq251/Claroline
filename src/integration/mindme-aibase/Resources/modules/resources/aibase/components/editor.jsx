import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor, ResourceEditorOverview, selectors as editorSelectors} from '#/main/core/resource/editor'

/**
 * Aibase is an "AI model resource": the editor is a plain resource
 * configuration form (model name / API key / expiry / default).
 *
 * The API key is never sent back by the API — the form only receives
 * hasKey + apiKeyMask. Leaving the key input empty keeps the stored key.
 * The digital-teacher surface moved to the Aiteacher resource.
 */
const AibaseEditorOverview = () => {
  // form data lives in the resourceEditor store, so we must read the *modified*
  // version of the resource (not the initial snapshot from the resource store).
  // Otherwise conditional fields (restrictionType mode, platformType-based help)
  // never re-render when the user changes the value in the form.
  const resource = useSelector(editorSelectors.resource)
  const hasKey = get(resource, 'hasKey', false)
  const mask = get(resource, 'apiKeyMask', '')
  const restrictionType = get(resource, 'restrictionType', 'none')
  const platformType = get(resource, 'platformType', 'custom')

  const baseFields = [
    {
      name: 'resource.platformType',
      label: trans('platform_type', {}, 'resource'),
      type: 'choice',
      options: {
        choices: {
          deepseek: 'DeepSeek',
          openai: 'OpenAI',
          qwen: '通义千问 Qwen',
          kimi: 'Kimi',
          custom: trans('platform_custom', {}, 'resource')
        }
      },
      help: trans('platform_type_help', {}, 'resource')
    },
    {
      name: 'resource.modelName',
      label: trans('model_name', {}, 'resource'),
      type: 'string',
      options: {
        placeholder: trans('model_name_placeholder', {}, 'resource')
      }
    },
    {
      name: 'resource.baseUrl',
      label: trans('base_url', {}, 'resource'),
      type: 'string',
      options: {
        placeholder: 'https://api.example.com/v1'
      },
      help: ('custom' === platformType)
        ? trans('base_url_help_custom', {}, 'resource')
        : trans('base_url_help_preset', {}, 'resource')
    },
    {
      name: 'resource.apiKey',
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
      name: 'resource.extraConfig',
      label: trans('extra_config', {}, 'resource'),
      type: 'string',
      options: {
        long: true,
        minRows: 4,
        placeholder: '{"option": "value"}'
      },
      help: trans('extra_config_help', {}, 'resource')
    },
    {
      name: 'resource.restrictionType',
      label: trans('restriction_type', {}, 'resource'),
      type: 'choice',
      options: {
        choices: {
          none: trans('restriction_none', {}, 'resource'),
          time: trans('restriction_time', {}, 'resource'),
          count: trans('restriction_count', {}, 'resource')
        }
      },
      help: trans('restriction_type_help', {}, 'resource')
    }
  ]

  // fields shown only for the selected restriction mode (D4-A: mutually exclusive)
  const modeFields = []
  if ('time' === restrictionType) {
    modeFields.push(
      {
        name: 'resource.startAt',
        label: trans('access_start_at', {}, 'resource'),
        type: 'date',
        options: {time: true},
        help: trans('access_start_at_help', {}, 'resource')
      },
      {
        name: 'resource.expiresAt',
        label: trans('access_end_at', {}, 'resource'),
        type: 'date',
        options: {time: true},
        help: trans('access_end_at_help', {}, 'resource')
      }
    )
  } else if ('count' === restrictionType) {
    modeFields.push(
      {
        name: 'resource.usageLimit',
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
            name: 'resource.isDefault',
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
