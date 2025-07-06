
import {API_REQUEST} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'
import {actions as formActions, selectors as formSelectors} from '#/main/app/content/form/store'

import {selectors} from '#/main/community/tools/community/user/store/selectors'

export const actions = {}

actions.open = (username, reload = false) => (dispatch, getState) => {
  if (!reload) {
    const currentUser = formSelectors.data(formSelectors.form(getState(), selectors.FORM_NAME))
    if (currentUser && username === currentUser.username) {
      // no need to reload the displayed user
      return
    }

    // remove the previous user if any to avoid displaying it while loading
    dispatch(formActions.resetForm(selectors.FORM_NAME, {}, false))
  }

  // invalidate embedded lists
  dispatch(listActions.invalidateData(selectors.FORM_NAME+'.groups'))

  return dispatch({
    [API_REQUEST]: {
      url: ['apiv2_user_get', {field: 'username', id: username}],
      silent: true,
      success: (response, dispatch) => dispatch(formActions.resetForm(selectors.FORM_NAME, response, false))
    }
  })
}

actions.unregisterUsers = (users, workspace) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_unregister_users', {id: workspace.id}],
    request: {
      method: 'DELETE',
      body: JSON.stringify(users.map(user => user.id))
    },
    success: (data, dispatch) => {
      dispatch(listActions.deleteItems(selectors.LIST_NAME, users))
    }
  }
})

actions.addGroups = (id, groups) => ({
  [API_REQUEST]: {
    url: ['apiv2_user_add_groups', {id: id}],
    request: {
      method: 'PATCH',
      body: JSON.stringify(groups)
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.LIST_NAME))
      dispatch(listActions.invalidateData(selectors.FORM_NAME+'.groups'))
    }
  }
})
