import {connect} from 'react-redux'

import {actions as listActions} from '#/main/app/content/list'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {RoleList as RoleListComponent} from '#/main/community/tools/community/role/components/list'
import {selectors} from '#/main/community/tools/community/role/store/selectors'

const RoleList = connect(
  state => ({
    path: toolSelectors.path(state),
    poster: toolSelectors.poster(state),
    contextType: toolSelectors.contextType(state),
    contextData: toolSelectors.contextData(state),
    canCreate: selectors.canCreate(state)
  }),
  (dispatch) => ({
    invalidateList() {
      dispatch(listActions.invalidateData(selectors.LIST_NAME))
    },
  })
)(RoleListComponent)

export {
  RoleList
}
