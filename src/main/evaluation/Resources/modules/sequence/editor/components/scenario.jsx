import React from 'react'
import {useSelector} from 'react-redux'

import {Routes} from '#/main/app/router'

import {selectors} from '#/main/evaluation/sequence/editor/store'
import {SequenceEditorSummary} from '#/main/evaluation/sequence/editor/components/summary'
import {SequenceEditorStep} from '#/main/evaluation/sequence/editor/components/step'

const SequenceEditorScenario = () => {
  const editorPath = useSelector(selectors.path)

  return (
    <Routes
      path={editorPath+'/steps'}
      routes={[
        {
          path: '/',
          exact: true,
          component: SequenceEditorSummary
        }, {
          path: '/:slug',
          component: SequenceEditorStep
        }
      ]}
    />
  )
}

export {
  SequenceEditorScenario
}
