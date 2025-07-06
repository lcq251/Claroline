
import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST, url} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/message/tools/messaging/store/selectors'

// actions
export const MESSAGE_LOAD = 'MESSAGE_LOAD'

// actions creators
export const actions = {}

actions.loadMessage = makeActionCreator(MESSAGE_LOAD, 'message')
actions.openMessage = (id) => (dispatch) => dispatch({
  [API_REQUEST]: {
    silent: true,
    url: ['apiv2_message_root', {id}],
    success: (data) => {
      dispatch(actions.loadMessage(data))
      if (!data.meta.read) {
        dispatch(actions.markedAsReadWhenOpen(data.meta.umuuid))
      }
    }
  }
})

actions.sendMessage = (message) => dispatch => dispatch({
  [API_REQUEST]: {
    type: 'send',
    url: ['apiv2_message_create'],
    request: {
      method: 'POST',
      body: JSON.stringify(message)
    },
    success: (response) => dispatch(actions.openMessage(response.id))
  }
})

actions.deleteMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_hard_delete'],
    request: {
      method: 'DELETE',
      body: JSON.stringify(messages.map(message => message.meta.umuuid))
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.deletedMessages`))
    }
  }
})

actions.removeMessages = (messages, listName) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_soft_delete'],
    request: {
      method: 'PUT',
      body: JSON.stringify(messages.map(message => message.meta.umuuid))
    },
    success: (data, dispatch) => dispatch(listActions.invalidateData(listName))
  }
})

actions.restoreMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_restore'],
    request: {
      method: 'PUT',
      body: JSON.stringify(messages.map(message => message.meta.umuuid))
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.deletedMessages`))
    }
  }
})

actions.markedAsReadWhenOpen = (id) => ({
  [API_REQUEST]: {
    silent: true,
    url: ['apiv2_message_read'],
    request: {
      method: 'PUT',
      body: JSON.stringify([id])
    }
  }
})

actions.readMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_read'],
    request: {
      method: 'PUT',
      body: JSON.stringify(messages.map(message => message.meta.umuuid))
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.receivedMessages`))
    }
  }
})

actions.unreadMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_unread'],
    request: {
      method: 'PUT',
      body: JSON.stringify(messages.map(message => message.meta.umuuid))
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.receivedMessages`))
    }
  }
})
