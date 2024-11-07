import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/main/template/modals/template-types/store/selectors'

const reducer = makeListReducer(selectors.STORE_NAME)

export {
  reducer
}
