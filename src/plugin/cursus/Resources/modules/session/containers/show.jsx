import {withReducer} from '#/main/app/store/components/withReducer'

import {selectors, reducer} from '#/plugin/cursus/session/store'
import {SessionShow as SessionShowComponent} from '#/plugin/cursus/session/components/show'

const SessionShow = withReducer(selectors.STORE_NAME, reducer)(
  SessionShowComponent
)

export {
  SessionShow
}
