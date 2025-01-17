import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {constants} from '#/main/evaluation/sequence/constants'

const SequenceEditorAppearance = () =>
  <EditorPage
    title={trans('appearance')}
    help={trans('Personnalisez les paramètres d\'affichage avancés de votre séquence et de ses contenus.')}
    definition={[
      {
        name: 'images',
        icon: 'fa fa-fw fa-picture',
        title: trans('images'),
        primary: true,
        fields: [
          {
            name: 'poster',
            label: trans('poster'),
            type: 'image'
          }, {
            name: 'thumbnail',
            label: trans('thumbnail'),
            type: 'image',
            recommended: true
          }
        ]
      }, {
        name: 'numbering',
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        primary: true,
        hideTitle: true,
        fields: [
          {
            name: 'display.numbering',
            type: 'choice',
            label: trans('path_numbering', {}, 'path'),
            required: true,
            options: {
              noEmpty: true,
              condensed: false,
              choices: constants.PATH_NUMBERINGS
            }
          }
        ]
      }, {
        name: 'opening',
        icon: 'fa fa-fw fa-sign-in',
        title: trans('opening_parameters'),
        subtitle: trans('Configurez la façon dont les contenus de votre parcours vont s\'ouvrir.'),
        primary: true,
        fields: [
          {
            name: 'opening.secondaryResources',
            label: trans('secondary_resources_open_target', {}, 'path'),
            type: 'choice',
            // required: true,
            options: {
              noEmpty: true,
              condensed: false,
              choices: {
                _self: trans('same_window'),
                _blank: trans('new_window')
              }
            }
          }
        ]
      }
    ]}
  />

export {
  SequenceEditorAppearance
}
