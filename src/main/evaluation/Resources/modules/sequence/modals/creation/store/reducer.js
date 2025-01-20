
import {makeFormReducer} from '#/main/app/content/form/store'

import {Sequence} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/sequence/modals/creation/store/selectors'

const reducer = makeFormReducer(selectors.STORE_NAME, {
  new: true,
  data: Sequence.defaultProps
})

export {
  reducer
}
