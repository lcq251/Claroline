
import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

import {actions as formActions} from '#/main/app/content/form/store'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/claco-form/resources/claco-form/store/selectors'

const ENTRIES_UPDATE = 'ENTRIES_UPDATE'
const ENTRY_CREATED = 'ENTRY_CREATED'
const CURRENT_ENTRY_LOAD = 'CURRENT_ENTRY_LOAD'
const ENTRY_CATEGORY_ADD = 'ENTRY_CATEGORY_ADD'
const ENTRY_CATEGORY_REMOVE = 'ENTRY_CATEGORY_REMOVE'
const USED_COUNTRIES_LOAD = 'USED_COUNTRIES_LOAD'

const actions = {}

actions.updateEntries = makeActionCreator(ENTRIES_UPDATE, 'entries')
actions.addCreatedEntry = makeActionCreator(ENTRY_CREATED, 'entry')
actions.loadCurrentEntry = makeActionCreator(CURRENT_ENTRY_LOAD, 'entry')
actions.addCategory = makeActionCreator(ENTRY_CATEGORY_ADD, 'category')
actions.removeCategory = makeActionCreator(ENTRY_CATEGORY_REMOVE, 'categoryId')
actions.loadUsedCountries = makeActionCreator(USED_COUNTRIES_LOAD, 'countries')

actions.deleteEntry = (entry) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_clacoformentry_delete'],
    request: {
      method: 'DELETE',
      body: JSON.stringify([entry.id])
    },
    success: (data, dispatch) => dispatch(listActions.invalidateData(selectors.STORE_NAME+'.entries.list'))
  }
})

actions.switchEntryStatus = (entryId) => ({
  [API_REQUEST]: {
    url: ['apiv2_clacoformentry_change_status', {entry: entryId}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => dispatch(actions.loadCurrentEntry(data))
  }
})

actions.switchEntriesStatus = (entries, status) => ({
  [API_REQUEST]: {
    url: ['apiv2_clacoformentry_change_status_bulk', {status: status}],
    request: {
      method: 'PUT',
      body: JSON.stringify(entries.map(e => e.id))
    },
    success: (data, dispatch) => dispatch(actions.updateEntries(data))
  }
})

actions.switchEntryLock = (entryId) => ({
  [API_REQUEST]: {
    url: ['claro_claco_form_entry_lock_switch', {entry: entryId}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => dispatch(actions.loadCurrentEntry(data))
  }
})

actions.switchEntriesLock = (entries, locked) => ({
  [API_REQUEST]: {
    url: ['claro_claco_form_entries_lock_switch', {locked: locked ? 1 : 0}],
    request: {
      method: 'PUT',
      body: JSON.stringify(entries.map(e => e.id))
    },
    success: (data, dispatch) => dispatch(actions.updateEntries(data))
  }
})

actions.downloadEntryPdf = (entryId) => ({
  [API_REQUEST]: {
    url: ['claro_claco_form_entry_pdf_download', {entry: entryId}],
    request: {
      method: 'GET'
    }
  }
})

actions.changeEntryOwner = (entryId, userId) => ({
  [API_REQUEST]: {
    url: ['claro_claco_form_entry_user_change', {entry: entryId, user: userId}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => dispatch(actions.loadCurrentEntry(data))
  }
})

actions.openForm = (formName, id = null, defaultProps) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_clacoformentry_get', {id}],
        success: (data, dispatch) => dispatch(formActions.resetForm(formName, data, false))
      }
    }
  } else {
    return formActions.resetForm(formName, defaultProps, true)
  }
}

actions.loadAllUsedCountries = (clacoFormId) => ({
  [API_REQUEST]: {
    silent: true,
    url: ['claro_claco_form_used_countries_load', {clacoForm: clacoFormId}],
    request: {
      method: 'GET'
    },
    success: (data, dispatch) => {
      dispatch(actions.loadUsedCountries(data))
    }
  }
})

export {
  actions,
  ENTRIES_UPDATE,
  ENTRY_CREATED,
  CURRENT_ENTRY_LOAD,
  ENTRY_CATEGORY_ADD,
  ENTRY_CATEGORY_REMOVE,
  USED_COUNTRIES_LOAD
}
