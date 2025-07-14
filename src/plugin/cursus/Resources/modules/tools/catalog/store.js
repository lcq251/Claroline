
import {makeListReducer} from '#/main/app/content/list/store'

const STORE_NAME = 'catalog'
const LIST_NAME = STORE_NAME

const selectors = {
  STORE_NAME,
  LIST_NAME
}

const reducer = makeListReducer(selectors.LIST_NAME, {
  sortBy: {property: 'name', direction: 1},
  filters: []
})

export {
  reducer,
  selectors
}
