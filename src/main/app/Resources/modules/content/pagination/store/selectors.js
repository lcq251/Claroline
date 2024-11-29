import get from 'lodash/get'

// retrieves a list instance in the store
const pagination = (state, paginationName) => get(state, paginationName)

const pageSize    = (paginationState) => paginationState.pageSize
const currentPage = (paginationState) => paginationState.page || 0

const queryString = (searchState) => `page=${currentPage(searchState)}&limit=${pageSize(searchState)}`

export const selectors = {
  pagination,
  pageSize,
  currentPage,
  queryString
}
