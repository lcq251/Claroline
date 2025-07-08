import cloneDeep from 'lodash/cloneDeep'

import {makeInstanceAction} from '#/main/app/store/actions'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {TOOL_LOAD} from '#/main/core/tool/store/actions'
import {selectors} from '#/main/template/administration/templates/store/selectors'
import {TEMPLATE_TYPE_LOAD, TEMPLATE_ADD, TEMPLATE_UPDATE} from '#/main/template/administration/templates/store/actions'

const reducer = combineReducers({
  templateTypes: makeReducer({}, {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.templateTypes || state
  }),
  current: makeReducer(null, {
    [TEMPLATE_TYPE_LOAD]: (state, action) => action.templateType
  }),
  templates: makeReducer([], {
    [TEMPLATE_TYPE_LOAD]: (state, action) => action.templates,
    [TEMPLATE_ADD]: (state, action) => {
      let newState = cloneDeep(state)
      if (action.template.default) {
        newState = newState.map(t => {
          t.default = false

          return t
        })
      }

      newState.push(action.template)

      return newState
    },
    [TEMPLATE_UPDATE]: (state, action) => {
      let newState = cloneDeep(state)

      const pos = state.findIndex(t => t.id === action.template.id)
      if (-1 !== pos) {
        if (action.template.default) {
          newState = newState.map(t => {
            t.default = false

            return t
          })
        }

        newState[pos] = action.template
      }

      return newState
    }
  }),
  template: makeFormReducer(selectors.STORE_NAME + '.template', {}, {
    data: makeReducer(null, {
      [TEMPLATE_UPDATE]: (state, action) => action.template
    }),
    originalData: makeReducer(null, {
      [TEMPLATE_UPDATE]: (state, action) => action.template
    })
  })
})

export {
  reducer
}
