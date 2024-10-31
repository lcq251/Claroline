import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/reducer'

import {UserEditor as UserEditorComponent} from '#/main/community/user/editor/components/main'
import {actions, reducer, selectors} from '#/main/community/user/editor/store'

const UserEditor = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      formData: selectors.user(state)
    }),
    (dispatch) => ({
      open(username) {
        dispatch(actions.open(username))
      }
    })
  )(UserEditorComponent)
)

export {
  UserEditor
}
