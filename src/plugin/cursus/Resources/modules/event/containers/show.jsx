import {withReducer} from '#/main/app/store/components/withReducer'

import {selectors, reducer} from '#/plugin/cursus/event/store'
import {EventShow as EventShowComponent} from '#/plugin/cursus/event/components/show'

const EventShow = withReducer(selectors.STORE_NAME, reducer)(
  EventShowComponent
)

export {
  EventShow
}
