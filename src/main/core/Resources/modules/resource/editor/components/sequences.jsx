import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const ResourceEditorSequences = () =>
  <EditorPage
    title={trans('Scénarisation')}
    help={trans('Retrouver tous les scénarios pédagogiques utilisant cette ressource.')}
  >
    Liste des Séquences
  </EditorPage>

export {
  ResourceEditorSequences
}
