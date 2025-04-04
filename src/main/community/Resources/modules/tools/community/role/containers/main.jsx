import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {RoleMain as RoleMainComponent} from '#/main/community/tools/community/role/components/main'
import {actions} from '#/main/community/tools/community/role/store'

const RoleMain = connect(
  (state) => ({
    path: toolSelectors.path(state),
    contextData: toolSelectors.contextData(state)
  }),
  (dispatch) => ({
    open(id, contextData) {
      dispatch(actions.open(id, contextData))
    }
  })
)(RoleMainComponent)

export {
  RoleMain
}
