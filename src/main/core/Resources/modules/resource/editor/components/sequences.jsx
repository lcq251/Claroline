import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'
import get from 'lodash/get'

const ResourceEditorSequences = (props) =>
  <EditorPage
    title={trans('Scénarisation')}
    help={trans('Retrouver tous les scénarios pédagogiques utilisant cette ressource.')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'resourceNode.evaluation.required',
            label: trans('require_resource', {}, 'resource'),
            type: 'boolean',
            help: trans('require_resource_help', {}, 'resource'),
            onChange: (required) => {
              if (!required) {
                updateProp('resourceNode.evaluation.evaluated', false)
              }
            },
            linked: [
              {
                name: 'resourceNode.evaluation.evaluated',
                label: trans('evaluate_resource', {}, 'resource'),
                type: 'boolean',
                help: trans('evaluate_resource_help', {}, 'resource'),
                displayed: (resource) => get(resource, 'resourceNode.evaluation.required', false)
              }
            ]
          }
        ]
      }
    ]}
  >
    Liste des Séquences
  </EditorPage>

export {
  ResourceEditorSequences
}
