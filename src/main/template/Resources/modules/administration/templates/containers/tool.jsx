import {connect} from 'react-redux'

import {actions as listActions} from '#/main/app/content/list/store'

import {TemplateTool as TemplateToolComponent} from '#/main/template/administration/templates/components/tool'
import {actions, reducer, selectors} from '#/main/template/administration/templates/store'
import {withReducer} from '#/main/app/store/reducer'

const TemplateTool = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      open(id) {
        dispatch(actions.open(id))
      },
      invalidateList() {
        dispatch(listActions.invalidateData(selectors.STORE_NAME + '.templates'))
      }
    })
  )(TemplateToolComponent)
)

export {
  TemplateTool
}
