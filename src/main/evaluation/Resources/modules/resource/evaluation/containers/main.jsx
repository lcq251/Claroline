import {withReducer} from '#/main/app/store/components/withReducer'

import {selectors, reducer} from '#/main/evaluation/resource/evaluation/store'
import {ResourceEvaluations as ResourceEvaluationsComponent} from '#/main/evaluation/resource/evaluation/components/main'

const ResourceEvaluations = withReducer(selectors.STORE_NAME, reducer)(
  ResourceEvaluationsComponent
)

export {
  ResourceEvaluations
}
