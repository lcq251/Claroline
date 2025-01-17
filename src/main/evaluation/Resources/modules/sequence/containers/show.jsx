import {withReducer} from '#/main/app/store/reducer'

import {SequenceShow as SequenceShowComponent} from '#/main/evaluation/sequence/components/show'
import {reducer, selectors} from '#/main/evaluation/sequence/store'

const SequenceShow = withReducer(selectors.STORE_NAME, reducer)(
  SequenceShowComponent
)

export {
  SequenceShow
}
