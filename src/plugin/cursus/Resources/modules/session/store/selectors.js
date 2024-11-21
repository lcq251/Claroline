import get from 'lodash/get'

const store = (name, state) => state[name]

const status = (name, state) => {
  const viewState = store(name, state)

  return viewState.status
}

const error = (name, state) => {
  const viewState = store(name, state)

  return viewState.error
}

const errorStatus = (name, state) => {
  const viewState = store(name, state)

  return viewState.errorStatus
}

const data = (name, state) => {
  const viewState = store(state)

  return viewState.data
}

export const selectors = {
  status,
  errorStatus,
  error,
  data
}
