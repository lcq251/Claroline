import {makeFormReducer} from '#/main/app/content/form/store'

import {selectors} from '#/plugin/cursus/course/editor/store/selectors'

const reducer = makeFormReducer(selectors.STORE_NAME)

export {
  reducer
}
