import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/forum/resources/forum/store/selectors'

export const FORUM_TOGGLE_NOTIFICATION = 'FORUM_TOGGLE_NOTIFICATION'
export const SUBJECT_LOAD = 'SUBJECT_LOAD'

export const actions = {}

actions.toggleNotification = makeActionCreator(FORUM_TOGGLE_NOTIFICATION, 'notified')
actions.notify = (forum, user) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_notify', {user: user.id, forum: forum.id}],
    request: {
      method: 'PATCH'
    },
    success: () => dispatch(actions.toggleNotification(true))
  }
})

actions.stopNotify = (forum, user) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_unnotify', {user: user.id, forum: forum.id}],
    request: {
      method: 'PATCH'
    },
    success: () => dispatch(actions.toggleNotification(false))
  }
})

actions.invalidateSubjects = () => listActions.invalidateData(selectors.STORE_NAME+'.subjects.list')
actions.loadSubject = makeActionCreator(SUBJECT_LOAD, 'subject')
actions.fetchSubject = (id) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_get', {id}],
    success: (data) => {
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.openSubject = (id) => (dispatch, getState) => {
  const subject = selectors.subject(getState())

  if (subject.id !== id) {
    dispatch(actions.loadSubject({id: id}))
    dispatch(actions.fetchSubject(id))
    dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
  }
}

actions.deleteSubject = (id, push, path) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_delete'],
    request: {
      method: 'DELETE',
      body: JSON.stringify([id])
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      push(`${path}/subjects`)
    }
  }
})

actions.stickSubject = (subject) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {sticky:true}})),
      method: 'PUT'
    },
    success: (data) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.unStickSubject = (subject) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {sticky:false}})),
      method: 'PUT'
    },
    success: (data) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.closeSubject = (subject) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {closed:true}})),
      method: 'PUT'
    },
    success: (data) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.unCloseSubject = (subject) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {closed:false}})),
      method: 'PUT'
    },
    success: (data) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.flagSubject = (subject) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {flagged:true}})),
      method: 'PUT'
    },
    success: (data) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.unFlagSubject = (subject) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {flagged:false}})),
      method: 'PUT'
    },
    success: (data) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.createMessage = (subjectId, content, parentId = null) => (dispatch) => {
  if (!parentId) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_forum_subject_create_message', {id: subjectId}],
        request: {
          method: 'POST',
          body: JSON.stringify({
            content: content
          })
        },
        success: () => dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
      }
    })
  }

  return dispatch({
    [API_REQUEST]: {
      url: ['apiv2_forum_message_create_comment', {id: parentId}],
      request: {
        method: 'POST',
        body: JSON.stringify({
          content: content
        })
      },
      success: () => dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
    }
  })
}

actions.editMessage = (message, subjectId, content) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_message_update', {message: message.id, subject: subjectId}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {content: content})),
      method: 'PUT'
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
    }
  }
})


actions.flag = (message, subjectId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_message_update', {message: message.id, subject: subjectId}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {meta: {flagged:true}})),
      method: 'PUT'
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
    }
  }
})

actions.unFlag = (message, subjectId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_message_update', {message: message.id, subject: subjectId}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {meta: {flagged:false}})),
      method: 'PUT'
    },
    success: () => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
    }
  }
})
