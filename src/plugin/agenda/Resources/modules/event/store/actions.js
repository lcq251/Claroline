import {API_REQUEST} from '#/main/app/api'

export const actions = {}

actions.delete = (event) => ({
  [API_REQUEST]: {
    url: ['apiv2_planned_object_delete'],
    request: {
      method: 'DELETE',
      body: JSON.stringify([event.id])
    }
  }
})
