import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/reducer'

import {SharedModal as SharedModalComponent} from '#/plugin/claco-form/resources/claco-form/player/modals/shared/components/modal'
import {actions, reducer, selectors} from '#/plugin/claco-form/resources/claco-form/player/modals/shared/store'

const SharedModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      shareEntry(entryId, users) {
        dispatch(actions.shareEntry(entryId, users))
      }
    })
  )(SharedModalComponent)
)

export {
  SharedModal
}
