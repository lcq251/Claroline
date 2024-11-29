import isEmpty from 'lodash/isEmpty'

import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeInstanceAction} from '#/main/app/store/actions'
import {TOOL_LOAD} from '#/main/core/tool/store'

import {selectors} from '#/plugin/cursus/tools/trainings/store/selectors'
import {reducer as sessionReducer} from '#/plugin/cursus/tools/trainings/session/store/reducer'
import {reducer as eventReducer} from '#/plugin/cursus/tools/trainings/event/store/reducer'
import {reducer as dashboardReducer} from '#/plugin/cursus/tools/trainings/dashboard/store/reducer'

const reducer = combineReducers({
  session: sessionReducer,
  event: eventReducer,
  /**
   * The list of current user registrations.
   */
  registrations: makeReducer({
    // direct registration
    users: [],
    // registration to trainings without session
    pending: [],
  }, {
    [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => {
      if (!isEmpty(action.toolData.registrations)) {
        return action.toolData.registrations
      }

      return state
    }
  }),
  dashboard: dashboardReducer
})

export {
  reducer
}
