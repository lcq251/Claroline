import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeInstanceAction} from '#/main/app/store/actions'
import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'
import {TOOL_OPEN} from '#/main/core/tool/store/actions'

import {selectors} from '#/plugin/open-badge/tools/badges/store/selectors'
import {CONTEXT_OPEN} from '#/main/app/context/store/actions'
import {BADGE_LOAD_CURRENT_ASSERTION} from '#/plugin/open-badge/tools/badges/store/actions'

const reducer = combineReducers({
  /**
   * THe list of all the badges available for the current context.
   */
  list: makeListReducer(selectors.LIST_NAME, {
    sortBy: {property: 'name', direction: 1}
  }, {
    loaded: makeReducer(false, {
      [CONTEXT_OPEN]: () => false
    }),
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true,
      [makeInstanceAction(FORM_SUBMIT_SUCCESS, selectors.FORM_NAME)]: () => true
    })
  }),

  /**
   * The list of all the assertions for the badges owned by the current user.
   */
  mine: makeListReducer(selectors.STORE_NAME + '.mine', {
    sortBy: {property: 'issuedOn', direction: -1}
  }, {
    loaded: makeReducer(false, {
      [CONTEXT_OPEN]: () => false
    }),
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true
    })
  }),

  /**
   * The badge currently displayed.
   */
  current: makeFormReducer(selectors.FORM_NAME, {}, {
    /**
     * The current user assertion if the user own the badge.
     */
    myAssertion: makeReducer(null, {
      [BADGE_LOAD_CURRENT_ASSERTION]: (state, action) => action.assertion
    }),

    myEvidences: makeReducer([], {
      [BADGE_LOAD_CURRENT_ASSERTION]: (state, action) => action.evidences
    }),

    /**
     * The list of all users which own the badge.
     */
    assertions: makeListReducer(selectors.FORM_NAME + '.assertions', {
      sortBy: {property: 'issuedOn', direction: -1}
    }, {
      invalidated: makeReducer(false, {
        [TOOL_OPEN]: () => true
      })
    })
  })
})

export {
  reducer
}
