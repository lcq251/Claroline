import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'

const SequenceEditorRequirements = () => {
  return (
    <EditorPage
      title={trans('Pré-requis')}
      help={trans('Les utilisateurs ne pourront faire cette séquence qu\'une fois les séquences requises terminées.')}
    />
  )
}

export {
  SequenceEditorRequirements
}
