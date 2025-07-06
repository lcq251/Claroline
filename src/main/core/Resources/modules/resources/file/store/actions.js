import {API_REQUEST, url} from '#/main/app/api'

const actions = {}

actions.download = (resourceNode) => ({
  [API_REQUEST]: {
    url: url(['claro_resource_download'], {ids: [resourceNode.id]}),
    request: {
      method: 'GET'
    }
  }
})

export {
  actions
}
