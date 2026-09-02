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
  const hasTtsToken = get(resource, 'hasTtsToken', false)
  const restrictionType = get(resource, 'restrictionType', 'none')
  const platformType = get(resource, 'platformType', 'custom')
  const kind = get(resource, 'kind', 'model')

  const baseFields = [
    {
      name: 'kind',
      label: trans('kind', {}, 'resource'),
      type: 'choice',
      options: {
        choices: [
          {value: 'model', label: trans('kind_model', {}, 'resource')},
          {value: 'digital_teacher', label: trans('kind_digital_teacher', {}, 'resource')}
        ]
      },
      help: trans('kind_help', {}, 'resource')
    },
    {
      name: 'platformType',
      label: trans('platform_type', {}, 'resource'),
      type: 'choice',
      options: {
        choices: [
          {value: 'deepseek', label: 'DeepSeek'},
          {value: 'openai', label: 'OpenAI'},
          {value: 'qwen', label: '通义千问 Qwen'},
          {value: 'kimi', label: 'Kimi'},
          {value: 'custom', label: trans('platform_custom', {}, 'resource')}
        ]
      },
      help: trans('platform_type_help', {}, 'resource')
    },
    {
      name: 'modelName',
      label: trans('model_name', {}, 'resource'),
      type: 'string',
      options: {
        placeholder: trans('model_name_placeholder', {}, 'resource')
      }
    },
    {
      name: 'baseUrl',
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
      name: 'extraConfig',
      label: trans('extra_config', {}, 'resource'),
      type: 'textarea',
      options: {
        placeholder: '{"option": "value"}'
      },
      help: trans('extra_config_help', {}, 'resource')
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
        },
        // 语音(TTS) + 形象(Avatar) 分组仅对数字老师形态有语义
        ...('digital_teacher' === kind ? [
          {
            title: trans('dt_voice_settings', {}, 'resource'),
            fields: [
              {
                name: 'ttsEngine',
                label: trans('dt_tts_engine', {}, 'resource'),
                type: 'choice',
                options: {
                  choices: [
                    {value: 'none', label: trans('dt_choice_none', {}, 'resource')},
                    {value: 'cloud', label: trans('dt_choice_cloud', {}, 'resource')},
                    {value: 'volc', label: trans('dt_choice_volc', {}, 'resource')},
                    {value: 'edge', label: trans('dt_choice_edge', {}, 'resource')},
                    {value: 'selfhosted', label: trans('dt_choice_selfhosted', {}, 'resource')}
                  ]
                },
                help: trans('dt_tts_engine_help', {}, 'resource')
              },
              {
                name: 'voiceId',
                label: trans('dt_voice_id', {}, 'resource'),
                type: 'string',
                help: trans('dt_voice_id_help', {}, 'resource')
              },
              {
                name: 'rate',
                label: trans('dt_rate', {}, 'resource'),
                type: 'number',
                options: {step: 0.1},
                help: trans('dt_rate_help', {}, 'resource')
              },
              {
                name: 'pitch',
                label: trans('dt_pitch', {}, 'resource'),
                type: 'number',
                options: {step: 0.1},
                help: trans('dt_pitch_help', {}, 'resource')
              },
              {
                name: 'ttsAppId',
                label: trans('dt_tts_appid', {}, 'resource'),
                type: 'string',
                help: trans('dt_tts_appid_help', {}, 'resource')
              },
              {
                name: 'ttsToken',
                label: trans('dt_tts_token', {}, 'resource'),
                type: 'password',
                options: {
                  disablePasswordCheck: true
                },
                help: hasTtsToken
                  ? trans('dt_tts_token_help_set', {}, 'resource')
                  : trans('dt_tts_token_help_empty', {}, 'resource')
              }
            ]
          },
          {
            title: trans('dt_avatar_settings', {}, 'resource'),
            fields: [
              {
                name: 'avatarType',
                label: trans('dt_avatar_type', {}, 'resource'),
                type: 'choice',
                options: {
                  choices: [
                    {value: 'none', label: trans('dt_choice_none', {}, 'resource')},
                    {value: 'live2d', label: trans('dt_choice_live2d', {}, 'resource')},
                    {value: 'vrm', label: trans('dt_choice_vrm', {}, 'resource')},
                    {value: 'image', label: trans('dt_choice_image', {}, 'resource')}
                  ]
                },
                help: trans('dt_avatar_type_help', {}, 'resource')
              },
              {
                name: 'avatarAsset',
                label: trans('dt_avatar_asset', {}, 'resource'),
                type: 'string',
                help: trans('dt_avatar_asset_help', {}, 'resource')
              }
            ]
          }
        ] : [])
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
