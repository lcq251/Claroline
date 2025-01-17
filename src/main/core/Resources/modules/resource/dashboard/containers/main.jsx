
import {ResourceDashboard as ResourceDashboardComponent} from '#/main/core/resource/dashboard/components/main'
import {reducer, selectors} from '#/main/core/resource/dashboard/store'
import {withReducer} from '#/main/app/store/reducer'

const ResourceDashboard = withReducer(selectors.STORE_NAME, reducer)(
  ResourceDashboardComponent
)

export {
  ResourceDashboard
}
