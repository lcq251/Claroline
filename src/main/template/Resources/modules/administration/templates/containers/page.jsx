import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {TemplatePage as TemplatePageComponent} from '#/main/template/administration/templates/components/page'

const TemplatePage = connect(
  (state) => ({
    path: toolSelectors.path(state)
  })
)(TemplatePageComponent)

export {
  TemplatePage
}
