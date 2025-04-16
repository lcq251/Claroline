import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {LogOperationalList} from '#/main/log/components/operational-list'
import {selectors} from '#/main/evaluation/sequence/store'

const SequenceEditorHistory = () => {
  const sequenceId = useSelector(selectors.id)

  return (
    <EditorPage
      title={trans('history')}
      help={trans('sequence_history_desc', {}, 'evaluation')}
    >
      <LogOperationalList
        autoload={!!sequenceId}
        url={['apiv2_logs_operational_object', {objectName: 'Claroline/EvaluationBundle/Entity/Sequence/Sequence', objectId: sequenceId}]}
      />
    </EditorPage>
  )
}

export {
  SequenceEditorHistory
}
