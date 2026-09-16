import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor, ResourceEditorOverview, selectors as editorSelectors} from '#/main/core/resource/editor'

/**
 * Aiteacher editor — ai-avatar-bot widget configuration. The LLM brain is a
 * linked Aibase resource (brainAibaseId); model + API key stay on that Aibase.
 */
const AiteacherEditorOverview = () => {
  // read the *modified* resource from the editor store so conditional fields
  // re-render as the user edits.
  const resource = useSelector(editorSelectors.resource)

  return (
    <ResourceEditorOverview
      definition={[
        {
          title: trans('aiteacher_editor_title', {}, 'resource'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: 'resource.widgetBaseUrl',
              label: trans('aiteacher_widget_base_url', {}, 'resource'),
              type: 'string',
              options: {
                placeholder: '/avatar'
              },
              help: trans('aiteacher_widget_base_url_help', {}, 'resource')
            },
            {
              name: 'resource.brainAibaseId',
              label: trans('aiteacher_brain_aibase_id', {}, 'resource'),
              type: 'number',
              help: trans('aiteacher_brain_aibase_id_help', {}, 'resource')
            },
            {
              name: 'resource.modelUrl',
              label: trans('aiteacher_model_url', {}, 'resource'),
              type: 'string',
              help: trans('aiteacher_model_url_help', {}, 'resource')
            },
            {
              name: 'resource.voice',
              label: trans('aiteacher_voice', {}, 'resource'),
              type: 'string',
              help: trans('aiteacher_voice_help', {}, 'resource')
            },
            {
              name: 'resource.mode',
              label: trans('aiteacher_mode', {}, 'resource'),
              type: 'choice',
              options: {
                choices: {
                  assistant: 'assistant',
                  companion: 'companion'
                }
              },
              help: trans('aiteacher_mode_help', {}, 'resource')
            },
            {
              name: 'resource.usageLimit',
              label: trans('usage_limit', {}, 'resource'),
              type: 'number',
              help: trans('aiteacher_usage_limit_help', {}, 'resource')
            },
            {
              name: 'resource.fit',
              label: trans('aiteacher_fit', {}, 'resource'),
              type: 'choice',
              options: {
                choices: {
                  half: 'half',
                  full: 'full'
                }
              },
              help: trans('aiteacher_fit_help', {}, 'resource')
            },
            {
              name: 'resource.zoom',
              label: trans('aiteacher_zoom', {}, 'resource'),
              type: 'number',
              options: {
                min: 1,
                max: 3
              },
              help: trans('aiteacher_zoom_help', {}, 'resource')
            },
            {
              name: 'resource.avatarName',
              label: trans('aiteacher_avatar_name', {}, 'resource'),
              type: 'string',
              help: trans('aiteacher_avatar_name_help', {}, 'resource')
            },
            {
              name: 'resource.welcome',
              label: trans('aiteacher_welcome', {}, 'resource'),
              type: 'string',
              options: {
                long: true,
                minRows: 2
              },
              help: trans('aiteacher_welcome_help', {}, 'resource')
            },
            {
              name: 'resource.greeting',
              label: trans('aiteacher_greeting', {}, 'resource'),
              type: 'string',
              options: {
                long: true,
                minRows: 2
              },
              help: trans('aiteacher_greeting_help', {}, 'resource')
            },
            {
              name: 'resource.fallback',
              label: trans('aiteacher_fallback', {}, 'resource'),
              type: 'string',
              options: {
                long: true,
                minRows: 2
              },
              help: trans('aiteacher_fallback_help', {}, 'resource')
            },
            {
              name: 'resource.suggestions',
              label: trans('aiteacher_suggestions', {}, 'resource'),
              type: 'collection',
              options: {
                type: 'string',
                defaultItem: '',
                button: trans('aiteacher_add_suggestion', {}, 'resource'),
                placeholder: trans('aiteacher_no_suggestion', {}, 'resource')
              },
              help: trans('aiteacher_suggestions_help', {}, 'resource')
            }
          ]
        }
      ]}
    />
  )
}

const AiteacherEditor = () =>
  <ResourceEditor
    overviewPage={AiteacherEditorOverview}
  />

export {
  AiteacherEditor
}
