import React from 'react'

import {trans} from '#/main/app/intl'
import {ResourceEditorAppearance} from '#/main/core/resource/editor'

import {constants} from '#/main/core/resources/file/constants'

const FileEditorAppearance = () => {
  return (
    <ResourceEditorAppearance
      definition={[
        {
          title: trans('opening_parameters'),
          description: trans('Configurez la façon dont votre fichier va s\'ouvrir.', {}, 'file'),
          primary: true,
          fields: [
            {
              name: 'resource.opening',
              label: trans('type'),
              type: 'choice',
              required: true,
              hideLabel: true,
              options: {
                noEmpty: true,
                choices: constants.OPENING_TYPES
              }
            }
          ]
        }
      ]}
    />
  )
}

export {
  FileEditorAppearance
}
