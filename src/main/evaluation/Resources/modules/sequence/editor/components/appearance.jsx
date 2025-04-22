import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {constants} from '#/main/evaluation/sequence/constants'
import get from 'lodash/get'
import {useDispatch} from 'react-redux'
import {actions} from '#/main/evaluation/sequence/editor/store'

const SequenceEditorAppearance = () => {
  const dispatch = useDispatch()
  const updateProp = (propPath, propValue) => dispatch(actions.update(propValue, propPath))

  return (
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
        }, /*{
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
        }, */{
          title: trans('Bouton "Quitter"'),
          description: trans('Personnalisez le comportement et l\'affichage du bouton "Quitter" affiché à la fin de la séquence.'),
          primary: true,
          enabled: (sequence) => !!get(sequence, 'end.back.type') || get(sequence, 'end.back._enabled'),
          onToggle: (enabled) => {
            updateProp('end.back._enabled', enabled)
            if (!enabled) {
              updateProp('end.back.type', null)
              updateProp('end.back.label', null)
            }
          },
          fields: [
            {
              name: 'end.back.label',
              type: 'string',
              label: trans('resource_end_back_label', {}, 'resource'),
              placeholder: trans('exit', {}, 'actions'),
              //displayed: (path) => (!!get(path, 'end.back.type') || get(path, 'end.back._enabled'))
            }, {
              name: 'end.back.type',
              type: 'choice',
              //displayed: (path) => (!!get(path, 'end.back.type') || get(path, 'end.back._enabled')),
              label: trans('resource_end_back_type', {}, 'resource'),
              required: true,
              options: {
                choices: {
                  workspace: trans('resource_end_back_workspace', {}, 'resource'),
                  desktop: trans('resource_end_back_desktop', {}, 'resource')
                }
              }
            }
          ]
        }
      ]}
    />
  )
}

export {
  SequenceEditorAppearance
}
