import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor, ResourceEditorOverview} from '#/main/core/resource/editor'
import {selectors as resourceSelectors} from '#/main/core/resource'

/**
 * AiLesson is now an "AI model resource" (C-24): the editor is a plain
 * resource configuration form (model name / API key / expiry / default).
 *
 * The API key is never sent back by the API — the form only receives
 * hasKey + apiKeyMask. Leaving the key input empty keeps the stored key.
 */
const AiLessonEditorOverview = () => {
  const resource = useSelector(resourceSelectors.resource)
  const hasKey = get(resource, 'hasKey', false)
  const mask = get(resource, 'apiKeyMask', '')

  return (
    <ResourceEditorOverview
      definition={[
        {
          title: trans('ai_model_resource', {}, 'resource'),
          primary: true,
          hideTitle: true,
          fields: [
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
              name: 'expiresAt',
              label: trans('expires_at', {}, 'resource'),
              type: 'date',
              options: {
                time: true
              },
              help: trans('expires_at_help', {}, 'resource')
            },
            {
              name: 'isDefault',
              label: trans('is_default', {}, 'resource'),
              type: 'boolean',
              help: trans('is_default_help', {}, 'resource')
            },
            {
              name: 'usageLimit',
              label: trans('usage_limit', {}, 'resource'),
              type: 'number',
              help: trans('usage_limit_help', {}, 'resource')
            }
          ]
        }
      ]}
    />
  )
}

const AiLessonEditor = () =>
  <ResourceEditor
    overviewPage={AiLessonEditorOverview}
  />

export {
  AiLessonEditor
}
