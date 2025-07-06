import {now} from '#/main/app/intl/date'
import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/main/scheduler/administration/scheduled-task/store/selectors'

export const actions = {}

actions.open = (formName, id = null) => (dispatch) => {
  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_scheduled_task_get', {id}],
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, {
      scheduledDate: now(false)
    }, true))
  }
}

actions.addUsers = (id, users) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_scheduled_task_add_users', {id: id}],
    request: {
      method: 'PATCH',
      body: JSON.stringify(users)
    },
    success: (data) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME + '.task'))
      dispatch(listActions.invalidateData(selectors.STORE_NAME + '.task.users'))
    }
  }
})

actions.execute = (tasks = null) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_scheduled_task_execute'],
    request: {
      method: 'POST',
      body: tasks ? JSON.stringify(tasks) : undefined
    },
    success: () => dispatch(listActions.invalidateData(selectors.STORE_NAME + '.tasks'))
  }
})
