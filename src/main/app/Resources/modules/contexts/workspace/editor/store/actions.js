import {API_REQUEST, url} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/main/app/contexts/workspace/editor/store/selectors'

export const actions = {}

actions.addOrganizations = (id, organizations) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: url(['apiv2_workspace_add_organizations', {id: id}], {ids: organizations}),
    request: {
      method: 'PATCH'
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.organizations'))
    }
  }
})
