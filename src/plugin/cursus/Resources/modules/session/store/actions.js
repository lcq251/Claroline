import {API_REQUEST} from '#/main/app/api'

export const actions = {}

actions.addUsers = (sessionId, users, type) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_session_add_users', {id: sessionId, type: type}],
    request: {
      method: 'PATCH',
      body: JSON.stringify(users.map(user => user.id))
    }
  }
})
