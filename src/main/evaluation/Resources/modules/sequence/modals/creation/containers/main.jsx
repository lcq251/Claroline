import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/reducer'
import {actions as formActions} from '#/main/app/content/form'

import {CreationModal as CreationModalComponent} from '#/main/evaluation/sequence/modals/creation/components/main'
import {reducer, selectors} from '#/main/evaluation/sequence/modals/creation/store'

const CreationModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      startCreation(baseData) {
        dispatch(formActions.load(selectors.STORE_NAME, baseData))
      },
      create() {
        return dispatch(formActions.save(selectors.STORE_NAME, ['apiv2_evaluation_sequence_create']))
      }
    })
  )(CreationModalComponent)
)

export {
  CreationModal
}
