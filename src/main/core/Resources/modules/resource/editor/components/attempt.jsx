import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'
import {useDispatch} from 'react-redux'

import {actions} from '#/main/core/resource/editor/store'

const enableScore = (formData) => get(formData, 'resourceNode.evaluation._enableScore') || get(formData, 'resourceNode.evaluation.scoreTotal')
const enableSuccessCondition = (formData) => get(formData, 'resourceNode.evaluation._enableSuccess')
  || get(formData, 'resourceNode.evaluation.successCondition.score')
const enableMessages = (formData) => get(formData, 'resourceNode.evaluation._enableMessages')
  || get(formData, 'resourceNode.evaluation.endMessage')
  || get(formData, 'resourceNode.evaluation.successMessage')
  || get(formData, 'resourceNode.evaluation.failureMessage')

const enableSuccessScore = (formData) => get(formData, 'resourceNode.evaluation._enableSuccessScore') || get(formData, 'resourceNode.evaluation.successCondition.score')

const ResourceEditorAttempt = (props) => {
  const dispatch = useDispatch()
  const updateProp = (propPath, propValue) => dispatch(actions.updateResourceNode(propPath, propValue))

  return (
    <EditorPage
      title={trans('Tentatives')}
      help={trans('Configurez le déroulement de votre activité pédagogique.')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'resourceNode.evaluation.estimatedDuration',
              label: trans('estimated_duration'),
              type: 'number',
              options: {
                unit: trans('minutes')
              },
              help: trans('Estimez le temps nécessaire à la consultation du contenu ou à la réalisation de l\'activité.')
            }, {
              name: 'resourceNode.evaluation._enable',
              type: 'boolean',
              label: trans('Activer le suivi pédagogique', {}, 'evaluation'),
              help: trans('', {}, 'evaluation')
            }
          ]
        }, {
          title: trans('Score'),
          description: trans('Donnez un score à vos utilisateurs une fois qu\'ils ont terminé l\'activité.'),
          primary: true,
          fields: [
            {
              name: 'resourceNode.evaluation._enableScore',
              type: 'boolean',
              label: trans('Activer le score'),
              calculated: enableScore,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.scoreTotal', null)
                }
              }
            }, {
              name: 'resourceNode.evaluation.scoreTotal',
              label: trans('score_total'),
              type: 'number',
              disabled: (data) => !enableScore(data)
            },
          ]
        }, {
          title: trans('Conditions de réussite'),
          description: trans('Donnez un statut de Réussite ou d\'Échec à vos utilisateurs en fonction des conditions définies. Si aucune condition n\'est définie les utilisateurs obtiennent un statut Terminé une fois qu\'ils ont terminé l\'activités.'),
          primary: true,
          fields: [
            {
              name: 'resourceNode.evaluation._enableSuccess',
              type: 'boolean',
              label: trans('enable_success_condition', {}, 'workspace'),
              //help: trans('enable_success_condition_help', {}, 'workspace'),
              calculated: enableSuccessCondition,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.successCondition', null)
                  updateProp('evaluation._enableSuccessScore', false)
                }
              }
            }, {
              name: 'resourceNode.evaluation._enableSuccessScore',
              label: trans('Obtenir un score minimal', {}, 'workspace'),
              help: trans('Les utilisateurs doivent obtenir un score supérieur ou égale au pourcentage du score total défini pour réussir.'),
              type: 'boolean',
              disabled: (data) => !enableSuccessCondition(data),
              calculated: enableSuccessScore,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.successCondition.score', null)
                }
              },
              linked: [
                {
                  name: 'resourceNode.evaluation.successCondition.score',
                  label: trans('score_to_pass'),
                  type: 'number',
                  required: true,
                  displayed: enableSuccessScore,
                  options: {
                    min: 0,
                    max: 100,
                    unit: '%'
                  }
                }
              ]
            }
          ]
        }
      ]}
    >
      {props.children}
    </EditorPage>
  )
}

ResourceEditorAttempt.propTypes = {
  children: T.any
}

export {
  ResourceEditorAttempt
}
