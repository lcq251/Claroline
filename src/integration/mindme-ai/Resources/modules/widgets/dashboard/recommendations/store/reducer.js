/*
 * Product recommendations list reducer.
 */

import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/integration/mindme-ai/widgets/dashboard/recommendations/store/selectors'

const reducer = makeListReducer(selectors.STORE_NAME)

export {
  reducer
}
