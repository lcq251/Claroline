import {makeInstanceAction} from '#/main/app/store/actions'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {TOOL_LOAD} from '#/main/core/tool/store/actions'
import {selectors} from '#/main/template/administration/templates/store/selectors'
import {TEMPLATE_TYPE_LOAD} from '#/main/template/administration/templates/store/actions'

const reducer = combineReducers({
  templateTypes: makeReducer({}, {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.templateTypes || state
  }),
  current: makeReducer(null, {
    [TEMPLATE_TYPE_LOAD]: (state, action) => action.templateType
  }),
  templates: makeReducer(false, {
    [TEMPLATE_TYPE_LOAD]: (state, action) => action.templates
  }),
  template: makeFormReducer(selectors.STORE_NAME + '.template')
})

export {
  reducer
}
