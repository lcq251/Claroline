import {makeInstanceAction} from '#/main/app/store/actions'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'

import {TOOL_LOAD, TOOL_OPEN} from '#/main/core/tool/store/actions'
import {selectors} from '#/main/template/administration/templates/store/selectors'
import {TEMPLATE_TYPE_LOAD} from '#/main/template/administration/templates/store/actions'

const reducer = combineReducers({
  current: makeReducer(null, {
    [TEMPLATE_TYPE_LOAD]: (state, action) => action.templateType
  }),
  templateTypes: makeReducer({}, {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.templateTypes || state
  }),
  templates: makeListReducer(selectors.STORE_NAME + '.templates', {
    //sortBy: {property: 'name', direction: 1}
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(FORM_SUBMIT_SUCCESS, selectors.STORE_NAME + '.template')]: () => true,
      [TOOL_OPEN]: () => true
    })
  }),
  template: makeFormReducer(selectors.STORE_NAME + '.template')
})

export {
  reducer
}
