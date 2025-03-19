import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {actions as formActions} from '#/main/app/content/form'
import {ResourceEditorAppearance, selectors as editorSelectors, actions} from '#/main/core/resource/editor'

import {constants} from '#/plugin/claco-form/resources/claco-form/constants'
import {getTemplateErrors, getTemplateHelp} from '#/plugin/claco-form/resources/claco-form/template'

const ClacoFormEditorAppearance = () => {
  const dispatch = useDispatch()

  const clacoForm = useSelector(editorSelectors.resource)
  const errors = useSelector(editorSelectors.errors)

  const updateProp = (propPath, propValue) => dispatch(actions.update(propValue, propPath))
  const validateTemplate = () => {
    if (get(clacoForm, 'template.content')) {
      const formErrors = Object.assign({}, errors, {
        resource: {template: {content: getTemplateErrors(get(clacoForm, 'template.content'), clacoForm.fields)}}
      })

      dispatch(formActions.setErrors(editorSelectors.STORE_NAME, formErrors))
    }
  }

  return (
    <ResourceEditorAppearance
      definition={[
        {
          title: trans('opening_parameters'),
          description: trans('Configurez la façon dont votre ressource va s\'ouvrir.'),
          primary: true,
          fields: [
            {
              name: 'resource.details.default_home',
              type: 'choice',
              label: trans('type'),
              required: true,
              options: {
                noEmpty: true,
                condensed: false,
                choices: constants.DEFAULT_HOME_CHOICES
              }
            }
          ]
        }, {
          title: trans('Fiches personnalisées', {}, 'clacoform'),
          description: trans('Personnalisez complètement l\'affichage des fiches.', {}, 'clacoform'),
          primary: true,
          enabled: (formData) => get(formData, 'resource.template.enabled', false),
          onToggle: (enabled) => {
            updateProp('resource.template.enabled', enabled)
            if (!enabled) {
              updateProp('resource.template.content', null)
            }
          },
          fields: [
            {
              name: 'resource.template.content',
              type: 'html',
              label: trans('template', {}, 'clacoform'),
              help: getTemplateHelp(clacoForm.fields || [], get(clacoForm, 'details.title_field_label')),
              required: true,
              onError: validateTemplate
            }
          ]
        }
      ]}
    />
  )
}

export {
  ClacoFormEditorAppearance
}
