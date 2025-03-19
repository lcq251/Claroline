import {makeListReducer} from '#/main/app/content/list'

import {selectors} from '#/plugin/claco-form/resources/claco-form/player/modals/shared/store/selectors'

const reducer = makeListReducer(selectors.STORE_NAME)

export {
  reducer
}
