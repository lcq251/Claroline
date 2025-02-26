import React from 'react'

import {trans} from '#/main/app/intl'
import {ResourceEditorAppearance} from '#/main/core/resource/editor/components/appearance'

import {constants} from '#/plugin/path/resources/path/constants'

const PathEditorAppearance = () =>
  <ResourceEditorAppearance
    definition={[
      {
        name: 'numbering',
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        primary: true,
        hideTitle: true,
        fields: [
          {
            name: 'resource.display.numbering',
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
        description: trans('Configurez la façon dont les contenus de votre parcours vont s\'ouvrir.'),
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
  PathEditorAppearance
}
