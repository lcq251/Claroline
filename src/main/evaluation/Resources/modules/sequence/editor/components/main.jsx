import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {Editor} from '#/main/app/editor'
import {selectors as toolSelectors} from '#/main/core/tool'

import {selectors as sequenceSelectors, actions as sequenceActions} from '#/main/evaluation/sequence/store'
import {route} from '#/main/evaluation/sequence'
import {SequenceEditorScenario} from '#/main/evaluation/sequence/editor/components/scenario'
import {SequenceEditorAppearance} from '#/main/evaluation/sequence/editor/components/appearance'
import {SequenceEditorActions} from '#/main/evaluation/sequence/editor/components/actions'
import {SequenceEditorOverview} from '#/main/evaluation/sequence/editor/components/overview'
import {SequenceEditorHistory} from '#/main/evaluation/sequence/editor/components/history'
import {SequenceEditorPermissions} from '#/main/evaluation/sequence/editor/components/permissions'
import {SequenceEditorRequirements} from '#/main/evaluation/sequence/editor/components/requirements'
import {SequenceEditorEvaluation} from '#/main/evaluation/sequence/editor/components/evaluation'
import {actions, selectors} from '#/main/evaluation/sequence/editor/store'


const SequenceEditor = () => {
  const dispatch = useDispatch()

  const toolPath = useSelector(toolSelectors.path)
  const sequence = useSelector(sequenceSelectors.sequence)
  const editedSequence = useSelector(selectors.data)

  useEffect(() => {
    dispatch(actions.reset(sequence))
  }, [sequence.id])

  return (
    <Editor
      path={route(sequence, null, toolPath)+'/edit'}
      name={selectors.STORE_NAME}
      title={get(editedSequence, 'name') || trans('sequence', {}, 'evaluation')}
      thumbnail={
        <Thumbnail
          className="rounded-1"
          thumbnail={editedSequence.thumbnail}
          name={editedSequence.name}
          size="sm"
        />
      }
      target={['apiv2_evaluation_sequence_update', {
        id: get(sequence, 'id')
      }]}
      onSave={(savedData) => dispatch(sequenceActions.reload(savedData))}
      close={route(sequence, null, toolPath)}
      overviewPage={SequenceEditorOverview}
      appearancePage={SequenceEditorAppearance}
      permissionsPage={SequenceEditorPermissions}
      actionsPage={SequenceEditorActions}
      historyPage={SequenceEditorHistory}
      pages={[
        {
          name: 'evaluation',
          title: trans('parameters'),
          help: trans('Activez le suivi pédagogique pour enregistrer et suivre la progression des utilisateurs.'),
          component: SequenceEditorEvaluation,
          group: trans('evaluation')
        }, {
          name: 'requirements',
          title: trans('Pré-requis', {}, 'evaluation'),
          component: SequenceEditorRequirements,
          group: trans('evaluation'),
          displayed: false
        }, {
          name: 'steps',
          title: trans('Scenario', {}, 'evaluation'),
          component: SequenceEditorScenario
        }
      ]}
      canAdministrate={hasPermission('administrate', sequence)}
    />
  )
}

export {
  SequenceEditor
}
