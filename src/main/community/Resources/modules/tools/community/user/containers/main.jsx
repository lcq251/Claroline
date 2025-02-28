import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {UserMain as UserMainComponent} from '#/main/community/tools/community/user/components/main'
import {actions, selectors} from '#/main/community/tools/community/user/store'

const UserMain = connect(
  state => ({
    path: toolSelectors.path(state),
    contextType: toolSelectors.contextType(state),
    limitReached: selectors.limitReached(state)
  }),
  dispatch => ({
    open(id) {
      dispatch(actions.open(id))
    }
  })
)(UserMainComponent)

export {
  UserMain
}
