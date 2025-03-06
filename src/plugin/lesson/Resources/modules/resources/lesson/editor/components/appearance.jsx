import React from 'react'

import {trans} from '#/main/app/intl'
import {ResourceEditorAppearance} from '#/main/core/resource/editor/components/appearance'

import {constants} from '#/plugin/lesson/resources/lesson/constants'

const LessonEditorAppearance = () =>
  <ResourceEditorAppearance
    definition={[
      {
        name: 'lesson-display',
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        primary: true,
        hideTitle: true,
        fields: [
          {
            name: 'resource.display.showOverview',
            type: 'boolean',
            label: trans('show_overview', {}, 'lesson'),
            help: trans('show_overview_help', {}, 'lesson')
          }, {
            name: 'resource.display.navigation',
            type: 'boolean',
            label: trans('show_navigation', {}, 'lesson'),
            help: trans('show_navigation_help', {}, 'lesson')
          }, {
            name: 'resource.display.numbering',
            type: 'choice',
            label: trans('lesson_numbering', {}, 'lesson'),
            required: true,
            options: {
              noEmpty: true,
              condensed: false,
              choices: constants.LESSON_NUMBERINGS
            }
          }
        ]
      }
    ]}
  />

export {
  LessonEditorAppearance
}
