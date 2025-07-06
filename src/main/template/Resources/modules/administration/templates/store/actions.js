import {makeActionCreator} from '#/main/app/store/actions'

import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'
import {selectors} from '#/main/template/administration/templates/store/selectors'

export const TEMPLATE_TYPE_LOAD = 'TEMPLATE_TYPE_LOAD'
export const TEMPLATE_ADD = 'TEMPLATE_ADD'

const actions = {}

actions.loadTemplateType = makeActionCreator(TEMPLATE_TYPE_LOAD, 'templateType', 'templates')
actions.addTemplate = makeActionCreator(TEMPLATE_ADD, 'template')
actions.loadTemplate = (template) => formActions.resetForm(selectors.STORE_NAME + '.template', template, false)

actions.open = (type = null) => (dispatch) => {
  if (type) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_template_type_list', {type: type}],
        success: (response) => {
          dispatch(actions.loadTemplateType(type, response.data))

          let defaultTemplate = response.data.find(template => template.default)
          if (!defaultTemplate) {
            defaultTemplate = response.data.find(template => template.system)
          }

          dispatch(actions.loadTemplate(defaultTemplate))
        }
      }
    })
  }

  return dispatch(actions.loadTemplateType(null, []))
}

actions.deleteTemplate = (templateTypeId, templateId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_template_delete'],
    request: {
      method: 'DELETE',
      body: JSON.stringify([templateId])
    },
    success: () => dispatch(actions.open(templateTypeId))
  }
})

export {
  actions
}
