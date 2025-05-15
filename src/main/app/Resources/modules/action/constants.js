
// scope
const ACTION_SCOPE_OBJECT     = 'object' // action is only available for single object
const ACTION_SCOPE_COLLECTION = 'collection' // action is available for list of objects

const ACTION_SCOPES = [
  ACTION_SCOPE_OBJECT,
  ACTION_SCOPE_COLLECTION
]

// sets
const ACTION_SET_LIST = 'list'
const ACTION_SET_DETAILS = 'details'
const ACTION_SET_DASHBOARD = 'dashboard'
const ACTION_SET_COMMAND = 'command'
const ACTION_SET_ADVANCED = 'advanced'

const ACTION_SETS = [
  ACTION_SET_LIST,
  ACTION_SET_DETAILS,
  ACTION_SET_DASHBOARD,
  ACTION_SET_COMMAND,
  ACTION_SET_ADVANCED
]

// types
const ACTION_GENERIC   = 'generic'
const ACTION_LOAD      = 'load'
const ACTION_REFRESH   = 'refresh'
const ACTION_SAVE      = 'save'
const ACTION_CREATE    = 'create'
const ACTION_UPDATE    = 'update'
const ACTION_DELETE    = 'delete'
const ACTION_SEND      = 'send'
const ACTION_UPLOAD    = 'upload'
const ACTION_DOWNLOAD  = 'download'
const ACTION_PUBLISH   = 'publish'
const ACTION_UNPUBLISH = 'unpublish'
const ACTION_SCHEDULE  = 'schedule'

const ACTIONS = {
  [ACTION_GENERIC]: {},
  [ACTION_LOAD]: {
    icon: 'fa fa-search'
  },
  [ACTION_REFRESH]: {
    icon: 'fa fa-sync'
  },
  [ACTION_SAVE]: {
    icon: 'fa fa-save'
  },
  [ACTION_CREATE]: {
    icon: 'fa fa-save'
  },
  [ACTION_UPDATE]: {
    icon: 'fa fa-save'
  },
  [ACTION_DELETE]: {
    icon: 'fa fa-trash'/*,
    dangerous: true*/
  },
  [ACTION_SEND]: {
    icon: 'fa fa-paper-plane'
  },
  [ACTION_UPLOAD]: {
    icon: 'fa fa-upload'
  },
  [ACTION_DOWNLOAD]: {
    icon: 'fa fa-download'
  },
  [ACTION_PUBLISH]: {
    icon: 'fa fa-eye'
  },
  [ACTION_UNPUBLISH]: {
    icon: 'fa fa-eye-slash'
  },
  [ACTION_SCHEDULE]: {
    icon: 'fa fa-clock'
  }
}

export const constants = {
  // scope
  ACTION_SCOPES,
  ACTION_SCOPE_OBJECT,
  ACTION_SCOPE_COLLECTION,

  // sets
  ACTION_SETS,
  ACTION_SET_LIST,
  ACTION_SET_DETAILS,
  ACTION_SET_DASHBOARD,
  ACTION_SET_COMMAND,
  ACTION_SET_ADVANCED,

  // types
  ACTIONS,
  ACTION_GENERIC,
  ACTION_LOAD,
  ACTION_REFRESH,
  ACTION_SAVE,
  ACTION_CREATE,
  ACTION_UPDATE,
  ACTION_DELETE,
  ACTION_SEND,
  ACTION_UPLOAD,
  ACTION_DOWNLOAD,
  ACTION_PUBLISH,
  ACTION_UNPUBLISH,
  ACTION_SCHEDULE
}
