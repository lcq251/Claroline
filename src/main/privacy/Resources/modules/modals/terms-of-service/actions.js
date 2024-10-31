import {API_REQUEST} from '#/main/app/api'

export const actions = {}

actions.acceptTerms = () => ({
  [API_REQUEST]: {
    url: ['apiv2_platform_terms_of_service_accept'],
    request: {
      method: 'PUT'
    }
  }
})
