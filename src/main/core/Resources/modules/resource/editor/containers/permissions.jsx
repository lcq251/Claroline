import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {ResourceEditorPermissions as ResourceEditorPermissionsComponent} from '#/main/core/resource/editor/components/permissions'
import {reducer, selectors, actions} from '#/main/core/resource/editor/store'

const ResourceEditorPermissions = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      resourceNode: selectors.resourceNode(state),
      rights: selectors.rights(state)
    }),
    (dispatch) => ({
      loadRights(resourceNode) {
        return dispatch(actions.fetchRights(resourceNode))
      },
      updateResourceNode(prop, value) {
        dispatch(actions.updateResourceNode(value, prop))
      },
      updateRights(perms) {
        dispatch(actions.updateRights(perms))
      }
    })
  )(ResourceEditorPermissionsComponent)
)

export {
  ResourceEditorPermissions
}
