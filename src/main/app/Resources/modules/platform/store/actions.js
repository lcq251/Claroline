import merge from 'lodash/merge'

import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'
import {actions as securityActions} from '#/main/app/security/store'

// action names
export const PLATFORM_SET_CURRENT_ORGANIZATION = 'PLATFORM_SET_CURRENT_ORGANIZATION'
export const FAVORITE_TOGGLE = 'FAVORITE_TOGGLE'

// action creators
export const actions = {}

actions.setCurrentOrganizations = makeActionCreator(PLATFORM_SET_CURRENT_ORGANIZATION, 'organization')

actions.toggleFavorite = makeActionCreator(FAVORITE_TOGGLE, 'favorite')
actions.addFavorite = (workspace) => (dispatch) => dispatch({
  [API_REQUEST]: {
    silent: true,
    url: ['apiv2_workspace_favourite_create', {id: workspace.id}],
    before: () => dispatch(actions.toggleFavorite(workspace)),
    request: {
      method: 'POST'
    }
  }
})

actions.deleteFavorite = (workspace) => (dispatch) => dispatch({
  [API_REQUEST]: {
    silent: true,
    url: ['apiv2_workspace_favourite_delete', {id: workspace.id}],
    before: () => dispatch(actions.toggleFavorite(workspace)),
    request: {
      method: 'DELETE'
    }
  }
})

actions.changeOrganization = (organization) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['claro_organization_change', {organization: organization.id}],
    silent: true,
    request: {
      method: 'PUT'
    },
    success: () => dispatch(actions.setCurrentOrganizations(organization))
  }
})

actions.changeStatus = (currentUser, status) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_user_change_status', {status: status}],
    success: (response) => dispatch(securityActions.updateUser(merge({}, currentUser, {status: response}))),
    request: {method: 'PUT'}
  }
})
