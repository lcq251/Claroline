import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {EvaluationTool as EvaluationToolComponent} from '#/main/evaluation/tools/evaluation/components/tool'
import {reducer, selectors} from '#/main/evaluation/tools/evaluation/store'
import {withReducer} from '#/main/app/store/reducer'

const EvaluationTool = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      contextType: toolSelectors.contextType(state)
    })
  )(EvaluationToolComponent)
)

export {
  EvaluationTool
}
