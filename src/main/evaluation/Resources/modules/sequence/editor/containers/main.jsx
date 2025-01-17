import {withReducer} from '#/main/app/store/components/withReducer'

import {SequenceEditor as SequenceEditorComponent} from '#/main/evaluation/sequence/editor/components/main'
import {reducer, selectors} from '#/main/evaluation/sequence/editor/store'

const SequenceEditor = withReducer(selectors.STORE_NAME, reducer)(
  SequenceEditorComponent
)

export {
  SequenceEditor
}
