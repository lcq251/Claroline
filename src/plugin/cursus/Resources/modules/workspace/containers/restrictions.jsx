import {withReducer} from '#/main/app/store/components/withReducer'

import {selectors, reducer} from '#/plugin/cursus/course/store'
import {TrainingWorkspaceRestrictions as TrainingWorkspaceRestrictionsComponent} from '#/plugin/cursus/workspace/components/restrictions'

const TrainingWorkspaceRestrictions = withReducer(selectors.STORE_NAME, reducer)(
  TrainingWorkspaceRestrictionsComponent
)

export {
  TrainingWorkspaceRestrictions
}
