import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {TemplateDetails as TemplateDetailsComponent} from '#/main/template/administration/templates/components/details'
import {actions, selectors} from '#/main/template/administration/templates/store'

const TemplateDetails = connect(
  (state) => ({
    path: toolSelectors.path(state),
    templateType: selectors.templateType(state),
    currentTemplate: selectors.template(state),
    templates: selectors.templates(state)
  }),
  (dispatch) => ({
    addTemplate(template) {
      dispatch(actions.addTemplate(template))
    },
    loadTemplate(template) {
      dispatch(actions.loadTemplate(template))
    },
    updateTemplate(template) {
      dispatch(actions.updateTemplate(template))
    },
    deleteTemplate(templateTypeId, template) {
      return dispatch(actions.deleteTemplate(templateTypeId, template.id))
    }
  })
)(TemplateDetailsComponent)

export {
  TemplateDetails
}
