import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'

import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/open-badge/tools/badges/store/selectors'
import {Badge as BadgeTypes} from '#/plugin/open-badge/prop-types'

export const BADGE_LOAD_CURRENT_ASSERTION = 'BADGE_LOAD_CURRENT_ASSERTION'

export const actions = {}

actions.loadCurrentAssertion = makeActionCreator(BADGE_LOAD_CURRENT_ASSERTION, 'assertion', 'evidences')

actions.openBadge = (formName, id = null, workspace = null) => {
  if (id) {
    return {
      [API_REQUEST]: {
        silent: true,
        url: ['apiv2_badge_get', {id: id}],
        before: (dispatch) => {
          dispatch(formActions.resetForm(formName, {}, false))
          dispatch(actions.loadCurrentAssertion(null, []))
          dispatch(listActions.invalidateData(selectors.FORM_NAME + '.assertions'))
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    }
  }

  return formActions.resetForm(formName, merge({}, BadgeTypes.defaultProps, !isEmpty(workspace) ? {workspace: workspace} : {}), true)
}

actions.openAssertion = (id) => (dispatch) => dispatch({
  [API_REQUEST]: {
    silent: true,
    url: ['apiv2_badge_current_user', {badge: id}],
    success: (response) => dispatch(actions.loadCurrentAssertion(response.assertion, response.evidences))
  }
})
