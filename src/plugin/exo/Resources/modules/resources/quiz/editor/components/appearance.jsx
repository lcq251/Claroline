import React from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {ResourceEditorAppearance} from '#/main/core/resource/editor/components/appearance'

import {NUMBERINGS} from '#/main/app/utils/numbering'

const QuizEditorAppearance = () =>
  <ResourceEditorAppearance
    definition={[
      {
        name: 'quiz-display',
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        primary: true,
        hideTitle: true,
        fields: [
          {
            name: 'resource.display.showOverview',
            type: 'boolean',
            label: trans('show_overview', {}, 'quiz'),
            help: trans('show_overview_help', {}, 'quiz')
          }, {
            name: 'resource.parameters.showTitles',
            type: 'boolean',
            label: trans('show_step_titles', {}, 'quiz'),
            linked: [
              {
                name: 'resource.parameters.numbering',
                type: 'choice',
                label: trans('quiz_numbering', {}, 'quiz'),
                required: true,
                displayed: (quiz) => get(quiz, 'resource.parameters.showTitles', false),
                options: {
                  noEmpty: true,
                  condensed: false,
                  choices: NUMBERINGS
                }
              }
            ]
          }, {
            name: 'resource.parameters.showQuestionTitles',
            type: 'boolean',
            label: trans('show_question_titles', {}, 'quiz'),
            linked: [
              {
                name: 'resource.parameters.questionNumbering',
                type: 'choice',
                label: trans('quiz_question_numbering', {}, 'quiz'),
                required: true,
                displayed: (quiz) => get(quiz, 'resource.parameters.showQuestionTitles', false),
                options: {
                  noEmpty: true,
                  condensed: false,
                  choices: NUMBERINGS
                }
              }
            ]
          }
        ]
      }
    ]}
  />

export {
  QuizEditorAppearance
}
