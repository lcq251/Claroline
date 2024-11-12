import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {TemplateList as TemplateListComponent} from '#/main/template/administration/templates/components/list'
import {selectors} from '#/main/template/administration/templates/store'

const TemplateList = connect(
  (state) => ({
    path: toolSelectors.path(state),
    templateTypes: selectors.templateTypes(state)
  })
)(TemplateListComponent)

export {
  TemplateList
}
