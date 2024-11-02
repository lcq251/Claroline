import {API_REQUEST, url} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/main/community/user/editor/store/selectors'

export const actions = {}

actions.open = (username) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_user_get', {field: 'username', id: username}],
    silent: true,
    success: (response) => dispatch(formActions.resetForm(selectors.FORM_NAME, response, false))
  }
})

actions.addRoles = (id, roles) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: url(['apiv2_user_add_roles', {id: id}], {ids: roles}),
    request: {
      method: 'PATCH'
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.roles'))
    }
  }
})

actions.addOrganizations = (id, organizations) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: url(['apiv2_user_add_organizations', {id: id}], {ids: organizations}),
    request: {
      method: 'PATCH'
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.organizations'))
    }
  }
})

actions.export = () => ({
  [API_REQUEST]: {
    url: ['apiv2_profile_export']
  }
})
