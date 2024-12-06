import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form'
import {selectors} from '#/plugin/forum/resources/forum/store/selectors'
import merge from 'lodash/merge'
import {Subject as SubjectTypes} from '#/plugin/forum/resources/forum/prop-types'
import {makeId} from '#/main/app/utils/id'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {actions as listActions} from '#/main/app/content/list/store'
import {now} from '#/main/app/intl'

export const FORUM_TOGGLE_NOTIFICATION = 'FORUM_TOGGLE_NOTIFICATION'
export const SUBJECT_LOAD = 'SUBJECT_LOAD'
export const SUBJECT_FORM_OPEN = 'SUBJECT_FORM_OPEN'
export const SUBJECT_FORM_CLOSE = 'SUBJECT_FORM_CLOSE'
export const SUBJECT_EDIT = 'SUBJECT_EDIT'
export const SUBJECT_STOP_EDIT = 'SUBJECT_STOP_EDIT'

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


actions.openSubjectForm = makeActionCreator(SUBJECT_FORM_OPEN)
actions.closeSubjectForm = makeActionCreator(SUBJECT_FORM_CLOSE)
actions.subjectEdition = makeActionCreator(SUBJECT_EDIT)
actions.stopSubjectEdition = makeActionCreator(SUBJECT_STOP_EDIT)

actions.newSubject = (id = null) => (dispatch, getState) => {
  dispatch(actions.openSubjectForm())
  if (id) {
    dispatch(actions.subjectEdition())
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_forum_subject_get', {id}],
        success: (data, dispatch) => {
          dispatch(formActions.resetForm(selectors.STORE_NAME+'.subjects.form', data, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(
      selectors.STORE_NAME+'.subjects.form',
      merge({}, SubjectTypes.defaultProps, {
        id: makeId(),
        meta: {creator: securitySelectors.currentUser(getState())}
      }),
      true
    ))
  }
}

actions.loadSubject = makeActionCreator(SUBJECT_LOAD, 'subject')
actions.fetchSubject = (id) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_get', {id}],
    success: (data, dispatch) => {
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.openSubject = (id) => (dispatch, getState) => {
  const subject = selectors.subject(getState())
  // showform state
  if (subject.id !== id) {
    dispatch(actions.loadSubject({id: id}))
    dispatch(actions.fetchSubject(id))
    dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
  }
}

actions.deleteSubject = (id, push, path) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_delete', {ids: id}],
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      push(`${path}/subjects`)
    }
  }
})

actions.stickSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {sticky:true}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.unStickSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {sticky:false}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.closeSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {closed:true}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.unCloseSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {closed:false}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.flagSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {flagged:true}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.unFlagSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {flagged:false}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.createMessage = (subjectId, content, moderation) => (dispatch, getState) => {
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_forum_subject_create_message', {id: subjectId}],
      request: {
        method: 'POST',
        body: JSON.stringify({
          id: makeId(),
          content: content,
          meta: {
            creator: securitySelectors.currentUser(getState()),
            created: now(false),
            updated: now(false),
            moderation: moderation
          },
          comments: []
        })
      },
      success: (data, dispatch) => {
        dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
      }
    }
  })
}

actions.createComment = (messageId, comment) => (dispatch, getState) => {
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_forum_message_create_comment', {id: messageId}],
      request: {
        method: 'POST',
        body: JSON.stringify({
          id: makeId(),
          content: comment,
          meta: {
            creator: securitySelectors.currentUser(getState()),
            created: now(false),
            updated: now(false)
          }
        })
      },
      success: (data, dispatch) => {
        dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
      }
    }
  })
}

actions.editContent = (message, subjectId, content) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_message_update', {message: message.id, subject: subjectId}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {content: content})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
    }
  }
})


actions.flag = (message, subjectId) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_message_update', {message: message.id, subject: subjectId}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {meta: {flagged:true}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
    }
  }
})

actions.unFlag = (message, subjectId) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_message_update', {message: message.id, subject: subjectId}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {meta: {flagged:false}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.subjects.messages'))
    }
  }
})
