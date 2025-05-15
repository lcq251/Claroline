import {API_REQUEST, url} from '#/main/app/api'

export const actions = {}

actions.addUsers = (sessionId, users, type) => ({
  [API_REQUEST]: {
    url: url(['apiv2_cursus_session_add_users', {id: sessionId, type: type}], {ids: users.map(user => user.id)}),
    request: {
      method: 'PATCH'
    }
  }
})
