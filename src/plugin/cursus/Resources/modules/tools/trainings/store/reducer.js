import isEmpty from 'lodash/isEmpty'

import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeInstanceAction} from '#/main/app/store/actions'
import {TOOL_LOAD} from '#/main/core/tool/store'

import {selectors} from '#/plugin/cursus/tools/trainings/store/selectors'
import {reducer as catalogReducer} from '#/plugin/cursus/tools/trainings/catalog/store/reducer'
import {reducer as sessionReducer} from '#/plugin/cursus/tools/trainings/session/store/reducer'
import {reducer as eventReducer} from '#/plugin/cursus/tools/trainings/event/store/reducer'
import {reducer as dashboardReducer} from '#/plugin/cursus/tools/trainings/dashboard/store/reducer'
import {TRAININGS_UPDATE_REGISTRATIONS} from '#/plugin/cursus/tools/trainings/store/actions'
import cloneDeep from 'lodash/cloneDeep'

const reducer = combineReducers({
  catalog: catalogReducer,
  session: sessionReducer,
  event: eventReducer,

  /**
   * The list of current user registrations.
   */
  registrations: makeReducer([], {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => {
      if (!isEmpty(action.toolData.registrations)) {
        return action.toolData.registrations
      }

      return []
    },
    [TRAININGS_UPDATE_REGISTRATIONS]: (state, action) => {
      const newState = cloneDeep(state)
      const pos = newState.findIndex(r => r.id === action.registration.id)
      if (-1 !== pos) {
        newState[pos] = action.registration
      }

      return newState
    }
  }),
  dashboard: dashboardReducer
})

export {
  reducer
}
