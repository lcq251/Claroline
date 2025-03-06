import {withReducer} from '#/main/app/store/components/withReducer'

import {selectors, reducer} from '#/main/evaluation/resource/evaluation/store'
import {ResourceDashboardEvaluations as ResourceDashboardEvaluationsComponent} from '#/main/evaluation/resource/evaluation/components/main'

const ResourceDashboardEvaluations = withReducer(selectors.STORE_NAME, reducer)(
  ResourceDashboardEvaluationsComponent
)

export {
  ResourceDashboardEvaluations
}
