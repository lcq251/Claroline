import {actions as formActions} from '#/main/app/content/form/store/actions'
import {actions as baseActions} from '#/plugin/announcement/tools/announcement/store/actions'

import {selectors} from '#/plugin/announcement/tools/announcement/modals/sending/store/selectors'

export const actions = {}

actions.sendAnnounce = (announce) => (dispatch) => {
  dispatch(formActions.saveForm(selectors.STORE_NAME+'.form', ['claro_announcement_update', {id: announce.id}]))
    .then((response) => dispatch(baseActions.changeAnnounce(response)))
}
