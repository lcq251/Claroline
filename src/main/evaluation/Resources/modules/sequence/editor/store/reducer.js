import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/sequence/editor/store/selectors'

const reducer = makeFormReducer(selectors.STORE_NAME, {
  data: SequenceTypes.defaultProps
})

export {
  reducer
}
