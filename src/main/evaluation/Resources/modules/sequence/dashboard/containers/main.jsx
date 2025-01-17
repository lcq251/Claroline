import {withReducer} from '#/main/app/store/reducer'

import {SequenceDashboard as SequenceDashboardComponent} from '#/main/evaluation/sequence/dashboard/components/main'
import {reducer, selectors} from '#/main/evaluation/sequence/dashboard/store'

const SequenceDashboard = withReducer(selectors.STORE_NAME, reducer)(
  SequenceDashboardComponent
)

export {
  SequenceDashboard
}
