import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {UserShow as UserShowComponent} from '#/main/community/tools/community/user/components/show'
import {actions, selectors} from '#/main/community/tools/community/user/store'
import {selectors as securitySelectors} from '#/main/app/security'

const UserShow = connect(
  state => ({
    path: toolSelectors.path(state),
    user: selectors.currentUser(state),
    currentUser: securitySelectors.currentUser(state)
  }),
  (dispatch) => ({
    reload(id) {
      dispatch(actions.open(id, true))
    },
    addGroups(id, groups) {
      dispatch(actions.addGroups(id, groups))
    }
  })
)(UserShowComponent)

export {
  UserShow
}
