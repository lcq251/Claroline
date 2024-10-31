import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store'
import {makeListReducer} from '#/main/app/content/list/store'
import {makeInstanceAction} from '#/main/app/store/actions'
import {FORM_RESET} from '#/main/app/content/form/store/actions'

import {selectors} from '#/main/community/user/editor/store/selectors'

const reducer = combineReducers({
  form: makeFormReducer(selectors.FORM_NAME, {data: null}),
  organizations: makeListReducer(selectors.STORE_NAME + '.organizations', {
    sortBy: {property: 'name', direction: 1}
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(FORM_RESET, selectors.FORM_NAME)]: () => true
    })
  }),
  roles: makeListReducer(selectors.STORE_NAME + '.roles', {
    sortBy: {property: 'name', direction: 1}
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(FORM_RESET, selectors.FORM_NAME)]: () => true
    })
  })
})

export {
  reducer
}
