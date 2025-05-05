import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/reducer'
import {TemplateTool as TemplateToolComponent} from '#/main/template/administration/templates/components/tool'
import {actions, reducer, selectors} from '#/main/template/administration/templates/store'

const TemplateTool = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      open(type) {
        dispatch(actions.open(type))
      }
    })
  )(TemplateToolComponent)
)

export {
  TemplateTool
}
