import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const SequenceEditorHistory = () =>
  <EditorPage
    title={trans('history')}
    help={trans('sequence_history_desc', {}, 'evaluation')}
  >
    <div className="p-4">
      <p>Cette page contiendra les logs opérationnels liés à la séquence</p>
      <p>Afficher aussi ici le créateur, date de création, date de dernière modifications</p>
    </div>
  </EditorPage>

export {
  SequenceEditorHistory
}
