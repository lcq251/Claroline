import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {PageListSection} from '#/main/app/page'
import {ToolPage, selectors as toolSelectors} from '#/main/core/tool'

import {SequenceList} from '#/main/evaluation/sequence/components/list'
import {selectors} from '#/main/evaluation/tools/evaluation/store'

const EvaluationSequences = () => {
  const toolPath = useSelector(toolSelectors.path)
  const contextId = useSelector(toolSelectors.contextId)
  const contextName = useSelector(toolSelectors.contextType)

  return (
    <ToolPage title={trans('sequences', {}, 'evaluation')}>
      <PageListSection
        addAction={{
          icon: 'fa fa-fw fa-plus',
          label: trans('add_sequence', {}, 'actions'),
          type: CALLBACK_BUTTON,
          callback: () => true
        }}
      >
        <SequenceList
          path={toolPath}
          name={selectors.STORE_NAME+'.sequences'}
          flush={true}
          url={['apiv2_evaluation_sequence_context_list', {context: contextName, contextId: contextId}]}
        />
      </PageListSection>
    </ToolPage>
  )
}

export {
  EvaluationSequences
}
