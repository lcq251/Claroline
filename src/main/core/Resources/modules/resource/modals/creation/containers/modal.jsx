import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {ResourceCreationModal as ResourceCreationModalComponent} from '#/main/core/resource/modals/creation/components/modal'
import {actions, reducer, selectors} from '#/main/core/resource/modals/creation/store'

const ResourceCreationModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      startCreation(parent, resourceType, nodeData, resourceData) {
        return dispatch(actions.startCreation(parent, resourceType, nodeData, resourceData))
      },
      fromFile(file) {
        return dispatch(actions.fromFile(file))
      },
      fromUrl(url) {
        return dispatch(actions.fromUrl(url))
      },
      create(parent) {
        return dispatch(actions.create(parent))
      },
      reset() {
        dispatch(actions.reset())
      }
    })
  )(ResourceCreationModalComponent)
)

export {
  ResourceCreationModal
}
