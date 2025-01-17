import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'
import {useDispatch} from 'react-redux'

import {actions} from '#/main/evaluation/sequence/editor/store'

const enableScore = (formData) => get(formData, 'evaluation._enableScore') || get(formData, 'evaluation.scoreTotal')
const enableSuccessCondition = (formData) => get(formData, 'evaluation._enableSuccess')
  || get(formData, 'evaluation.successCondition.score')

const enableSuccessScore = (formData) => get(formData, 'evaluation._enableSuccessScore') || get(formData, 'evaluation.successCondition.score')

const enableEndMessage = (formData) => get(formData, 'evaluation._enableEndMessage')
  || get(formData, 'evaluation.endMessage')
const enableSuccessMessage = (formData) => get(formData, 'evaluation._enableSuccessMessage')
  || get(formData, 'evaluation.successMessage')
const enableFailureMessage = (formData) => get(formData, 'evaluation._enableFailureMessage')
  || get(formData, 'evaluation.failureMessage')
const enableAttemptsReachedMessage = (formData) => get(formData, 'evaluation._enableAttemptsReachedMessage')
  || get(formData, 'evaluation.attemptsReachedMessage')

const SequenceEditorEvaluation = (props) => {
  const dispatch = useDispatch()
  const updateProp = (propPath, propValue) => dispatch(actions.update(propValue, propPath))

  return (
    <EditorPage
      title={trans('parameters')}
      help={trans('Activez le suivi pédagogique pour enregistrer et suivre la progression des utilisateurs.')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'evaluation.estimatedDuration',
              label: trans('estimated_duration'),
              type: 'number',
              options: {
                unit: trans('minutes')
              },
              help: trans('Estimez le temps nécessaire à la consultation du contenu ou à la réalisation de l\'activité.')
            }, {
              name: 'evaluation._enable',
              type: 'boolean',
              label: trans('Activer le suivi pédagogique', {}, 'evaluation'),
              help: trans('', {}, 'evaluation')
            }
          ]
        }, {
          title: trans('Score'),
          subtitle: trans('Donnez un score à vos utilisateurs une fois qu\'ils ont terminé l\'activité.'),
          primary: true,
          fields: [
            {
              name: 'evaluation._enableScore',
              type: 'boolean',
              label: trans('Activer le score'),
              calculated: enableScore,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.scoreTotal', null)
                }
              }
            }, {
              name: 'evaluation.scoreTotal',
              label: trans('score_total'),
              type: 'number',
              displayed: enableScore
            },
          ]
        }, {
          title: trans('Conditions de réussite'),
          subtitle: trans('Donnez un statut de Réussite ou d\'Échec à vos utilisateurs en fonction des conditions définies. Si aucune condition n\'est définie les utilisateurs obtiennent un statut Terminé une fois qu\'ils ont terminé l\'activité.'),
          primary: true,
          fields: [
            {
              name: 'evaluation._enableSuccess',
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
              name: 'evaluation._enableSuccessScore',
              label: trans('Obtenir un score minimal', {}, 'workspace'),
              help: trans('Les utilisateurs doivent obtenir un score supérieur ou égale au pourcentage du score total défini pour réussir.'),
              type: 'boolean',
              displayed: enableSuccessCondition,
              calculated: enableSuccessScore,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.successCondition.score', null)
                }
              },
              linked: [
                {
                  name: 'evaluation.successCondition.score',
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
        }, {
          title: trans('Messages'),
          subtitle: trans('Personnalisez les messages affichés automatiquement à vos utilisateurs lors de leur progression.'),
          primary: true,
          fields: [
            {
              name: 'evaluation._enableEndMessage',
              type: 'boolean',
              label: trans('Personnaliser le message de fin'),
              help: trans('Le message de fin est affiché à partir du moment où les utilisateurs ont atteint le statut "Terminé" à leur activité.'),
              calculated: enableEndMessage,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.endMessage', null)
                }
              },
              linked: [
                {
                  name: 'evaluation.endMessage',
                  label: trans('end_message'),
                  type: 'html',
                  required: true,
                  displayed: enableEndMessage
                }
              ]
            }, {
              name: 'evaluation._enableSuccessMessage',
              type: 'boolean',
              label: trans('Personnaliser le message de réussite'),
              help: trans('Le message de réussite est affiché à partir du moment où les utilisateurs ont atteint le statut "Succès" à leur activité.'),
              calculated: enableSuccessMessage,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.successMessage', null)
                }
              },
              linked: [
                {
                  name: 'evaluation.successMessage',
                  label: trans('success_message'),
                  type: 'html',
                  required: true,
                  displayed: enableSuccessMessage
                }
              ]
            }, {
              name: 'evaluation._enableFailureMessage',
              type: 'boolean',
              label: trans('Personnaliser le message d\'échec'),
              help: trans('Le message d\'échec est affiché à partir du moment où les utilisateurs ont atteint le statut "Echec" à leur activité.'),
              calculated: enableFailureMessage,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.failureMessage', null)
                }
              },
              linked: [
                {
                  name: 'evaluation.failureMessage',
                  label: trans('failure_message'),
                  type: 'html',
                  required: true,
                  displayed: enableFailureMessage
                }
              ]
            }, {
              name: 'evaluation._enableAttemptsReachedMessage',
              type: 'boolean',
              label: trans('Personnaliser le message de tentatives épuisées'),
              help: trans('Le message de tentatives épuisées est affiché à partir du moment où les utilisateurs ont consommé toutes leurs tentatives disponibles.'),
              calculated: enableAttemptsReachedMessage,
              onChange: (enabled) => {
                if (!enabled) {
                  updateProp('evaluation.attemptsReachedMessage', null)
                }
              },
              linked: [
                {
                  name: 'evaluation.attemptsReachedMessage',
                  label: trans('Message de tentatives épuisées'),
                  type: 'html',
                  required: true,
                  displayed: enableAttemptsReachedMessage
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

SequenceEditorEvaluation.propTypes = {
  children: T.any
}

export {
  SequenceEditorEvaluation
}
