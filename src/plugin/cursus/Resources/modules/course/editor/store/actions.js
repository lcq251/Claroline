
import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store/actions'

import {selectors} from '#/plugin/cursus/course/store/selectors'
export const actions = {}

actions.openForm = (courseSlug = null, defaultProps = {}, workspace = null) => (dispatch) => {
  if (workspace) {
    defaultProps = {
      ...defaultProps,
      _workspaceType: workspace.meta.model ? 'model' : 'workspace',
      workspace: workspace
    }

    return dispatch(formActions.resetForm(selectors.FORM_NAME, defaultProps, true))
  }

  if (courseSlug) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_cursus_course_get', {field: 'slug', id: courseSlug}],
        silent: true,
        before: () => dispatch(formActions.resetForm(selectors.FORM_NAME, null, true)),
        success: (data) => dispatch(formActions.resetForm(selectors.FORM_NAME, data))
      }
    })
  }

  return dispatch(formActions.resetForm(selectors.FORM_NAME, defaultProps, true))
}
