import {API_REQUEST} from '#/main/app/api'

export const actions = {}

actions.fetchRuleTypes = (contextType, contextId = null) => ({
  [API_REQUEST]: {
    url: ['apiv2_badge_available_rules', {
      context: contextType,
      contextId: contextId
    }]
  }
})
