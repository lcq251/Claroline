import React from 'react'
import {ResourceEditorAppearance} from '#/main/core/resource/editor/components/appearance'
import {trans} from '#/main/app/intl'
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
            label: trans('Afficher la vue "A propos"'),
            help: trans('La vue "A propos" contient l\'image de converture de la ressource, sa description longue ainsi que le sommaire des pages de la Connaissance.')
          }, {
            name: 'resource.display.navigation',
            type: 'boolean',
            label: trans('Afficher la navigation'),
            help: trans('Affiche des boutons "Précédent" et "Suivant" pour naviguer facilement entre les pages.')
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
