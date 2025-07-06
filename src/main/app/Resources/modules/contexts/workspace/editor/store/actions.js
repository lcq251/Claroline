import {API_REQUEST} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/main/app/contexts/workspace/editor/store/selectors'

export const actions = {}

actions.addOrganizations = (id, organizations) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_workspace_add_organizations', {id: id}],
    request: {
      method: 'PATCH',
      body: JSON.stringify(organizations)
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.organizations'))
    }
  }
})
