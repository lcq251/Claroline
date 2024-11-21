import {selectors} from '#/plugin/cursus/course/store'
import isEmpty from 'lodash/isEmpty'
import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

export const actions = {}

actions.setLoadingStatus = makeActionCreator()

actions.open = (url) => (dispatch) => {
  const currentCourse = selectors.course(getState())
  if (force || isEmpty(currentCourse) || currentCourse.slug !== courseSlug) {
    return dispatch({
      [API_REQUEST]: {
        url: url,
        silent: true,
        before: () => dispatch(actions.loadCourse(null, null, [], {})),
        success: (data) => dispatch(actions.loadCourse(data.course, data.defaultSession, data.availableSessions, data.registrations))
      }
    })
  }
}