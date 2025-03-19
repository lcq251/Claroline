import {API_REQUEST, url} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list'

import {selectors} from '#/plugin/claco-form/resources/claco-form/player/modals/shared/store/selectors'

export const actions = {}

actions.shareEntry = (entryId, users) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: url(['claro_claco_form_entry_users_share', {entry: entryId}], {ids: users}),
    request: {
      method: 'PUT'
    },
    success: () => dispatch(listActions.invalidateData(selectors.STORE_NAME))
  }
})
