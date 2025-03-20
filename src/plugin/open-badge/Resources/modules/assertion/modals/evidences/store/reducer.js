import {makeListReducer} from '#/main/app/content/list'

import {selectors} from '#/plugin/open-badge/assertion/modals/evidences/store/selectors'

const reducer = makeListReducer(selectors.STORE_NAME)

export {
  reducer
}
