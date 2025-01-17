import React from 'react'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {EditorActions} from '#/main/app/editor'

const SequenceEditorActions = (props) => {
  return (
    <EditorActions
      actions={[
        {
          title: trans('Changer le propriétaire'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('Transférer', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          managerOnly: true
        }, {
          title: trans('Recalculer les évaluations'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('recalculate', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          }
        }, {
          title: trans('Purger les évaluations'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('purge', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          dangerous: true,
          managerOnly: true
        }, {
          title: trans('Supprimer la séquence'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('delete', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          dangerous: true,
          managerOnly: true
        }
      ]}
    />
  )
}

export {
  SequenceEditorActions
}
